import getMenu from "./getMenu.js";
import { Cookie } from "./Cookie.js";
import { mkdirSync, readdirSync } from "fs";
import { readCSV } from "danfojs-node";
import { DataFrame } from "danfojs-node";

const DEBUG_MODE = false;

async function main() {
	const date = new Date();

	let TODAY = `${date.getFullYear()}`;
	if (date.getMonth() + 1 < 10) TODAY += `-0${date.getMonth() + 1}`;
	else TODAY += `-${date.getMonth() + 1}`;
	if (date.getDate() < 10) TODAY += `-0${date.getDate()}`;
	else TODAY += `-${date.getDate()}`;

	const PATH = `../../../panda_data_js/panda_menu/${TODAY}`;

	// 確保輸出目錄存在
	mkdirSync(PATH, { recursive: true });

	// init cookie
	let cookie = new Cookie();
	cookie.init();

	// 如果在 debug 模式，側特定的店家就夠了
	if (DEBUG_MODE) {
		await getMenu(
			cookie,
			"abmy",
			"",
			25.0531908,
			121.45147382,
		)
		return;
	}

	// read shopinformation
	const locationPath = `../../../panda_data/shopLst/${TODAY}`;
	let locationLst = readdirSync(locationPath);
	const menuPath = `../../../panda_data_js/panda_menu/${TODAY}`;


	for (const location of locationLst) {
		if (!location.startsWith("shopLst")) continue;
		let stores = [];
		let df = await readCSV(`${locationPath}/${location}`);
		try {
			df = df.loc({
				columns: [
					"shopCode",
					"shopName",
					"anchor_latitude",
					"anchor_longitude",
				],
			}).values;
		} catch (e) {
			console.error(e);
			continue;
		}
		console.log(`(${df[0][2]}, ${df[0][3]}): ${df.length} shops`);
		for (const row of df)
			try {
				stores.push(await getMenu(cookie, row[0], row[1], row[2], row[3]));
			} catch (e) {
				console.error(e);
			}
		const result = new DataFrame(stores);
		result.toCSV({
			filePath: `${menuPath}/${location}_${TODAY}.csv`,
			header: true,
		});
	}

	console.log("down shop catch");
}

try {
	await main();
} catch (e) {
	console.log("Totally failed");
	console.error(e);
}
