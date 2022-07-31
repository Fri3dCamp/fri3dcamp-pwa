import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classnames from "classnames";
import {
	CardActions,
	CardContent,
	Collapse,
	IconButton,
	withStyles,
} from "@material-ui/core";

const styles = (theme) => ({
	actions: {
		display: "flex",
		paddingTop: 0,
		marginTop: "-56px",
	},
	expand: {
		transform: "rotate(0deg)",
		marginLeft: "auto",
		transition: theme.transitions.create("transform", {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: "rotate(180deg)",
	},
});

class CollapsingCardContent extends Component {
	state = {
		open: false,
	};

	handleExpandClick = (e) => {
		e.preventDefault();

		this.setState((oldState) => ({ open: !oldState.open }));
	};

	render() {
		const { open } = this.state;
		const { classes, content } = this.props;

		if (!content || !content.length) {
			return null;
		}

		return (
			<>
				<CardActions className={classes.actions} disableActionSpacing>
					<IconButton
						className={classnames(classes.expand, {
							[classes.expandOpen]: open,
						})}
						onClick={this.handleExpandClick}
						aria-expanded={open}
						aria-label="Show more"
					>
						<ExpandMoreIcon />
					</IconButton>
				</CardActions>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<CardContent>
						<Typography
							dangerouslySetInnerHTML={{ __html: content }}
						/>
					</CardContent>
				</Collapse>
			</>
		);
	}
}

export default withStyles(styles)(CollapsingCardContent);
