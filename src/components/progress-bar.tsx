import { css } from "@utils";

const style = css`
	.progressBar {
		width: 100%;
		position: relative;
		background-color: black;
		height: 5px;
	}

	.progressBar .bar {
		position: absolute;
		width: 0%;
		top: 0;
		left: 0;
		bottom: 0;
		background-color: var(--accent);
	}

	.progressBar .thumb {
		position: absolute;
		width: 1em;
		height: 2em;
	}
`;

export function ProgressBar(props: { value?: number, min?: number, max?: number, onSet?: (value: number) => unknown }) {
	let { value, min, max } = props;
	if (!min) {
		min = 0;
	}
	if (!max) {
		max = 100;
	}
	if (!value || value < 0) {
		value = 0;
	}
	const r = (value - min) / (max - min);
	const pc = r * 100;
	return (
		<div className={style.progressBar}>
			<div className={style.bar} style={{ width: pc + "%" }} />
			<div className={style.thumb} style={{ left: pc + "%" }} />
		</div>
	)
}
