import { Subject } from "observational";
import { 
	DEFAULT_SETTINGS, 
	MEDIA_HOST, 
	MusicAlbum, 
	MusicCollection, 
	MusicTrack
} from "@model";
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
	year: string;
	track: number;
	genre: string;
	number: number;
}

export const DEFAULT_ARTWORK = "blankmusic.jpg";

const FORMATIVE = ["constance", "where-you-live", "chaos-ep", "acoustic-scratches-2020"];

class LibraryService {

	subCollection = new Subject<MusicCollection>(new MusicCollection());
	subSettings = new Subject({ ...DEFAULT_SETTINGS });

	constructor() {
		this.load();
		const loadedSettingsStr = localStorage.getItem("settings");
		if (loadedSettingsStr) {
			try {
				const loadedSettings = JSON.parse(loadedSettingsStr);
				const newSettings = { ...DEFAULT_SETTINGS } as any;
				for (const key in newSettings) {
					if (loadedSettings.hasOwnProperty(key)) {
						newSettings[key] = loadedSettings[key];
					}
				}
				this.subSettings.setValue(newSettings);
			} catch (e) {}
		}
		this.subSettings.listen(this, settings => {
			localStorage.setItem("settings", JSON.stringify(settings));
		});
	}

	load() {
		return new Promise((resolve, reject) => {
			fetch(MEDIA_HOST + "library.php?r=" + Math.random())
			.then(response => response.json())
			.then(entries => {
				const collection = parseCollection(entries);
				this.subCollection.setValue(collection);
				resolve(collection);
			})
			.catch(e => {
				const blankCollection = new MusicCollection();
				blankCollection.hasLoaded = true;
				this.subCollection.setValue(blankCollection);
				reject(e)
			});
		});
	}

	getTrackArt(track?: MusicTrack) {
		if (track) {
			if (track.image)
				return track.image;
			if (track.album) {
				const album = this.getAlbum(track.album);
				if (album && album.image)
					return album.image;
			}
		}
		return DEFAULT_ARTWORK;
	}

	getAlbum(key?: string) {
		if (!key)
			return undefined;
		return this.subCollection.value.albums.find(x => x.key === key) || undefined;
	}

}

function parseCollection(entries: Record<string, MusicEntry>) {
	const collection = new MusicCollection();
	collection.hasLoaded = true;
	for (const key in entries) {
		const entry = entries[key] as MusicEntry;
		const path = entry.path;
		const lastSlashI = path.lastIndexOf('/');
		const folder = lastSlashI > 0 ? path.substring(0, lastSlashI) : "";
		let name = entry.name;
		if (name) {
			path.substring(lastSlashI + 1);
			const lastDot = name.lastIndexOf('.');
			if (lastDot > 0) {
				name = name.substring(0, lastDot);
			}
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
		const dateYear = date.getFullYear() || 0;
		const albumYear = parseInt(entry.year) || dateYear || 0;;
		const year = Math.min(dateYear, albumYear);
		if (albumYear < dateYear) {
			date = new Date(albumYear, 0, 1);
		}
		const tempAlbum: MusicAlbum = {
			key: albumKey,
			name: toTitle(albumName),
			path: folder,
			artist,
			date,
			year,
			genre: entry.genre || "Music",
			image: entry.cover ? MEDIA_HOST + entry.cover : DEFAULT_ARTWORK,
			formative: FORMATIVE.includes(toKey(artist)) || FORMATIVE.includes(albumKey)
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
		let track = Number(entry.number) || 0;
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

export const libraryService = new LibraryService();
