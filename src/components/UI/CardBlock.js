import {
	Card,
	CardActionArea,
	CardContent,
	CardHeader,
	CardMedia,
	Typography,
	withStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import React from "react";
import CardActions from "@material-ui/core/CardActions";

const styles = (theme) => ({
	card: {
		position: "relative",
	},
	cardMedia: {
		height: 0,
		paddingTop: "33.33%",
        backgroundSize: "contain",
	},
});

const CardBlockHeader = ({ header, link }) =>
	!link ? (
		<CardHeader {...header} />
	) : (
		<CardActionArea component={Link} to={link}>
			<CardHeader {...header} />
		</CardActionArea>
	);

const CardBlock = ({
	classes,
	link = null,
	header = null,
	headerLink = null,
	actions = null,
	media,
	mediaProps = {},
	bodyProps = {},
	raw = false,
	children,
}) => {
	const Container = ({ link, children }) =>
		!link ? (
			<>{children}</>
		) : (
			<CardActionArea component={Link} to={link}>
				{children}
			</CardActionArea>
		);
	const body = raw ? (
		<>{children}</>
	) : (
		<Typography variant="body1" component="div" {...bodyProps}>
			{children}
		</Typography>
	);
	return (
		<Card elevation={1} className={classes.card}>
			<Container link={link}>
				{media && (
					<CardMedia
						image={media}
						className={classes.cardMedia}
						{...mediaProps}
					/>
				)}
				{header && (
					<CardBlockHeader header={header} link={headerLink} />
				)}
				{children && <CardContent>{body}</CardContent>}
				{actions && <CardActions>{actions}</CardActions>}
			</Container>
		</Card>
	);
};

export default withStyles(styles)(CardBlock);
