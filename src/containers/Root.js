import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import MapContainer from "../containers/Map";
import Locations from "../containers/Locations";
import Location from "../containers/Location";
import ServiceWorkerHandler from "../lib/ServiceWorkerHandler";
import { SnackbarProvider } from "notistack";
import ScrollToTop from "../components/ScrollToTop";
import BottomBar from "../components/UI/BottomBar";
import withRoot from "../withRoot";
import { withStyles } from "@material-ui/core";
import Update from "./Update";
import Activities from "./Activities";
import Updates from "./Updates";
import Activity from "./Activity";
import Favorites from "./Favorites";
import { doInitialize, forceUpdate } from "../redux/actions";
import Partners from "./Partners";
import Settings from "./Settings";
import { ConnectedRouter } from "connected-react-router";
import { history } from "../redux/store/configureStore";
import ErrorBoundary from "./ErrorBoundary";
import Notifier from "../components/Notifier";
import {prefixRoute} from "../routing";

const styles = (theme) => ({
	main: {
		display: "flex",
		height: "100%",
		paddingBottom: "56px",
		flexDirection: "column",
	},
});

class Root extends React.Component {
	componentDidMount() {
		const { store } = this.props;
		store.dispatch(doInitialize());
	}

	onNewContent() {
		const { store } = this.props;
		store.dispatch(forceUpdate());
	}

	render() {
		const { store, classes } = this.props;

		return (
			<Provider store={store}>
				<ConnectedRouter history={history}>
					<SnackbarProvider>
						<ServiceWorkerHandler
							onNewContent={() => this.onNewContent()}
						/>
						<ScrollToTop />
						<Notifier />
						<main className={classes.main}>
							<ErrorBoundary>
								<Switch>
									<Route
										exact
										path={prefixRoute(`/locations`)}
										component={Locations}
									/>
									<Route
										exact
										path={prefixRoute(`/location/:name`)}
										component={Location}
									/>
									<Route
										exact
										path={prefixRoute(`/update`)}
										component={Updates}
									/>
									<Route
										path={prefixRoute(`/update/:id`)}
										component={Update}
									/>
									<Route
										exact
										path={prefixRoute(`/activity`)}
										component={Activities}
									/>
									<Route
										path={prefixRoute(`/activity/:id`)}
										component={Activity}
									/>
									<Route
										path={prefixRoute(`/favorites`)}
										component={Favorites}
									/>
									<Route
										path={prefixRoute(`/partners`)}
										component={Partners}
									/>
									<Route
										path={prefixRoute(`/settings`)}
										component={Settings}
									/>
									<Route
										path={prefixRoute(`/map`)}
										component={MapContainer}
									/>
									<Route
										path={prefixRoute(`/`)}
										component={({ location }) => {
											console.log(location);
											return (<Redirect
												to={prefixRoute('/activity')}
											/>)}}
									/>
								</Switch>
							</ErrorBoundary>
						</main>
						<BottomBar />
					</SnackbarProvider>
				</ConnectedRouter>
			</Provider>
		);
	}
}

Root.propTypes = {
	store: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Root));
