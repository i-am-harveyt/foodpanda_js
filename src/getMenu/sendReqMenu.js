import { Cookie } from "../getShop/Cookie";
import { Logger } from "../lib/Logger.js";

/**
 * This function is used to send request and get response
 * @param {Cookie} cookie
 * @param {string} shopUuid
 * @param {number} latitude
 * @param {number} longitude
 * @param {Logger} logger
 * @returns Promise<Response> | boolean
 */
export default async function sendReqMenu(
  cookie,
  shopUuid,
  latitude,
  longitude,
  logger,
) {
  try {
    return await fetch(
      `https://tw.fd-api.com/api/v5/vendors/${shopUuid}?` +
        "include=menus,bundles,multiple_discounts&language_id=6&" +
        "opening_type=delivery&basket_currency=TWD&" +
        `latitude=${latitude}&longitude=${longitude}`,
      {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:124.0) Gecko/20100101 Firefox/124.0",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
          "Accept-Encoding": "gzip, deflate, br",
          DNT: "1",
          "Sec-GPC": "1",
          Connection: "keep-alive",
          Cookie: cookie.gen(),
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
          TE: "trailers",
        },
      },
    );
  } catch (e) {
    logger.error(e);
  }
  return false;
}
