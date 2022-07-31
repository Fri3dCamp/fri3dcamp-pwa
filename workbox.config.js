module.exports = (options) => {
	options.skipWaiting = true;
	options.clientsClaim = true;
	//options.include = [/\.svg$/, /\.png$/, /\.css$/, /\.js$/];

	options.runtimeCaching = [
		/*{
			urlPattern: new RegExp(
				"^https://([^.]+).wp.com/soundofscience.be/assets/"
			),
			handler: "CacheFirst",
			options: {
				cacheableResponse: {
					statuses: [0, 200],
				},
			},
		},
		{
			urlPattern: new RegExp("^https://soundofscience.be/assets/"),
			handler: "CacheFirst",
			options: {
				cacheableResponse: {
					statuses: [0, 200],
				},
			},
		},*/
		{
			urlPattern: new RegExp("^https://api.mapbox.com/"),
			handler: "CacheFirst",
			options: {
				cacheableResponse: {
					statuses: [0, 200],
				},
			},
		},
	];

	options.importScripts = options.importScripts || [];
	options.importScripts.push("/progressiveWebApp.js");

	return options;
};
