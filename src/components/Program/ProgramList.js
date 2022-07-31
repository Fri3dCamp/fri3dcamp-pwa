import React from "react";
import {
	CardContent,
	Grid,
	Paper,
	Typography,
	withStyles,
} from "@material-ui/core";
import ProgramCard from "./ProgramCard";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Card from "@material-ui/core/Card";

const styles = (theme) => ({
	programList: {
		marginTop: theme.spacing.unit * 2,
	},
	card: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2,
	},
});

function ProgramList(props) {
	const { programs, classes } = props;

	if (!programs.length) {
		return (
			<div className={classes.programList}>
				<EmptyContainer {...props} />
			</div>
		);
	}

	return (
		<div className={classes.programList}>
			<Grid container spacing={24}>
				{programs.map((program) => (
					<Grid key={program.id} item xs={12} sm={6} md={4} lg={3}>
						<LazyLoadComponent
							id={program.id}
							delayTime={1000}
							treshold={0}
							placeholder={<LazyCard />}
						>
							<ProgramCard program={program} />
						</LazyLoadComponent>
					</Grid>
				))}
			</Grid>
		</div>
	);
}

const LazyCard = () => (
	<Card style={{ height: "200px" }}>
		<CardContent>Tralaliere hopsasa</CardContent>
	</Card>
);

const EmptyContainer = (props) => (
	<Paper className={props.classes.card} elevation={1}>
		<Typography variant="h6">Niets gevonden</Typography>
		<Typography variant="body1">
			Er werden geen activiteiten gevonden voor deze zoekopdracht.
		</Typography>
	</Paper>
);

export default withStyles(styles)(ProgramList);
