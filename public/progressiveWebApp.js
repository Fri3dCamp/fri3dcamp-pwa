function messageToClient(client, data) {
	return new Promise(function (resolve, reject) {
		const channel = new MessageChannel();

		channel.port1.onmessage = function (event) {
			if (event.data.error) {
				reject(event.data.error);
			} else {
				resolve(event.data);
			}
		};

		client.postMessage(JSON.stringify(data), [channel.port2]);
	});
}

self.addEventListener("push", function (event) {
	if (event && event.data) {
		self.pushData = event.data.json();
		if (self.pushData) {
			let options = {
				title: self.pushData.title,
				body: self.pushData.body,
				data: self.pushData.data,
			};

			if (self.pushData.data.icon) {
				options.icon = self.pushData.data.icon;
			}

			if (self.pushData.data.image && self.pushData.data.show_image) {
				options.image = self.pushData.data.image;
			}

			if (self.pushData.data.actions) {
				options.actions = self.pushData.data.actions;
			}

			event.waitUntil(
				self.registration
					.showNotification(options.title, options)
					.then(function () {
						clients
							.matchAll({ type: "window" })
							.then(function (clientList) {
								if (clientList.length > 0) {
									messageToClient(clientList[0], {
										data: options,
									});
								}
							});
					})
			);
		}
	}
});

self.addEventListener("notificationclick", function (e) {
	var notification = e.notification;
	var url = notification.data.url;
	var action = e.action;

	if (action && action === "close") {
		notification.close();
	} else {
		notification.close();
		clients.openWindow(url);
	}
});

workbox.routing.registerRoute(
	new RegExp(
		"^(https://www.soundofscience.test|https://sos.siteoptimo.be|https://soundofscience.be)/(wp-json|wp-admin/admin-ajax.php)"
	),
	new workbox.strategies.StaleWhileRevalidate({
		plugins: [
			new workbox.broadcastUpdate.Plugin({
				channelName: "api-updates",
				headersToCheck: ["content-length"],
			}),
		],
	})
);

workbox.googleAnalytics.initialize();
