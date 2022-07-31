import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import api from "../middleware/api";
import rootReducer from "../reducers";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import { googleAnalytics } from "../middleware/analytics";
import { load, save } from "redux-localstorage-simple";

export const history = createBrowserHistory(
	{
		basename: process.env.PUBLIC_PATH,
	}
);

console.log('History', history);

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
		load({ states, disableWarnings: true }),
		composeWithDevTools(
			applyMiddleware(
				routerMiddleware(history),
				googleAnalytics,
				thunk,
				api,
				createLogger(),
				save({ states })
			)
		)
	);
};

export default configureStore;
