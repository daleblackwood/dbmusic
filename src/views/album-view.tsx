import { useSubject } from "observational/hooks";
import { Markup, Track } from "@components";
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
	}

	.bgDither {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: url("bgdither.png") repeat;
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

	.content {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	@media (min-width: 800px) {
		.content {
			flex-direction: row;
		}

		.content > * {
			width: 50%;
		}

		.info {
			padding: 1rem;
		}
	}
`;

export function AlbumView(props: { route: string, params: string[] }) {
	const [collection] = useSubject(libraryService.subCollection);
	const [state] = useSubject(playerService.subState);
	const albumKey = props.params[0];
	const trackKey = props.params[2] == "track" ? props.params[3] : undefined;
	console.log("track", trackKey);
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
				<div className={style.bgDither} />
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
			<div className={style.content}>
				<div className={style.tracks}>
					{tracks.map((track, i) => (
						<Track 
							key={track.key} 
							tracks={tracks} 
							index={i} 
							selected={track.key === state.track?.key}
							onSelect={undefined/*x => cappService.appendTrack(x)*/}
						/>
					))}
				</div>
				<div className={style.info}>
					<Markup className={style.markup} path={album.markup} />
				</div>
			</div>
		</div>
	);
}
