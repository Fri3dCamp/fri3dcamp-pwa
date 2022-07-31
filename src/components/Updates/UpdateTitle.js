import { withStyles } from "@material-ui/core";
import React from "react";

const styles = (theme) => ({
	unReadDot: {
		background: theme.palette.secondary.light,
		boxShadow: `0 0 4px -1px ${theme.palette.secondary.dark}`,
		width: "10px",
		height: "10px",
		borderRadius: "50%",
		display: "inline-block",
		transform: "translateY(-3px)",
		marginRight: "5px",
	},
});

const UpdateTitle = ({ update, classes }) => (
	<>
		{!update.isRead && <span className={classes.unReadDot} />}
		{update.title}
	</>
);

export default withStyles(styles)(UpdateTitle);
