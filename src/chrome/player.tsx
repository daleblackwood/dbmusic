import { useSubject } from "observational/hooks";
import { Icon } from "@components";
import { playerService, libraryService } from "@services";
import { css, cx } from "@utils";

const style = css`
	.player {
		position: fixed;
		height: 80px;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0,0,0,0.85);
		display: flex;
		flex-direction: row;
		padding: 0 1rem;
		justify-content: space-between;
	}

	.trackless {
		display: none;
	}

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
	}

	.buffering svg {
		animation-name: spin;
		animation-duration: 2000ms;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}

	.track {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
		max-width: 75%;
	}

	.track img {
		width: 60px;
		height: 60px;
	}

	.trackTitle {
		font-size: 0.8rem;
	}

	.trackTitle p {
		margin: 0;
		white-space: nowrap;
	}

	.trackTitle p:first-child {
		font-weight: bold;
		font-size: 1rem;
	}

	@keyframes spin {
		from {transform:rotate(0deg);}
		to {transform:rotate(360deg);}
	}

	@media(max-width: 500px) {
		.player {
			bottom: 80px;
		}

		.btnPrev, .btnNext {
			display: none;
		}
	}
`;

export function Player() {
	const [state] = useSubject(playerService.subState);
	const imageUrl = libraryService.getTrackArt(state.track);

	return (
		<div className={cx(style.player, !state.track && style.trackless)}>
			<div className={style.track}>
				<img src={imageUrl} />
				<div className={style.trackTitle} >
					<p>{state.track?.name}</p>
					<p>{state.track?.artist}</p>
				</div>
			</div>
			<div className={style.buttons}>
				<Icon className={style.btnPrev} src="icons/prev.svg" onClick={() => playerService.playPrev()} />
				{state.state === "playing" ? (
					<Icon src="icons/pause.svg" onClick={() => playerService.pause()} />
				) : state.state === "buffering" ? (
					<Icon src="icons/loading.svg" className={style.buffering} onClick={() => playerService.pause()} />
				) : (
					<Icon src="icons/play.svg" onClick={() => playerService.resume()} />
				)}
				<Icon className={style.btnNext} src="icons/next.svg" onClick={() => playerService.playNext()} />
			</div>
		</div>
	);
}
