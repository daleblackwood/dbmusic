export function toTitle(s: string) {
	if (!s)
		return "";
	return s.replace(/[-_]+/g, " ");
}
