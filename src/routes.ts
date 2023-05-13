import React from "react";
import { Album } from "./views/album";
import { Albums } from "./views/albums";

type ComponentType<T = any> = (props: T) => (JSX.Element | null);

interface RouteInfo {
	title: string;
	icon: string;
	view: ComponentType
}

export const ROUTE = {
	albums: {
		title: "Albums",
		icon: "icons/releases.svg",
		view: Albums
	},
	album: {
		title: "Album",
		icon: "icons/releases.svg",
		view: Album
	}
}  as const satisfies Record<string, RouteInfo>;

export type Route = keyof typeof ROUTE;

export function parseRoute(route: string): Route {
	if (!route) 
		return "albums";
	route = route.trim();
	if (route.charAt(0) === '#') {
		route = route.substring(1);
	}
	if (route.charAt(0) === '/') {
		route = route.substring(1);
	}
	return route.toLowerCase() as Route;
}

export function getRoute(): Route {
	return parseRoute(location.hash) as Route;
}

export function getView(route: Route) {
	return React.createElement(getViewClass(route), { key: route, route }, []);
}

function getViewClass(route: Route) {
	route = parseRoute(route);
	if (ROUTE[route]) {
		return ROUTE[route].view;
	}
	const top = route.split('/')[0] as Route;
	if (ROUTE[top]) {
		return ROUTE[top].view;
	}
	return ROUTE.albums.view;
}
