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

async function getSchedule() {
	const context = await getContext();
	const user = getUser();

	if (!user) return { error: "not auth" };
	const dates = getDaysOfWeek();
	const { data: res } = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${dates[0]}&finishDate=${dates[6]}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
			transformResponse: [(data) => data],
		}
	);
	console.log(JSONbig.parse(res));
	return JSONbig.parse(res);
}

export {
	getContext,
	getImportant,
	getTodayAndTomorrowLessons,
	getLessonInfo,
	getSchedule,
};
