import moment from "moment";

function getDaysOfWeek(date: any) {
	function dates(current: any) {
		let week: number[] = [];

		current.setDate(current.getDate() - current.getDay() + 1);
		for (var i = 0; i < 8; i++) {
			week.push(moment(current).unix());
			current.setDate(current.getDate() + 1);
		}
		return week;
	}
	return dates(date);
}

export { getDaysOfWeek };
