
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
	date: Date;
}

export class MusicCollection {
	tracks = [] as MusicTrack[];
	albums = [] as MusicAlbum[];
}
