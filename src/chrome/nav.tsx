import { appService } from "@services";
import { css, cx } from "@utils";

const style = css`
	.nav {
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0,0,0,0.85);
		color: white;
		font-weight: bold;
		position: fixed;
		width: 100%;
		z-index: 1000;
		cursor: pointer;
	}

	@media(max-width: 500px) {
		.nav {
			display: none;
		}
	}
`;

export function Nav() {
	return (
		<div className={cx("nav", style.nav)} onClick={() => appService.navigate("/")}>
			Dale Blackwood Music
		</div>
	);
}
