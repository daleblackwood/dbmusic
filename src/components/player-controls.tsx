import { useSubject } from "observational/hooks";
import { Icon, Loader } from "@components";
import { playerService } from "@services";
import { css, cx } from "@utils";

const style = css`
	.buttons {
		display: flex;
		flex-direction: row;
		color: white;
		justify-content: center;
		align-items: center;
	}

	.buttons svg {
		width: 45px;
		height: 45px;
		border: 1px solid white;
		border-radius: 50%;
		padding: 10px;
		justify-content: center;
		overflow: visible;
		margin: 5px;
		background: black;
	}

	@media (max-width: 500px) {
		.compact .btnPrev, .compact .btnNext {
			display: none;
		}
	}
`;

export function PlayerControls(props: { compact?: boolean }) {
	const [state] = useSubject(playerService.subState);
	return (
		<div className={cx(style.buttons, props.compact && style.compact)}>
			<Icon className={style.btnPrev} src="icons/prev.svg" onClick={() => playerService.playPrev()} />
			{state.state === "playing" ? (
				<Icon src="icons/pause.svg" onClick={() => playerService.pause()} />
			) : state.state === "buffering" ? (
				<Loader onClick={() => playerService.pause()} />
			) : (
				<Icon src="icons/play.svg" onClick={() => playerService.resume()} />
			)}
			<Icon className={style.btnNext} src="icons/next.svg" onClick={() => playerService.playNext()} />
		</div>
	);
}

