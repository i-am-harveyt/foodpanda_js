/**
 * Generates a menu object from the given data.
 *
 * @param {object} data - The data to extract the menu from.
 * @return {object} - The generated menu object.
 */
export default function getMenuData(data) {
  let result = {
    id: [],
    code: [],
    product: [],
    description: [],
    variations: {
      code: [],
      name: [],
      preDiscountPrice: [],
    },
    isSoldOut: [],
  };
  for (const category of data.menus[0].menu_categories) {
    for (const item of category.products) {
      result.id.push(item.id ? item.id : NaN);
      result.code.push(item.code ? item.code : NaN);
      result.product.push(item.name ? item.name : NaN);
      result.description.push(item.description ? item.description : NaN);
      result.isSoldOut.push(item.is_sold_out ? item.is_sold_out : NaN);

      // variations
      for (const variation of item.product_variations) {
        result.variations.code.push(variation.code);
        result.variations.name.push(variation.name);
        result.variations.preDiscountPrice.push(variation.preDiscountPrice);
      }
    }
  }
  return result;
}
