import getMenu from "./getMenu.js";
import { Cookie } from "./Cookie.js";
import { mkdirSync } from "fs";
import { readCSV } from "danfojs-node";
import { DataFrame } from "danfojs-node";
import { Logger } from "../lib/Logger.js";

const date = new Date();

let TODAY = `${date.getFullYear()}`;
if (date.getMonth() + 1 < 10) TODAY += `-0${date.getMonth() + 1}`;
else TODAY += `-${date.getMonth() + 1}`;
if (date.getDate() < 10) TODAY += `-0${date.getDate()}`;
else TODAY += `-${date.getDate()}`;

const PATH = `../../../panda_data_js/panda_menu/${TODAY}`;

const DEBUG_MODE = false;
const logger = new Logger(`${TODAY}.log`);

async function main() {
  // 確保輸出目錄存在
  try {
    mkdirSync(PATH, { recursive: true });
  } catch (e) {}

  // init cookie
  let cookie = new Cookie();
  cookie.init();

  // 如果在 debug 模式，側特定的店家就夠了
  if (DEBUG_MODE) {
    await getMenu(cookie, "abmy", "", 25.0531908, 121.45147382, true);
    return;
  }

  // read shopinformation
  const locationPath = `../../../panda_data/shopLst/rolling.csv`;
  const menuPath = `../../../panda_data_js/panda_menu/${TODAY}`;

  let stores = [];
  let retries = [];
  let df = await readCSV(locationPath);
  df = df.loc({
    columns: ["shopCode", "shopName", "anchor_latitude", "anchor_longitude"],
  }).values;
  logger.info(`(${df[0][2]}, ${df[0][3]}): ${df.length} shops`);

  // const grepJson = date.getDate() >= 10 && date.getDate() < 17;
  const grepJson = true;
  let cnt = 0;

  for (const row of df) {
    if (cnt === 20) {
      await new Promise(
        (resolve) => setTimeout(resolve, Math.random() * 1_000 * 60), // sleep around 1 min
      );
      cnt = 0;
    }
    try {
      const menu = await getMenu(
        cookie,
        row[0],
        row[1],
        row[2],
        row[3],
        grepJson,
        logger,
      );
      const df = new DataFrame(menu);
      df.toCSV({
        filePath: `${menuPath}/${TODAY}-${row[0]}.csv`,
        header: true,
      });
      stores.push(menu);
    } catch (e) {
      logger.error(e);
      return;
      retries.push([row[0], row[1], row[2], row[3]]);
    }
    cnt++;
  }
  for (const retry of retries) {
    try {
      const menu = await getMenu(
        cookie,
        retry[0],
        retry[1],
        retry[2],
        retry[3],
        grepJson,
        logger,
      );
      const df = new DataFrame(menu);
      df.toCSV({
        filePath: `${menuPath}/${TODAY}-${retry[0]}.csv`,
        header: true,
      });
      stores.push(menu);
    } catch (e) {
      logger.error(e);
    }
  }
  const result = new DataFrame(stores);
  result.toCSV({
    filePath: `${menuPath}/${TODAY}.csv`,
    header: true,
  });
}

logger.info("down shop catch");

try {
  main();
} catch (e) {
  logger.error("Totally failed");
  logger.error(e.toString());
}
