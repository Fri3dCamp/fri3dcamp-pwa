import React from "react";
import { CircularProgress, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";

const styles = () => ({
	loadingIndicator: {
		display: "flex",
		width: "100%",
		alignContent: "center",
		justifyContent: "center",
		padding: "100px 0",
	},
});

const LoadingIndicator = ({ classes }) => (
	<div className={classes.loadingIndicator}>
		<CircularProgress />
	</div>
);

LoadingIndicator.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoadingIndicator);
