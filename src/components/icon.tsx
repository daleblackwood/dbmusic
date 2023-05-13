export function Icon(props: { src: string, className?: string, onClick?: () => unknown }) {
	return (
		<img src={props.src} className={props.className} onClick={props.onClick} />
	);
}
