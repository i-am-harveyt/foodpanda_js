import { Cookie } from "./Cookie.js";
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
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:139.0) Gecko/20100101 Firefox/139.0",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.5",
          "perseus-client-id": "1744253582842.308245428132967256.txas2vn6st",
          "perseus-session-id": "1750265276145.352734549829797010.x7ky22z890",
          "X-PD-Language-ID": "6",
          "X-FP-API-KEY": "volo",
          "dps-session-id":
            "eyJzZXNzaW9uX2lkIjoiMzJlMjQ0OTUzMGJlNmIxNmVlY2RiZTFlMDg2M2Q1MDUiLCJwZXJzZXVzX2lkIjoiMTc0NDI1MzU4Mjg0Mi4zMDgyNDU0MjgxMzI5NjcyNTYudHhhczJ2bjZzdCIsInRpbWVzdGFtcCI6MTc1MDI2NTI3OX0=",
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
