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

	.logo {
		top: 0.5rem;
		left: 0.5rem;
		position: fixed;
		z-index: 1;
		color: var(--accent);
	}

	.logo svg {
		width: 40px;
		height: auto;
	}

	.icon {
		flex-grow: 1;
		text-align: center;
		padding: 10px;
		max-width: 100px;
	}

	.icon svg {
		height: 30px;
		width: 30px;
	}

	.disabled {
		opacity: 0.3;
		cursor: default;
	}

	.selected {
		border-bottom: 2px solid var(--accent);
		cursor: default;
		color: var(--accent);
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
			path: "library",
			selected: !route || route.root === "library",
			link: "library"
		},
		{
			title: "Album",
			icon: "icons/releases.svg",
			path: "album",
			disabled: !state.track,
			selected: route.root === "album",
			link: "album/" + state.track?.album
		},
		{
			title: "Track",
			icon: "icons/music.svg",
			path: "track",
			disabled: !state.track,
			selected: route.root === "track",
			link: "track/" + state.track?.key
		},
		{
			title: "Settings",
			icon: "icons/settings.svg",
			path: "settings",
			selected: route.root === "settings",
			link: "settings"
		}
	];
	return (
		<div className={style.nav}>
			<Icon 
				src="logo.svg" 
				className={style.logo} 
				onClick={() => appService.navigate("library")}
			/>
			<span className={style.title}>Dale Blackwood Music</span>
			{links.map(x => (
				<a key={x.link} href={x.disabled ? location.hash : "#" + x.link}>
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
