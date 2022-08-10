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


/** Pretalx API **/
const normalizeTranslation = ( object ) => {
	if(typeof object === 'string') {
		return object;
	}

	const { en, nl } = object;
	return nl || en || 'N/A';
}

/**
 * {
 *       "code": "ABCDE",
 *       "name": "Jane",
 *       "biography": "A good speaker",
 *       "submissions": ["DEFAB"],
 *       "avatar": "https://example.org/media/avatar.png",
 *       "availabilities": [
 *         {
 *           "id": 1,
 *           "start": "2019-07-24T04:00:00Z",
 *           "end": "2019-07-25T04:00:00Z",
 *           "allDay": false
 *         }
 *       ]
 *     }
 * @type {schema.Entity}
 */
export const speaker = new schema.Entity(
	"speakers",
	{},
	{
		idAttribute: 'code',
		processStrategy: (obj, parent, key) => {
			const {
				code,
				name,
				biography,
				avatar,
			} = obj;

			return {
				code,
				name,
				biography: normalizeTranslation(biography),
				avatar,
			};
		},
	}
);

/**
 * {
 *       "id": 23,
 *       "name": "R101",
 *       "description": "Next to the entrance",
 *       "capacity": 50,
 *       "position": 10
 *     }
 * @type {schema.Entity}
 */
export const room = new schema.Entity(
	"rooms",
	{},
	{
		idAttribute: 'id',
		processStrategy: (obj, parent, key) => {
			const {
				id,
				name,
				description,
				capacity,
				position,
			} = obj;

			return {
				id,
				name: normalizeTranslation(name),
				description: normalizeTranslation(description),
				capacity,
				position,
			};
		},
	}
);

/**
 * {
 *           "id": 1,
 *           "variant": "number",
 *           "question": "How much do you like green, on a scale from 1-10?",
 *           "question_required": "none",
 *           "deadline": null,
 *           "required": false,
 *           "read_only": false,
 *           "freeze_after": "2021-06-22T12:44:42Z",
 *           "target": "submission",
 *           "options": [],
 *           "help_text": null,
 *           "tracks": [],
 *           "submission_types": [],
 *           "default_answer": null,
 *           "contains_personal_data": false,
 *           "min_length": null,
 *           "max_length": null,
 *           "is_public": false,
 *           "is_visible_to_reviewers": true
 *       }
 * @type {schema.Entity}
 */
export const question = new schema.Entity(
	"questions",
	{},
	{
		idAttribute: 'id',
		processStrategy: (obj, parent, key) => {
			const {
				id,
				variant,
				options = [],
				helpText,
				question,
				isPublic,
			} = obj;

			return {
				id,
				variant,
				helpText: normalizeTranslation(helpText),
				question: normalizeTranslation(question),
				options: options.map(({ id, answer = '' }) => ({ id, answer: normalizeTranslation(answer) })),
				isPublic,
			};
		},
	}
);

/**
 * {
 *       "tag": "science",
 *       "description": {"en": "Scientific sessions"},
 *       "color": "#00ff00",
 *     }
 * @type {schema.Entity}
 */
export const tag = new schema.Entity(
	"tags",
	{},
	{
		idAttribute: 'tag',
		processStrategy: (obj, parent, key) => {
			const {
				tag,
				description,
				color,
			} = obj;

			return {
				tag,
				description: normalizeTranslation(description),
				color,
			};
		},
	}
);

const normalizeAnswer = ( answer ) => {
	switch(answer) {
		case 'True':
			return true;
		case 'False':
			return false;
		default:
			return answer;
	}
}

/**
 * {
 *       "id": 106,
 *       "question": {
 *         "id": 1,
 *         "question": {
 *           "en": "What infrastrcture would you need for your submission?",
 *           "nl": "Welke infrastructuur heb je nodig voor je inzending?"
 *         }
 *       },
 *       "answer": "Tables & chairs, Creative material, Outdoor space",
 *       "answer_file": null,
 *       "submission": "JPCNFQ",
 *       "review": null,
 *       "person": null,
 *       "options": [
 *         {
 *           "id": 2,
 *           "answer": {
 *             "en": "Tables & chairs",
 *             "nl": "Tafels & stoelen"
 *           }
 *         },
 *       ]
 *     }
 * @type {schema.Entity}
 */
export const answer = new schema.Entity(
	"answers",
	{
		question: question,
	},
	{
		idAttribute: 'id',
		processStrategy: (obj, parent, key) => {
			const {
				id,
				question,
				answer,
			} = obj;

			return {
				id,
				question,
				answer: normalizeAnswer(answer),
			};
		},
	}
);

const getDay = ( slot ) => {
	return '2022-08-11';
}
const getPeriodFromSlot = ({ start, end } ) => {
	return { start: moment(start).toDate(), end: moment(end).toDate() };
}

/**
 * {
 *             "code": "ZQ8QV8",
 *             "speakers": [
 *                 {
 *                     "code": "798JH3",
 *                     "name": "Coderdojo Belgium",
 *                     "biography": "CoderDojo  organiseert gratis programmeerclubs, de zogenaamde \"Dojo's\". Op die Dojo's leren meisjes en jongens programmeren, websites maken, apps en spelletjes ontwikkelen enzovoort. Ze ontmoeten gelijkgestemde deelnemers en laten elkaar zien waaraan ze gewerkt hebben. CoderDojo maakt van ontwikkelen en programmeren een superleuke, keigezellige en megatoffe leerervaring.",
 *                     "avatar": "https://pretalx.fri3d.be/media/avatars/CoderDojo_Logo_iJoZXTW.png"
 *                 }
 *             ],
 *             "title": "CoderDojo @ Fri3d Camp - Microbit programmeren",
 *             "submission_type": {
 *                 "en": "Workshop",
 *                 "nl": "Workshop"
 *             },
 *             "track": null,
 *             "state": "confirmed",
 *             "abstract": "Een microbit is een mini computertje dat jij kan programmeren. Het heeft twee knopjes en een scherm van 5x5 ledjes. \r\nMaar het kan veel meer dan je denkt: het kan de temperatuur meten, het weet waar het noorden ligt, het voelt als je ermee schudt, het kantelt of laat vallen en het kan babbelen met andere microbits!",
 *             "description": "CoderDojo vzw is een verzameling enthousiaste vrijwillige coaches die -meestal op zaterdag- workshops organiseren waarin we elkaar leren programmeren, en op het einde laten zien waaraan we werken. In deze unieke workshop gaan we samen aan de slag met de Fri3d batch. \r\n\r\nWelkom vanaf 10j. Hangouders ook welkom, zolang ze zich kunnen bedwingen om het toetsenbord niet in beslag te nemen. Wie een eigen laptop meebrengt, kan hun werkje makkelijker naar huis brengen.\r\n\r\nHeb je al eens microbits geprogrammeerd? Wij hebben een boel leuke uitbreidingen voor de microbits, zoals robots en neopixels. Deze maken microbits programmeren tot een heel nieuwe uitdaging.",
 *             "duration": 120,
 *             "slot_count": 1,
 *             "do_not_record": false,
 *             "is_featured": false,
 *             "content_locale": "nl",
 *             "slot": {
 *                 "room": {
 *                     "en": "Large LED",
 *                     "nl": "Large LED"
 *                 },
 *                 "start": "2022-08-12T15:00:00+02:00",
 *                 "end": "2022-08-12T17:00:00+02:00"
 *             },
 *             "image": null,
 *             "resources": [],
 *             "created": "2021-11-10T22:39:48.640088+01:00",
 *             "answers": [
 *                 {
 *                     "id": 112,
 *                     "question": {
 *                         "id": 2,
 *                         "question": {
 *                             "en": "Tick this box in case your activity requires adult supervision",
 *                             "nl": "Vink dit aan als je activiteit begeleiding van volwassenen vereist"
 *                         }
 *                     },
 *                     "answer": "False",
 *                     "answer_file": null,
 *                     "submission": "ZQ8QV8",
 *                     "review": null,
 *                     "person": null,
 *                     "options": []
 *                 },
 *             ],
 *             "notes": null,
 *             "internal_notes": "",
 *             "tags": [
 *                 "Teen hackers",
 *                 "Voorkennis/materiaal nodig"
 *             ]
 *         }
 * @type {schema.Entity}
 */
export const talk = new schema.Entity(
	"talks",
	{
		speakers: [speaker],
		answers: [answer],
		tags: [tag],
	},
	{
		idAttribute: 'code',
		processStrategy: (obj, parent, key) => {
			const {
				code,
				slot = { start: null, end: null, room: 'NO_ROOM' },
				submissionType,
				description,
				abstract,
				image,
			} = obj;

			return {
				code,
				id: code,
				slot,
				room: slot.room,
				location: slot.room.toLowerCase(),
				type: normalizeTranslation(submissionType),
				content: description,
				excerpt: abstract,
				day: getDay(slot),
				continuous: false,
				childFriendly: false,
				night: false,
				logo: image,
				period: getPeriodFromSlot(slot),
			};
		},
	}
);
