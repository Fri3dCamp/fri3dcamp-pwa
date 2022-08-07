import React from "react";
import Page from "../components/UI/Page";
import CardBlock from "../components/UI/CardBlock";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import {Button, Grid} from "@material-ui/core";
import { connect } from "react-redux";
import {
	changeActivityFilter,
	changeConsent,
	replyToNotifications,
} from "../redux/actions";
import {Link} from "react-router-dom";
import {prefixRoute} from "../routing";

const Settings = ({
	reply,
	replyToNotifications,
	hidePastActivities,
	changeActivityFilter,
	changeConsent,
}) => (
	<Page backLink={true} pageTitle={"Instellingen"}>
		<Grid container spacing={24}>
			<Grid item xs={12}>
				<CardBlock>
					<FormControl component="fieldset">
						<FormLabel component="legend">Meldingen</FormLabel>
						<FormGroup>
							<FormControlLabel
								control={
									<Switch
										color="secondary"
										checked={reply}
										onChange={(e) =>
											replyToNotifications(
												e.target.checked
											)
										}
										value="pushNotifications"
									/>
								}
								label="Stuur mij meldingen"
							/>
						</FormGroup>
						<FormHelperText>
							Wanneer deze optie actief is, houden we je op de
							hoogte van belangrijke nieuwtjes voor- en tijdens
							het kamp. Je krijgt van ons een handige melding
							op je toestel toegestuurd.
						</FormHelperText>
					</FormControl>
				</CardBlock>
			</Grid>
			<Grid item xs={12}>
				<CardBlock>
					<FormControl component="fieldset">
						<FormLabel component="legend">Programma</FormLabel>
						<FormGroup>
							<FormControlLabel
								control={
									<Switch
										color="secondary"
										checked={hidePastActivities}
										onChange={(e) =>
											changeActivityFilter({
												hidePastActivities:
												e.target.checked,
											})
										}
										value="hidePastActivities"
									/>
								}
								label="Verberg afgelopen activiteiten"
							/>
						</FormGroup>
						<FormHelperText>
							Als deze optie aan staat, worden activiteiten die
							zijn afgelopen naar onderen verplaatst.
						</FormHelperText>
					</FormControl>
				</CardBlock>
			</Grid>
			<Grid item xs={12}>
				<CardBlock>
					<FormControl component="fieldset">
						<FormLabel component="legend">Troubleshooting</FormLabel>
						<FormHelperText>
							<p>Als je problemen ondervindt met de app, kun je proberen om de app te herladen via het kebab-menu rechtsboven.</p>
							<p>Nog steeds problemen? Probeer eens om de local storage cache te verwijderen via onderstaande knop. Kom gerust even langs bij de infodesk, dan kijken we met je verder.</p>
						</FormHelperText>
						<FormGroup>
							<Button
								variant="outlined"
								color="default"
								onClick={() => {
									if(window.localStorage) {
										window.localStorage.clear();
									}
									window.location.reload(true);
								}}
							>
								Clear local storage
							</Button>
						</FormGroup>
					</FormControl>
				</CardBlock>
			</Grid>
		</Grid>
	</Page>
);

export const mapStateToProps = (state) => {
	const {
		notifications: { reply = false },
		activityFilter: {
			filter: { hidePastActivities },
		},
	} = state;

	return {
		reply,
		hidePastActivities,
	};
};

export default connect(mapStateToProps, {
	replyToNotifications,
	changeActivityFilter,
	changeConsent,
})(Settings);
