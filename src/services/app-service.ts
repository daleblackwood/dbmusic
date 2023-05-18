import { Subject } from "observational";
import { getRoute, parseRoute } from "../routes";

class AppService {

	subRoute = new Subject(getRoute());
	subNagged = new Subject(false);

	constructor() {
		location.hash = getRoute().fullPath;
		window.addEventListener("hashchange", e => {
			const newUrl = e.newURL.substring(e.newURL.indexOf('#') + 1);
			const route = parseRoute(newUrl);
			this.subRoute.setValue(route);
			window.scrollTo(0, 0);
		});
		this.subRoute.listen(this, x => console.log("route", x))
	}

	navigate(route: string, modal?: boolean) {
		if (modal) {
			route = this.subRoute.value.path + ":" + route;
		}
		const parsed = parseRoute(route);
		location.hash = parsed.fullPath;
		this.subRoute.setValue(parsed);
	}

	closeModal() {
		const currentRoute = this.subRoute.value;
		const route = { ...currentRoute, subPaths: [], fullPath: currentRoute.root };
		this.subRoute.setValue(route);
	}

}

export const appService = new AppService();
