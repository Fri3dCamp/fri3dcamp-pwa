import React from "react";
import { withStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

const styles = (theme) => ({
	icon: {
		color: "black",
		position: "absolute",
        background: theme.palette.primary.main,
		marginTop: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		// background:
			// "radial-gradient(circle, rgba(0,0,0,0.075) 0%, rgba(0,0,0,0) 65%)",
		top: 0,
		right: 0,
	},
});

const LikeButton = ({ classes, onClick, active = false }) => (
	<IconButton
		className={classes.icon}
		onClick={(e) => {
			e.preventDefault();
			onClick();
		}}
	>
		{active ? <FavoriteIcon /> : <FavoriteBorderIcon />}
	</IconButton>
);

export default withStyles(styles)(LikeButton);
