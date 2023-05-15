import { useSubject } from "observational/hooks";
import { Track } from "@components";
import { playerService, libraryService } from "@services"
import { css } from "@utils";

const style = css`
	.header {
		position: relative;
		height: 18rem;
		margin: -1rem -1rem 1rem;
		padding: 1rem;
		background-color: black;
	}

	.bgImage {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		opacity: 0.2;
	}

	.titles {
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
	}

	.heading h3 {
		color: var(--accent);
	}

	.cover {
		width: 120px;
		height: 120px;
		border-radius: 5px;
	}
`;

export function AlbumView(props: { route: string, params: string[] }) {
	const [collection] = useSubject(libraryService.subCollection);
	const [state] = useSubject(playerService.subState);
	const albumKey = props.params[0];
	const album = collection.albums.find(x => x.key === albumKey);
	if (!album) {
		return (
			<p>Album not found.</p>
		);
	}
	const tracks = collection.tracks.filter(x => x.album === albumKey);
	return (
		<div className="page">
			<div className={style.header}>
				<div className={style.bgImage} style={{ backgroundImage: "url('" + album.image + "')"}} />
				<div className={style.titles}>
					<img className={style.cover} src={album.image} />
					<div className={style.heading}>
						<h1 className="display-1">
							{album.name}
						</h1>
						<h3 className="display-3">
							{album.artist}
						</h3>
					</div>
				</div>
			</div>
			<div className="img" />
			<div className="menu">
				{tracks.map((track, i) => (
					<Track key={track.key} tracks={tracks} index={i} selected={track.key === state.track?.key } />
				))}
			</div>
		</div>
	);
}
