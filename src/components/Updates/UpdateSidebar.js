import React from "react";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Header from "../UI/Header";
import UpdateNag from "./UpdateNag";
import { enqueueSnackbar, queueUpdate } from "../../redux/actions";
import CardBlock from "../UI/CardBlock";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import LoadingIndicator from "../UI/LoadingIndicator";

const SendUpdateForm = ({ onSubmit, sendingUpdate, ...props }) => {
	if (sendingUpdate) {
		return <LoadingIndicator />;
	}

	return (
		<Grid item xs={12}>
			<CardBlock header={{ title: "Nieuwe update" }}>
				<form method="POST" onSubmit={onSubmit}>
					<FormControl fullWidth={true} component="fieldset">
						<FormLabel component="legend">Update</FormLabel>
						<FormGroup>
							<TextField fullWidth={true} name="updateTitle" />
						</FormGroup>
						<FormHelperText>De titel.</FormHelperText>
						<FormGroup>
							<TextField
								fullWidth={true}
								rows={4}
								multiline
								name="updateContent"
							/>
						</FormGroup>
						<FormHelperText>Inhoud.</FormHelperText>
						<div style={{ marginBottom: "16px" }} />
						<Button
							type="submit"
							variant="contained"
							color="primary"
						>
							Versturen
						</Button>
					</FormControl>
				</form>
			</CardBlock>
		</Grid>
	);
};

const UpdateSidebar = ({
	reply,
	isAuthenticated,
	queueUpdate,
	enqueueSnackbar,
	sendingUpdate,
}) => {
	return (
		<>
			<Grid container spacing={24}>
				{reply === null && (
					<Grid item>
						<UpdateNag />
					</Grid>
				)}
				<Grid item>
					<Header header="Volg ons" variant="h4" />
                    <Typography variant="p">Hello world</Typography>
					<Button
						component="a"
						style={{ margin: "5px" }}
						target="_blank"
						variant="contained"
						rel="noreferrer noopener"
						href="http://join.discord.fri3d.be/"
					>
						Discord
					</Button>
				</Grid>
				{isAuthenticated && (
					<SendUpdateForm
						sendingUpdate={sendingUpdate}
						onSubmit={(e) => {
							e.preventDefault();

							const formData = new FormData(e.target);

							const update = {
								title: formData.get("updateTitle"),
								content: formData.get("updateContent"),
							};

							if (
								update.title.length > 0 &&
								update.content.length > 0
							) {
								queueUpdate(update);
								enqueueSnackbar({
									message: "Update wordt verzonden!",
								});
							} else {
								enqueueSnackbar({
									message: "Update werd niet verzonden",
									options: {
										variant: "warning",
									},
								});
							}

							return false;
						}}
					/>
				)}
			</Grid>
		</>
	);
};

const mapStateToProps = (state) => {
	const {
		notifications: { reply },
		general: { auth, sendingUpdate },
	} = state;

	return {
		reply,
		isAuthenticated: auth && auth.userObj !== undefined,
		sendingUpdate,
	};
};

export default connect(mapStateToProps, { queueUpdate, enqueueSnackbar })(
	UpdateSidebar
);
