import { Subject } from "observational";
import { MusicAlbum, MusicCollection, MusicTrack, MEDIA_HOST } from "@model";
import { toKey, toTitle } from "@utils";

interface MusicEntry {
	modified: number;
	path: string;
}

interface MusicEntry {
	name: string;
	album: string;
	artist: string;
	cover: string;
	readme: string;
	path: string;
	date: string;
	track: number;
}

function parseCollection(entries: Record<string, MusicEntry>) {
	const collection = new MusicCollection();
	for (const key in entries) {
		const entry = entries[key] as MusicEntry;
		const path = entry.path;
		const lastSlashI = path.lastIndexOf('/');
		const folder = lastSlashI > 0 ? path.substring(0, lastSlashI) : "";
		let name = path.substring(lastSlashI + 1);
		const lastDot = name.lastIndexOf('.');
		if (lastDot > 0) {
			name = name.substring(0, lastDot);
		}
		let albumName = entry.album || "";
		let artist = entry.artist || "Dale Blackwood";
		if (!albumName && lastSlashI > 0) {
			albumName = path.substring(0, lastSlashI);
			const nextLastI = folder.lastIndexOf('/');
			if (nextLastI >= 0) {
				albumName = folder.substring(nextLastI + 1);
			}
		}
		let date = new Date(entry.date);
		const albumKey = toKey(albumName);
		let album = collection.albums.find(x => x.key == albumKey);
		const tempAlbum: MusicAlbum = {
			key: albumKey,
			name: toTitle(albumName),
			path: folder,
			artist,
			date,
			image: entry.cover ? MEDIA_HOST + entry.cover : "blankmusic.jpg"
		};
		if (!album) {
			album = tempAlbum;
			collection.albums.push(album);
		} else {
			album.name = album.name || tempAlbum.name;
			album.artist = album.artist || tempAlbum.artist;
			album.date = album.date < tempAlbum.date ? album.date : tempAlbum.date;
			album.image = album.image || tempAlbum.image;
		}
		let track = 1;
		const music: MusicTrack = {
			key: toKey(name),
			path,
			name,
			artist,
			album: albumKey,
			date,
			track,
			url: MEDIA_HOST + path
		};
		collection.tracks.push(music);
	}
	console.log("collection", collection);
	return collection;
}

class LibraryService {

	subCollection = new Subject<MusicCollection>(new MusicCollection());

	constructor() {
		this.load();
	}

	load() {
		return new Promise((resolve, reject) => {
			fetch(MEDIA_HOST + "dumblib.php")
			.then(response => response.json())
			.then(entries => {
				const collection = parseCollection(entries);
				this.subCollection.setValue(collection);
				resolve(collection);
			})
			.catch(e => reject(e));
		});
	}

}

export const libraryService = new LibraryService();
