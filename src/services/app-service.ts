import { Subject } from "observational";
import { getRoute, parseRoute } from "../routes";

class AppService {

	subRoute = new Subject(getRoute());

	constructor() {
		location.hash = getRoute();
		window.addEventListener("hashchange", e => {
			const newUrl = e.newURL.substring(e.newURL.indexOf('#') + 1);
			const route = parseRoute(newUrl);
			this.subRoute.setValue(route);
		});
		this.subRoute.listen(this, x => console.log("route", x))
	}

	navigate(route: string) {
		const parsed = parseRoute(route);
		location.hash = parsed;
		this.subRoute.setValue(parsed);
	}

}

export const appService = new AppService();
