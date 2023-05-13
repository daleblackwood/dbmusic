import { Subject } from "observational";
import { MusicTrack, DURATION } from "@model";

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

    context: AudioContext = new AudioContext();
	source: AudioBufferSourceNode|null = null;
	tickInterval = 0;
	startTime = 0;

	constructor() {
		this.tickInterval = setInterval(() => this.tick(), 1000);
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
		
		if (this.source) {
			this.source.stop();
		}

		this.subState.setValue(state);
	}

	resume() {
		let state = this.subState.value;
		if (state.state)
			return;

		state = {
			...state,
			state: "playing"
		};

		this.subState.setValue(state);
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

	add(tracks: MusicTrack | MusicTrack[]) {
		if (!Array.isArray(tracks)) {
			tracks = [tracks];
		}
		const newQueue = this.subQueue.value.concat(tracks);
		this.subQueue.setValue(newQueue);
	}

    loadAudio(url: string) {
        return fetch(url)
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) => this.context.decodeAudioData(arrayBuffer));
    }

	playNext() {
		this.playIndex(this.subState.value.index + 1);
	}

	playPrev() {
		this.playIndex(this.subState.value.index - 1);
	}

    playIndex(index: number) {
		index = index % this.subQueue.value.length;
		const track = this.subQueue.value[index];
		if (!track) {
			console.log("No tracks to play.");
			return;
		}
		
		if (this.source) {
			this.source.stop();
			this.source.disconnect();
		}

		const state: PlayState = {
			track,
			index,
			duration: DURATION.MS_MINUTE * 3.5,
			position: 0,
			state: "buffering"
		};
		this.subState.setValue(state, true);
		
        this.loadAudio(track.url).then(audioBuffer => {
			if (this.source) {
				this.source.stop();
				this.source.disconnect();
			}
			this.source = this.context.createBufferSource();
			this.source.buffer = audioBuffer;

			// Progress monitoring
			this.startTime = this.context.currentTime;
			state.duration = audioBuffer.duration;

			// Connect the source to the audio context's output
			this.source.connect(this.context.destination);

			// Start playing
			this.source.start();

			console.log(`Playing ${track.name}`);
		})
		.catch((error) => {
			console.error(`Error loading audio file: ${track.url}`, error);
			this.playNext();
		});
    }

	tick() {
		const state = { ...this.subState.value };
		if (!state.state || !state.track)
			return;

		state.position = this.context.currentTime - this.startTime;
		if (state.position > 0) {
			state.state = "playing";
		}
		this.subState.setValue(state, true);

		if (state.position >= state.duration) {
			console.log(`Finished playing ${state.track.name}`);
			this.playNext();
		}
	}
}

export const playerService = new PlayerService();
