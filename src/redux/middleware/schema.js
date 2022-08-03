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

export const conferenceRoom = new schema.Entity(
	"rooms",
	{
		sessions: [conferenceSession],
	},
	{
		idAttribute: 'name',
	}
);

export const conferenceDay = new schema.Entity(
	"days",
	{
		rooms: [conferenceRoom],
	},
	{
		idAttribute: 'index',
		processStrategy: (obj, parent, key) => ({
			...obj,
			rooms: Object.entries(obj.rooms).map(([name, sessions]) => ({
				name,
				sessions: sessions.map((session) => ({...session, room: name})),
			})),
		})
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
			console.log(obj, parent, key);
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
	"schedule",
	{
		conference,
	},
	{
		mergeStrategy: (entityA, entityB) => {
			console.log('merge', entityA, entityB);
			return {
				...entityA,
				...entityB,
			};
		},
		idAttribute: 'id',
		processStrategy: (obj, parent, key) => {
			console.log('process', obj, parent, key);
			return { id: 'schedule', ...obj.schedule }
		}
	}
);
