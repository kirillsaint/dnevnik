import Store from "store-js";
import moment from "moment";

export type SettingsType = {
	replaceBadMarks: boolean;
	showName: boolean;
	showSchool: boolean;
};

function getSettings() {
	const data = Store.get("settings");
	let settings: SettingsType = {
		replaceBadMarks: false,
		showName: true,
		showSchool: true,
	};
	if (!data) {
		Store.set(
			"settings",
			JSON.stringify({
				replaceBadMarks: false,
				showName: true,
				showSchool: true,
			}),
			moment().add(300, "days")
		);
		return settings;
	}

	settings = JSON.parse(data);

	return settings;
}

function updateSettings(
	param: "replaceBadMarks" | "showName" | "showSchool",
	value: any
) {
	let newSettings = getSettings();
	switch (param) {
		case "replaceBadMarks":
			newSettings.replaceBadMarks = value;
			break;
		case "showName":
			newSettings.showName = value;
			break;
		case "showSchool":
			newSettings.showSchool = value;
			break;
	}

	Store.set("settings", JSON.stringify(newSettings), moment().add(300, "days"));

	return newSettings;
}

export { getSettings, updateSettings };
