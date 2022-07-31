import React from "react";
import { CardContent, Grid, withStyles } from "@material-ui/core";
import ActivityCard from "./ActivityCard";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Card from "@material-ui/core/Card";
import CardBlock from "../UI/CardBlock";

const styles = (theme) => ({
	activityList: {
		marginTop: theme.spacing.unit * 2,
	},
	card: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2,
	},
});

const ActivityList = ({ activities, sizes, classes }) => {
	if (!activities.length) {
		return (
			<div className={classes.activityList}>
				<EmptyContainer />
			</div>
		);
	}

	return (
		<div className={classes.activityList}>
			<Grid container spacing={24}>
				{activities.map((activity) => (
					<Grid key={activity.id} item {...sizes}>
						<LazyLoadComponent
							id={activity.id}
							delayTime={1000}
							treshold={0}
							placeholder={<LazyCard />}
						>
							<ActivityCard activity={activity} />
						</LazyLoadComponent>
					</Grid>
				))}
			</Grid>
		</div>
	);
};

const LazyCard = () => (
	<Card style={{ height: "200px" }}>
		<CardContent />
	</Card>
);

const EmptyContainer = () => (
	<CardBlock
		header={{
			title: "Niets gevonden",
			titleTypographyProps: { variant: "h3" },
		}}
	>
		Er werden geen activiteiten gevonden voor deze zoekopdracht.
	</CardBlock>
);

export default withStyles(styles)(ActivityList);
