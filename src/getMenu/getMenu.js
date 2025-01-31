import sendReqMenu from "./sendReqMenu.js";
import { Cookie } from "./Cookie.js";
import { mkdirSync, writeFileSync } from "fs";
import extractData from "./extractData.js";
import { Logger } from "../lib/Logger.js";

/**
 *
 * @param {Cookie} cookie
 * @param {string} shopUuid
 * @param {string} shopName
 * @param {number} latitude
 * @param {number} longitude
 * @param {Logger} logger
 */
export default async function getMenu(
  cookie,
  shopUuid,
  shopName,
  latitude,
  longitude,
  grepJson,
  logger,
) {
  // delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1_000 * 5 + Math.random() * 1_000),
  );

  if (Object.keys(cookie.cookies).length === 0) {
    let get = await fetch(
      `https://www.foodpanda.com.tw/restaurant/${shopUuid}/`,
    );
    logger.info(shopUuid, latitude, longitude, get.status);
    cookie.updateCookies(get.headers.getSetCookie().join("; "));
  }

  let now = new Date();

  // fetch logic
  let response = await sendReqMenu(cookie, shopUuid, latitude, longitude, logger);
  logger.info(shopUuid, latitude, longitude, response.status);
  cookie.updateCookies(response.headers.getSetCookie().join("; "));
  const data = await response.json();

  // write to json
  if (grepJson) {
    try {
      const TODAY = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      const jsonPath = `../../../panda_data_js/panda_menu/json/${TODAY}`;
      mkdirSync(jsonPath, { recursive: true });
      writeFileSync(
        `${jsonPath}/${latitude}_${longitude}_${shopUuid}.json`,
        JSON.stringify(data),
      );
    } catch (error) {
      logger.error(error);
    }
  }

  // data conversion
  return extractData(data.data, now, latitude, longitude);
}
