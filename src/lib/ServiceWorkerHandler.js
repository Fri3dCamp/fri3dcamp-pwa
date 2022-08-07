import React from "react";
import { useSnackbar } from "notistack";
import { Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import * as serviceWorker from "../serviceWorker";

let installPromptTimeout;
let deferredPrompt;

const ServiceWorkerHandler = ({ onNewContent }) => {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const action = () => (
		<>
			<Button
				color="secondary"
				onClick={() => {
					window.location.reload(true);
				}}
			>
				{"Herladen"}
			</Button>
		</>
	);

	// add multiple actions to one snackbar
	const addToHsActions = (key) => (
		<>
			<Button
				key="ok"
				color="secondary"
				size="small"
				onClick={() => {
					installPrompt();
					closeSnackbar(key);
				}}
			>
				OK
			</Button>
			<IconButton
				key="close"
				size="small"
				aria-label="Close"
				color="inherit"
				style={{ padding: "8px" }}
				onClick={() => closeSnackbar(key)}
			>
				<CloseIcon />
			</IconButton>
		</>
	);

	const deferInstallation = (e) => {
		// Prevent Chrome 67 and earlier from automatically showing the prompt
		e.preventDefault();
		// Stash the event so it can be triggered later.
		deferredPrompt = e;

		window.clearTimeout(installPromptTimeout);
		installPromptTimeout = window.setTimeout(() => {
			enqueueSnackbar("Toevoegen aan startscherm?", {
				action: addToHsActions,
			});
		}, 5000);
	};

	const installPrompt = () => {
		// Show the prompt
		deferredPrompt.prompt();
		// Wait for the user to respond to the prompt
		deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === "accepted") {
				//console.log('User accepted the A2HS prompt');
			} else {
				//console.log('User dismissed the A2HS prompt');
			}
			deferredPrompt = null;
		});
	};

	serviceWorker.register({
		onUpdate: (registration) => {
			enqueueSnackbar("Update beschikbaar", { action });

			if(registration && registration.waiting) {
				registration.waiting.postMessage({ type: "SKIP_WAITING" });
			}
		},
		onSuccess: () => {
			enqueueSnackbar("App is nu offline beschikbaar!");
		},
		onNewContent: (data) => {
			if (typeof onNewContent === "function") {
				onNewContent(data);
			}
		},
	});

	window.removeEventListener("beforeinstallprompt", deferInstallation);
	window.addEventListener("beforeinstallprompt", deferInstallation);

	return null;
};

export default ServiceWorkerHandler;
