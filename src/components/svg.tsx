import React, { useEffect, useState } from "react";

interface SVGImageProps extends React.HTMLProps<HTMLDivElement> {
  	src: string;
}

const svgCache: Record<string, string> = {};

export function SVGImage({ src, ...props }: SVGImageProps) {
	const [svgContent, setSvgContent] = useState<string | null>(null);

	useEffect(() => {
		if (svgCache[src]) {
			setSvgContent(svgCache[src]);
		} else {
			fetch(src).then(x => x.text())
			.then(svgText => {
				const parser = new DOMParser();
				const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
				svgCache[src] = svgDoc.documentElement.outerHTML;
				setSvgContent(svgCache[src]);
			})
			.catch(error => {
				console.error("Error loading SVG:", error);
			});
		}
	}, [src]);

  	return svgContent ? (
		<div {...props} dangerouslySetInnerHTML={{ __html: svgContent }} />
	) : (
		<div {...props} ><svg /></div>
	);
}
