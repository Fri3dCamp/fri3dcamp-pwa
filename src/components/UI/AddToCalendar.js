import { Button, Dialog, DialogTitle } from "@material-ui/core";
import AddToCalendarHOC, { SHARE_SITES } from "react-add-to-calendar-hoc";
import React from "react";

const MyModal = (props) => (
	<Dialog
		open={props.isOpen}
		onClose={props.onRequestClose}
		aria-labelledby="simple-dialog-title"
	>
		<DialogTitle id="simple-dialog-title">
			Aan kalender toevoegen
		</DialogTitle>
		<div style={{ padding: "5px" }}>{props.children}</div>
	</Dialog>
);

const AddToCalendarModal = AddToCalendarHOC(Button, MyModal);

export const AddToCalendar = ({ event }) => (
	<AddToCalendarModal
		buttonText="Toevoegen aan kalender"
		buttonProps={{ variant: "outlined", color: "primary" }}
		event={event}
		items={[SHARE_SITES.GOOGLE, SHARE_SITES.OUTLOOK, SHARE_SITES.ICAL]}
		linkProps={{
			className: "calendar-button",
		}}
	/>
);
