import { MusicTrack } from "@model";
import { playerService } from "@services";
import { css, cx } from "@utils";

const style = css`
	.track {
		padding: 0.6rem 1rem;
		margin-bottom: 2px;
		border-radius: 5px;
    	background-color: rgba(180, 180, 180, 0.05);
	}

	.trackNumber {
		width: 4ex;
		text-align: center;
		display: inline-block;
		color: var(--accent);
	}

	.selected {
		color: var(--accent);
    	background-color: rgba(180, 180, 180, 0.1);
	}
`;

export function Track(props: { tracks: MusicTrack[], index: number, selected?: boolean }) {
	const track = props.tracks[props.index];
	return (
		<div 
			className={cx(style.track, props.selected && style.selected)} 
			key={track.key} 
			onClick={() => playerService.play(props.tracks, props.index)}
		>
			<span className={style.trackNumber}>{track.track}</span>
			{track.name}
		</div>
	);
}
