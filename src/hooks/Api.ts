import axios from "axios";
import { getUser } from "./Auth";
import moment from "moment";

async function getContext() {
	const user = getUser();

	const { data: res } = await axios.get(
		`https://api.dnevnik.ru/mobile/v5/users/${user?.userId}/context?`,
		{
			headers: {
				accessToken: `${user?.accessToken}`,
			},
		}
	);

	return res;
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

	const groupId = BigInt(context.contextPersons[0].group.id) - BigInt(112);

	const { data: today } = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${groupId}/diary?startDate=${date}&finishDate=${tommorowDate}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
		}
	);

	const { data: tomorrow } = await axios.get(
		`https://api.dnevnik.ru/mobile/v3/persons/${user.personId}/schools/${context.contextPersons[0].school.id}/groups/${groupId}/diary?startDate=${tommorowDate}&finishDate=${afterTommorowDate}`,
		{
			headers: {
				accessToken: user.accessToken,
			},
		}
	);

	return { today: today.days, tomorrow: tomorrow.days };
}

async function getLessonInfo(lessonId: number) {
	const context = await getContext();
	const user = getUser();

	if (!user) return { error: "not auth" };

	const groupId = BigInt(context.contextPersons[0].group.id) - BigInt(112);

	const { data: res } = await axios.get(
		`https://api.dnevnik.ru/mobile/v6/persons/${user.personId}/groups/${groupId}/lessons/${lessonId}/lessonDetails?`,
		{
			headers: {
				accessToken: user.accessToken,
			},
		}
	);

	return res;
}

async function getImportant() {
	// let date: any = moment().format("YYYY-MM-DD 00:00:00");
	// date = moment(date).unix();
	// let tommorowDate: any = moment().add(1, "days").format("YYYY-MM-DD 00:00:00");
	// tommorowDate = moment(tommorowDate).unix();
	const context = await getContext();
	const user = getUser();

	if (!user) return { error: "not auth" };

	const groupId = BigInt(context.contextPersons[0].group.id) - BigInt(112);

	const { data: res } = await axios.get(
		`https://api.dnevnik.ru/mobile/v6/persons/${user.personId}/groups/${groupId}/important?`,
		{
			headers: {
				accessToken: user.accessToken,
			},
		}
	);

	return res;
}

export { getContext, getImportant, getTodayAndTomorrowLessons, getLessonInfo };
