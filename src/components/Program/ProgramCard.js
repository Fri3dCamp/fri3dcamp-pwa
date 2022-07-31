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
import moment from "moment";
import CollapsingCardContent from "./CollapsingCardContent";
import {
	LazyLoadComponent,
	trackWindowScroll,
} from "react-lazy-load-image-component";

const styles = (theme) => ({
	card: {},
	cardHeaderTitle: {
		maxWidth: "100%",
		whiteSpace: "nowrap",
		overflowX: "hidden",
		textOverflow: "ellipsis",
	},
	cardHeaderContent: { maxWidth: "100%" },
	media: {
		height: 0,
		//paddingTop: '56.25%', // 16:9
		paddingTop: "33.3%", // 16:9
	},
});

class ProgramCard extends React.Component {
	state = {
		expanded: false,
	};

	handleExpandClick = (event) => {
		event.preventDefault();

		this.setState((state) => ({ expanded: !state.expanded }));
	};

	renderLocation = (program) => {
		if (program.isIntermission) {
			return null;
		}

		return (
			<>
				<LocationOnIcon /> {program.location}&nbsp;&middot;&nbsp;
			</>
		);
	};

	renderPeriod = (program) => {
		if (program.continuous) {
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
				&nbsp;
				{moment(program.period.start).format("HH:mm") +
					" - " +
					moment(program.period.end).format("HH:mm")}
			</>
		);
	};

	SubHeader = ({ program }) => (
		<div style={{ display: "flex", alignItems: "center" }}>
			{this.renderLocation(program)}
			{this.renderPeriod(program)}
		</div>
	);

	render() {
		const { classes, program, scrollPosition, ...others } = this.props;
		const image = program.images && program.images.medium;
		const imageUrl = image.source_url || false;

		const programCardContent = (
			<ProgramCardContent
				classes={classes}
				image={imageUrl}
				title={program.title}
				subHeader={<this.SubHeader program={program} />}
				content={program.excerpt}
				{...others}
			/>
		);

		return (
			<Card className={classes.card}>
				{program.isIntermission ? (
					programCardContent
				) : (
					<CardActionArea
						component={Link}
						to={`${process.env.PUBLIC_URL}/program/${program.id}`}
					>
						{programCardContent}
					</CardActionArea>
				)}
			</Card>
		);
	}
}

const ProgramCardContent = ({
	classes,
	image,
	title,
	subHeader,
	content,
	scrollPosition,
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
		<CardHeader
			title={title}
			titleTypographyProps={{
				variant: "h6",
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

export default trackWindowScroll(withStyles(styles)(ProgramCard));
