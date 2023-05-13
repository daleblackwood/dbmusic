import { useSubject } from "observational/hooks";
import { Nav, Player } from "./chrome";
import { appService } from "./services";
import { getView } from "./routes";
import { css } from "@utils";

const style = css`
	.page {
		padding: calc(50px + 1rem) 1rem 100px;
	}
`;

export function App() {
	const [route] = useSubject(appService.subRoute);
	const view = getView(route);
	
	return (
		<div id="#App">
			<Nav />
			<div className={style.page}>
				{view}
			</div>
			<Player />
		</div>
	);
}
