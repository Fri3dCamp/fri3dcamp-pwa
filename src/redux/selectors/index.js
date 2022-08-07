import {createSelector} from "reselect";
//import locations from '../../config/locations';

export const getActivities = (state) => state.entities.activities || [];
const getActivityFilter = (state) => state.activityFilter.filter;
//const getCategories = state => state.entities.categories;

const getCurrentDate = (state) => state.general.currentDate;
const getLocations = (state) => state.entities.locations;
const getPersons = (state) => state.entities.persons;
const getDays = (state) => state.entities.days;
const getFavoriteActivityIds = (state) => state.favoriteActivities;

export const getActivityLoader = (state) =>
	state.entityloader.schedules || {
		initialFetch: true,
		isFetching: true,
		ids: [],
	};

export const getUpdateLoader = (state) =>
	state.entityloader.updates || {
		initialFetch: true,
		isFetching: true,
		ids: [],
	};

// Filters
const getFloorPlanFeatures = (state) => state.floorPlan.features;
export const getFloorPlanFilters = (state) => state.floorPlan.filters;

export const getLocationList = createSelector([getLocations], (locations) =>
	Object.keys(locations).map((locationId) => locations[locationId])
);

export const getDayList = createSelector([getDays], (days) =>
	Object.keys(days).map((dayId) => days[dayId])
);

export const getSortedActivities = createSelector(
	[getActivities, getActivityLoader],
	(activities, activityList) => {
//		if (!activityList || !activityList.ids) {
//			activityList = { ids: [] };
//		}

		activityList.ids = Object.keys(activities || {});


		return activityList.ids
			.map((id) => activities[id])
			.sort((firstActivity, secondActivity) => {
				if (firstActivity.continuous === secondActivity.continuous) {
					return (
						firstActivity.period.start - secondActivity.period.start
					);
				} else {
					return firstActivity.continuous - secondActivity.continuous;
				}
			});
	}
);

export const getPastActivities = createSelector(
	[getSortedActivities, getCurrentDate],
	(activities, currentDate) => {
		if (!Array.isArray(activities)) {
			activities = [];
		}

		return activities
			.filter((activity) => {
				return (
					!activity.continuous &&
					activity.period &&
					activity.period.end &&
					currentDate > activity.period.end
				);
			})
			.map((activity) => activity.id);
	}
);

export const getFilteredActivities = createSelector(
	[getSortedActivities, getActivityFilter, getPastActivities],
	(activities, filter, pastActivities) => {
		let conditions = {
			general: [],
			props: {},
		};

		if (filter.categories.length) {
			for (let i = 0; i < filter.categories.length; i++) {
				let category = filter.categories[i];
				conditions.props[category.property] = category.activeState;
			}
		}

		if (filter.locations.length) {
			conditions.general.push(
				({ location }) => filter.locations.indexOf(location) !== 1
			);
		}

		if (filter.search !== "") {
			conditions.general.push(
				({ title, location, excerpt }) =>
					title.toLowerCase().indexOf(filter.search) !== -1 ||
					location.toLowerCase().indexOf(filter.search) !== -1 ||
					excerpt.toLowerCase().indexOf(filter.search) !== -1
			);
		}

		if (filter.hidePastActivities) {
			conditions.general.push(({ id, continuous, period }) => {
				if (continuous) {
					return true;
				}

				return period && pastActivities.indexOf(id) === -1;
			});
		}

		console.log(filter, conditions, activities);
		return activities.filter(function (activity) {
			const propConditionsMet = Object.keys(this.props).every(
				(property) => activity[property] === this.props[property]
			);

			const generalConditionsMet =
				this.general.length === 0 ||
				this.general.every((condition) => condition(activity));

			return propConditionsMet && generalConditionsMet;
		}, conditions);
	}
);

export const getActivitiesByDays = createSelector(
	[getFilteredActivities, getDayList],
	(activities, days) => {
		console.log('ACTIVITIES BY DAYS', days, activities);

		return days.map((day) => ({
			...day,
			activities: activities.filter(
				(activity) => activity.day === day.key
			),
		}));
	}
);
export const getFavoriteActivities = createSelector(
	[getSortedActivities, getFavoriteActivityIds],
	(activities, ids) =>
		activities.filter((activity) => ids.indexOf(activity.id) !== -1)
);

export const getDayById = createSelector(
	[getDays],
	(days) => (day) => days[day]
);

export const getLocationByName = createSelector(
	[getLocations],
	(locations) => (location) => {
		return locations[location];
	}
);

export const getPersonById = createSelector(
	[getPersons],
	(persons) => (person) => persons[person]
);

export const getActivitiesByLocation = createSelector(
	[getSortedActivities, getLocationList],
	(activities, locations) =>
		locations.reduce((carry, location) => {
			const key = location.name.toLowerCase();
			carry[key] = activities.filter(
				(activity) =>
					activity.location ===
						(location.filter ? location.filter.value : key) &&
					!activity.isIntermission
			);
			return carry;
		}, {})
);

export const getUpcomingActivitiesByLocation = createSelector(
	[getActivitiesByLocation, getPastActivities],
	(activitiesByLocation, pastActivities) => {
		let location;

		for (location of Object.keys(activitiesByLocation)) {
			activitiesByLocation[location] = activitiesByLocation[
				location
			].filter((activity) => {
				return (
					!activity.continuous &&
					pastActivities.indexOf(activity.id) === -1
				);
			});
		}

		return activitiesByLocation;
	}
);

export const getMapFeaturesByType = createSelector(
	[getFloorPlanFeatures, getLocations],
	(mapFeatures, locations) => {
		const locationNames = Object.keys(locations);

		const byType = mapFeatures.reduce(
			(carry, mapFeature) => {
				let featureType = "general";
				if (mapFeature.type === "location") {
					const name = (mapFeature.name || "").toLowerCase();
					if (locationNames.indexOf(name) !== -1) {
						featureType = "location";
					} else {
						featureType = "activity";
					}
				}

				carry[featureType].push(mapFeature);
				return carry;
			},
			{
				location: [],
				activity: [],
				general: [],
			}
		);

		return byType;
	}
);

// Filters
export const getFilteredFeatures = createSelector(
	[getMapFeaturesByType, getFloorPlanFilters],
	(featuresByType, filters) => {
		let features = [];

		for (let featureType of filters) {
			if (featuresByType.hasOwnProperty(featureType)) {
				features = [...features, ...featuresByType[featureType]];
			}
		}

		return features;
	}
);

export const getLocationsByFeature = createSelector(
	[getLocations, getFilteredFeatures],
	(locations, features) => {
		const featureToLocationNameMap = {
			"main stage": "mainone",
		};

		return features.reduce((carry, feature) => {
			const fName = feature.name || "";
			const query = fName.toLowerCase();
			const locationSlug = featureToLocationNameMap.hasOwnProperty(query) ? featureToLocationNameMap[query] : query;
			const location = locations[locationSlug];

			if (location) {
				carry[query] = location;
			}

			return carry;
		}, {});
	}
);
