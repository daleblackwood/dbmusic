import { css, cx } from "@utils";

const style = css`
	.albumArt {
		border-radius: 5px;
		width: 50vw;
		height: 50vw;
		object-fit: scale-down;
		object-position: top;
		cursor: pointer;
	}
`;

export function AlbumArt(props: { src?: string, className?: string, onClick?: () => unknown}) {
	return (
		<img
			src={props.src || "blankmusic.jpg"}
			className={cx(style.albumArt, props.className, "album-art")}
			onClick={props.onClick}
		/>
	);
}
