#!/usr/bin/env python3

import os
import argparse
import datetime
import subprocess
import shutil

def is_media_file(filename):
	if filename:
		try:
			media_extensions = ('.mp3', '.mp4', '.mov', '.mkv', '.ogg')
			max_file_size = 100 * 1024 * 1024  # 100MB
			base_filename = os.path.splitext(os.path.basename(filename))[0]
			return (
				any(filename.lower().endswith(extension) for extension in media_extensions)
				and os.path.getsize(filename) <= max_file_size
				and any(c.isalpha() for c in base_filename)
			)
		except:
			pass
	return False

def check_ffmpeg_availability():
    return shutil.which('ffmpeg') is not None

def calculate_audio_checksum(filename):
	if is_media_file(filename) and os.path.isfile(filename):
		command = f'ffmpeg -i "{filename}" -map 0:a -codec copy -hide_banner -loglevel warning -f md5 -'
		process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
		stdout, stderr = process.communicate()
		if process.returncode == 0:
			checksum = stdout.decode().strip()
			if checksum.startswith("MD5="):
				checksum = checksum[4:]  # Strip "MD5=" prefix
				return checksum
	return None

def should_skip_folder(foldername):
	skip_keywords = ['Windows', 'Program', 'Steam']
	return foldername.startswith('.') or any(keyword in foldername for keyword in skip_keywords)

def read_file_map(date_file):
	files_map = {}
	try:
		with open(date_file, 'r') as f:
			for line in f:
				k, v = line.strip().split('|')
				files_map[k] = datetime.datetime.strptime(v, '%Y-%m-%d %H:%M:%S')
	except:
		pass
	return files_map

def check_and_update_files(dir_in_list, date_file, commit_changes):
	files_map = read_file_map(date_file)
	for dir_in in dir_in_list:
		for foldername, subfolders, filenames in os.walk(dir_in):
			if should_skip_folder(foldername):
				continue
			for filename in filenames:
				file_path = os.path.join(foldername, filename)
				checksum = calculate_audio_checksum(file_path)
				if not checksum:
					continue
				if checksum in files_map:
					mod_time = datetime.datetime.fromtimestamp(os.path.getmtime(file_path))
					if mod_time > files_map[checksum] and commit_changes:
						os.utime(file_path, (mod_time.timestamp(), mod_time.timestamp()))
						print(f"{file_path}: changed ({mod_time})")
					else:
						print(f"{file_path}: unchanged ({mod_time})")
				else:
					print(f"{file_path}: skipped (not in date_file or exceeds size limit)")

def create_hash_map(dir_in_list, date_file):
	files_map = read_file_map(date_file)
	for dir_in in dir_in_list:
		for foldername, subfolders, filenames in os.walk(dir_in):
			if should_skip_folder(foldername):
				continue
			for filename in filenames:
				file_path = os.path.join(foldername, filename)
				checksum = calculate_audio_checksum(file_path)
				if not checksum:
					continue
				mod_time = os.path.getmtime(file_path)
				mod_time_date = datetime.datetime.fromtimestamp(mod_time)
				mod_time_str = mod_time_date.strftime('%Y-%m-%d %H:%M:%S')
				if checksum not in files_map:
					files_map[checksum] = mod_time_date
					print(f"Found: {file_path} ({mod_time_str})")

	with open(date_file, 'w') as f:
		for k, v in files_map.items():
			mod_time_str = v.strftime('%Y-%m-%d %H:%M:%S')
			f.write(f"{k}|{mod_time_str}\n")

if __name__ == '__main__':
	if not check_ffmpeg_availability():
		print("ffmpeg must be installed and on PATH")
		exit(1)

	parser = argparse.ArgumentParser(description='Check and update file modification dates for media files in given directories and their subfolders')
	parser.add_argument('dir_in', metavar='dir_in', type=str, nargs='+', help='the directories to scan')
	parser.add_argument('--date_file', metavar='date_file', type=str, help='the file containing the file modification dates')
	parser.add_argument('--commit', action='store_true', help='commit the changes by updating the modification dates')

	args = parser.parse_args()

	for dir_in in args.dir_in:
		if not os.path.isdir(dir_in):
			print(f"{dir_in} is not a valid directory.")
			exit(1)

	date_file = args.date_file or 'date_file.txt'
	create_hash_map(args.dir_in, date_file)
	check_and_update_files(args.dir_in, date_file, args.commit)

	print(f"Checked and updated media files in {', '.join(args.dir_in)} using dates from {date_file}")
