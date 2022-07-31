import { withStyles } from "@material-ui/core";
import React from "react";
import Header from "../UI/Header";
import ActivityList from "./ActivityList";

const styles = (theme) => ({
	dayContainer: {
		width: "100%",
		marginTop: 0,
		marginBottom: theme.spacing.unit * 8,
	},
});

const ActivityView = ({ activities = [], sizes = {}, title, classes }) => {
	sizes = { xs: 12, sm: 6, md: 4, lg: 3, ...sizes };
	return (
		<div className={classes.dayContainer}>
			<Header typoProps={{ variant: "h3" }} header={title} />
			<ActivityList activities={activities} sizes={sizes} />
		</div>
	);
};

export default withStyles(styles)(ActivityView);
