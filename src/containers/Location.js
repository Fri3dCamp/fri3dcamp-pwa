import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core";
import { connect } from "react-redux";
import Page from "../components/UI/Page";
import ActivityView from "../components/Activities/ActivityView";
import CardBlock from "../components/UI/CardBlock";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import { getActivitiesByLocation, getActivityLoader, getLocations } from "../redux/selectors";
import SidebarPage from "../components/UI/SidebarPage";
import UpcomingActivities from "../components/Activities/UpcomingActivities";
import {prefixRoute} from "../routing";

const styles = (theme) => ({
	root: {
		margin: "30px auto 60px",
		maxWidth: 1140,
		width: "100%",
		padding: theme.spacing.unit * 2,
	},
});

class Location extends React.Component {
	componentDidUpdate(prevProps, prevState, snapshot) {
		const { myLocation } = this.props;

		if (myLocation) {
			document.title = `${myLocation.label || myLocation.name} - Fri3d Camp`;
		}
	}

	render() {
		const { myLocation, locationActivities, activityLoader } = this.props;

		if (!myLocation) {
			return null;
		}

		return (
			<Page backLink={true} pageTitle={`Locatie: ${myLocation.label || myLocation.name}`}>
				<SidebarPage
					sidebar={<LocationSidebar location={myLocation} />}
				>
					{activityLoader.isFetching &&
					activityLoader.initialFetch ? (
						<LoadingIndicator />
					) : (
						<ActivityView
							activities={locationActivities}
							sizes={{ md: 6, lg: 4 }}
						/>
					)}
				</SidebarPage>
			</Page>
		);
	}
}

const LocationSidebar = ({ location }) => (
	<CardBlock
		headerLink={prefixRoute(`/location/${location.name.toLowerCase()}`)}
		header={{
			title: location.label || location.name,
			subheader: location.feature || undefined,
			avatar: <Avatar src={location.icon} />,
		}}
	>
		<UpcomingActivities location={location.name.toLowerCase()} />
	</CardBlock>
);

const mapStateToProps = (state, ownProps) => {
	const locationName = ownProps.match.params.name;

	const locations = getLocations(state);
	const activityLoader = getActivityLoader(state);
	const myLocation = locations[locationName];
	const locationActivities = getActivitiesByLocation(state)[locationName];

	return {
		myLocation,
		locationActivities,
		activityLoader,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(Location));
