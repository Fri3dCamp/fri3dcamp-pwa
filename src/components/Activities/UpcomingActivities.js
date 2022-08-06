import { getUpcomingActivitiesByLocation } from "../../redux/selectors";
import { connect } from "react-redux";
import Period from "./Single/Period";
import React from "react";
import Header from "../UI/Header";
import DetailList from "../UI/DetailList";
import {prefixRoute} from "../../routing";

const UpcomingActivities = ({ upcomingListItems = [], title = "Upcoming" }) => {
	if (!upcomingListItems.length) {
		return null;
	}

	return (
		<>
			{title && title.length ? (
				<Header header={title} variant="h4" />
			) : (
				""
			)}
			<DetailList>{upcomingListItems}</DetailList>
		</>
	);
};

const mapStateToProps = (state, { location, amount = 3 }) => {
	const upcomingActivitiesByLocation = getUpcomingActivitiesByLocation(state);
	let upcomingActivities =
		upcomingActivitiesByLocation && upcomingActivitiesByLocation[location];

	const upcomingListItems = [];

	if (upcomingActivities) {
		if (upcomingActivities.length > amount) {
			upcomingActivities = upcomingActivities.slice(0, amount);
		}

		let upcomingActivity;

		for (upcomingActivity of upcomingActivities) {
			upcomingListItems.push({
				key: upcomingActivity.id,
				link: prefixRoute(`/activity/${upcomingActivity.id}`),
				truncate: true,
				text: {
					primary: upcomingActivity.title,
					secondary: (
						<Period showDay={true} activity={upcomingActivity} />
					),
					primaryTypographyProps: { noWrap: true },
				},
				avatar:
					upcomingActivity.images["thumbnail"] &&
					upcomingActivity.images["thumbnail"].sourceUrl,
			});
			upcomingListItems.push({
				key: `divider-${upcomingActivity.id}`,
				isDivider: true,
			});
		}

		if (upcomingListItems.length) {
			upcomingListItems.pop();
		}
	}

	return {
		upcomingListItems,
	};
};
export default connect(mapStateToProps)(UpcomingActivities);
