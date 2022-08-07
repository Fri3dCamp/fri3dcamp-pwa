import React from "react";
import {Avatar, CardActions, Grid, Typography} from "@material-ui/core";
import moment from "moment";
import Details from "./Details";
import { AddToCalendar } from "../../UI/AddToCalendar";
import CardBlock from "../../UI/CardBlock";
import {connect} from "react-redux";
import {getDayById, getLocationByName, getPersonById} from "../../../redux/selectors";
import UpcomingActivities from "../UpcomingActivities";
import {prefixRoute} from "../../../routing";
import PersonIcon from "@material-ui/icons/Person";

const getEvent = (activity) => {
	const startDatetime = moment(activity.period.start).subtract(2, "hours");
	const endDatetime = moment(activity.period.end).subtract(2, "hours");
	const duration = moment
		.duration(endDatetime.diff(startDatetime))
		.asHours()
		.toString();

	return {
		description: activity.excerpt,
		duration,
		endDatetime: endDatetime.format("YYYYMMDDTHHmmss") + "Z",
		location: "Fort 4, Mortsel",
		startDatetime: startDatetime.format("YYYYMMDDTHHmmss") + "Z",
		title: activity.title,
	};
};

const Sidebar = ({activity, location, day, persons}) => {
	if (activity === null) {
		return null;
	}

	const event = getEvent(activity);

	return (
		<Grid container spacing={24}>
			<Grid item xs={12} sm={6} md={12}>
				<CardBlock>
					<Details
						activity={activity}
						location={location}
						day={day}
					/>
					{event && (
						<CardActions disableActionSpacing>
							<AddToCalendar event={event}/>
						</CardActions>
					)}
				</CardBlock>
			</Grid>
			{persons.length > 0 ? persons.map(person => (<Grid key={person.code} item xs={12} sm={6} md={12}>
				<CardBlock
					header={{
					title: person.publicName,
					titleTypographyProps: {
						variant: "h5",
					},
					avatar: <Avatar>
						<PersonIcon />
					</Avatar>,
				}}>
					<Typography
						variant="body1"
					>{person.biography || ''}</Typography>
				</CardBlock>
			</Grid>)) : null}
			{activity.location !== "terrein" && (
				<Grid item xs={12} sm={6} md={12}>
					<CardBlock
						headerLink={prefixRoute(`/location/${activity.location}`)}
						header={{
							title: location.name,
							subheader: location.subTitle,
							avatar: <Avatar src={location.icon}/>,
						}}
					>
						<UpcomingActivities location={activity.location} />
					</CardBlock>
				</Grid>
			)}
		</Grid>
	);
};

const mapStateToProps = (state, { activity }) => {
	const location = getLocationByName(state)(activity.location);
	const persons = activity && activity.persons.map(person => getPersonById(state)(person)) || [];

	return {
		day: getDayById(state)(activity.day),
		location,
		persons,
	};
};
export default connect(mapStateToProps)(Sidebar);
