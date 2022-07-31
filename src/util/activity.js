import categories from "../config/categories";

export const getCategory = (catId) => {
	if (categories.hasOwnProperty(catId)) {
		return categories[catId];
	}

	return null;
};

export const isIntermission = (activity) =>
	activity.categories.indexOf(null) !== -1;

export const getCurrentDate = () => {
	return new Date();
};
