
export interface MusicTrack {
	key: string;
	path: string;
	name: string;
	artist: string;
	date: Date;
	track: number;
	image?: string;
	album?: string;
	markup?: string;
	url: string;
}

export interface MusicAlbum {
	key: string;
	path: string;
	name: string;
	artist: string;
	image?: string;
	year: number;
	genre: string;
	date: Date;
	markup?: string;
	formative?: boolean;
}

export class MusicCollection {
	tracks = [] as MusicTrack[];
	albums = [] as MusicAlbum[];
	hasLoaded = false;
}

export const LIBRARY_GROUPINGS = {
	"album.artist": "Album by Artist",
	"album.genre": "Album by Genre",
	"album.year": "Album by Year",
	"track.date": "Track by Date"
 } as const;

export type LibraryGrouping = keyof typeof LIBRARY_GROUPINGS;

export interface Settings {
	grouping: LibraryGrouping,
	grouped: boolean,
	showFormative: boolean
}

export const DEFAULT_SETTINGS: Settings = {
	grouping: "Artist",
	grouped: false,
	showFormative: false
}
