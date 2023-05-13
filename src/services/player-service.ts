import { Subject } from "observational";
import { MusicTrack, DURATION } from "@model";

interface PlayState {
	track?: MusicTrack;
	index: number;
	duration: number;
	position: number;
	isPlaying: boolean;
}

const BLANK_STATE: PlayState = {
	track: undefined,
	index: -1,
	duration: 0,
	position: 0,
	isPlaying: false
};

class PlayerService {

	subQueue = new Subject<MusicTrack[]>([]);
	subState = new Subject(BLANK_STATE);

    context: AudioContext = new AudioContext();
	source: AudioBufferSourceNode|null = null;

	clear() {
		this.subQueue.setValue([]);
	}

	stop() {
		this.clear();
		this.subState.setValue(BLANK_STATE);
	}

	pause() {
		let state = this.subState.value;
		if (!state.isPlaying)
			return;

		state = {
			...state,
			isPlaying: false
		};
		
		if (this.source) {
			this.source.stop();
		}

		this.subState.setValue(state);
	}

	resume() {
		let state = this.subState.value;
		if (state.isPlaying)
			return;

		state = {
			...state,
			isPlaying: true
		};
		
		if (this.source) {
			this.source.start();
		}

		this.subState.setValue(state);
	}

	play(tracks: MusicTrack | MusicTrack[]) {
		this.clear();
		if (!Array.isArray(tracks)) {
			tracks = [tracks];
		}
		this.subQueue.setValue(tracks);
		this.playNext();
	}

	add(tracks: MusicTrack | MusicTrack[]) {
		if (!Array.isArray(tracks)) {
			tracks = [tracks];
		}
		this.subQueue.setValue(tracks);
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

		const state: PlayState = {
			track,
			index,
			duration: DURATION.MS_MINUTE * 3.5,
			position: 0,
			isPlaying: true
		};
		this.subState.setValue(state, true);
        this.loadAudio(track.url).then(audioBuffer => {
			this.source = this.context.createBufferSource();
			this.source.buffer = audioBuffer;

			// Progress monitoring
			const startTime = this.context.currentTime;
			state.duration = audioBuffer.duration;
			const intervalId = setInterval(() => {
				if (!state.isPlaying)
					return;

				state.position = this.context.currentTime - startTime;
				console.log(`[${track.name}] Progress: ${state.position.toFixed(1)}s / ${state.duration.toFixed(1)}s`);
				this.subState.setValue(state, true);

				if (state.position >= state.duration) {
					clearInterval(intervalId);
					console.log(`Finished playing ${track.name}`);
					this.playNext();
				}
			}, 1000);

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
}

export const playerService = new PlayerService();
