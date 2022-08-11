import {
	loadQuestions, loadRooms,
	loadSpeakers, loadTags,
	loadTalks, loadUpdates,
	QUESTIONS_SUCCESS, ROOMS_SUCCESS,
	SPEAKERS_SUCCESS,
	TAGS_SUCCESS,
	TALKS_SUCCESS, UPDATES_SUCCESS
} from "../actions";

const autoPaginatingEntities = [
	{
		action: SPEAKERS_SUCCESS,
		loadNext: () => loadSpeakers(true),
	},
	{
		action: TALKS_SUCCESS,
		loadNext: () => loadTalks(true),
	},
	{
		action: ROOMS_SUCCESS,
		loadNext: () => loadRooms(true),
	},
	{
		action: QUESTIONS_SUCCESS,
		loadNext: () => loadQuestions(true),
	},
	{
		action: TAGS_SUCCESS,
		loadNext: () => loadTags(true),
	},
	{
		action: UPDATES_SUCCESS,
		loadNext: () => loadUpdates(true),
	},
	{
		action: TAGS_SUCCESS,
		loadNext: () => loadTags(true),
	}
];

// A Redux middleware that listens for success actions and automatically paginates them.
export default (store) => (next) => (action) => {
	next(action);
	const paginatingEntity = autoPaginatingEntities.find(({action: actionType}) => action.type === actionType);

	if (!paginatingEntity || !action.response || !action.response.nextPageUrl) {
		return;
	}

	store.dispatch(paginatingEntity.loadNext());
};
