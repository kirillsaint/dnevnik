import moment from "moment";

function getDaysOfWeek() {
	function dates(current) {
		let week: number[] = [];

		current.setDate(current.getDate() - current.getDay() + 1);
		for (var i = 0; i < 7; i++) {
			week.push(moment(current).unix());
			current.setDate(current.getDate() + 1);
		}
		return week;
	}
	return dates(new Date(moment().year(), moment().month(), moment().date()));
}

export { getDaysOfWeek };
