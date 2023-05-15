import { Component, createRef } from "react";
import { css, cx } from "@utils";

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
		pointer-events: none;
	}

	.progressBar .thumb {
		position: absolute;
		width: 1em;
		height: 2em;
		pointer-events: none;
	}

	.clickArea { 
		position: absolute;
		top: -15px;
		bottom: -15px;
		left: 0;
		right: 0;
		z-index: 100;
	}
`;

export class ProgressBar extends Component<{ 
	getValue?: () => number, 
	min?: number, 
	max?: number, 
	className?: string, 
	onSet?: (value: number) => unknown 
}> {
	downPos = [0, 0];
	refParent = createRef<HTMLDivElement>();
	refBar = createRef<HTMLDivElement>();
	refThumb = createRef<HTMLDivElement>();
	refClickArea = createRef<HTMLDivElement>();
	isDragging = false;
	isMounted = false;
	dragValue = 0;

	componentDidMount() {
		this.isMounted = true;
		window.requestAnimationFrame(this.onFrame);
	}

	onFrame = () => {
		const parent = this.refParent.current;
		if (!parent)
			return;
		const props = this.props;
		const [ min, max ] = this.getMinMax();
		let value = props.getValue && props.getValue();
		if (!value || value < 0) {
			value = 0;
		}
		const r = (value - min) / (max - min);
		let pc = r * 100;
		if (this.isDragging) {
			pc = this.dragValue;
		}
		if (this.refBar.current) {
			this.refBar.current.style.width = pc + "%";
		}
		if (this.refThumb.current) {
			this.refThumb.current.style.left = pc + "%";
		}
		if (this.isMounted) {
			window.requestAnimationFrame(this.onFrame);
		}
	}

	getMinMax() {
		let { min, max } = this.props;
		if (!min) {
			min = 0;
		}
		if (!max) {
			max = 100;
		}
		return [min, max];
	}

	startDrag = (e: MouseEvent|TouchEvent) => {
		if (!this.props.onSet)
			return;
		const parent = this.refParent.current;
		if (!parent || this.isDragging)
			return;
		this.isDragging = true;
		if (e.type.startsWith("touch")) {
			const te = e as TouchEvent;
			this.downPos = [te.touches[0].clientX, te.touches[0].clientY];
			window.addEventListener("touchmove", this.updateDrag, true);
			window.addEventListener("touchend", this.stopDrag, true);
			window.addEventListener("touchcancel", this.stopDrag, true);
		} else {
			const me = e as MouseEvent;
			this.downPos = [me.clientX, me.clientY];
			window.addEventListener("mousemove", this.updateDrag, true);
			window.addEventListener("mouseup", this.stopDrag, true);
		}
		this.downPos[0] += parent.offsetLeft;
		this.updateDrag(e);
	}

	updateDrag = (e: MouseEvent|TouchEvent) => {
		const parent = this.refParent.current;
		if (!parent || !this.isDragging)
			return;
		let currentPos = this.downPos;
		if (e.type.startsWith("touch")) {
			const te = e as TouchEvent;
			currentPos = [te.touches[0].clientX, te.touches[0].clientY];
		} else {
			const me = e as MouseEvent;
			currentPos = [me.clientX, me.clientY];
		}
		const rect = parent.getBoundingClientRect();
		const ratio = (currentPos[0] - rect.left) / (rect.right - rect.left);
		const pc = Math.max(0, Math.min(100, ratio * 100));
		this.dragValue = pc;
	}

	stopDrag = (e: MouseEvent|TouchEvent) => {
		console.log("stop drag", e);
		const parent = this.refParent.current;
		if (!parent || !this.isDragging)
			return;
		this.isDragging = false;
		this.updateDrag(e);
		this.removeListeners();
		const [ min, max ] = this.getMinMax();
		this.props.onSet && this.props.onSet(this.dragValue / 100 * (max - min) + min);
	}

	componentWillUnmount(): void {
		this.removeListeners();
	}

	removeListeners() {
		window.removeEventListener("mouseup", this.stopDrag);
		window.removeEventListener("mousemove", this.updateDrag);
		window.removeEventListener("touchend", this.stopDrag);
		window.removeEventListener("touchcancel", this.stopDrag);
		window.removeEventListener("touchmove", this.updateDrag);
	}

	render() {
		return (
			<div 
				ref={this.refParent} 
				className={cx(style.progressBar, this.props.className)} 
				onMouseDown={e => this.startDrag(e.nativeEvent)} 
				onTouchStart={e => this.startDrag(e.nativeEvent)}
			>
				<div ref={this.refBar} className={style.bar} />
				<div ref={this.refThumb} className={style.thumb} />
				<div ref={this.refClickArea} className={style.clickArea} />
			</div>
		);
	}
}
