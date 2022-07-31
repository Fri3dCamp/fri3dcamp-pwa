import { Badge, withStyles } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import Fab from "@material-ui/core/Fab";
import React from "react";

const styles = (theme) => ({
	fab: {
		zIndex: 1000,
		position: "fixed",
		right: "16px",
		top: "72px",
	},
});

const FilterButton = ({ classes, count, onClick }) => {
	const filterIcon = count ? (
		<Badge badgeContent={count} color="primary">
			<FilterListIcon />
		</Badge>
	) : (
		<FilterListIcon />
	);

	return (
		<Fab
			size="medium"
			className={classes.fab}
			onClick={onClick}
			color="secondary"
			aria-label="Filter"
		>
			{filterIcon}
		</Fab>
	);
};

export default withStyles(styles)(FilterButton);
