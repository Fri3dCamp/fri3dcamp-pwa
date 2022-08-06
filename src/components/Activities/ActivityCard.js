import React from "react";
import {
	Card,
	CardActionArea,
	CardHeader,
	CardMedia,
	withStyles,
} from "@material-ui/core";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { Link } from "react-router-dom";
import CollapsingCardContent from "../UI/CollapsingCardContent";
import {
	LazyLoadComponent,
	trackWindowScroll,
} from "react-lazy-load-image-component";
import Period from "./Single/Period";
import { connect } from "react-redux";
import { getLocationByName, getPastActivities } from "../../redux/selectors";
import LikeButton from "../UI/LikeButton";
import { toggleFavorite } from "../../redux/actions";

const styles = (theme) => ({
	card: {},
	cardHeaderTitle: {
		maxWidth: "100%",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
	},
	pastActivity: {
		opacity: 0.5,
	},
	cardHeaderContent: { maxWidth: "100%" },
	media: {
		height: 0,
		//paddingTop: '56.25%', // 16:9
		paddingTop: "33.3%", // 16:9
	},
});

class ActivityCard extends React.Component {
	state = {
		expanded: false,
	};

	handleExpandClick = (event) => {
		event.preventDefault();

		this.setState((state) => ({ expanded: !state.expanded }));
	};

	renderLocation = (activity) => {
		const { location } = this.props;

		if (activity.isIntermission) {
			return null;
		}

		if (!location) {
			return null;
		}

		return (
			<>
				<LocationOnIcon /> {location.name}&nbsp;&nbsp;
			</>
		);
	};

	renderPeriod = (activity) => {
		if (activity.continuous) {
			return (
				<>
					<AutorenewIcon />
					&nbsp;Doorlopend
				</>
			);
		}

		return (
			<>
				<AccessTimeIcon />
				&nbsp;{<Period activity={activity} />}
			</>
		);
	};

	SubHeader = ({ activity }) => (
		<div
			style={{
				display: "flex",
				marginTop: "5px",
				alignItems: "center",
				fontSize: "90%",
			}}
		>
			{this.renderLocation(activity)}
			{this.renderPeriod(activity)}
		</div>
	);

	render() {
		const { classes, activity, scrollPosition, isPast, ...others } =
			this.props;
		let img = null;

		if (activity && activity.images) {
			img =
				activity.images.mediumLarge ||
				activity.images.large ||
				activity.images.medium;
		}
		const imageUrl = img.sourceUrl || false;

		const activityCardContent = (
			<ActivityCardContent
				classes={classes}
				activity={activity}
				image={imageUrl}
				title={activity.title}
				subHeader={<this.SubHeader activity={activity} />}
				content={activity.excerpt}
				{...others}
			/>
		);

		return (
			<Card
				className={`${classes.card} ${
					isPast ? classes.pastActivity : ""
				}`}
			>
				{activity.isIntermission ? (
					activityCardContent
				) : (
					<CardActionArea
						component={Link}
						to={`activity/${activity.id}`}
					>
						{activityCardContent}
					</CardActionArea>
				)}
			</Card>
		);
	}
}

const ActivityCardContent = ({
	activity,
	classes,
	image,
	title,
	subHeader,
	content,
	scrollPosition,
	isFavorite,
	toggleFavorite,
}) => (
	<>
		{image && (
			<LazyLoadComponent
				style={{ height: 0, paddingTop: "33.3%" }}
				scrollPosition={scrollPosition}
			>
				<CardMedia className={classes.media} image={image} />
			</LazyLoadComponent>
		)}
		<LikeButton
			active={isFavorite}
			onClick={() => toggleFavorite(activity.id)}
		/>
		<CardHeader
			title={title}
			titleTypographyProps={{
				variant: "h4",
			}}
			classes={{
				title: classes.cardHeaderTitle,
				content: classes.cardHeaderContent,
			}}
			subheader={subHeader}
		/>
		<CollapsingCardContent content={content} />
	</>
);

const mapStateToProps = (state, { activity }) => {
	const isFavorite = state.favoriteActivities.includes(activity.id);
	const pastActivities = getPastActivities(state);

	const isPast = pastActivities.indexOf(activity.id) !== -1;

	return {
		location: getLocationByName(state)(activity.location),
		isFavorite,
		isPast,
	};
};

export default connect(mapStateToProps, { toggleFavorite })(
	trackWindowScroll(withStyles(styles)(ActivityCard))
);
