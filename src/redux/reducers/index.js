import * as ActionTypes from "../actions";
import merge from "lodash/merge";
import categories from "../../config/categories";
import { combineReducers } from "redux";
import locations from "../../config/locations";
import { getEventDates } from "../../config/dates";
import { getCurrentDate } from "../../util/activity";
import { connectRouter } from "connected-react-router";
import { getMapFeatures } from "../../util/floorplan";
import loadEntity from "./entitityloader";
import loadSchedule from "./schedule-loader";

const initialState = {
	schedule: {},
	entities: {
		schedule: {},
		activities: {},
		updates: {},
		days: {},
		categories: {},
		/*locations: locations.reduce((obj, item) => {
			obj[item.name.toLowerCase()] = item;
			return obj;
		}, {}),*/
		locations: {},
	},
	notifications: {
		reply: null,
		subscription: null,
	},
	snackbarNotifications: [],
	general: {
		currentDate: getCurrentDate(),
		trackingConsent: true,
		firstLaunch: true,
		installDate: new Date(),
		auth: null,
		sendingUpdate: null,
	},
	activityFilter: {
		filter: {
			search: "",
			categories: [],
			locations: [],
			hidePastActivities: true,
		},
	},
	floorPlan: {
		features: getMapFeatures(),
		filters: ["location", "general"],
	},
	updatesRead: [],
	favoriteActivities: [],
};

const schedule = ( state = initialState.schedule, action) => {
	return state;
};

// Updates an entity cache in response to any action with response.entities.
const entities = (state = initialState.entities, action) => {
	if (action.response && action.response.entities) {
		return merge({}, state, action.response.entities);
	}

	return state;
};

const updatesRead = (state = initialState.updatesRead, action) => {
	if (action.type === ActionTypes.UPDATE_READ) {
		return [...state, action.updateId];
	}

	if (action.type === ActionTypes.UPDATE_READ_ALL) {
		return action.updateIds;
	}

	return state;
};

const favoriteActivities = (
	state = initialState.favoriteActivities,
	action
) => {
	if (action.type === ActionTypes.ACTIVITY_FAVORITE) {
		let newState = [...state];
		let index = newState.indexOf(action.activity.id);

		if (index === -1) {
			if (action.isLike) {
				newState.push(action.activity.id);
			}
		} else {
			if (!action.isLike) {
				newState.splice(index, 1);
			}
		}

		return newState;
	}

	return state;
};

const notifications = (state = initialState.notifications, action) => {
	if (action.type === ActionTypes.NOTIFICATIONS_REPLY) {
		return { ...state, reply: action.reply };
	}

	if (action.type === ActionTypes.NOTIFICATIONS_PUSH_SUBSCRIPTION) {
		return { ...state, subscription: action.subscription };
	}

	return state;
};

const floorPlan = (state = initialState.floorPlan, action) => {
	switch (action.type) {
		case ActionTypes.FLOORPLAN_FILTER:
			return { ...state, filters: action.filters };
		default:
			return state;
	}
};

const entityloader = combineReducers({
	schedules: loadSchedule({
		types: [
			ActionTypes.SCHEDULE_REQUEST,
			ActionTypes.SCHEDULE_SUCCESS,
			ActionTypes.SCHEDULE_FAILURE,
		],
	}),
	updates: loadEntity({
		types: [
			ActionTypes.UPDATES_REQUEST,
			ActionTypes.UPDATES_SUCCESS,
			ActionTypes.UPDATES_FAILURE,
		],
	}),
	activities: loadEntity({
		types: [
			ActionTypes.ACTIVITIES_REQUEST,
			ActionTypes.ACTIVITIES_SUCCESS,
			ActionTypes.ACTIVITIES_FAILURE,
		],
	}),
});

const activityFilter = (state = initialState.activityFilter, action) => {
	switch (action.type) {
		case ActionTypes.ACTIVITIES_FILTER:
			return { ...state, filter: { ...state.filter, ...action.filter } };
		case ActionTypes.ACTIVITIES_FILTER_SEARCH:
			return {
				...state,
				filter: { ...state.filter, search: action.searchTerm },
			};
		default:
			return state;
	}
};

const general = (state = initialState.general, action) => {
	switch (action.type) {
		case ActionTypes.GENERAL_INITIALIZED:
			return { ...state, firstLaunch: false };
		case ActionTypes.GENERAL_TICKTIME:
			return { ...state, currentDate: action.date };
		case ActionTypes.GENERAL_SETCONSENT:
			return { ...state, trackingConsent: !!action.consent };
		case ActionTypes.GENERAL_SETPASSWORD:
			return {
				...state,
				auth: {
					password: action.password,
					user: action.user,
					userObj: action.userObj,
				},
			};
		default:
			return state;
	}
};

const snackbarNotifications = (
	state = initialState.snackbarNotifications,
	action
) => {
	switch (action.type) {
		case ActionTypes.SNACKBAR_ENQUEUE:
			return [
				...state,
				{
					...action.notification,
				},
			];

		case ActionTypes.SNACKBAR_REMOVE:
			return state.filter(
				(notification) => notification.key !== action.key
			);

		default:
			return state;
	}
};

// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
	const { type, error } = action;

	if (type === ActionTypes.RESET_ERROR_MESSAGE) {
		return null;
	} else if (error) {
		return error;
	}

	return state;
};

export default (history) =>
	combineReducers({
		router: connectRouter(history),
		schedule,
		entities,
		entityloader,
		activityFilter,
		snackbarNotifications,
		notifications,
		floorPlan,
		general,
		updatesRead,
		favoriteActivities,
		errorMessage,
	});
