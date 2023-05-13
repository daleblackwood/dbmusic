export function cx(...classes: (string|boolean|undefined|null)[]) {
	const classNames = [];
	for (const c of classes) {
		if (c) {
			classNames.push(c);
		}
	}
	return classNames.join(" ");
}
