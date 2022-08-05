import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import api from "../middleware/api";
import rootReducer from "../reducers";
import { load, save } from "redux-localstorage-simple";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";

const states = [
	"entities",
	"notifications",
	"general",
	"updatesRead",
	"favoriteActivities",
];

export const history = createBrowserHistory(
	{
		basename: process.env.PUBLIC_PATH,
	}
);

const configureStore = (preloadedState) =>
	createStore(
		rootReducer(history),
		load({ states, disableWarnings: true }),
		applyMiddleware(
			routerMiddleware(history),
			thunk,
			api,
			save({ states })
		)
	);

export default configureStore;
