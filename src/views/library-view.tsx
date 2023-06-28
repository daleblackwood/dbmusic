import { useSubject } from "observational/hooks";
import { libraryService } from "@services";
import { AlbumGrid, TrackGrid, Dropdown } from "@components";
import { LIBRARY_GROUPINGS, Settings } from "@model";
import { css, cx } from "@utils";

const style = css`
	.library {
		margin-top: 80px;
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

	@media (min-width: 800px) {
		.library {
			margin-top: 0;
		}
	}
`;

export function LibraryView() {
	const [collection] = useSubject(libraryService.subCollection);
	const [settings, setSettings] = useSubject(libraryService.subSettings);
	if (!collection || !collection.albums || !collection.albums.length)
		return null;
	const groupKeys = settings.grouping.split(".");
	const groupType = groupKeys[0];
	
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
			{groupType === "track" ? (
				<TrackGrid
					tracks={collection.tracks}
					grouping={settings.grouping}
					grouped={settings.grouped}
					showFormative={settings.showFormative}
				/>
			) : (
				<AlbumGrid
					albums={collection.albums}
					grouping={settings.grouping}
					grouped={settings.grouped}
					showFormative={settings.showFormative}
				/>
			)}
		</div>
	);
}
