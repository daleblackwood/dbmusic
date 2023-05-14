import { useSubject } from "observational/hooks";
import { AlbumArt, PlayerControls } from "@components";
import { appService, playerService, libraryService } from "@services";
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

	@media(max-width: 500px) {
		.player {
			bottom: 80px;
		}
	}
`;

export function Player() {
	const [state] = useSubject(playerService.subState);
	const imageSrc = libraryService.getTrackArt(state.track);
	return (
		<div className={cx(style.player, !state.track && style.trackless)}>
			<div 
				className={style.track} 
				onClick={() => appService.navigate("track/" + state.track?.key, true)}
			>
				<AlbumArt src={imageSrc} />
				<div className={style.trackTitle} >
					<p>{state.track?.name}</p>
					<p>{state.track?.artist}</p>
				</div>
			</div>
			<PlayerControls compact />
		</div>
	);
}
