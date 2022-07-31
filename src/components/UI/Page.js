import React from "react";
import Header from "./Header";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import TopBar from "./TopBar";

const styles = (theme) => ({
	root: {},
	pageContainer: {
		margin: `0 auto ${theme.spacing.unit * 8}px`,
		width: "100%",
		maxWidth: 1600,
		padding: `${theme.spacing.unit * 6}px ${theme.spacing.unit * 2}px`,
	},
});

const Page = ({
	backLink = false,
	topBarProps,
	pageTitle,
	children,
	classes,
	smaller,
}) => (
	<div className={classes.root}>
		<TopBar backLink={backLink} {...topBarProps} />
		<div
			className={classes.pageContainer}
			style={smaller ? { maxWidth: 1140 } : {}}
		>
			{pageTitle.length > 0 ? (
				<Header header={pageTitle} variant={"h2"} />
			) : (
				""
			)}
			{children}
		</div>
	</div>
);

Page.defaultProps = {
	pageTitle: "",
};

Page.propTypes = {
	pageTitle: PropTypes.string,
	backLink: PropTypes.bool,
	topBarProps: PropTypes.object,
	children: PropTypes.element.isRequired,
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Page);
