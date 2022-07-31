import { Avatar, Chip, withStyles } from "@material-ui/core";
import FaceIcon from "@material-ui/icons/Face";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import Brightness2Icon from "@material-ui/icons/Brightness2";
import React from "react";

const styles = (theme) => ({
	chip: {
		margin: theme.spacing.unit,
		textTransform: "uppercase",
	},
});

const FeatureList = ({ activity, classes }) => (
	<div className="details">
		{activity.continuous && (
			<Chip
				avatar={
					<Avatar>
						<AutorenewIcon />
					</Avatar>
				}
				label="Doorlopend"
				className={classes.chip}
				color="primary"
			/>
		)}
		{activity.childFriendly && (
			<Chip
				avatar={
					<Avatar>
						<FaceIcon />
					</Avatar>
				}
				label="Kindvriendelijk"
				className={classes.chip}
				color="primary"
			/>
		)}
		{activity.night && (
			<Chip
				avatar={
					<Avatar>
						<Brightness2Icon />
					</Avatar>
				}
				label="Avond"
				className={classes.chip}
				color="primary"
			/>
		)}
	</div>
);

export default withStyles(styles)(FeatureList);
