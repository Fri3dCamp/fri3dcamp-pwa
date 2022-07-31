import { urlBase64ToUint8Array } from "../util/binary";

export const getServerKey = async () => {
	try {
		const url = process.env.REACT_APP_AJAX_LOCATION;

		let response = await fetch(`${url}?action=get_key`);
		let responseJson = await response.json();

		return responseJson.serverKey;
	} catch (error) {
		console.error(error);
		throw new Error("Kon server key niet vinden.");
	}
};

export const pushSubscription = async (subscription) => {
	const url = process.env.REACT_APP_AJAX_LOCATION;

	const key = subscription.getKey("p256dh");
	const token = subscription.getKey("auth");
	const contentEncoding = (PushManager.supportedContentEncodings || [
		"aesgcm",
	])[0];

	const requestData = {
		payload: {
			endpoint: subscription.endpoint,
			publicKey: key
				? btoa(String.fromCharCode.apply(null, new Uint8Array(key)))
				: null,
			authToken: token
				? btoa(String.fromCharCode.apply(null, new Uint8Array(token)))
				: null,
			contentEncoding,
		},
	};

	try {
		const response = await fetch(`${url}?action=subscribe`, {
			method: "POST",
			mode: "no-cors",
			cache: "no-cache",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestData),
		});

		return response.status === 201;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const requestPermission = async () => {
	if (Notification.permission === "granted") {
		return true;
	}

	if (Notification.permission === "denied") {
		return false;
	}

	// Ask for permission.
	const result = await Notification.requestPermission();

	return result === "granted";
};

export const hasActiveSubscription = async () => {
	const serviceWorkerRegistration = await navigator.serviceWorker.ready;

	const subscription =
		await serviceWorkerRegistration.pushManager.getSubscription();

	return subscription !== null;
};

export const subscribeForNotifications = async () => {
	try {
		const hasPermissions = await requestPermission();

		if (!hasPermissions) {
			return false;
		}

		const serverKey = await this.getServerKey();
		const serviceWorkerRegistration = await navigator.serviceWorker.ready;

		const subscription =
			await serviceWorkerRegistration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(serverKey),
			});

		return await pushSubscription(subscription);
	} catch (error) {
		console.error(error);
		throw new Error(
			"Kon meldingen niet activeren. Probeer het later nog eens."
		);
	}
};

export const getIncompatibilities = () => {
	let warnings = [];

	if (
		typeof Promise === "undefined" ||
		Promise.toString().indexOf("[native code]") === -1
	) {
		warnings.push("Promises are not supported by this browser.");
	}

	if (!("serviceWorker" in navigator)) {
		warnings.push("Service workers are not supported by this browser.");
	}

	if (!("PushManager" in window)) {
		warnings.push("Push notifications are not supported by this browser");
	}

	if (!("showNotification" in ServiceWorkerRegistration.prototype)) {
		warnings.push("Notifications are not supported by this browser");
	}

	return warnings;
};
