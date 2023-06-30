#!/usr/bin/env python3

import os
import argparse
import datetime
import hashlib

def calculate_sha256(filepath):
    sha256_hash = hashlib.sha256()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b""):
            sha256_hash.update(chunk)
    return sha256_hash.hexdigest()

def is_media_file(filename):
    media_extensions = ('.mp3', '.mp4', '.mov', '.mkv', '.ogg')
    max_file_size = 100 * 1024 * 1024  # 100MB
    base_filename = os.path.splitext(os.path.basename(filename))[0]
    return (
        any(filename.lower().endswith(extension) for extension in media_extensions)
        and os.path.getsize(filename) <= max_file_size
        and any(c.isalpha() for c in base_filename)
    )

def should_skip_folder(foldername):
    skip_keywords = ['Windows', 'Program', 'Steam']
    return foldername.startswith('.') or any(keyword in foldername for keyword in skip_keywords)

def check_and_update_files(dir_in_list, date_file, commit_changes):
    files_map = {}
    with open(date_file, 'r') as f:
        for line in f:
            k, v = line.strip().split('|')
            files_map[k] = datetime.datetime.strptime(v, '%Y-%m-%d %H:%M:%S')
    for dir_in in dir_in_list:
        for foldername, subfolders, filenames in os.walk(dir_in):
            if should_skip_folder(foldername):
                continue
            for filename in filenames:
                file_path = os.path.join(foldername, filename)
                if is_media_file(file_path):
                    checksum = calculate_sha256(file_path)
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
    files_map = {}
    for dir_in in dir_in_list:
        for foldername, subfolders, filenames in os.walk(dir_in):
            if should_skip_folder(foldername):
                continue
            for filename in filenames:
                file_path = os.path.join(foldername, filename)
                if is_media_file(file_path):
                    mod_time = os.path.getmtime(file_path)
                    mod_time_str = datetime.datetime.fromtimestamp(mod_time).strftime('%Y-%m-%d %H:%M:%S')
                    checksum = calculate_sha256(file_path)
                    if checksum not in files_map:
                        files_map[checksum] = mod_time
                        print(f"Added to map: {file_path} ({mod_time_str})")

    with open(date_file, 'w') as f:
        for k, v in files_map.items():
            mod_time_str = datetime.datetime.fromtimestamp(v).strftime('%Y-%m-%d %H:%M:%S')
            f.write(f"{k}|{mod_time_str}\n")

if __name__ == '__main__':
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
