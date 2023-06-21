import { Subject } from "observational";
import { Howl } from "howler";
import { MusicTrack, DURATION, MusicAlbum } from "@model";
import { appService } from "./app-service";
import { libraryService } from "./library-service";
import { toKey } from "@utils";

interface PlayState {
	track?: MusicTrack;
	index: number;
	duration: number;
	position: number;
	state: "" | "buffering" | "playing";
}

const BLANK_STATE: PlayState = {
	track: undefined,
	index: -1,
	duration: 0,
	position: 0,
	state: ""
};

class PlayerService {

	subQueue = new Subject<MusicTrack[]>([]);
	subState = new Subject(BLANK_STATE);

	tickInterval = 0;
	startOffset = 0;

	sound: ({ howl: Howl, src: string }) | null = null;

	constructor() {
		this.tickInterval = setInterval(() => this.tick(), 1000);
		libraryService.subCollection.listen(this, collection => {
			const route = appService.subRoute.value;
			let album: MusicAlbum|undefined = undefined;
			let track: MusicTrack|undefined = undefined;
			if (route.root === "album") {
				album = collection.albums.find(x => x.key === route.params[0]);
				const trackRoute = route.subPaths.find(x => x.root === "track");
				if (trackRoute) {
					track = collection.tracks.find(x => x.key === trackRoute.params[0]);
				}
			} else if (route.root === "track") {
				track = collection.tracks.find(x => x.key === route.params[0]);
			} else {
				return;
			}
			if (!track && !album)
				return;

			let queue = [track as MusicTrack];
			let index = 0;
			if (!album) {
				album = libraryService.getAlbum(track?.album);
			}
			if (album) {
				queue = collection.tracks.filter(x => x.album == album?.key);
				index = queue.findIndex(x => x?.key === track?.key);
			}
			this.subQueue.setValue(queue);
			this.subState.setValue({
				...BLANK_STATE,
				track,
				index
			});
			this.play(queue, index);
		}, { immediate: true });
		window.addEventListener("keydown", e => {
			if (e.keyCode == 37) {
				this.playPrev();
			}
			switch (e.keyCode) {
				case 37:
					this.playPrev();
					break;
				case 39:
					this.playNext();
					break;
				case 32:
					if (this.subState.value.state == "playing") {
						this.pause();
					} else {
						this.resume();
					}
					break;
			}
		});
	}

	clear() {
		this.subQueue.setValue([]);
	}

	stop() {
		this.clear();
		this.subState.setValue(BLANK_STATE);
	}

	pause() {
		let state = this.subState.value;
		if (!state.state)
			return;

		state = {
			...state,
			state: ""
		};
		
		if (this.sound) {
			this.sound.howl.stop();
		}

		this.subState.setValue(state);
	}

	resume() {
		const state = this.subState.value;
		if (state.state)
			return;
		this.playIndex(state.index, state.position);
	}

	play(tracks: MusicTrack | MusicTrack[], index?: number) {
		this.clear();
		if (!Array.isArray(tracks)) {
			tracks = [tracks];
		}
		this.subQueue.setValue(tracks);
		if (index) {
			this.playIndex(index);
		} else {
			this.playIndex(0);
		}
	}

	skip(position: number) {
		const state = this.subState.value;
		this.playIndex(state.index, position);
	}

	add(tracks: MusicTrack | MusicTrack[]) {
		if (!Array.isArray(tracks)) {
			tracks = [tracks];
		}
		const newQueue = this.subQueue.value.concat(tracks);
		this.subQueue.setValue(newQueue);
	}

	playNext() {
		this.playIndex(this.subState.value.index + 1);
	}

	playPrev() {
		this.playIndex(this.subState.value.index - 1);
	}

    playIndex(index: number, position: number = 0) {
		index = index % this.subQueue.value.length;
		const track = this.subQueue.value[index];
		if (!track) {
			console.log("No tracks to play.");
			return;
		}
		
		if (this.sound) {
			if (this.sound.src === track.url) {
				this.sound.howl.seek(position);
				if (!this.subState.value.state) {
					this.sound.howl.play();
					const newState: PlayState = {
						...this.subState.value,
						position,
						state: "playing"
					};
					this.subState.setValue(newState);
				}
				return;
			}
			this.sound.howl.stop();
			this.sound.howl.unload();
		}

		const state: PlayState = {
			track,
			index,
			duration: DURATION.MS_MINUTE * 3.5,
			position: 0,
			state: "buffering"
		};
		this.subState.setValue(state);
		this.startOffset = position;
		this.tick();
		
		const howl = new Howl({
			src: track.url,
			html5: true
		});
		const sound = {
			howl,
			src: track.url,
		};
		this.sound = sound;
		howl.on("load", () => {
			howl.play();
			const newState: PlayState = {
				track,
				index,
				duration: howl.duration(),
				position: 0,
				state: "playing"
			};
			this.subState.setValue(newState);
			gtag("event", "play", {
				"track": toKey(track.key),
				"album": toKey(track.album),
				"artist": toKey(track.artist)
			});
			gtag("event", "page_view", {
				page_title: track.name,
				page_location: track.url
			});
		});
		howl.on("end", () => this.playNext());
		howl.on("loaderror", () => this.playNext());
    }

	tick() {
		const state = { ...this.subState.value };
		if (!state.state || !state.track || !this.sound)
			return;

		if (state.state === "playing") {
			state.position = this.sound.howl.seek();
		}
		this.subState.setValue(state, true);

		if (state.state === "playing" && state.position >= state.duration) {
			//this.playNext();
		}
	}
}

export const playerService = new PlayerService();
