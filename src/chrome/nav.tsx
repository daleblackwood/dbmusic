import { Icon } from "@components";
import { appService, playerService } from "@services";
import { css, cx } from "@utils";
import { useSubject } from "observational/hooks";

const style = css`
	.nav {
		height: 80px;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		background-color: rgba(0,0,0,0.85);
		color: white;
		font-weight: bold;
		position: fixed;
		width: 100%;
		z-index: 1000;
		cursor: pointer;
		gap: 1rem;
		padding: 1rem;
	}

	.icon {
		flex-grow: 1;
		text-align: center;
		padding: 10px;
		max-width: 100px;
	}

	.icon svg {
		height: 40px;
		width: 40px;
	}

	.disabled {
		opacity: 0.3;
		cursor: default;
	}

	.selected {
		border-bottom: 2px solid white;
		cursor: default;
	}

	@media(max-width: 500px) {
		.nav {
			bottom: 0;
		}
		.title {
			display: none;
		}
	}
`;

export function Nav() {
	const [route] = useSubject(appService.subRoute);
	const [state] = useSubject(playerService.subState);
	const links = [
		{
			title: "Library",
			icon: "icons/collection.svg",
			path: "albums",
			selected: !route || route.split("/")[0] === "albums",
			link: "albums"
		},
		{
			title: "Album",
			icon: "icons/releases.svg",
			path: "album",
			disabled: !state.track,
			selected: route.split("/")[0] === "album",
			link: "album/" + state.track?.album
		},
		{
			title: "Track",
			icon: "icons/music.svg",
			path: "track",
			disabled: !state.track,
			selected: route.split("/")[0] === "track",
			link: "track/" + state.track?.key
		}
	];
	return (
		<div className={style.nav} onClick={() => appService.navigate("/")}>
			<span className={style.title}>Dale Blackwood Music</span>
			{links.map(x => (
				<a href={x.disabled || x.selected ? "javascript:void(0)" : "#" + x.link}>
					<Icon key={x.path} 
						src={x.icon} 
						className={cx(
							style.icon, 
							!x.selected && x.disabled && style.disabled,
							x.selected && style.selected
						)}
					/>
				</a>
			))}
		</div>
	);
}
