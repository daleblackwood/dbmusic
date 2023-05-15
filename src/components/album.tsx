import { MusicAlbum } from "@model";
import { css, cx } from "@utils";
import { AlbumArt } from "./album-art";

const style = css`
	.album {
		width: 100%;
		text-decoration: none;
	}

	.album h5 {
		color: var(--accent);
	}

	.image {
		width: 250px;
		height: auto;
		max-width: 100%;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: 5px;
	}
`;

export function Album(props: { album: MusicAlbum }) {
	return (
		<a className={cx("card", style.album)} href={"#album/" + props.album.key}>
			<AlbumArt src={props.album.image} className={style.image} />
			<div className="card-body">
				<h4>{props.album.artist}</h4>
				<h5 className="card-title">{props.album.name}</h5>
				<p className="card-content">
					{cx(props.album.genre, props.album.date.getFullYear())}
				</p>
			</div>
		</a>
	);
}
