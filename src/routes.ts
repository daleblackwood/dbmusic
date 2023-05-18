import React from "react";
import { AlbumView } from "./views/album-view";
import { LibraryView } from "./views/library-view";
import { TrackView } from "./views/track-view";
import { SettingsView } from "./views/settings-view";

type ComponentType<T = any> = (props: T) => (JSX.Element | null);

interface RouteInfo {
	title: string;
	view: ComponentType
}

export const ROUTE = {
	library: {
		title: "Library",
		view: LibraryView
	},
	album: {
		title: "Album",
		view: AlbumView
	},
	track: {
		title: "Track",
		view: TrackView
	},
	settings: {
		title: "Settings",
		view: SettingsView
	}
}  as const satisfies Record<string, RouteInfo>;

export type RoutePath = keyof typeof ROUTE;

export interface PathInfo {
	path: RoutePath;
	root: string;
	params: string[];
}

export interface PathInfoRoot extends PathInfo {
	subPaths: PathInfo[];
	fullPath: string;
}

export function parseRoute(routePath: string) {
	const path = parseRoutePath(routePath) || "library";
	const pathSegs = path.split(":");
	const subPaths = [] as PathInfo[];
	for (const pathSeg of pathSegs) {
		const folders = pathSeg.split("/");
		const root = folders[0];
		const params = folders.slice(1);
		subPaths.push({ path: pathSeg as RoutePath, root, params });
	}
	const fullPath = subPaths.map(x => x.path).join(":");
	const root = {
		...subPaths[0],
		subPaths: subPaths.length > 1 ? subPaths.slice(1) : [],
		fullPath
	} as PathInfoRoot;
	return root;
}

function parseRoutePath(path: string): RoutePath | undefined {
	if (!path) 
		return undefined;
	path = path.trim();
	if (path.charAt(0) === '#') {
		path = path.substring(1);
	}
	if (path.charAt(0) === '/') {
		path = path.substring(1);
	}
	return path.toLowerCase() as RoutePath;
}

export function getRoutePath(): RoutePath {
	return parseRoutePath(location.hash) as RoutePath;
}

export function getRoute() {
	return parseRoute(getRoutePath());
}

export function getView(path: RoutePath) {
	const route = parseRoute(path);
	const view = getViewClass(path);
	return React.createElement(view, { key: route.root, route: route.path, params: route.params } as any, []);
}

function getViewClass(path: RoutePath) {
	if (ROUTE[path]) {
		return ROUTE[path].view;
	}
	const top = path.split('/')[0] as RoutePath;
	if (ROUTE[top]) {
		return ROUTE[top].view;
	}
	return ROUTE.library.view;
}
