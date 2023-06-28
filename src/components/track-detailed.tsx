import { MusicTrack } from "@model";
import { playerService, libraryService } from "@services";
import { css, cx } from "@utils";

const style = css`
	.track {
		padding: 0.6rem 1rem;
		margin-bottom: 2px;
		border-radius: 5px;
    	background-color: rgba(180, 180, 180, 0.05);
		display: flex;
		direction: row;
		gap: 1ex;
		justify-content: space-between;
		text-align: left;
	}

	.trackNumber {
		text-align: center;
		display: inline-block;
		color: var(--accent);
	}

	.trackName {
		flex-grow: 2;
	}

	.selected {
		color: var(--accent);
    	background-color: rgba(180, 180, 180, 0.1);
	}

	.image {
		float: left;
		width: 40px !important;
		flex-grow: 0;
	}
`;

export function TrackDetailed(props: { tracks: MusicTrack[], index: number, selected?: boolean, onSelect?: (key: string) => unknown }) {
	const track = props.tracks[props.index];
	const album = libraryService.getAlbum(track.album);
	return (
		<div 
			className={cx(style.track, props.selected && style.selected)} 
			key={track.key} 
			onClick={() => {
				playerService.play(props.tracks, props.index);
				props.onSelect && props.onSelect(track.key);
			}}
		>
			<img className={style.image} src={album?.image} />
			<span className={style.trackName}>{track.name}</span>
			<span className={style.trackNumber}>{album?.name} #{track.track}</span>
		</div>
	);
}
