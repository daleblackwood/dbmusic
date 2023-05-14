import { useSubject } from "observational/hooks";
import { libraryService } from "@services";
import { Album } from "@components";
import { css } from "@utils";

const style = css`
	.library {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		max-width: 100%;
		direction: col;
		padding-top: 50px;
	}

	.album {
		display: flex;
		flex-grow: 1;
	}

	.album img {
		width: 100%;
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

export function LibraryView() {
	const [music] = useSubject(libraryService.subCollection);
	if (!music || !music.albums || !music.albums.length)
		return null;
	return (
		<div className={style.library}>
			{music.albums.map(x => (
				<div key={x.key} className={style.album}>
					<Album album={x} />
				</div>
			))}
		</div>
	);
}
