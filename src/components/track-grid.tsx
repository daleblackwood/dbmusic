import { LibraryGrouping, MusicAlbum, MusicTrack } from "@model";
import { css, cx, toKey } from "@utils";
import { Album, TrackDetailed } from "./";
import { libraryService } from "@services";

const style = css`
	.albums {
		/*
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		max-width: 100%;
		direction: col;
		*/
	}

	.item {
		display: flex;
		width: 100%;
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

interface MusicTrackAlbum extends MusicTrack {
	albumData: MusicAlbum
}

interface Group {
	name: string;
	items: MusicTrackAlbum[]
}

export function TrackGrid(props: {
	grouping: LibraryGrouping,
	tracks: MusicTrack[],
	grouped?: boolean,
	showFormative?: boolean,
	className?: string
}) {
	const groupKeys = props.grouping.split(".");
	let groups = [] as Group[];
	for (const track of props.tracks) {
		const groupKey = groupKeys[groupKeys.length - 1] as keyof MusicTrack;
		const name = String(track[groupKey] || "");
		let group = groups.find(x => toKey(x.name) === toKey(name));
		if (!group) {
			group = {
				name,
				items: []
			};
			groups.push(group);
		}
		const albumData = libraryService.getAlbum(track.album);
		const item = { ...track, albumData } as MusicTrackAlbum;
		group.items.push(item);
	}
	for (const group of groups) {
		group.items.sort((a, b) => a.date < b.date ? 1 : -1);
	}
	groups = groups.filter(x => x.items.filter(x => x.albumData.formative === false || props.showFormative).length > 0);
	groups.sort((a, b) => a.items[0].date < b.items[0].date ? 1 : -1);
	if (!props.grouped) {
		const onlyGroup: Group = {
			name: props.grouping,
			items: []
		};
		for (const group of groups) {
			onlyGroup.items.push(...group.items);
		}
		groups = [onlyGroup];
	}
	return (
		<div className={cx(style.albumGrid, props.className)}>
			{groups.map(group => (
				<div key={group.name} className={style.group}>
					{props.grouped && (
						<h1 className={style.groupName}>{group.name}</h1>
					)}
					<div className={style.albums}>
						{group.items.filter(x => !x.albumData.formative || props.showFormative).map((item, index) => (
							<div key={item.key} className={style.album}>
								<TrackDetailed tracks={group.items as MusicTrack[]} index={index} />
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
