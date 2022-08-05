import SearchIcon from "@material-ui/icons/Search";
import { InputBase, withStyles } from "@material-ui/core";
import React from "react";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { connect } from "react-redux";
import { changeActivitySearchTerm } from "../../redux/actions";
import { debounce } from "lodash";

const styles = (theme) => ({
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: "black",
		"&:hover": {
			backgroundColor: "black",
		},
        color:"white",
		marginLeft: theme.spacing.unit,
		width: "auto",
	},
	searchIcon: {
		width: theme.spacing.unit * 5,
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
        color: "white",
	},
	inputRoot: {
		color: "inherit",
		width: "100%",
	},
	inputInput: {
		paddingTop: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit,
		paddingLeft: theme.spacing.unit * 5,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			width: 100,
			"&:focus": {
				width: 200,
			},
		},
		[theme.breakpoints.down("sm")]: {
			width: 60,
			"&:focus": {
				width: 200,
			},
		},
	},
});

const SearchBar = ({ search, classes, changeActivitySearchTerm }) => {
	const inputChanged = debounce((searchTerm) => {
		changeActivitySearchTerm(searchTerm);
	}, 100);

	return (
		<div className={classes.search}>
			<div className={classes.searchIcon}>
				<SearchIcon />
			</div>
			<InputBase
				onChange={(event) => inputChanged(event.target.value)}
				placeholder="Zoeken…"
				classes={{
					root: classes.inputRoot,
					input: classes.inputInput,
				}}
			/>
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	const {
		activityFilter: {
			filter: { search },
		},
	} = state;

	return {
		search,
	};
};

export default connect(mapStateToProps, { changeActivitySearchTerm })(
	withStyles(styles)(SearchBar)
);
