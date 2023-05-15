import { useSubject } from "observational/hooks";
import { Nav, Player } from "./chrome";
import { appService, libraryService } from "./services";
import { getView } from "./routes";
import { accentColor, css, cx } from "@utils";

const style = css`
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
		z-index: 1;
		padding: 1rem;
		background-color: #111111;
		transition: top 0.3s ease-in-out;
	}

	.open {
		top: 0;
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
	updateAccent(route.fullPath);
	const [collection] = useSubject(libraryService.subCollection);
	if (collection.hasLoaded !== true) {
		return <div className={style.loadStatus}>Loading...</div>
	}
	if (collection.hasLoaded && collection.tracks.length < 1) {
		return <p>Collection didn't load.</p>
	}
	return (
		<div id="#App">
			<Nav />
			<div className={style.page}>
				{getView(route.path)}
			</div>
			<div className={cx(style.modal, route.subPaths.length > 0 && style.open)}>
				{route.subPaths[0] && getView(route.subPaths[0].path)}
			</div>
			<Player />
		</div>
	);
}
