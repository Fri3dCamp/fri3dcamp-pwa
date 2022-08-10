import union from "lodash/union";
import * as ActionTypes from "../actions";

const initialState = {
	isFetching: false,
	initialFetch: true,
	nextPageUrl: undefined,
	pageCount: 0,
	lastFetched: null,
	ids: [],
};

const loadPretalxEntity = ({ types }) => {
	if (!Array.isArray(types) || types.length !== 3) {
		throw new Error("Expected types to be an array of three elements.");
	}
	if (!types.every((t) => typeof t === "string")) {
		throw new Error("Expected types to be strings.");
	}

	const [requestType, successType, failureType] = types;

	const updateEntity = (
		state = {
			isFetching: false,
			initialFetch: true,
			nextPageUrl: undefined,
			pageCount: 0,
			lastFetched: null,
			ids: [],
		},
		action
	) => {
		switch (action.type) {
			case ActionTypes.GENERAL_FORCE_REFRESH:
				return {
					...initialState,
					...state,
					lastFetched: null,
				};
			case requestType:
				return {
					...initialState,
					...state,
					isFetching: true,
				};
			case successType:
				return {
					...state,
					isFetching: false,
					initialFetch: false,
					ids: union(state.ids, action.response.results),
					nextPageUrl: action.response.nextPageUrl || undefined,
					lastFetched: new Date(),
					pageCount: action.response.nextPageUrl
						? state.pageCount + 1
						: 0,
				};
			case failureType:
				return {
					...state,
					isFetching: false,
				};
			default:
				return state;
		}
	};

	return (state = {}, action) => {
		switch (action.type) {
			case requestType:
			case successType:
			case failureType:
				return {
					...state,
					...updateEntity(state, action),
				};
			default:
				return state;
		}
	};
};

export default loadPretalxEntity;
