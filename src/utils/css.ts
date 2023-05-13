let index = 0;

export function css(cssMarkup: string | string[] | TemplateStringsArray) {
	if (cssMarkup && typeof cssMarkup !== "string") {
		cssMarkup = Array.prototype.join.apply(cssMarkup, ["\n"]);
	}
	const result = {} as Record<string, string>;
	if (cssMarkup) {
		const suffix = "C" + (++index);
		const modifiedCSS = cssMarkup.replace(/\.([^\s{]+)/g, match => {
			if (match.indexOf(';') > 0)
				return match;
			const className = match.substring(1);
			const suffixedClassName = className + suffix;
			result[className] = suffixedClassName;
			return '.' + suffixedClassName;
		});
		const sheet = document.createElement("style");
		sheet.innerHTML = modifiedCSS;
		document.head.append(sheet);
	}
	return result;
}
