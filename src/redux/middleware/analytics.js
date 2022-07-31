import ReactGA from "react-ga";
import * as ActionTypes from "../actions";
import { snakeCase } from "lodash";
import { isPwa } from "../../util/general";

const options = {};

ReactGA.initialize(process.env.REACT_APP_ANALYTICS, {
	debug: process.env.NODE_ENV !== "production",
});

ReactGA.set({ dimension1: isPwa() ? "PWA" : "Browser" });

const trackPage = (page) => {
	ReactGA.set({
		page,
		...options,
	});
	ReactGA.pageview(page);
};

const trackLike = (activity, value) => {
	ReactGA.event({
		category: "Likes",
		action: `${value ? "Liked" : "Disliked"} an activity`,
		label: snakeCase(activity.title),
	});
};

const trackException = (error, info) => {
	ReactGA.exception({
		description: `Error: ${error}\n${JSON.stringify(info)}`,
		fatal: true,
	});
};

let currentPage = "";

export const googleAnalytics = (store) => (next) => (action) => {
	const {
		general: { trackingConsent },
	} = store.getState();

	if (!trackingConsent) {
		console.warn("Tracking disabled.");

		return next(action);
	}

	if (action.type === "@@router/LOCATION_CHANGE") {
		const nextPage = `${action.payload.location.pathname}${action.payload.location.search}`;

		if (currentPage !== nextPage) {
			currentPage = nextPage;
			trackPage(nextPage);
		}
	}

	if (action.type === ActionTypes.ACTIVITY_FAVORITE) {
		trackLike(action.activity, action.isLike);
	}

	if (action.type === ActionTypes.GENERAL_EXCEPTION) {
		trackException(action.error, action.info);
	}

	return next(action);
};
