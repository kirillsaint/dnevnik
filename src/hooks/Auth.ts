import axios from "axios";
import Store from "store-js";
import moment from "moment";

interface UserData {
	accessToken: string;
	userId: number;
	personId: number;
	avatarUrl: string | null;
	firstName: string;
	middleName?: string;
	lastName: string;
	schoolName: string;
}

function setAuth(user: UserData) {
	Store.set(
		"auth-data",
		JSON.stringify({
			accessToken: user.accessToken,
			userId: user.userId,
			personId: user.personId,
			avatarUrl: user.avatarUrl,
			firstName: user.firstName,
			lastName: user.lastName,
			middleName: user.middleName,
			schoolName: user.schoolName,
		}),
		moment().add(300, "days")
	);
}

function getUser() {
	const data = Store.get("auth-data");

	if (!data) {
		return null;
	} else {
		let userData: UserData = JSON.parse(data);
		return userData;
	}
}

function logout() {
	Store.remove("auth-data");
}

async function getAuth() {
	const user = getUser();

	if (!user) {
		return false;
	}

	try {
		const { data: res } = await axios.get(
			`https://api.dnevnik.ru/mobile/v5/users/${user.userId}/context?`,
			{
				headers: {
					accessToken: user.accessToken,
				},
			}
		);

		if (res.type !== "Success") {
			logout();
			return false;
		}

		return true;
	} catch {
		logout();
		return false;
	}
}

async function login(login: string, password: string) {
	try {
		const { data: res } = await axios.post(
			"https://api.dnevnik.ru/v2/authorizations/bycredentials",
			{
				userName: login,
				password: password,
				scope:
					"CommonInfo,EducationalInfo,FriendsAndRelatives,SocialInfo,Files,Wall,Messages",
				client_id: "0925b3b0d1e84c05b85851e4f8a4033d",
				client_secret: "3771967e6bf140359ab60a8894106947",
			}
		);

		if (!res.accessToken) return { error: "bad login or pass" };

		const { data: user } = await axios.get(
			`https://api.dnevnik.ru/mobile/v5/users/${res.user}/context?`,
			{
				headers: {
					accessToken: res.accessToken,
				},
			}
		);

		if (user.type !== "Success") return { error: `${user.description}` };

		let userData: UserData = {
			accessToken: res.accessToken,
			userId: res.user,
			personId: user.contextPersons[0].personId,
			avatarUrl: user.info.avatarUrl,
			firstName: user.info.firstName,
			middleName: user.info.middleName,
			lastName: user.info.lastName,
			schoolName: user.contextPersons[0].school.name,
		};

		setAuth(userData);

		return { error: false };
	} catch (e) {
		return { error: `${e}` };
	}
}

async function updateAuth() {
	const user = getUser();
	if (!user) {
		logout();
		return { error: "not auth" };
	}
	const { data: res } = await axios.get(
		`https://api.dnevnik.ru/mobile/v5/users/${user.userId}/context?`,
		{
			headers: {
				accessToken: user.accessToken,
			},
		}
	);

	if (res.type !== "Success") {
		logout();
		return { error: `${res.description}` };
	}

	let userData: UserData = {
		accessToken: user.accessToken,
		userId: user.userId,
		personId: res.contextPersons[0].personId,
		avatarUrl: res.info.avatarUrl,
		firstName: res.info.firstName,
		middleName: res.info.middleName,
		lastName: res.info.lastName,
		schoolName: res.contextPersons[0].school.name,
	};

	setAuth(userData);

	return { error: false };
}

export type { UserData };
export { getAuth, getUser, setAuth, logout, login, updateAuth };
