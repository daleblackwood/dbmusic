import { css, cx } from "@utils";

const style = css`
	.albumArt {
		border-radius: 5px;
		width: 50px;
		height: 50px;
	}
`;

export function AlbumArt(props: { src?: string, className?: string, onClick?: () => unknown}) {
	return (
		<img
			src={props.src || "blankmusic.jpg"}
			className={cx(style.albumArt, props.className, "album-art")}
			onClick={props.onClick}
		/>
	)
}
