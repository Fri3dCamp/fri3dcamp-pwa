import React, { Component } from "react";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import { removeSnackbar } from "../redux/actions";

class Notifier extends Component {
	displayed = [];

	storeDisplayed = (id) => {
		this.displayed = [...this.displayed, id];
	};

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		const { notifications: newSnacks = [] } = nextProps;
		const { notifications: currentSnacks } = this.props;
		let notExists = false;
		for (let i = 0; i < newSnacks.length; i += 1) {
			if (notExists) continue;
			notExists =
				notExists ||
				!currentSnacks.filter(({ key }) => newSnacks[i].key === key)
					.length;
		}
		return notExists;
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { notifications = [] } = this.props;

		notifications.forEach((notification) => {
			// Do nothing if snackbar is already displayed
			if (this.displayed.includes(notification.key)) return;
			// Display snackbar using notistack
			this.props.enqueueSnackbar(
				notification.message,
				notification.options
			);
			// Keep track of snackbars that we've displayed
			this.storeDisplayed(notification.key);
			// Dispatch action to remove snackbar from redux store
			this.props.removeSnackbar(notification.key);
		});
	}

	render() {
		return null;
	}
}

const mapStateToProps = (state) => {
	return {
		notifications: state.snackbarNotifications,
	};
};

export default withSnackbar(
	connect(mapStateToProps, { removeSnackbar })(Notifier)
);
