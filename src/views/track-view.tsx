import { useSubject } from "observational/hooks";
import { AlbumArt, Icon, PlayerControls, ProgressBar } from "@components";
import { appService, libraryService, playerService } from "@services";
import { css } from "@utils";

const style = css`
	.track {
		position: relative;
		height: calc(100% - 80px);
	}

	.trackDetails {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		text-align: center;
		gap: 1rem;
		height: calc(100% - 100px);
	}

	.track h3 {
		color: var(--accent);
	}

	.controls {
		width: 80%;
		height: 20%;
		position: absolute;
		bottom: 40px;
		left: 10%;
		text-align: center;
	}

	.progress {
		margin-top: 10px;
	}

	.art {
		width: 300px;
		height: auto;
		max-width: 50%;
	}

	.hideIcon svg {
		width: 40px;
		height: 40px;
		margin-top: 20px;
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
			<div className={style.trackDetails}>
				<AlbumArt src={imageSrc} className={style.art} />
				<h2>{track.name}</h2>
				<a href={album ? "#album/" + album.key : "#library"}>
					<h3>{album?.name + (date ? " (" + date.getFullYear() + ")" : "")}</h3>
				</a>
				<h5>{track.artist}</h5>
			</div>
			<div className={style.controls}>
				<PlayerControls />
				<ProgressBar
					className={style.progress}
					getValue={() => state.position} 
					max={state.duration} 
					onSet={value => playerService.skip(value)}
				/>
				<Icon 
					className={style.hideIcon} 
					src="icons/down-close.svg" 
					onClick={() => appService.closeModal()}
				/>
			</div>
		</div>
	);
}
