export function toKey(s: string | number | Date | boolean | undefined | null) {
	if (typeof s === "undefined" || s === null) return "";
	s = s.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
	return s;
}
