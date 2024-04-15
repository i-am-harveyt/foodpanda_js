import { readFileSync, writeFileSync } from "fs";

export class Cookie {
  cookies = {}; // The container
  keys = [];
  init() {}

  /**
   * @param {string} cookieString
   * @returns Object
   */
  updateCookies(cookieString) {
    // 將字符串分割成Cookie部分
    const cookieSplit = cookieString.split("; ");

    let skipWords = [
      "expires",
      "path",
      "domain",
      "HttpOnly",
      "SameSite",
			"Secure",
    ];

    // 遍歷每個Cookie部分並解析成對象
    cookieSplit.forEach((cookie) => {
      let [name, value] = cookie.split("=");
      if (!skipWords.includes(name)) {
        value = `${name}=${value};`;

        // update
        this.cookies[name] = value;
      }
    });
    return this.cookies;
  }

  /**
   * call this to set value to key
   * @param {string} key
   * @param {string} value
   */
  setCookie(key, value) {
    this.cookies[key] = `${key}=${value};`;
  }

  /**
   * return the value of the key
   * @param {string} key
   * @returns string
   */
  getCookie(key) {
    return this.cookies[key];
  }

  /**
   * generate the cookie with latitude and longitude
   * @param {number} latitude
   * @param {number} longitude
   * @returns string
   */
  gen(latitude, longitude) {
    // 製造cookie
    const locatCookie = {
      address: {
        address1: "",
        address2: "",
        aptOrSuite: "",
        eaterFormattedAddress: "",
        subtitle: "",
        title: "",
        uuid: "",
      },
      latitude: latitude,
      longitude: longitude,
      reference: "",
      referenceType: "google_places",
      type: "google_places",
      addressComponents: {
        city: "",
        countryCode: "TW",
        firstLevelSubdivisionCode: "",
        postalCode: "",
      },
      categories: ["establishment", "point_of_interest"],
      originType: "user_autocomplete",
      source: "manual_auto_complete",
    };
    const json_str = JSON.stringify(locatCookie); // 將物件轉換為 JSON 字串
    const url_encoded_str = encodeURIComponent(json_str); // 再轉換成 URL encode 的格式
    const ret =
      `uev2.loc=${url_encoded_str};` + Object.values(this.cookies).join(" ");
    return ret;
  }

  print() {
    let values = Object.values(this.cookies);
    for (const v of values) console.log(v);
  }
}
