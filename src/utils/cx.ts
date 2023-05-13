export function cx(...classes: string[]) {
	const classNames = [];
	for (const c of classes) {
		if (c) {
			classNames.push(c);
		}
	}
	return classNames.join(" ");
}
