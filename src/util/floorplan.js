import rawFeatures from "../config/map-features";

export const getMapFeatures = () =>
	rawFeatures.features
		.map((rawFeature, index) => {
			try {
				if (rawFeature.geometry.type !== "Point") return null;
				if (rawFeature.properties.type === "shape") return null;

				return {
					name: rawFeature.properties.name,
					key: rawFeature.properties.name.toLowerCase() + index,
					type: rawFeature.properties.type,
					icon: rawFeature.properties.icon || "default",
					activityId: rawFeature.properties.Activity,
					coordinates: {
						longitude: rawFeature.geometry.coordinates[0],
						latitude: rawFeature.geometry.coordinates[1],
					},
				};
			} catch (error) {
				console.error(error);
				return null;
			}
		})
		.filter((feature) => {
			return !!feature !== false;
		});
