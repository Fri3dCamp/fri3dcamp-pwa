import moment from "moment";
import { capitalize } from "lodash";

export default ({ activity, day, showDay = true }) => {
	if (!activity) {
		return null;
	}

	if (activity.continuous) {
		return "Doorlopend";
	}

	let returnValue = "";

	if (showDay) {
		const dayName = day && day.label || activity.day;
		returnValue += capitalize(dayName.substr(0, 2)) + " ";
	}

	returnValue +=
		moment(activity.period.start).format("HH:mm") +
		" - " +
		moment(activity.period.end).format("HH:mm");

	return returnValue;
};
