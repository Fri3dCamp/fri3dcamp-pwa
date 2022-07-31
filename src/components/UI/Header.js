import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";

const styles = (theme) => ({
	header: {
		marginBottom: theme.spacing.unit * 2,
	},
});

const Header = ({ header, variant, classes, typoProps, ...props }) => (
	<header className={classes.header} {...props}>
		<Typography variant={variant} {...typoProps}>
			{header}
		</Typography>
	</header>
);

Header.defaultProps = {
	header: "",
	variant: "h5",
	typoProps: {},
};

Header.propTypes = {
	header: PropTypes.string,
	variant: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6"]),
	typoProps: PropTypes.object,
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
