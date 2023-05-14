export function accentColor(path: string) {
	let hue = 30;
	for (let i=0; i<path.length; i++) {
		hue += path.toUpperCase().charCodeAt(i) - 65;
	}
	hue = (hue % 100) + 260;
	const color = "hsl(" + hue + "deg 45% 65%)";
	return color;
}
