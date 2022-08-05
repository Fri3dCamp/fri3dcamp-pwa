import { normalize } from "normalizr";
import { camelizeKeys } from "humps";
import * as Schema from "./schema";

const API_ROOT = process.env.REACT_APP_API_LOCATION;

const getNextPageUrl = (response) => {
	const link = response.headers.get("link");
	if (!link) {
		return null;
	}

	const nextLink = link.split(",").find((s) => s.indexOf('rel="next"') > -1);
	if (!nextLink) {
		return null;
	}

	return nextLink.trim().split(";")[0].slice(1, -1);
};

const callApi = async (endpoint, schema) => {
	const fullUrl =
		endpoint.indexOf('http') !== 0
			? API_ROOT + "/" + endpoint
			: endpoint;

	let response = await fetch(fullUrl);
	let jsonResponse = await response.json();

	if (!response.ok) {
		throw new Error(jsonResponse);
	}

	const camelizedJson = camelizeKeys(jsonResponse);
	const nextPageUrl = getNextPageUrl(response);

	return { ...normalize(camelizedJson, schema), nextPageUrl: nextPageUrl };
};

export const Schemas = {
	ACTIVITY: Schema.activity,
	ACTIVITY_ARRAY: [Schema.activity],
	SCHEDULE: Schema.schedule,
	UPDATE: Schema.update,
	UPDATE_ARRAY: [Schema.update],
};

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = "Call API";

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default (store) => (next) => (action) => {
	const callAPI = action[CALL_API];
	if (typeof callAPI === "undefined") {
		return next(action);
	}

	let { endpoint } = callAPI;
	const { schema, types } = callAPI;

	if (typeof endpoint === "function") {
		endpoint = endpoint(store.getState());
	}

	if (typeof endpoint !== "string") {
		throw new Error("Specify a string endpoint URL.");
	}

	if (!Array.isArray(types) || types.length !== 3) {
		throw new Error("Expected an array of three action types.");
	}

	if (!types.every((type) => typeof type === "string")) {
		throw new Error("Expected action types to be strings.");
	}

	const actionWith = (data) => {
		const finalAction = Object.assign({}, action, data);
		delete finalAction[CALL_API];
		return finalAction;
	};

	const [requestType, successType, failureType] = types;
	next(actionWith({ type: requestType }));

	return callApi(endpoint, schema).then(
		(response) =>
			next(
				actionWith({
					response,
					type: successType,
				})
			),
		(error) =>
			next(
				actionWith({
					type: failureType,
					error: error.message || "Something bad happened",
				})
			)
	);
};
