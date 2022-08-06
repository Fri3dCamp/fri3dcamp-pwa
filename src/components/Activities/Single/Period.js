import moment from "moment";
import { capitalize } from "lodash";

export default ({ activity, showDay = true }) => {
	if (!activity) {
		return null;
	}

	if (activity.continuous) {
		return "Doorlopend";
	}

	let returnValue = "";

	if (showDay) {
		returnValue += capitalize(activity.day.substr(0, 2)) + " ";
	}

	returnValue +=
		moment(activity.period.start).format("HH:mm") +
		" - " +
		moment(activity.period.end).format("HH:mm");

	return returnValue;
};
