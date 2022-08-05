const convertPerson = ({
						   id,
						   code,
						   public_name: publicName,
						   biography,
					   }) => {
	return {
		id,
		code,
		publicName,
		biography,
	}
};

const convertSession = ({
							id,
							guid,
							logo,
							date,
							start,
							duration,
							room,
							slug,
							title,
							subtitle,
							type,
							language,
							abstract,
							description,
							persons,
						}) => {
	return {
		id,
		guid,
		logo,
		date: new Date(date),
		start,
		duration,
		room,
		slug,
		title,
		subtitle,
		type,
		language,
		abstract,
		description,
		persons: persons.map(convertPerson),
	}
};

const convertDay = ({
						index,
						date,
						day_start: dayStart,
						day_end: dayEnd,
						rooms,
					}) => {
	return {
		index,
		date,
		dayStart: new Date(dayStart),
		dayEnd: new Date(dayEnd),
		rooms: Object.fromEntries(Object.entries(rooms).map(
			([key, sessions = []]) => {
				return [key, sessions.map(convertSession)]
			}
		)),
	}
};

const convertConference = ({
							   acronym,
							   title,
							   start,
							   end,
							   daysCount,
							   timeslot_duration: timeslotDuration,
							   days,
						   }) => {
	return {
		acronym,
		title,
		start,
		end,
		daysCount,
		timeslotDuration,
		days: days.map(convertDay),
	}
};

const convertSchedule = ({
							 version,
							 base_url: baseUrl,
							 conference
						 }) => {
	return {
		version,
		baseUrl,
		conference: convertConference(conference)
	}
};
