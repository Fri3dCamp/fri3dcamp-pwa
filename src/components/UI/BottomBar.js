import React from "react";
import { Link, withRouter } from "react-router-dom";
import {
	Badge,
	BottomNavigation,
	BottomNavigationAction,
	withStyles,
} from "@material-ui/core";
import EventIcon from "@material-ui/icons/EventOutlined";
import MapIcon from "@material-ui/icons/MapOutlined";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { getUnreadUpdateCount } from "../../redux/actions";
import {connect} from "react-redux";
import {prefixRoute} from "../../routing";

const styles = (theme) => ({
	bottomNavigation: {
		width: "100%",
		position: "fixed",
		bottom: 0,
		zIndex: 1100,
	},
});

class BottomBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentAction: -1,
			navigationActions: [
				{
					key: 0,
					label: "Programma",
					icon: EventIcon,
					path: "/activity",
				},
				{
					key: 1,
					label: "Plattegrond",
					icon: MapIcon,
					path: "/map",
				},
				{
					key: 2,
					label: "Updates",
					badge: UpdateBadge,
					icon: NotificationsIcon,
					path: "/update",
				},
				{
					key: 3,
					label: "Favorieten",
					icon: FavoriteIcon,
					path: "/favorites",
				},
			],
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.location !== prevProps.location) {
			this.setState({
				currentAction: this.getNavigationValue(
					this.props.location,
					this.props.match
				),
			});
		}
	}

	componentDidMount() {
		this.setState({
			currentAction: this.getNavigationValue(
				this.props.location,
				this.props.match
			),
		});
	}

	actions(actions) {
		return actions.map((action) => {
			let icon = <action.icon />;

			if (action.badge) {
				icon = <action.badge>{icon}</action.badge>;
			}

			return (
				<BottomNavigationAction
					key={action.key}
					label={action.label}
					icon={icon}
					component={Link}
					to={prefixRoute(action.path)}
				/>
			);
		});
	}

	getNavigationValue(location, match) {
		let activeNavigation = this.state.navigationActions.find((action) => {
			return (prefixRoute(action.path)) === location.pathname;
		});

		if (!activeNavigation) {
			activeNavigation = Array.from(this.state.navigationActions)
				.reverse()
				.find((action) => {
					return location.pathname.startsWith(prefixRoute(action.path));
				});
		}

		return activeNavigation ? activeNavigation.key : -1;
	}

	render() {
		const { navigationActions, currentAction } = this.state;
		const { classes } = this.props;

		return (
			<BottomNavigation
				className={classes.bottomNavigation}
				value={currentAction}
				showLabels
			>
				{this.actions(navigationActions)}
			</BottomNavigation>
		);
	}
}

let UpdateBadge = ({ children, unreadCount }) => {
	if (!unreadCount) {
		return <>{children}</>;
	}

	return (
		<Badge badgeContent={unreadCount} color="secondary">
			{children}
		</Badge>
	);
};

UpdateBadge = connect((state) => ({
	unreadCount: getUnreadUpdateCount(state),
}))(UpdateBadge);

export default withRouter(withStyles(styles)(BottomBar));
