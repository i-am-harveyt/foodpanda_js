import sendReqMenu from "./sendReqMenu.js";
import { Cookie } from "./Cookie.js";
import { mkdirSync, writeFileSync } from "fs";
import extractData from "./extractData.js";
import { exit } from "process";

/**
 *
 * @param {Cookie} cookie
 * @param {string} shopUuid
 * @param {string} shopName
 * @param {number} latitude
 * @param {number} longitude
 */
export default async function getMenu(
	cookie,
	shopUuid,
	shopName,
	latitude,
	longitude
) {
	// delay
	await new Promise((resolve) =>
		setTimeout(resolve, 1_000 * 5 + Math.random() * 1_000)
	);

	if (Object.keys(cookie.cookies).length === 0) {
		let get = await fetch(
			`https://www.foodpanda.com.tw/restaurant/${shopUuid}/`
		);
		console.log(shopUuid, latitude, longitude, get.status);
		cookie.updateCookies(get.headers.getSetCookie().join("; "));
	}

	let now = new Date();

	// fetch logic
	let response = await sendReqMenu(cookie, shopUuid, latitude, longitude);
	console.log(shopUuid, latitude, longitude, response.status);
	cookie.updateCookies(response.headers.getSetCookie().join("; "));
	let jsonPath = `../../../panda_data_js/panda_menu/${
		now.getMonth() + 1
	}-${now.getDate()}/json/`;
	mkdirSync(jsonPath, { recursive: true });
	writeFileSync(
		`${jsonPath}/${shopUuid}.json`,
		JSON.stringify(await response.json())
	);

	// data conversion
	return extractData((await response.json()).data, now, latitude, longitude);
}
