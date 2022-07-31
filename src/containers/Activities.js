import React, { Component } from "react";
import PropTypes from "prop-types";
import Page from "../components/UI/Page";
import { changeActivitySearchTerm } from "../redux/actions";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import SearchBar from "../components/Activities/SearchBar";
import ActivityView from "../components/Activities/ActivityView";
import { connect } from "react-redux";
import ActivityFilter from "../components/Activities/Filters/Filter";
import {
	getActivitiesByDays,
	getActivityLoader,
	getPastActivities,
} from "../redux/selectors";
import UpdateNag from "../components/Updates/UpdateNag";
import CardBlock from "../components/UI/CardBlock";

class Activities extends Component {
	static propTypes = {
		activityLoader: PropTypes.object,
		activitiesByDays: PropTypes.array.isRequired,
	};

	componentDidMount() {
		this.props.changeActivitySearchTerm("");
		document.title = `Programma - Fri3d Camp`;
	}

	render() {
		const { activityLoader, activitiesByDays, pastActivities } = this.props;

		return (
			<Page
				topBarProps={{
					toolbarRight: <SearchBar />,
				}}
			>
				{activityLoader.isFetching && activityLoader.initialFetch ? (
					<LoadingIndicator />
				) : (
					<>
						<ActivityFilter />
						{/*<UpdateNag style={{marginBottom: '32px'}}/>*/}
						<CardBlock
							header={{
								title: "Fri3d Camp zit erop...",
								subheader: "And it was awesome.",
							}}
						>
							Bedankt om deel uit te maken van een fantastische
							tweede editie van Fri3d Camp. You rock!
						</CardBlock>
						<div style={{ marginBottom: "32px" }} />
						{activitiesByDays.map((activitiesByDay) => {
							if (activitiesByDay.activities.length <= 0) {
								return null;
							}

							return (
								<ActivityView
									key={activitiesByDay.key}
									title={activitiesByDay.label}
									activities={activitiesByDay.activities}
								/>
							);
						})}
						{pastActivities && pastActivities.length ? (
							<ActivityView
								title="Afgelopen activiteiten"
								activities={pastActivities}
							/>
						) : (
							""
						)}
					</>
				)}
			</Page>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		entities: { activities },
	} = state;
	const activityLoader = getActivityLoader(state);

	const activitiesByDays = getActivitiesByDays(state);
	const pastActivities = getPastActivities(state).map(
		(activityId) => activities[activityId]
	);

	return {
		activityLoader,
		activitiesByDays,
		pastActivities,
	};
};

export default connect(mapStateToProps, { changeActivitySearchTerm })(
	Activities
);
