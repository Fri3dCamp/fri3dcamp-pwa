import locations from "../config/locations";

export const getLocationIcon = (requestedLocation) => {
	requestedLocation = requestedLocation.toLowerCase();
	const foundLocation = locations.find((location) => {
		if (location.name.toLowerCase() === requestedLocation) {
			return true;
		}

		if (location.aliases.indexOf(requestedLocation) !== -1) {
			return true;
		}

		return false;
	});

	if (foundLocation && foundLocation.icon) {
		return foundLocation.icon;
	}
};

export const getLocations = () => {
	return locations;
};

export const getLocation = (name) => {
	name = name.toLowerCase();

	return getLocations().find(
		(location) => name === location.name.toLowerCase()
	);
};
