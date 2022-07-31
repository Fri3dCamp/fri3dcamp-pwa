import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function AlertDialog(props) {
	const { open, onClose, title } = props;

	return (
		<div>
			<Dialog
				open={open}
				onClose={() => onClose()}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{title && (
					<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
				)}

				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{props.children}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={this.handleClose}
						color="primary"
						autoFocus
					>
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default AlertDialog;
