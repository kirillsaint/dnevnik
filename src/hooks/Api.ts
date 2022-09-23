import axios from "axios";
import { getUser } from "./Auth";
import moment from "moment";
import JSONbig from "json-bigint";

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

async function getScheduleWeek(dates: any) {
	const context = await getContext();
	const user = getUser();

	if (!user) return { error: "not auth" };
	let schedule: any = [];
	let resText = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${dates[0]}&finishDate=${dates[1]}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
			transformResponse: [(data) => data],
		}
	);
	let res: any = null;
	res = JSONbig.parse(resText.data);
	if (res.days.length !== 0) {
		schedule.push(res.days[0]);
	} else {
		schedule.push(null);
	}

	resText = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${dates[1]}&finishDate=${dates[2]}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
			transformResponse: [(data) => data],
		}
	);
	res = JSONbig.parse(resText.data);
	if (res.days.length !== 0) {
		schedule.push(res.days[0]);
	} else {
		schedule.push(null);
	}

	resText = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${dates[2]}&finishDate=${dates[3]}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
			transformResponse: [(data) => data],
		}
	);
	res = JSONbig.parse(resText.data);
	if (res.days.length !== 0) {
		schedule.push(res.days[0]);
	} else {
		schedule.push(null);
	}

	resText = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${dates[3]}&finishDate=${dates[4]}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
			transformResponse: [(data) => data],
		}
	);
	res = JSONbig.parse(resText.data);
	if (res.days.length !== 0) {
		schedule.push(res.days[0]);
	} else {
		schedule.push(null);
	}

	resText = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${dates[4]}&finishDate=${dates[5]}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
			transformResponse: [(data) => data],
		}
	);

	res = JSONbig.parse(resText.data);
	if (res.days.length !== 0) {
		schedule.push(res.days[0]);
	} else {
		schedule.push(null);
	}

	resText = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${dates[5]}&finishDate=${dates[6]}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
			transformResponse: [(data) => data],
		}
	);
	res = JSONbig.parse(resText.data);
	if (res.days.length !== 0) {
		schedule.push(res.days[0]);
	} else {
		schedule.push(null);
	}

	resText = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${context.contextPersons[0].group.id}/diary?startDate=${dates[6]}&finishDate=${dates[7]}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
			transformResponse: [(data) => data],
		}
	);
	res = JSONbig.parse(resText.data);
	if (res.days.length !== 0) {
		schedule.push(res.days[0]);
	} else {
		schedule.push(null);
	}

	return schedule;
}

async function getMainContent() {
	const context = await getContext();
	const user = getUser();
	if (!user) return { error: "not auth" };
	let important: any = null;
	important = await axios.get(
		`https://api.dnevnik.ru/mobile/v6/persons/${user.personId}/groups/${context.contextPersons[0].group.id}/important?`,
		{
			headers: { accessToken: user.accessToken },
			transformResponse: [(data) => data],
		}
	);
	important = JSONbig.parse(important.data);

	let news: any = null;
	let todayLessons: any = null;
	let tomorrowLessons: any = null;
	let recentMarks: any = null;

	try {
		news = important.feed;
	} catch {
		throw new Error("Произошла ошибка при получении новостей");
	}
	try {
		let marks: any = [];
		if (important.recentMarks !== null) {
			for (const mark of important.recentMarks) {
				let { data: lesson } = await axios.get(
					`https://api.dnevnik.ru/mobile/v6/persons/${user.personId}/groups/${context.contextPersons[0].group.id}/lessons/${mark.lesson.id}/lessonDetails?`,
					{
						headers: {
							accessToken: user.accessToken,
						},
					}
				);

				marks.push({
					lesson: {
						date: mark.lesson.date,
						id: mark.lesson.id,
						name: lesson.subject.name,
					},
					marks: mark.marks,
				});
			}
		}
		recentMarks = marks;
	} catch (e) {
		throw new Error("Произошла ошибка при получении недавних оценок");
	}

	try {
		let date: any = moment().format("YYYY-MM-DD 00:00:00");
		date = moment(date).unix();
		let tommorowDate: any = moment()
			.add(1, "days")
			.format("YYYY-MM-DD 00:00:00");
		tommorowDate = moment(tommorowDate).unix();
		let afterTommorowDate: any = moment()
			.add(2, "days")
			.format("YYYY-MM-DD 00:00:00");
		afterTommorowDate = moment(afterTommorowDate).unix();

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

		todayLessons = JSONbig.parse(today).days;
		if (todayLessons.length !== 0) {
			todayLessons = todayLessons[0].lessons;
		}

		tomorrowLessons = JSONbig.parse(tomorrow).days;
		if (tomorrowLessons.length !== 0) {
			tomorrowLessons = tomorrowLessons[0].lessons;
		}
	} catch (e) {
		console.log(e);
		throw new Error("Произошла ошибка");
	}

	return {
		news: news,
		recentMarks: recentMarks,
		todayLessons: todayLessons,
		tomorrowLessons: tomorrowLessons,
	};
}

export {
	getContext,
	getImportant,
	getTodayAndTomorrowLessons,
	getLessonInfo,
	getScheduleWeek,
	getMainContent,
};
