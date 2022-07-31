import React from "react";
import FaceIcon from "@material-ui/icons/Face";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import Brightness2Icon from "@material-ui/icons/Brightness2";
import { connect } from "react-redux";
import { changeActivityFilter } from "../../../redux/actions";
import FilterButton from "./FilterButton";
import FilterDialog from "./FilterDialog";

export const possibleFilters = {
	continuous: {
		key: "continuous",
		label: "Doorlopend",
		icon: AutorenewIcon,
		property: "continuous",
	},
	childFriendly: {
		key: "childFriendly",
		label: "Kindvriendelijk",
		icon: FaceIcon,
		property: "childFriendly",
	},
	night: {
		key: "night",
		label: "Avond",
		icon: Brightness2Icon,
		property: "night",
	},
};

class Filter extends React.Component {
	state = {
		open: false,
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	handleFilterChange(newFilters) {
		this.handleClose();
		this.props.changeActivityFilter(newFilters);
	}

	render() {
		const { filter, activeFilterCount } = this.props;

		return (
			<>
				<FilterButton
					count={activeFilterCount}
					onClick={() => this.setState({ open: true })}
				/>
				<FilterDialog
					chipFilters={possibleFilters}
					filter={filter}
					open={this.state.open}
					onClose={() => this.handleClose()}
					onChange={(newFilters) =>
						this.handleFilterChange(newFilters)
					}
				/>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		activityFilter: { filter },
	} = state;

	let activeFilterCount = filter.categories.length + filter.locations.length;

	return {
		filter,
		activeFilterCount,
	};
};

export default connect(mapStateToProps, { changeActivityFilter })(Filter);
