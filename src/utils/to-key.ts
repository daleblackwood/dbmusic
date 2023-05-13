export function toKey(s: string) {
	if (!s) return "";
	s = s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
	return s;
}
