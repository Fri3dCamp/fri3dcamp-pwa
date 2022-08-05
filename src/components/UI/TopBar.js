import React from "react";
import {
	AppBar,
	Divider,
	IconButton,
	Toolbar,
	withStyles,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Link, withRouter } from "react-router-dom";
import logo from "../../img/logo.png";

import MoreIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {
	bindMenu,
	bindTrigger,
	usePopupState,
} from "material-ui-popup-state/hooks";

const styles = (theme) => ({
	appBar: {
		width: "100%",
	},
	appBarImage: {
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center center",
	},
	logo: {
		display: "block",
		maxWidth: "100%",
		width: "auto",
		height: "65px",
		paddingRight: theme.spacing.unit,
	},
	root: {
		margin: "0 auto",
		maxWidth: 1140,
		padding: theme.spacing.unit * 2,
	},
	grow: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: -12,
		marginleft: 4,
	},
	backButton: {
		marginLeft: -12,
		marginRight: 20,
	},
	toolBar: {
		maxWidth: "1600px",
		marginLeft: "auto",
		marginRight: "auto",
		paddingLeft: "16px",
		paddingRight: "16px",
		width: "100%",
	},
});

class TopBar extends React.Component {
	render() {
		const { classes, backLink, background } = this.props;
		const appBarStyles = {};

		if (background) {
			appBarStyles.backgroundImage = `url('${background}')`;
		}

		return (
			<AppBar
				className={`${classes.appBar} ${
					background ? classes.appBarImage : ""
				}`}
				position="sticky"
				style={appBarStyles}
			>
				<Toolbar className={classes.toolBar}>
					{backLink && (
						<IconButton
							className={classes.backButton}
							onClick={this.props.history.goBack}
							color="inherit"
							aria-label="Back"
						>
							<ArrowBackIcon />
						</IconButton>
					)}
					<Link to="/">
						<img
							src={logo}
							className={classes.logo}
							alt="Fri3d Camp"
						/>
					</Link>
					<div className={classes.grow} />
					{this.props.toolbarRight && this.props.toolbarRight}
					<TopBarMenu classes={classes} />
				</Toolbar>
				{this.props.children}
			</AppBar>
		);
	}
}

const TopBarMenu = ({ classes }) => {
	const popupState = usePopupState({
		variant: "popover",
		popupId: "menuPopup",
	});

	return (
		<>
			<IconButton
				color="inherit"
				className={classes.menuButton}
				{...bindTrigger(popupState)}
			>
				<MoreIcon />
			</IconButton>

			<Menu {...bindMenu(popupState)}>
				<Link
					to="/locations"
					style={{ textDecoration: "none", outline: "none" }}
				>
					<MenuItem onClick={popupState.close}>Locaties</MenuItem>
				</Link>
				<Divider />
				<Link
					to="/settings"
					style={{ textDecoration: "none", outline: "none" }}
				>
					<MenuItem onClick={popupState.close}>Instellingen</MenuItem>
				</Link>
				<Link
					to="/partners"
					style={{ textDecoration: "none", outline: "none" }}
				>
					<MenuItem onClick={popupState.close}>Partners</MenuItem>
				</Link>
				<Divider />
				<MenuItem
					onClick={() => {
						window.location.reload();
						popupState.close();
					}}
				>
					App herladen
				</MenuItem>
			</Menu>
		</>
	);
};

export default withRouter(withStyles(styles)(TopBar));
