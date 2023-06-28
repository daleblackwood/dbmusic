import { LibraryGrouping, MusicAlbum } from "@model";
import { css, cx, toKey } from "@utils";
import { Album } from "./album";

const style = css`
	.albums {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		max-width: 100%;
		direction: col;
	}

	.album {
		display: flex;
		flex-grow: 1;
	}

	.album img {
		width: 100%;
	}

	.group {
		margin-bottom: 2em;
	}

	.groupName {
		color: #666;
		padding: 0.5rem 0;
		text-transform: uppercase;
	}

	@media (min-width: 800px) {
		.albums {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 1200px) {
		.albums {
			grid-template-columns: repeat(5, 1fr);
		}
	}
`;

interface AlbumGroup {
	name: string;
	albums: MusicAlbum[]
}

export function AlbumGrid(props: {
	grouping: LibraryGrouping,
	albums: MusicAlbum[],
	grouped?: boolean,
	showFormative?: boolean,
	className?: string
}) {
	const groupKeys = props.grouping.split(".");
	let albumGroups = [] as AlbumGroup[];
	for (const album of props.albums) {
		const groupKey = groupKeys[groupKeys.length - 1] as keyof MusicAlbum;
		const name = String(album[groupKey] || "");
		let group = albumGroups.find(x => toKey(x.name) === toKey(name));
		if (!group) {
			group = {
				name,
				albums: []
			};
			albumGroups.push(group);
		}
		group.albums.push(album);
	}
	for (const group of albumGroups) {
		group.albums.sort((a, b) => a.date < b.date ? 1 : -1);
	}
	albumGroups.sort((a, b) => a.albums[0].date < b.albums[0].date ? 1 : -1);
	albumGroups = albumGroups.filter(x => x.albums.filter(x => x.formative === false || props.showFormative).length > 0);
	if (!props.grouped) {
		const onlyGroup: AlbumGroup = {
			name: props.grouping,
			albums: []
		};
		for (const group of albumGroups) {
			onlyGroup.albums.push(...group.albums);
		}
		albumGroups = [onlyGroup];
	}
	return (
		<div className={cx(style.albumGrid, props.className)}>
			{albumGroups.map(group => (
				<div key={group.name} className={style.group}>
					{props.grouped && (
						<h1 className={style.groupName}>{group.name}</h1>
					)}
					<div className={style.albums}>
						{group.albums.filter(x => !x.formative || props.showFormative).map(album => (
							<div key={album.key} className={style.album}>
								<Album album={album} />
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
