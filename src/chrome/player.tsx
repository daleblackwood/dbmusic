import { useSubject } from "observational/hooks";
import { Icon } from "@components";
import { playerService } from "@services";
import { css } from "@utils";

const style = css`
	.player {
		position: fixed;
		height: 100px;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: grey;
	}

	.buttons {
		display: flex;
		flex-direction: column;
	}

	.buttons img {
		width: 25px;
		height: 25px;
	}
`;

export function Player() {
	const [state] = useSubject(playerService.subState);

	return (
		<div className={style.player}>
			<div className={style.buttons}>
				<Icon src="icons/prev.svg" onClick={() => playerService.playPrev()} />
				{state.isPlaying ? (
					<Icon src="icons/pause.svg" onClick={() => playerService.pause()} />
				) : (
					<Icon src="icons/play.svg" onClick={() => playerService.resume()} />
				)}
				<Icon src="icons/next.svg" onClick={() => playerService.playNext()} />
			</div>
		</div>
	);
}
