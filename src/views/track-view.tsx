import { useSubject } from "observational/hooks";
import { AlbumArt, PlayerControls, ProgressBar } from "@components";
import { libraryService, playerService } from "@services";
import { css } from "@utils";
import { MusicTrack } from "@model";

const style = css`
	.track {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 1rem;
		height: calc(100% - 80px);
		text-align: center;
		padding-top: 100px;
	}

	.track h3 {
		color: var(--accent);
	}

	.controls {
		width: 80%;
		max-width: 400px;
		height: 20%;
		position: absolute;
		bottom: 60px;
	}

	.art {
		width: 300px;
		height: auto;
		max-width: 50%;
	}
`;

export function TrackView(props: { route: string, params: string[] }) {
	const [collection] = useSubject(libraryService.subCollection);
	const [state] = useSubject(playerService.subState);
	const track = state.track || collection.tracks.find(x => x.key === props.params[0]) || undefined;
	if (!track) {
		return (
			<p>Album not found.</p>
		);
	}
	const album = libraryService.getAlbum(track.album);
	const date = track?.date || album?.date || undefined;
	const imageSrc = libraryService.getTrackArt(track);
	return (
		<div className={style.track}>
			<AlbumArt src={imageSrc} className={style.art} />
			<h2>{track.name}</h2>
			<h3>{track.artist}</h3>
			<p>{album?.name + (date ? " (" + date.getFullYear() + ")" : "")}</p>
			<div className={style.controls}>
				<PlayerControls />
				<ProgressBar value={state.position} max={state.duration} />
			</div>
		</div>
	);
}
