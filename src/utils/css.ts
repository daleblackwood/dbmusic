let index = 0;

const CHAR_0 = "0".charCodeAt(0);
const CHAR_9 = "9".charCodeAt(0);

export function css(cssMarkup: string | string[] | TemplateStringsArray) {
	if (cssMarkup && typeof cssMarkup !== "string") {
		cssMarkup = Array.prototype.join.apply(cssMarkup, ["\n"]);
	}
	const result = {} as Record<string, string>;
	if (cssMarkup) {
		const suffix = "C" + (++index);
		const modifiedCSS = cssMarkup.replace(/\.([^\s{]+)/g, match => {
			const className = match.substring(1);
			if (className.indexOf(";") >= 0)
				return match;
			const firstChar = className.charCodeAt(0);
			if (firstChar >= CHAR_0 && firstChar <= CHAR_9)
				return match;
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
