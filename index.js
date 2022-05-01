const axios = require("axios").default;
const querystring = require("querystring");

const url = "https://turnos.tresdefebrero.gov.ar/turnera/web/buscarTurnos";
const operationId = 37;

const getDates = () => {
	const days = Array(31).fill(null).map((_, i) => `${i + 1}`);
	const months = ["05", "06"];
	const year = "2022";

	const dates = [];

	months.forEach(month => {
		days.forEach(day => {
			dates.push(`${day}/${month}/${year}`);
		})
	});

	return dates;
}

const getAvailability = async () => {
	const availabilities = {};

	await Promise.all(getDates().map(async (date) => {
		availabilities[date] = (await axios.post(
			url,
			querystring.stringify({
				id: operationId,
				fecha: date,
			})
		)).data;
	}));

	return availabilities;
}

const getFreeDates = async () => {
	const availabilities = await getAvailability();
	const dates = [];

	Object.keys(availabilities).forEach((date) => {
		if (availabilities[date].length > 0) {
			dates.push(date);
		}
	});

	return dates;
}

(async () => {
	const freeDates = await getFreeDates();

	if (freeDates.length > 0) {
		console.log("Found available dates!");
		console.log(freeDates);
	} else {
		console.log("No available dates :(");
	}
})()
