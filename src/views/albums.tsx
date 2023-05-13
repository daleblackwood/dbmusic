import { useSubject } from "observational/hooks";
import { libraryService } from "@services";
import { Album } from "@components";
import { css } from "@utils";

const style = css`
	.albums {
		display: flex;
		gap: 1rem;
		max-width: 100%;
		direction: col;
		flex-wrap: wrap;
		justify-items: center;
	}

	.album {
		display: flex;
		width: 250px;
		max-width: calc(50% - 0.5rem);
		flex-grow: 1;
	}

	.album img {
		width: 100%;
	}
`;

export function Albums() {
	const [music] = useSubject(libraryService.subCollection);
	if (!music || !music.albums || !music.albums.length)
		return null;
	return (
		<div className={style.albums}>
			{music.albums.map(x => (
				<div key={x.key} className={style.album}>
					<Album album={x} />
				</div>
			))}
		</div>
	);
}
