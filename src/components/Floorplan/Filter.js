import React from "react";
import { Badge, withStyles } from "@material-ui/core";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import PlaceIcon from "@material-ui/icons/Place";
import FlagIcon from "@material-ui/icons/Flag";
import InfoIcon from "@material-ui/icons/Info";
import { connect } from "react-redux";
import { changeFloorPlanFilter } from "../../redux/actions";
import { getFloorPlanFilters } from "../../redux/selectors";
import FilterListIcon from "@material-ui/icons/FilterList";

const styles = (theme) => ({
	fab: {
		zIndex: 1000,
		position: "fixed",
		right: "32px",
		top: "88px",
	},
	speedDial: {
		position: "absolute",
		bottom: theme.spacing.unit * 2,
		right: theme.spacing.unit * 3,
	},
});

const availableFilters = [
	{
		icon: (active) => (
			<PlaceIcon color={active ? "secondary" : "inherit"} />
		),
		name: "Locaties",
		value: "location",
	},
	{
		icon: (active) => <FlagIcon color={active ? "secondary" : "inherit"} />,
		name: "Activiteiten",
		value: "activity",
	},
	{
		icon: (active) => <InfoIcon color={active ? "secondary" : "inherit"} />,
		name: "Algemeen",
		value: "general",
	},
];

class Filter extends React.Component {
	state = {
		open: false,
		hidden: false,
	};

	getFilters = () => {
		const { filters } = this.props;

		return availableFilters.map((availableFilter) => ({
			...availableFilter,
			active: filters.indexOf(availableFilter.value) !== -1,
		}));
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	handleOpen = () => {
		this.setState({ open: true });
	};

	handleClick = (filter) => {
		const { filters, changeFloorPlanFilter } = this.props;
		let newFilters = [...filters];

		this.handleClose();

		const index = newFilters.indexOf(filter.value);

		if (index === -1) {
			newFilters.push(filter.value);
		} else {
			newFilters.splice(index, 1);
		}

		changeFloorPlanFilter(newFilters);
	};

	render() {
		const { classes, activeFilterCount } = this.props;
		const { hidden, open } = this.state;

		return (
			<>
				<SpeedDial
					ariaLabel="Location filter"
					hidden={hidden}
					className={classes.speedDial}
					icon={
						<Badge
							badgeContent={activeFilterCount}
							color="secondary"
						>
							<FilterListIcon />
						</Badge>
					}
					onBlur={this.handleClose}
					onClick={this.handleOpen}
					onClose={this.handleClose}
					onFocus={this.handleOpen}
					onMouseEnter={this.handleOpen}
					onMouseLeave={this.handleClose}
					open={open}
					direction="up"
					ButtonProps={{
						style: {
							width: "45px",
							height: "45px",
							right: "-8px",
						},
					}}
				>
					{this.getFilters().map((filter) => (
						<SpeedDialAction
							key={filter.value}
							icon={filter.icon(filter.active)}
							tooltipTitle={filter.name}
							onClick={() => this.handleClick(filter)}
							tooltipOpen
							title={filter.name}
						/>
					))}
				</SpeedDial>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	const filters = getFloorPlanFilters(state);

	let activeFilterCount = filters.length;

	return {
		filters,
		activeFilterCount,
	};
};

export default connect(mapStateToProps, { changeFloorPlanFilter })(
	withStyles(styles)(Filter)
);
