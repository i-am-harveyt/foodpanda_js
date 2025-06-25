import { Logger } from "../lib/Logger.js";

/**
 * This function is used to send request and get response
 * @param {Cookie} cookie
 * @param {string} shopUuid
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} perseusClientId 
 * @param {string} perseusSessionId 
 * @param {Logger} logger
 * @returns Promise<Response> | boolean
 */
export default async function sendReqMenu(
  shopUuid,
  latitude,
  longitude,
  perseusClientId,
  perseusSessionId,
  logger,
) {
  try {
    return await fetch(
      `https://tw.fd-api.com/api/v5/vendors/${shopUuid}?` +
        "include=menus,bundles,multiple_discounts&language_id=6&" +
        "opening_type=delivery&basket_currency=TWD&" +
        `latitude=${latitude}&longitude=${longitude}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:139.0) Gecko/20100101 Firefox/139.0",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.5",
          "perseus-client-id": perseusClientId,
          "perseus-session-id": perseusSessionId,
          "X-PD-Language-ID": "6",
          "X-FP-API-KEY": "volo",
          Authorization: "",
          "Api-Version": "7",
          "Sec-GPC": "1",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "cross-site",
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
        },
        referrer: "https://www.foodpanda.com.tw/",
        method: "GET",
        mode: "cors",
      },
    );
  } catch (e) {
    logger.error(e);
  }
  return false;
}
