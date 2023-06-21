import { css, cx } from "@utils";
import { Icon } from "@components";

const style = css`
	.loader svg {
		animation-name: spin;
		animation-duration: 2000ms;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}

	.loader svg {
		animation-name: spin;
		animation-duration: 2000ms;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}

	@keyframes spin {
		from {transform:rotate(0deg);}
		to {transform:rotate(360deg);}
	}
`;

export function Loader(props: { className?: string, onClick: () => unknown }) {
	return (
		<Icon 
			src="icons/loading.svg" 
			className={cx(style.loader, props.className)} 
			onClick={props.onClick} 
		/>
	)
}
