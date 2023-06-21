import { MEDIA_HOST } from "@model";
import { useState, useEffect } from "react";

const markupMap = {} as Record<string, string>;

export function useMarkup(path?: string) {
	const existing = (path && markupMap[path]) || "";
	const [markup, setMarkup] = useState(existing);
	useEffect(() => {
		if (path && !existing) {
			setMarkup("");
			fetch(MEDIA_HOST + path)
			.then(x => x.text())
			.then(x => {
				markupMap[path] = x;
				setMarkup(x);
			})
			.catch(e => console.error("Couldn't load markup: " + path, e))
		}
	}, [path]);
	return markup;
}
