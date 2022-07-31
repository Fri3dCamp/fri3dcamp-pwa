import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";

const styles = (theme) => ({
	sidebarGrid: {},
});

const SidebarPage = ({ children, sidebar, classes }) => (
	<Grid className={classes.sidebarGrid} container spacing={24}>
		<Grid item xs={12} md={8} lg={9}>
			{children}
		</Grid>
		<Grid item xs={12} md={4} lg={3}>
			{sidebar}
		</Grid>
	</Grid>
);

SidebarPage.propTypes = {
	pageTitle: PropTypes.string,
	children: PropTypes.element.isRequired,
	sidebar: PropTypes.element.isRequired,
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SidebarPage);
