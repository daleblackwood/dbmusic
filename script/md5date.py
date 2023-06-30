#!/usr/bin/env python3

import os
import argparse
import datetime
import hashlib

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

def check_and_update_files(dir_in, date_file, commit_changes):
    files_map = {}
    with open(date_file, 'r') as f:
        for line in f:
            k, v = line.strip().split('|')
            files_map[k] = datetime.datetime.strptime(v, '%Y-%m-%d %H:%M:%S')
    for foldername, subfolders, filenames in os.walk(dir_in):
        for filename in filenames:
            file_path = os.path.join(foldername, filename)
            checksum = calculate_sha256(file_path)
            if checksum in files_map:
                mod_time = datetime.datetime.fromtimestamp(os.path.getmtime(file_path))
                if mod_time > files_map[checksum] and commit_changes:
                    os.utime(file_path, (mod_time.timestamp(), mod_time.timestamp()))
                    print(f"{file_path}: changed ({mod_time})")
                else:
                    print(f"{file_path}: unchanged ({mod_time})")

def create_files_map(dir_in, date_file):
    files_map = {}
    for foldername, subfolders, filenames in os.walk(dir_in):
        for filename in filenames:
            filepath = os.path.join(foldername, filename)
            mod_time = os.path.getmtime(filepath)
            mod_time_str = datetime.datetime.fromtimestamp(mod_time).strftime('%Y-%m-%d %H:%M:%S')
            checksum = calculate_sha256(filepath)
            if checksum in files_map:
                if mod_time < files_map[checksum]:
                    files_map[checksum] = mod_time
            else:
                files_map[checksum] = mod_time
    with open(date_file, 'w') as f:
        for k, v in files_map.items():
            mod_time_str = datetime.datetime.fromtimestamp(v).strftime('%Y-%m-%d %H:%M:%S')
            f.write(f"{k}|{mod_time_str}\n")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Check and update file modification dates in a given folder and subfolders')
    parser.add_argument('dir_in', metavar='dir_in', type=str, help='the directory to scan')
    parser.add_argument('--date_file', metavar='date_file', type=str, help='the file containing the file modification dates')
    parser.add_argument('--commit', action='store_true', help='commit the changes by updating the modification dates')

    args = parser.parse_args()

    if not os.path.isdir(args.dir_in):
        print(f"{args.dir_in} is not a valid directory.")
        exit(1)

    date_file = args.date_file or 'date_file.txt'
    create_files_map(args.dir_in, date_file)
    check_and_update_files(args.dir_in, date_file, args.commit)

    print(f"Checked and updated files in {args.dir_in} using dates from {date_file}")
