import { useSubject } from "observational/hooks";
import { libraryService } from "@services";
import { Album, Dropdown } from "@components";
import { LIBRARY_GROUPING, LibraryGrouping, MusicAlbum, Settings } from "@model";
import { css, cx, toKey } from "@utils";

const style = css`
	.albums {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		max-width: 100%;
		direction: col;
	}

	.groupSelectArea {
		font-size: 20pt;
		margin: 80px 0 0.8rem;
	}

	.groupSelect {
		border: none;
		background: none;
		font-size: inherit !important;
		padding: 0;
		border-bottom: 3px dashed var(--accent);
		border-radius: 0;
	}

	.album {
		display: flex;
		flex-grow: 1;
	}

	.album img {
		width: 100%;
	}

	.heading {
		padding: 80px 0 1rem;
	}

	.group {
		margin-bottom: 2em;
	}

	.groupName {
		text-align: right;
		color: var(--accent);
		padding: 0.5rem 0;
		opacity: 0.5;
		text-transform: uppercase;
	}

	@media (min-width: 800px) {
		.library {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 1200px) {
		.library {
			grid-template-columns: repeat(5, 1fr);
		}
	}
`;

interface Group {
	name: string;
	albums: MusicAlbum[]
}

export function LibraryView() {
	const [collection] = useSubject(libraryService.subCollection);
	const [settings, setSettings] = useSubject(libraryService.subSettings);
	if (!collection || !collection.albums || !collection.albums.length)
		return null;
	const groupKey = settings.grouping.toLowerCase() as keyof MusicAlbum;
	let groups = [] as Group[];
	for (const album of collection.albums) {
		const name = String(album[groupKey] || "");
		let group = groups.find(x => toKey(x.name) === toKey(name));
		if (!group) {
			group = {
				name,
				albums: []
			};
			groups.push(group);
		}
		group.albums.push(album);
	}
	for (const group of groups) {
		group.albums.sort((a, b) => a.date < b.date ? -1 : 1);
	}
	groups.sort((a, b) => a.albums[0].year < b.albums[0].year ? -1 : 1);
	if (!settings.grouped) {
		const onlyGroup: Group = {
			name: settings.grouping,
			albums: []
		};
		for (const group of groups) {
			onlyGroup.albums.push(...group.albums);
		}
		groups = [onlyGroup];
	}
	const filterOptions = {} as Record<string, string>;
	for (const groupKey of LIBRARY_GROUPING) {
		filterOptions[groupKey] = "By " + groupKey;
	}
	return (
		<div className={style.library}>
			<div className={style.groupSelectArea}>
				<Dropdown 
					className={cx("heading", style.groupSelect)}
					selected={settings.grouping}
					options={filterOptions}
					onSelect={grouping => setSettings({ ...settings, grouping } as Settings)} 
				/>
			</div>
			{/*<h3 className={style.heading}>By {settings.grouping}</h3>*/}
			{groups.map(group => (
				<div key={group.name} className={style.group}>
					{settings.grouped && (
						<h1 className={style.groupName}>{group.name}</h1>
					)}
					<div className={style.albums}>
						{group.albums.filter(x => !x.formative || settings.showFormative).map(album => (
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
