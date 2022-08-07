import {
	Card,
	CardActionArea,
	CardContent,
	CardHeader,
	withStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import React from "react";
import UpdateTitle from "./UpdateTitle";
import moment from "moment";
import "moment/locale/nl";
import {prefixRoute} from "../../routing";

const styles = (theme) => ({
	unRead: {
		boxShadow: `0 0 13px -6px ${theme.palette.primary.main}`,
	},
});

const UpdateCard = ({ update, classes }) => (
	<Card className={`${update.isRead ? "" : classes.unRead}`}>
		<CardActionArea
			component={Link}
			to={prefixRoute(`/update/${update.id}`)}
		>
			<CardHeader
				title={<UpdateTitle update={update} />}
				titleTypographyProps={{ variant: "h3" }}
				subheader={moment(update.date).format("LLL")}
			/>
			<CardContent>
				<Typography variant="body1" dangerouslySetInnerHTML={
					{ __html: update.excerpt }
				}/>
			</CardContent>
		</CardActionArea>
	</Card>
);

export default withStyles(styles)(UpdateCard);
