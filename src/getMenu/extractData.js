import getMenuData from "./extractMenu.js";
import { Logger } from "../lib/Logger.js";

/**
 * The function is used to extract data from given data
 * @param {Object} data
 * @param {Date} now
 * @param {number} latitude
 * @param {number} longitude
 * @param {Logger} logger
 */
export default function extractData(data, now, latitude, longitude, logger) {
  // setup result
  let result = {
    shopCode: NaN,
    localtion: `"${JSON.stringify([latitude, longitude])}"`,
    updateDate: now.toLocaleDateString(),
    shopName: NaN,
    address: NaN,
    postalCode: NaN,
    shopLat: NaN,
    shopLng: NaN,
    city: NaN,
    pickupTime: NaN,
    deliverFee: NaN,
    rate: NaN,
    rateCt: NaN,
    storeAvailabilityStatus: NaN,
    catLst: NaN,
    chain: NaN,
    menu: NaN,
    is_shop_price: NaN,
  };

  // uuid and title
  try {
    result.shopCode = data.code;
    result.shopName = `"${data.name}"`;
  } catch (e) {
    return;
  }

  // location data
  try {
    result.address = `"${data.address}"`;
    result.postalCode = data.post_code ? `"${data.post_code}"` : NaN;
    result.shopLat = data.latitude;
    result.shopLng = data.longitude;
  } catch (e) {
    logger.error(`${data.uuid} has no location info`);
  }

  // waiting-time
  try {
    result.pickupTime = `"${data.delivery_duration_range}"`;
  } catch (e) {
    logger.error(`${data.uuid} has no waiting-time info`);
  }

  // delivery fee
  try {
    result.deliverFee = `"${data.minimum_delivery_fee}"`;
  } catch (e) {
    logger.error(`${data.uuid} has no delivery-fee info`);
  }

  // rating
  try {
    result.rate = data.rating;
    result.rateCt = data.rating;
  } catch (e) {
    logger.error(`${data.uuid} has no rating`);
  }

  // store available?
  try {
    result.is_delivery_enabled = data.is_delivery_enabled;
  } catch (e) {
    logger.error(`${data.uuid} has no availability`);
  }

  // categories
  try {
    // encoded as base64
    result.catLst = Buffer.from(JSON.stringify(data.cuisines)).toString(
      "base64",
    );
  } catch (e) {
    logger.error(`${data.uuid} has no categories`);
  }

  // chain
  try {
    result.chain = Buffer.from(JSON.stringify(data.chain)).toString("base64");
  } catch (e) {
    logger.error(`${data.uuid} may not have a chain or something's wrong`);
  }

  // menu
  try {
    // encoded as base64
    result.menu = Buffer.from(JSON.stringify(getMenuData(data))).toString(
      "base64",
    );
  } catch (e) {
    logger.error(`${data.uuid} has no menu`);
  }

  // is_shop_price
  try {
    for (let item of data["food_characteristics"]) {
      logger.info(item);
      if (item["name"].includes("店內價")) result.is_shop_price = true;
    }
  } catch (e) {
    logger.error(`${data.code} has no food_characteristics(shop_price)`);
  }

  return result;
}
