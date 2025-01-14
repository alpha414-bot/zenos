// ProductList: Components displaying a category of product based on different section of the web app
import classNames from "classnames";
import React from "react";
import ProductItem from "./ProductItem";

const ProductList: React.FC<ProductListInterface> = ({
  products,
  type = "product_listing",
}) => {
  const TypeCartListing = type === "carts_listing";
  const TypeSimilarListing = type === "similar_listing";
  const TypeOrderListing = type === "order_listing";
  const TypeProductListing = type === "product_listing";
  return (
    <div
      className={classNames("relative grid mixitup-product-wrapper", {
        "grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1": TypeSimilarListing,
        "grid-cols-1 gap-6": TypeCartListing,
        "grid-cols-1 gap-4": TypeOrderListing,
        "grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-12": TypeProductListing,
      })}
    >
      {products.length > 0 && (
        <>
          {products?.map((product, index) => (
            <ProductItem
              key={product.id || index}
              product={product}
              type={type}
            />
          ))}
          {false && (
            <img
              src="/assets/images/BannerE.png"
              className="w-full rounded-lg transition-all duration-700 product-placeholder"
            />
          )}
        </>
      )}
      <div className="hidden no-product-data bottom-0 space-y-2">
        <i className="fa-3x fa-solid fa-bug block text-zenos-600"></i>
        <p>Oops! No product found.</p>
      </div>
    </div>
  );
};

export default ProductList;
