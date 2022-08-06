import React, { Component } from "react";
import PropTypes from "prop-types";
import Page from "../components/UI/Page";
import { connect } from "react-redux";
import { loadUpdates } from "../redux/actions";
import { getFavoriteActivities } from "../redux/selectors";
import ActivityView from "../components/Activities/ActivityView";
import CardBlock from "../components/UI/CardBlock";
import SadFaceIcon from "@material-ui/icons/SentimentDissatisfiedOutlined";
import { Button, CardActions, IconButton, withStyles } from "@material-ui/core";

import { Link } from "react-router-dom";

const styles = (theme) => ({
	icon: {
		color: theme.palette.primary.main,
	},
});

class Favorites extends Component {
	static propTypes = {
		favorites: PropTypes.array.isRequired,
	};

	componentDidMount() {
		document.title = `Mijn favorieten - Fri3d Camp`;
	}

	render() {
		const { favorites } = this.props;

		return (
			<Page pageTitle="Mijn favorieten">
				{favorites && favorites.length ? (
					<ActivityView activities={favorites} />
				) : (
					<CardBlock
						header={{
							title: "Oeps...",
							titleTypographyProps: { variant: "h5" },
						}}
					>
						<IconButton
							iconStyle={{ width: "250px", height: "250px" }}
						>
							<SadFaceIcon fontSize="large" />
						</IconButton>
						Je hebt nog geen favoriete activiteiten! Selecteer er
						snel enkele via het hart-icoontje.
						<CardActions>
							<Button
								variant="contained"
								color="primary"
								component={Link}
								to={`activity`}
							>
								Bekijk het programma
							</Button>
						</CardActions>
					</CardBlock>
				)}
			</Page>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		favorites: getFavoriteActivities(state),
	};
};

export default connect(mapStateToProps, { loadUpdates })(
	withStyles(styles)(Favorites)
);
