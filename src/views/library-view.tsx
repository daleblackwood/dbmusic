import { useSubject } from "observational/hooks";
import { libraryService } from "@services";
import { Album, Dropdown } from "@components";
import { LIBRARY_GROUPINGS, MusicAlbum, Settings } from "@model";
import { css, cx, toKey } from "@utils";

const style = css`
	.library {
		margin-top: 80px;
	}

	.albums {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		max-width: 100%;
		direction: col;
	}

	.groupSelectArea {
		font-size: 20pt;
		margin: 0 0 0.8rem;
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
		color: #666;
		padding: 0.5rem 0;
		text-transform: uppercase;
	}

	@media (min-width: 800px) {
		.library {
			margin-top: 0;
		}

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

interface Group {
	name: string;
	albums: MusicAlbum[]
}

export function LibraryView() {
	const [collection] = useSubject(libraryService.subCollection);
	const [settings, setSettings] = useSubject(libraryService.subSettings);
	if (!collection || !collection.albums || !collection.albums.length)
		return null;
	const groupKeys = settings.grouping.split(".");
	const groupType = groupKeys[0];
	let groups = [] as Group[];
	if (groupType === "track") {
		

	} else {
		for (const album of collection.albums) {
			const groupKey = groupKeys[groupKeys.length - 1] as keyof MusicAlbum;
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
			group.albums.sort((a, b) => a.date < b.date ? 1 : -1);
		}
		groups.sort((a, b) => a.albums[0].date < b.albums[0].date ? 1 : -1);
		groups = groups.filter(x => x.albums.filter(x => x.formative === false || settings.showFormative).length > 0);
	}
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
	return (
		<div className={style.library}>
			<h1>Dale Blackwood Music</h1>
			<div className={style.groupSelectArea}>
				<Dropdown 
					className={cx("heading", style.groupSelect)}
					selected={settings.grouping}
					options={LIBRARY_GROUPINGS}
					onSelect={grouping => setSettings({ ...settings, grouping } as Settings)} 
				/>
			</div>
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
