import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { connect } from "react-redux";
import { replyToNotifications } from "../../redux/actions";

const updateNag = ({ reply, replyToNotifications, ...props }) => {
	if (reply !== null) {
		return null;
	}

	return (
		<Card elevation={1} {...props}>
			<CardHeader
				title="Blijf op de hoogte"
				titleTypographyProps={{ variant: "h3" }}
			/>
			<CardContent>
				<Typography variant="body1">
					Mogen we je op de hoogte houden van nieuwe updates? Denk
					hierbij aan kinderen met verloren gelopen ouders,
					last-minute plaatsen voor workshops, enzovoort.

					Opgelet: push-notificaties zijn mogelijk niet beschikbaar op iOS.
				</Typography>
			</CardContent>
			<CardActions>
				<Button
					onClick={() => replyToNotifications(true)}
					variant="contained"
					color="primary"
				>
					Natuurlijk
				</Button>
				<Button
					onClick={() => replyToNotifications(false)}
					variant="text"
					color="primary"
				>
					Liever niet
				</Button>
			</CardActions>
		</Card>
	);
};

export default connect((state) => state.notifications, {
	replyToNotifications,
})(updateNag);
