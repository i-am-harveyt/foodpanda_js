/**
 * Generates a menu object from the given data.
 *
 * @param {object} data - The data to extract the menu from.
 * @return {object} - The generated menu object.
 */
export default function getMenuData(data) {
	let result = [];
	for (const category of data.menus[0].menu_categories) {
		for (const product of category.products) {
			let productId = product.id ? product.id : NaN;
			let productCode = product.code ? product.code : NaN;
			let productName = product.name ? product.name : NaN;
			let productDesc = product.description ? product.description : NaN;
			// variations
			for (const variation of product.product_variations)
				result.push({
					id: productId,
					productCode: productCode,
					variationCode: variation.code,
					product:
						`${productName}` + (variation.name !== undefined ? `-${variation.name}` : ""),
					description: productDesc,
					preDiscountPrice: variation.price_before_discount,
					price: variation.price,
					isSoldOut: product.is_sold_out,
					tags: product.tags,
				});
		}
	}
	return result;
}
