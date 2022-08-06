import { CALL_API, Schemas } from "../middleware/api";
import { isEqual } from "lodash";
import {
	getServerKey,
	pushSubscription,
	requestPermission,
} from "../../lib/notifications";
import { urlBase64ToUint8Array } from "../../util/binary";

// GENERAL
export const GENERAL_INITIALIZED = "GENERAL_INITIALIZED";
export const GENERAL_TICKTIME = "GENERAL_TICKTIME";
export const GENERAL_SETCONSENT = "GENERAL_SETCONSENT";
export const GENERAL_EXCEPTION = "GENERAL_EXCEPTION";
export const GENERAL_SETPASSWORD = "GENERAL_SETPASSWORD";
export const GENERAL_NEWPASSWORD = "GENERAL_NEWPASSWORD";
export const GENERAL_FORCE_REFRESH = "GENERAL_FORCE_REFRESH";
const initialized = () => ({
	type: GENERAL_INITIALIZED,
});

const backgroundSync = () => (dispatch) => {
	setTimeout(() => dispatch(backgroundSync()), 15 * 60 * 1000);
	//setTimeout(() => dispatch(backgroundSync()), 5*1000);

	dispatch(loadSchedule());
	// dispatch(loadActivities());
	dispatch(loadUpdates());
	dispatch(ensureSubscription());
};

const setConsent = (consent) => ({
	type: GENERAL_SETCONSENT,
	consent,
});

export const changeConsent = (consent) => (dispatch, getState) => {
	dispatch(setConsent(consent));
};

export const setApplicationDetails = (user, password, userObj) => ({
	type: GENERAL_SETPASSWORD,
	password,
	user,
	userObj,
});

const newApplicationPassword = (user, password) => ({
	type: GENERAL_NEWPASSWORD,
	password,
	user,
});

export const logUserIn = (user, password) => (dispatch, getState) => {
	dispatch(newApplicationPassword(user, password));
};

const setCurrentDate = (date) => ({
	type: GENERAL_TICKTIME,
	date,
});

const forceRefresh = () => ({
	type: GENERAL_FORCE_REFRESH,
});

const tickTimer = () => (dispatch) => {
	setTimeout(() => dispatch(tickTimer()), 5 * 60 * 1000);

	let currentDate = new Date();
	const numberOfDaysToAdd = 0;
	currentDate.setDate(currentDate.getDate() + numberOfDaysToAdd);

	dispatch(setCurrentDate(currentDate));
};

const exception = (error, info) => ({
	type: GENERAL_EXCEPTION,
	error,
	info,
});

export const handleException = (error, info) => (dispatch) => {
	return dispatch(exception(error, info));
};

export const doInitialize = () => (dispatch) => {
	dispatch(backgroundSync());
	dispatch(tickTimer());
	dispatch(initialized());
};

export const forceUpdate = () => (dispatch) => {
	dispatch(forceRefresh());
	dispatch(loadSchedule());
	// dispatch(loadActivities());
	dispatch(loadUpdates());
};

// ACTIVITIES
export const ACTIVITIES_REQUEST = "ACTIVITIES_REQUEST";
export const ACTIVITIES_SUCCESS = "ACTIVITIES_SUCCESS";
export const ACTIVITIES_FAILURE = "ACTIVITIES_FAILURE";

const fetchActivities = (nextPageUrl) => ({
	[CALL_API]: {
		types: [ACTIVITIES_REQUEST, ACTIVITIES_SUCCESS, ACTIVITIES_FAILURE],
		endpoint: nextPageUrl,
		schema: Schemas.ACTIVITY_ARRAY,
	},
});

export const loadActivities = (nextPage) => (dispatch, getState) => {
	const defaultEndpoint = "wp/v2/activity/?categories=18&per_page=100&_embed";

	let {
		nextPageUrl = defaultEndpoint,
		pageCount = 0,
		lastFetched = null,
		isFetching = false,
	} = getState().entityloader.activities || {};

	if (pageCount > 0 && !nextPage) {
		return null;
	}

	if (isFetching) {
		return null;
	}

	nextPageUrl = nextPageUrl || defaultEndpoint;

	if (lastFetched) {
		const timePassed = new Date() - lastFetched;

		if (timePassed < 10000) {
			return null;
		}
	}

	return dispatch(fetchActivities(nextPageUrl));
};

// Filters
export const ACTIVITIES_FILTER = "ACTIVITIES_FILTER";
export const ACTIVITIES_FILTER_SEARCH = "ACTIVITIES_FILTER_SEARCH";

const setActivityFilter = (filter) => ({
	filter,
	type: ACTIVITIES_FILTER,
});

export const changeActivityFilter = (filter) => (dispatch, getState) => {
	if (isEqual(filter, getState().activityFilter.filter)) {
		return null;
	}

	return dispatch(setActivityFilter(filter));
};

const setActivitySearchTerm = (searchTerm) => ({
	searchTerm,
	type: ACTIVITIES_FILTER_SEARCH,
});

export const changeActivitySearchTerm =
	(searchTerm = "") =>
	(dispatch, getState) => {
		searchTerm = searchTerm.toLowerCase().trim();

		if (isEqual(searchTerm, getState().activityFilter.searchTerm)) {
			return null;
		}

		return dispatch(setActivitySearchTerm(searchTerm));
	};

export const ACTIVITY_FAVORITE = "ACTIVITY_FAVORITE";

const setActivityFavorite = (activity, isLike) => ({
	type: ACTIVITY_FAVORITE,
	activity,
	isLike,
});

export const toggleFavorite = (activityId) => (dispatch, getState) => {
	const {
		entities: { activities },
		favoriteActivities,
	} = getState();

	if (!activities[activityId]) {
		return null;
	}

	const activity = activities[activityId];
	const isLike = favoriteActivities.indexOf(activityId) === -1;

	return dispatch(setActivityFavorite(activity, isLike));
};

// SCHEDULE
export const SCHEDULE_REQUEST = "SCHEDULE_REQUEST";
export const SCHEDULE_SUCCESS = "SCHEDULE_SUCCESS";
export const SCHEDULE_FAILURE = "SCHEDULE_FAILURE";

const fetchSchedule = (endpoint, force) => ({
	[CALL_API]: {
		types: [SCHEDULE_REQUEST, SCHEDULE_SUCCESS, SCHEDULE_FAILURE],
		endpoint: endpoint,
		force: !!force,
		schema: Schemas.SCHEDULE,
	},
});

export const loadSchedule = (endpoint, force) => (dispatch) => {
	const defaultEndpoint = "https://pretalx.fri3d.be/fri3dcamp2022/schedule/export/schedule.json";

	return dispatch(fetchSchedule(endpoint || defaultEndpoint, !!force));
};

// UPDATES
export const UPDATES_REQUEST = "UPDATES_REQUEST";
export const UPDATES_SUCCESS = "UPDATES_SUCCESS";
export const UPDATES_FAILURE = "UPDATES_FAILURE";

const fetchUpdates = (nextPageUrl) => ({
	[CALL_API]: {
		types: [UPDATES_REQUEST, UPDATES_SUCCESS, UPDATES_FAILURE],
		endpoint: nextPageUrl,
		schema: Schemas.UPDATE_ARRAY,
	},
});

export const loadUpdates = (nextPage) => (dispatch, getState) => {
	const defaultEndpoint = "wp/v2/update/?per_page=100&_embed";

	let {
		nextPageUrl = defaultEndpoint,
		pageCount = 0,
		lastFetched = null,
		isFetching = false,
	} = getState().entityloader.updates || {};

	if (pageCount > 0 && !nextPage) {
		return null;
	}

	if (isFetching) {
		return null;
	}

	nextPageUrl = nextPageUrl || defaultEndpoint;

	if (lastFetched) {
		const timePassed = new Date() - lastFetched;

		if (timePassed < 10000) {
			return null;
		}
	}

	return dispatch(fetchUpdates(nextPageUrl));
};

export const UPDATE_READ = "UPDATE_READ";
export const UPDATE_READ_ALL = "UPDATE_READ_ALL";
export const UPDATE_SEND = "UPDATE_SEND";

const setUpdateRead = (updateId) => ({
	type: UPDATE_READ,
	updateId: updateId,
});

const setAllUpdatesRead = (updateIds) => ({
	type: UPDATE_READ_ALL,
	updateIds,
});

const sendUpdate = (auth, update) => ({
	type: UPDATE_SEND,
	update,
	auth,
});

export const queueUpdate = (update) => (dispatch, getState) => {
	const {
		general: { auth },
	} = getState();

	return dispatch(sendUpdate(auth, update));
};

export const markAsRead = (updateId) => (dispatch, getState) => {
	const { updates } = getState().entities;

	if (!updates[updateId]) {
		return null;
	}

	return dispatch(setUpdateRead(updateId));
};

export const markAllAsRead = () => (dispatch, getState) => {
	const { updates } = getState().entities;

	if (!updates) {
		return null;
	}

	const keys = Object.keys(updates);
	return dispatch(setAllUpdatesRead(keys.map((key) => parseInt(key))));
};

export const getUnreadUpdateCount = (state) => {
	const {
		entityloader: { updates },
		updatesRead,
	} = state;

	const updatesLoader = updates || { ids: [] };

	if (updatesLoader.isFetching && updatesLoader.initialFetch) {
		return 0;
	}

	if (!updatesLoader.ids) {
		return 0;
	}

	return (
		!updatesLoader.isFetching &&
		updatesLoader.ids.filter(
			(updateId) => updatesRead.indexOf(updateId) === -1
		).length
	);
};

// NOTIFICATIONS UPDATE_READ_STATUS_CHANGE
export const NOTIFICATIONS_REPLY = "NOTIFICATIONS_REPLY";
export const NOTIFICATIONS_RESPONSE = "NOTIFICATIONS_RESPONSE";
export const NOTIFICATIONS_PUSH_SUBSCRIPTION =
	"NOTIFICATIONS_PUSH_SUBSCRIPTION";
export const NOTIFICATIONS_PUSH_SUBSCRIBE_FAILED =
	"NOTIFICATIONS_PUSH_SUBSCRIBE_FAILED";

const setNotificationsReply = (reply) => ({
	type: NOTIFICATIONS_REPLY,
	reply,
});

const responseToNotificationRequest = (response) => ({
	type: NOTIFICATIONS_RESPONSE,
	response,
});

export const replyToNotifications =
	(reply = true) =>
	(dispatch, getState) => {
		const notificationsReply = !!reply;
		dispatch(setNotificationsReply(notificationsReply));

		if (notificationsReply === true) {
			requestPermission().then((hasPermissions) => {
				if (hasPermissions) {
					dispatch(ensureSubscription());
				}
				dispatch(responseToNotificationRequest(hasPermissions));
			});
		}
	};

const setSubscription = (subscription) => ({
	type: NOTIFICATIONS_PUSH_SUBSCRIPTION,
	subscription: subscription,
});

export const ensureSubscription = () => async (dispatch, getState) => {
	const {
		notifications: { reply },
	} = getState();

	if (reply === false || Notification.permission !== "granted") {
		return null;
	}

	try {
		const serviceWorkerRegistration = await navigator.serviceWorker.ready;
		let subscription =
			await serviceWorkerRegistration.pushManager.getSubscription();

		if (subscription) {
			return dispatch(setSubscription(subscription));
		}

		const serverKey = await getServerKey();

		// Subscribe.
		subscription = await serviceWorkerRegistration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(serverKey),
		});

		if (subscription) {
			dispatch(setSubscription(subscription));
			dispatch(pushSubscriptionToServer(subscription));
		}
	} catch (error) {
		console.error(error);
		return dispatch({
			type: NOTIFICATIONS_PUSH_SUBSCRIBE_FAILED,
			error: error,
		});
	}
};

const pushSubscriptionToServer =
	(subscription) => async (dispatch, getState) => {
		return await pushSubscription(subscription);
	};

export const RESET_ERROR_MESSAGE = "RESET_ERROR_MESSAGE";

// Resets the currently visible error message.
export const resetErrorMessage = () => ({
	type: RESET_ERROR_MESSAGE,
});

// Snackbar
export const SNACKBAR_ENQUEUE = "SNACKBAR_ENQUEUE";
export const SNACKBAR_REMOVE = "SNACKBAR_REMOVE";

export const enqueueSnackbar = (notification) => ({
	type: SNACKBAR_ENQUEUE,
	notification: {
		key: new Date().getTime() + Math.random(),
		...notification,
	},
});

export const removeSnackbar = (key) => ({
	type: SNACKBAR_REMOVE,
	key,
});

// Floorplan
export const FLOORPLAN_FILTER = "FLOORPLAN_FILTER";

const setFloorPlanFilter = (filters) => ({
	filters,
	type: FLOORPLAN_FILTER,
});

export const changeFloorPlanFilter = (filters) => (dispatch, getState) => {
	if (isEqual(filters, getState().floorPlan.filters)) {
		return null;
	}

	return dispatch(setFloorPlanFilter(filters));
};
