
export interface MusicTrack {
	key: string;
	path: string;
	name: string;
	artist: string;
	date: Date;
	track: number;
	image?: string;
	album?: string;
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
	formative?: boolean;
}

export class MusicCollection {
	tracks = [] as MusicTrack[];
	albums = [] as MusicAlbum[];
	hasLoaded = false;
}

export const LIBRARY_GROUPING = [
	"Artist",
	"Genre",
	"Year"
] as const;

export type LibraryGrouping = typeof LIBRARY_GROUPING[number];

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
