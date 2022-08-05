import React from "react";
import Page from "../components/UI/Page";
import CardBlock from "../components/UI/CardBlock";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import {
	changeActivityFilter,
	changeConsent,
	replyToNotifications,
} from "../redux/actions";

const Settings = ({
	reply,
	replyToNotifications,
	hidePastActivities,
	changeActivityFilter,
	trackingConsent,
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
		</Grid>
	</Page>
);

export const mapStateToProps = (state) => {
	const {
		notifications: { reply = false },
		general: { trackingConsent },
		activityFilter: {
			filter: { hidePastActivities },
		},
	} = state;

	return {
		reply,
		hidePastActivities,
		trackingConsent,
	};
};

export default connect(mapStateToProps, {
	replyToNotifications,
	changeActivityFilter,
	changeConsent,
})(Settings);
