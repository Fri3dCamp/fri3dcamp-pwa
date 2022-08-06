import { Avatar } from "@material-ui/core";
import React from "react";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import Page from "../components/UI/Page";
import CardBlock from "../components/UI/CardBlock";
import { getLocationList } from "../redux/selectors";
import UpcomingActivities from "../components/Activities/UpcomingActivities";
import {prefixRoute} from "../routing";

const Locations = ({ locations }) => (
	<Page pageTitle={"Programma per locatie"}>
		<Grid container spacing={24}>
			{locations.map((location) => (
				<Grid key={location.name} item xs={12} sm={6} md={4}>
					<CardBlock
						headerLink={prefixRoute(`/location/${location.name.toLowerCase()}`)}
						header={{
							title: location.name,
							subheader: location.subTitle,
							avatar: <Avatar src={location.icon} />,
						}}
					>
						<UpcomingActivities
							title=""
							location={location.name.toLowerCase()}
						/>
					</CardBlock>
				</Grid>
			))}
		</Grid>
	</Page>
);

const mapStateToProps = (state) => {
	const locations = getLocationList(state);

	return {
		locations: locations.filter(({ name }) => name !== "Terrein"),
	};
};

export default connect(mapStateToProps)(Locations);
