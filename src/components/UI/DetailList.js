import {
	Avatar,
	Divider,
	List,
	ListItem,
	ListItemText,
	withStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import React from "react";

const styles = (theme) => ({
	details: {
		width: "100%",
		backgroundColor: theme.palette.background.paper,
	},
});

const renderAvatar = (avatar) => {
	if (typeof avatar === "string") {
		return <Avatar src={avatar} />;
	}

	return <Avatar>{avatar}</Avatar>;
};

const DetailListItem = ({
	isDivider,
	text,
	avatar,
	link,
	truncate = false,
}) => {
	if (isDivider) {
		return (
			<li>
				<Divider variant="inset" />
			</li>
		);
	}

	const Container = ({ link, children }) =>
		link ? (
			<ListItem component={Link} to={link}>
				{children}
			</ListItem>
		) : (
			<ListItem>{children}</ListItem>
		);
	return (
		<Container link={link}>
			{avatar && renderAvatar(avatar)}
			<ListItemText {...text} />
		</Container>
	);
};

const DetailList = ({ children, classes }) => (
	<List className={classes.details}>
		{children.map((detailItem) => (
			<DetailListItem key={detailItem.key} {...detailItem} />
		))}
	</List>
);

export default withStyles(styles)(DetailList);
