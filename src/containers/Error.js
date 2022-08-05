import React from "react";
import Page from "../components/UI/Page";
import { Button, CardActions, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import CardBlock from "../components/UI/CardBlock";

const Error = () => (
	<Page backLink={true} pageTitle={"Oeps..."}>
		<CardBlock raw={true}>
			<Typography variant="body1">
				Het lijkt erop dat er iets mis ging. Probeer het later nog eens.
			</Typography>
			<CardActions>
				<Button
					variant="contained"
					color="primary"
					component={Link}
					to={`/activity`}
				>
					Naar beginpagina
				</Button>
				<Button
					variant="text"
					color="primary"
					component="a"
					onClick={() => window.location.reload()}
				>
					Refresh de app
				</Button>
			</CardActions>
		</CardBlock>
	</Page>
);

export default Error;
