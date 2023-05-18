import { useState } from "react";
import { useSubject } from "observational/hooks";
import { Nav, Player } from "./chrome";
import { appService, libraryService } from "./services";
import { getView } from "./routes";
import { accentColor, css, cx, isIOS } from "@utils";

const style = css`
	.app {
		position: relative;
	}

	.page {
		padding: 80px 1rem 180px;
	}

	.loadStatus {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	.modal {
		position: fixed;
		top: 100vh;
		left: 0;
		right: 0;
		height: 100vh;
		max-height: 100%;
		z-index: 1;
		padding: 1rem;
		background-color: #111111;
		transition: top 0.3s ease-in-out;
	}

	.open {
		top: 0;
	}

	.nag {
		position: fixed;
		width: 100%;
		height: 80%;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 10%;
		left: 0;
		background-color: black;
		flex-direction: column;
		padding: 2rem;
		text-align: center;
	}
	.nag a {
		color: var(--accent);
	}

	@media (max-width: 500px) {
		.page {
			padding-top: 1rem;
		}
	}

	@media (min-width: 501px) {
		.page {
			padding: 3rem;
			padding-left: 80px;
		}
	}
`;

function updateAccent(path: string) {
	const color = accentColor(path);
	const root = document.querySelector<HTMLElement>(":root");
	if (root) {
		root.style.setProperty("--accent", color);
	}
}

export function App() {
	const [route] = useSubject(appService.subRoute);
	const [nagged, setNagged] = useSubject(appService.subNagged);
	const [height, setHeight] = useState(window.innerHeight);
	updateAccent(route.fullPath);
	const [collection] = useSubject(libraryService.subCollection);
	if (collection.hasLoaded !== true) {
		return <div className={style.loadStatus}>Loading...</div>
	}
	if (collection.hasLoaded && collection.tracks.length < 1) {
		return <p>Collection didn't load.</p>
	}
	let appStyle: Record<string, string> = {};
	const ios = isIOS();
	if (ios) {
		appStyle.height = height + "px";
		appStyle.overflow = "auto";
		window.scrollTo(0, 1);
		window.onresize = () => setHeight(window.innerHeight);
		document.body.setAttribute("data-platform", "iphone");
	}
	const fullPhone = window.innerWidth / window.innerHeight < 0.5;
	document.body.setAttribute("data-full-phone", fullPhone ? "true" : "false");
	const needsNag = !nagged && ios && !fullPhone;
	return (
		<div id="#App" className={style.app} style={appStyle}>
			<Nav />
			<div className={style.page}>
				{getView(route.path)}
			</div>
			<div className={cx(style.modal, route.subPaths.length > 0 && style.open)}>
				{route.subPaths[0] && getView(route.subPaths[0].path)}
			</div>
			<Player />
			{needsNag && (
				<div className={style.nag} onClick={() => setNagged(true)}>
					<p>Hey! Add this to your Home Screen and it will work just like a regular phone app thingy and you'll be able to listen with your phone closed like a regular real thing.</p>
					<p>Oh, you'll probably need your ringer set to on for it to work. I don't make the rules, just the music.</p>
					<p>Do it, I bloody dare you.</p>
					<br />
					<a><h3>Yeah, alright.</h3></a>
				</div>
			)}
		</div>
	);
}
