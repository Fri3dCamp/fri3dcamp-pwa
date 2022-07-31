import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import Page from "../components/UI/Page";
import { connect } from "react-redux";
import {
	getUnreadUpdateCount,
	loadUpdates,
	markAllAsRead,
} from "../redux/actions";
import SidebarPage from "../components/UI/SidebarPage";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import UpdateCard from "../components/Updates/UpdateCard";
import UpdateSidebar from "../components/Updates/UpdateSidebar";
import { getUpdateLoader } from "../redux/selectors";

class Updates extends Component {
	markReadTimer = 0;

	static propTypes = {
		updatesToDisplay: PropTypes.array.isRequired,
		loadUpdates: PropTypes.func.isRequired,
	};

	componentDidMount() {
		document.title = `Updates - Fri3d Camp`;
		this.markAllUpdatesRead();
	}

	markAllUpdatesRead() {
		const { markAllAsRead, unreadCount } = this.props;

		clearTimeout(this.markReadTimer);

		if (unreadCount > 0) {
			this.markReadTimer = setTimeout(() => {
				markAllAsRead();
			}, 5000);
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.markAllUpdatesRead();
	}

	componentWillUnmount() {
		clearTimeout(this.markReadTimer);
	}

	render() {
		const { updateLoader, updatesToDisplay } = this.props;

		return (
			<Page pageTitle="Updates">
				<SidebarPage sidebar={<UpdateSidebar />}>
					{updateLoader.isFetching && updateLoader.initialFetch ? (
						<LoadingIndicator />
					) : (
						<Grid container spacing={24}>
							{updatesToDisplay.map((update) => (
								<Grid key={update.id} item xs={12}>
									<UpdateCard update={update} />
								</Grid>
							))}
						</Grid>
					)}
				</SidebarPage>
			</Page>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		entities: { updates },
		updatesRead,
	} = state;

	const updateLoader = getUpdateLoader(state);
	let updatesToDisplay = [];

	if (updateLoader && updateLoader.ids) {
		updatesToDisplay = updateLoader.ids.map((id) => ({
			...updates[id],
			isRead: updatesRead.indexOf(id) !== -1,
		}));
	}

	const unreadCount = getUnreadUpdateCount(state);

	return {
		updateLoader,
		updatesToDisplay,
		unreadCount,
	};
};

export default connect(mapStateToProps, { loadUpdates, markAllAsRead })(
	Updates
);
