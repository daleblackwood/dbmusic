import { MusicTrack } from "@model";
import { playerService } from "@services";
import { css } from "@utils";

const style = css`
	.track {
		padding: 0.6rem 1rem;
		margin-bottom: 2px;
		border-radius: 5px;
    	background-color: rgba(180, 180, 180, 0.2);
	}
`;

export function Track(props: { tracks: MusicTrack[], index: number }) {
	const track = props.tracks[props.index];
	return (
		<div className={style.track} key={track.key} onClick={() => playerService.play(props.tracks, props.index)}>
			{track.name}
		</div>
	);
}
