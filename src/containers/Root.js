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
		const publicUrl = process.env.PUBLIC_URL;
		const publicPath = (new URL(publicUrl)).pathname;

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
										path={`${publicPath}/locations`}
										component={Locations}
									/>
									<Route
										exact
										path={`${publicPath}/location/:name`}
										component={Location}
									/>
									<Route
										exact
										path={`${publicPath}/update`}
										component={Updates}
									/>
									<Route
										path={`${publicPath}/update/:id`}
										component={Update}
									/>
									<Route
										exact
										path={`${publicPath}/activity`}
										component={Activities}
									/>
									<Route
										path={`${publicPath}/activity/:id`}
										component={Activity}
									/>
									<Route
										path={`${publicPath}/favorites`}
										component={Favorites}
									/>
									<Route
										path={`${publicPath}/partners`}
										component={Partners}
									/>
									<Route
										path={`${publicPath}/settings`}
										component={Settings}
									/>
									<Route
										path={`${publicPath}/map`}
										component={MapContainer}
									/>
									<Route
										path={`${publicPath}/`}
										component={({ location }) => (
											<Redirect
												to={{
													...location,
													pathname: publicPath + "/activity",
												}}
											/>
										)}
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
