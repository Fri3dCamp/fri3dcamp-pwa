import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import api from "../middleware/api";
import paginator from "../middleware/paginator";
import rootReducer from "../reducers";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import { load, save } from "redux-localstorage-simple";

export const history = createBrowserHistory();

const states = [
	"entities",
	"notifications",
	"general",
	"updatesRead",
	"favoriteActivities",
];
const configureStore = (preloadedState) => {
	return createStore(
		rootReducer(history),
		// load({ states, disableWarnings: true }),
		composeWithDevTools(
			applyMiddleware(
				routerMiddleware(history),
				thunk,
				api,
				paginator,
				createLogger(),
				// save({ states })
			)
		)
	);
};

export default configureStore;
