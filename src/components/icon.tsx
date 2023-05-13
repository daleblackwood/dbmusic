import { SVGImage } from "./svg";

export function Icon(props: { src: string, className?: string, onClick?: () => unknown }) {
	return (
		<SVGImage src={props.src} className={props.className} onClick={props.onClick} />
	);
}
