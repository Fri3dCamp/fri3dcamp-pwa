import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { DetailPane } from "../components/UI/DetailPane";
import { connect } from "react-redux";
import { loadActivities, toggleFavorite } from "../redux/actions";
import PropTypes from "prop-types";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import Page from "../components/UI/Page";
import { withRouter } from "react-router-dom";
import CardBlock from "../components/UI/CardBlock";
import FeatureList from "../components/Activities/Single/FeatureList";
import Sidebar from "../components/Activities/Single/Sidebar";
import LikeButton from "../components/UI/LikeButton";
import {getActivityLoader, getPersonById} from "../redux/selectors";
import ShareOptions from "../components/Activities/Single/ShareOptions";
import defaultImage from "../img/default_image.png";

const styles = (theme) => ({});

class Activity extends React.Component {
	static propTypes = {
		activityId: PropTypes.number.isRequired,
		activity: PropTypes.object,
		loadActivities: PropTypes.func.isRequired,
	};

	componentDidMount() {
		const { activity } = this.props;
		if (activity && activity.title) {
			document.title = `${activity.title} - Fri3d Camp`;
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { activity } = this.props;
		if (activity && activity.title) {
			document.title = `${activity.title} - Fri3d Camp`;
		}
	}

	render() {
		const { activity, classes, needsPreloading } = this.props;

		return (
			<Page backLink smaller={true}>
				{needsPreloading ? (
					<LoadingIndicator />
				) : (
					this.renderActivity({ activity, classes })
				)}
			</Page>
		);
	}

	renderActivity = () => {
		const { activity, toggleFavorite, isFavorite, persons } = this.props;

		if (!activity) {
			return <LoadingIndicator />;
		}

		let imageUrl = undefined;

		if (activity && activity.logo && activity.logo !== "") {
			imageUrl = `https://pretalx.fri3d.be/${activity.logo}`;
		} else {
            imageUrl = defaultImage;
        }

		let cardContent = `<p><em>${activity.excerpt}</em></p><p>${activity.content}</p>`;

		return (
			<Grid container spacing={24} style={{ position: "relative" }}>
				<ShareOptions activity={activity} />
				<Grid item xs={12} md={8}>
					<CardBlock
						media={imageUrl}
						mediaProps={{ style: { paddingTop: "56.25%", backgroundSize: "cover" } }}
						header={{
							title: activity.title,
							subheader: Array.isArray(persons) && persons.length > 0 ? persons.map(person => person.publicName).join(", ") : undefined,
							titleTypographyProps: { variant: "h2" },
						}}
						raw={true}
					>
						<LikeButton
							active={isFavorite}
							onClick={() => toggleFavorite(activity.id)}
						/>
						<DetailPane content={cardContent} />
						<FeatureList activity={activity} />
					</CardBlock>
				</Grid>
				<Grid item xs={12} md={4}>
					<Sidebar activity={activity} />
				</Grid>
			</Grid>
		);
	};
}

const mapStateToProps = (state, ownProps) => {
	const activityId = parseInt(ownProps.match.params.id);

	const {
		entities: { activities },
	} = state;

	const isFavorite =
		state.favoriteActivities &&
		state.favoriteActivities.includes(activityId);
	const activityLoader = getActivityLoader(state);
	const activity = activities[activityId];
	const needsPreloading = !activity && activityLoader.isFetching;
	const persons = activity && activity.persons.map(person => getPersonById(state)(person)) || [];

	return {
		activity,
		needsPreloading,
		isFavorite,
		persons,
	};
};

export default withRouter(
	connect(mapStateToProps, { loadActivities, toggleFavorite })(
		withStyles(styles)(Activity)
	)
);
