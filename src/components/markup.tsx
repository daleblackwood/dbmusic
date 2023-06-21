import { marked } from "marked";
import { css, cx, useMarkup } from "@utils";

const style = css`
	.markup {
		font-size: 0.9rem;
	}

	.markup h1, .markup h2, .markup h3 {
		color: var(--accent);
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
	}

	.markup h4, .markup h5, .markup h6 {
		color: var(--accent);
		font-size: 1.1rem;
		margin-bottom: 1rem;
	}

	.markup p {
		margin-bottom: 1rem;
	}

	.markup a { 
		color: var(--accent);
		font-weight: bold;
	}
`;

export function Markup(props: { path?: string, className?: string }) {
	const markup = useMarkup(props.path);
	let renderedMarkup = (markup || "").trim();
	if (renderedMarkup && renderedMarkup.startsWith("<") == false) {
		renderedMarkup = marked.parse(renderedMarkup);
	}
	return (
		<div className={cx(style.markup, props.className)} dangerouslySetInnerHTML={{ __html: renderedMarkup }} />
	);
}
