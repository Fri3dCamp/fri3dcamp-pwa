import React from "react";
import { withStyles } from "@material-ui/core";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import ShareIcon from "@material-ui/icons/Share";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { Facebook, Twitter } from "mdi-material-ui";

const styles = (theme) => ({
	fab: {
		zIndex: 1000,
		position: "fixed",
		right: "32px",
		top: "88px",
	},
	speedDial: {
		position: "fixed",
		bottom: theme.spacing.unit * 10,
		right: theme.spacing.unit * 3,
	},
});

const shareIcons = [
	{
		icon: <Twitter />,
		name: "Twitter",
		link: "https://twitter.com/intent/tweet/?text={title}&url={url}&via=soundscifest",
	},
	{
		icon: <Facebook />,
		name: "Facebook",
		link: "https://www.facebook.com/sharer/sharer.php?u={url}",
	},
	{
		icon: <FileCopyIcon />,
		name: "Naar klembord",
		link: "#",
		onClick: () => {
			if (navigator.clipboard) {
				navigator.clipboard.writeText(document.location.href);
			}
		},
	},
];

const getShareUrl = (url, title) =>
	url
		.replace("{url}", encodeURIComponent(document.location.href))
		.replace("{title}", encodeURIComponent(title));

class ShareOptions extends React.Component {
	state = {
		open: false,
		hidden: false,
	};

	getIcons = () => {
		const { activity } = this.props;

		if (!activity || !activity.title) {
			return [];
		}

		return shareIcons.map((shareIcon) => ({
			...shareIcon,
			url: getShareUrl(shareIcon.link, activity.title),
		}));
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	handleOpen = () => {
		this.setState({ open: true });
	};

	render() {
		const { classes } = this.props;
		const { hidden, open } = this.state;

		return (
			<>
				<SpeedDial
					ariaLabel="Location filter"
					hidden={hidden}
					className={classes.speedDial}
					icon={<ShareIcon />}
					onBlur={this.handleClose}
					onClick={this.handleOpen}
					onClose={this.handleClose}
					onFocus={this.handleOpen}
					onMouseEnter={this.handleOpen}
					onMouseLeave={this.handleClose}
					open={open}
					direction="up"
				>
					{this.getIcons().map((shareIcon) => (
						<SpeedDialAction
							key={shareIcon.name}
							component="a"
							href={shareIcon.url}
							rel={"noreferrer noopener"}
							target={"_blank"}
							icon={shareIcon.icon}
							tooltipTitle={shareIcon.name}
							onClick={
								shareIcon.onClick
									? (e) => {
											e.preventDefault();
											shareIcon.onClick();
									  }
									: null
							}
							title={shareIcon.name}
						/>
					))}
				</SpeedDial>
			</>
		);
	}
}

export default withStyles(styles)(ShareOptions);
