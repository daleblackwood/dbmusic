#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function updateModifiedDate(filePath, newModifiedDate) {
	fs.utimesSync(filePath, newModifiedDate, newModifiedDate);
}

function isMP3File(filePath) {
	return path.extname(filePath).toLowerCase() === '.mp3';
}

function parseID3Tag(filePath) {
	const buffer = fs.readFileSync(filePath);

	if (buffer.toString('utf8', 0, 3) === 'ID3' && isMP3File(filePath)) {
		const version = buffer[3];
		const majorVersion = buffer[4];
		let offset = 10;
		let year;
		if (version === 3) {
			year = buffer.readUInt16BE(offset);
		} else if (version === 4) {
			year = buffer.readUInt32BE(offset);
		}
		return year;
	}

	return null;
}

function setModifiedDateFromID3(filePath, preview) {
	const stat = fs.statSync(filePath);
	const modifiedDate = stat.mtime;
	const id3Year = parseID3Tag(filePath);
	if (id3Year !== null) {
		const id3ModifiedDate = new Date(id3Year, 0, 1);
		if (preview) {
			console.log(`New modified date for file: ${filePath}`);
			console.log(id3ModifiedDate);
		} else if (id3ModifiedDate < modifiedDate) {
			updateModifiedDate(filePath, id3ModifiedDate);
			console.log(`Modified date updated for file: ${filePath}`);
		} else {
			console.log(`No need to update modified date for file: ${filePath}`);
		}
	} else {
		console.log(`No ID3 tag found or year information missing for file: ${filePath}`);
	}
}

function processFilesRecursively(directoryPath, preview) {
	const files = fs.readdirSync(directoryPath);

	for (const file of files) {
		const filePath = path.join(directoryPath, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			processFilesRecursively(filePath, preview);
		} else if (isMP3File(filePath)) {
			setModifiedDateFromID3(filePath, preview);
		}
	}
}

const args = process.argv.slice(2);
const targetPath = args[0];
const previewOptionIndex = args.indexOf('--preview');
const preview = previewOptionIndex !== -1;

if (!targetPath) {
	console.error('Please provide a file path or a folder path as a command line argument.');
	process.exit(1);
}

if (!fs.existsSync(targetPath)) {
	console.error('The specified path does not exist.');
	process.exit(1);
}

const isDirectory = fs.lstatSync(targetPath).isDirectory();

if (isDirectory) {
	processFilesRecursively(targetPath, preview);
} else if (isMP3File(targetPath)) {
	setModifiedDateFromID3(targetPath, preview);
} else {
	console.error('The specified file is not an MP3 file.');
	process.exit(1);
}
