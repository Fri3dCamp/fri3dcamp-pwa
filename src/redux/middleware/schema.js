import { schema } from "normalizr";
import { unEscape } from "../../util/content";
import moment from "moment/moment";
import { getEventDates } from "../../config/dates";

const getPeriod = (day, start, end) => {
	let startTime, endTime, dayDate;

	dayDate = getEventDates()[day];

	if (!dayDate) {
		return false;
	}

	if (!start) {
		startTime = moment(dayDate.start).toDate();
	} else {
		startTime = moment(
			moment(dayDate.start).format("YYYY-MM-DD") + " " + start,
			"YYYY-MM-DD HH:mm"
		).toDate();
	}

	if (!end) {
		endTime = moment(dayDate.end).toDate();
	} else {
		if (end === "0") {
			end = "23:59";
		}

		endTime = moment(
			moment(dayDate.start).format("YYYY-MM-DD") + " " + end,
			"YYYY-MM-DD HH:mm"
		).toDate();
	}

	return { start: startTime, end: endTime };
};

const getImages = (entity) => {
	let media =
		entity.embedded &&
		entity.embedded["wp:featuredmedia"] &&
		entity.embedded["wp:featuredmedia"][0];

	if (media) {
		return media.mediaDetails.sizes;
	}

	return null;
};

export const update = new schema.Entity(
	"updates",
	{},
	{
		idAttribute: (update) => update.id,
		processStrategy: (obj, parent, key) => {
			const {
				dateGmt,
				modifiedGmt,
				featuredMedia,
				links,
				template,
				embedded,
				...rest
			} = obj;

			return {
				...rest,
				date: moment(obj.date).toDate(),
				modified: moment(obj.modified).toDate(),
				title: unEscape(obj.title.rendered),
				content: obj.content.rendered,
				excerpt: unEscape(obj.excerpt.rendered),
				images: getImages(obj, embedded),
			};
		},
	}
);

export const category = new schema.Entity(
	"categories",
	{},
	{
		idAttribute: (category) => category.id,
	}
);

export const day = new schema.Entity(
	"days",
	{},
	{
		idAttribute: (day) => day.key,
	}
);

export const conferencePerson = new schema.Entity(
	"persons",
	{},
	{
		idAttribute: (person) => person.id,
	}
);

export const conferenceSession = new schema.Entity(
	"sessions",
	{
		persons: [conferencePerson],
	},
	{
		idAttribute: (room) => room.id,
	}
);

export const activityFromSession = new schema.Entity(
	"activities",
	{
		persons: [conferencePerson],
	},
	{
		idAttribute: (room) => room.id,
		processStrategy: (obj, parent, key) => {
			const {
				id,
				title,
				description,
				abstract,
				day,
				date,
				duration,
				room,
				persons,
				links,
				attachment,
				answers,
				logo,
				...rest
			} = obj;

			const startTime = moment(date);
			const sessionDuration = moment.duration(duration);
			const endTime = startTime.clone().add(sessionDuration);

			return {
				...rest,
				id,
				title: unEscape(title),
				content: description,
				excerpt: abstract,
				day,
				continuous: room === "Doorlopend programma",
				location: room.toLowerCase(),
				childFriendly: false,
				night: false,
				subtitle: "",
				persons,
				logo: logo && logo !== "" ? logo : "",
				period: { start: startTime.toDate(), end: endTime.toDate() },
				images: false,
			};
		}
	}
);

export const conferenceRoom = new schema.Entity(
	"locations",
	{
		activities: [activityFromSession],
	},
	{
		idAttribute: (room) => room.name.toLowerCase(),
	}
);

/**
 * vrijdag: {
 * 		key: "vrijdag",
 * 		label: "Vrijdag",
 * 		start: new Date("2022-08-12T11:00:00.000Z"),
 * 		end: new Date("2022-08-13T01:30:00.000Z"),
 * 	}
 * @type {schema.Entity}
 */
export const conferenceDay = new schema.Entity(
	"days",
	{
		rooms: [conferenceRoom],
	},
	{
		idAttribute: (day) => day.date,
		processStrategy: (obj, parent, key) => {
			return {
				key: obj.date,
				label: moment(obj.dayStart).format('dddd'),
				start: moment(obj.dayStart).toDate(),
				end: moment(obj.dayEnd).toDate(),
				rooms: Object.entries(obj.rooms).map(([name, sessions]) => ({
					name,
					activities: sessions.map((session) => ({...session, day: obj.date, room: name})),
				})),
			}
		},
	}
);

export const conference = new schema.Entity(
	"conference",
	{
		days: [conferenceDay],
	},
	{
		idAttribute: (conference) => conference.acronym.toLowerCase(),
		processStrategy: (obj, parent, key) => {
			return obj;
		}
	}
);

export const location = new schema.Entity(
	"locations",
	{},
	{
		idAttribute: (location) => location.name.toLowerCase(),
	}
);

const fixWeirdLocation = (obj, customFields) => {
	const lowerCaseTitle = obj.title.rendered.toLowerCase();

	if (lowerCaseTitle.indexOf("workshop") !== -1) {
		return "Workshops";
	}
	if (customFields.room === "Foodcourt") {
		return "Sound";
	}

	return customFields.room;
};

export const activity = new schema.Entity(
	"activities",
	{
		categories: [category],
		location: location,
		day: day,
	},
	{
		idAttribute: (activity) => activity.id,
		processStrategy: (obj, parent, key) => {
			const {
				date,
				modified,
				dateGmt,
				modifiedGmt,
				featuredMedia,
				links,
				template,
				embedded,
				customFields,
				...rest
			} = obj;

			let act = {
				...rest,
				title: unEscape(obj.title.rendered),
				content: obj.content.rendered,
				excerpt: unEscape(obj.excerpt.rendered),
				day: customFields.day || "zaterdag",
				continuous: !!customFields.continuous,
				location: { name: fixWeirdLocation(obj, customFields) },
				childFriendly: !!customFields.childfriendly,
				night: !!customFields.night,
				subtitle: customFields.subtitle || "",
				period: getPeriod(
					customFields.day || "zaterdag",
					!!customFields.continuous ? false : customFields.start,
					!!customFields.continuous ? false : customFields.end
				),
				images: getImages(obj, embedded),
			};

			return act;
		},
	}
);

export const schedule = new schema.Entity(
	"schedules",
	{
		conference: conference,
	},
	{
		mergeStrategy: (entityA, entityB) => {
			return {
				...entityA,
				...entityB,
			};
		},
		idAttribute: (schedule) => 'main',
		processStrategy: (obj, parent, key) => {
			return { id: 'main', ...obj.schedule }
		}
	}
);
