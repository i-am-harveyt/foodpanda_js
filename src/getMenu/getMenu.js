import sendReqMenu from "./sendReqMenu.js";
import { mkdirSync, writeFileSync } from "fs";
import extractData from "./extractData.js";
import { Logger } from "../lib/Logger.js";

/**
 *
 * @param {string} shopUuid
 * @param {string} shopName
 * @param {number} latitude
 * @param {number} longitude
 * @param {boolean} grepJson
 * @param {Logger} logger
 */
export default async function getMenu(
  shopUuid,
  shopName,
  latitude,
  longitude,
  grepJson,
  logger,
) {
  // delay
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 2_000));

  let get = await fetch(
    `https://www.foodpanda.com.tw/restaurant/${shopUuid}/`,
    {
      "credentials": "omit",
      "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:139.0) Gecko/20100101 Firefox/139.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Sec-GPC": "1",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-User": "?1",
        "Priority": "u=0, i",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
      },
      "referrer": "https://www.google.com/",
      "method": "GET",
      "mode": "cors"
    });
  logger.info(shopUuid, latitude, longitude, get.status);
  const setCookie = get.headers.getSetCookie();
  let perseus_client_id = "";
  let perseus_session_id = "";
  for (const setCookieStr of setCookie) {
    if (setCookieStr.includes("PerseusGuestId"))
      perseus_client_id = setCookieStr.split(";")[0].split("=")[1];
    else if (setCookieStr.includes("PerseusSessionId"))
      perseus_session_id = setCookieStr.split(";")[0].split("=")[1];
  }

  let now = new Date();

  // fetch logic
  let response = await sendReqMenu(
    shopUuid,
    latitude,
    longitude,
    perseus_client_id,
    perseus_session_id,
    logger,
  );
  logger.info(shopUuid, latitude, longitude, response.status);
  if (!response.ok) {
    logger.error(await response.text());
  }
  const data = await response.json();

  // write to json
  if (grepJson) {
    const TODAY = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const jsonPath = `../../../panda_data_js/panda_menu/json/${TODAY}`;
    try {
      mkdirSync(jsonPath, { recursive: true });
    } catch (err) { }
    try {
      writeFileSync(
        `${jsonPath}/${latitude}_${longitude}_${shopUuid}.json`,
        JSON.stringify(data),
      );
    } catch (error) {
      logger.error(error);
    }
  }

  // data conversion
  return extractData(data.data, now, latitude, longitude, logger);
}
