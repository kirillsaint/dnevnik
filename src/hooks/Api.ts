import axios from "axios";
import { getUser } from "./Auth";
import moment from "moment";
import JSONbig from "json-bigint";
import { getDaysOfWeek } from "./Helpers";

async function getContext() {
	const user = getUser();

	const res = await axios.get(
		`https://api.dnevnik.ru/mobile/v5/users/${user?.userId}/context?`,
		{
			headers: {
				accessToken: `${user?.accessToken}`,
			},
			transformResponse: [(data) => data],
		}
	);

	return JSONbig.parse(res.data);
}

async function getTodayAndTomorrowLessons() {
	let date: any = moment().format("YYYY-MM-DD 00:00:00");
	date = moment(date).unix();
	let tommorowDate: any = moment().add(1, "days").format("YYYY-MM-DD 00:00:00");
	tommorowDate = moment(tommorowDate).unix();
	let afterTommorowDate: any = moment()
		.add(2, "days")
		.format("YYYY-MM-DD 00:00:00");
	afterTommorowDate = moment(afterTommorowDate).unix();
	const context = await getContext();
	const user = getUser();

	if (!user) return { error: "not auth" };

	const { data: today } = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${date}&finishDate=${tommorowDate}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
			transformResponse: [(data) => data],
		}
	);

	const { data: tomorrow } = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${tommorowDate}&finishDate=${afterTommorowDate}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
			transformResponse: [(data) => data],
		}
	);

	return {
		today: JSONbig.parse(today).days,
		tomorrow: JSONbig.parse(tomorrow).days,
	};
}

async function getLessonInfo(lessonId: any) {
	const context = await getContext();
	const user = getUser();

	if (!user) return { error: "not auth" };

	const { data: res } = await axios.get(
		`https://api.dnevnik.ru/mobile/v6/persons/${user.personId}/groups/${context.contextPersons[0].group.id}/lessons/${lessonId}/lessonDetails?`,
		{
			headers: {
				accessToken: user.accessToken,
			},
		}
	);

	return res;
}

async function getImportant() {
	const context = await getContext();
	const user = getUser();

	if (!user) return { error: "not auth" };

	const { data: res } = await axios.get(
		`https://api.dnevnik.ru/mobile/v6/persons/${user.personId}/groups/${context.contextPersons[0].group.id}/important?`,
		{
			headers: {
				accessToken: user.accessToken,
			},
			transformResponse: [(data) => data],
		}
	);

	return JSONbig.parse(res);
}

async function getScheduleCurrentWeek() {
	const context = await getContext();
	const user = getUser();

	if (!user) return { error: "not auth" };
	const dates = getDaysOfWeek();
	let schedule: any = [];
	let res = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${dates[0]}&finishDate=${dates[1]}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
		}
	);
	if (res.data.days.length !== 0) {
		schedule.push(res.data.days[0]);
	} else {
		schedule.push(null);
	}

	res = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${dates[1]}&finishDate=${dates[2]}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
		}
	);
	if (res.data.days.length !== 0) {
		schedule.push(res.data.days[0]);
	} else {
		schedule.push(null);
	}

	res = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${dates[2]}&finishDate=${dates[3]}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
		}
	);
	if (res.data.days.length !== 0) {
		schedule.push(res.data.days[0]);
	} else {
		schedule.push(null);
	}

	res = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${dates[3]}&finishDate=${dates[4]}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
		}
	);
	if (res.data.days.length !== 0) {
		schedule.push(res.data.days[0]);
	} else {
		schedule.push(null);
	}

	res = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${dates[4]}&finishDate=${dates[5]}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
		}
	);
	if (res.data.days.length !== 0) {
		schedule.push(res.data.days[0]);
	} else {
		schedule.push(null);
	}

	res = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${dates[5]}&finishDate=${dates[6]}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
		}
	);
	if (res.data.days.length !== 0) {
		schedule.push(res.data.days[0]);
	} else {
		schedule.push(null);
	}

	res = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${dates[6]}&finishDate=${dates[7]}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
		}
	);
	if (res.data.days.length !== 0) {
		schedule.push(res.data.days[0]);
	} else {
		schedule.push(null);
	}

	return schedule;
}

export {
	getContext,
	getImportant,
	getTodayAndTomorrowLessons,
	getLessonInfo,
	getScheduleCurrentWeek,
};
