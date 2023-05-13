import { useSubject } from "observational/hooks";
import { libraryService } from "@services";
import { Album } from "@components";
import { css } from "@utils";

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
