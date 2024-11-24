// ProductList: Components displaying a category of product based on different section of the web app
import classNames from "classnames";
import React from "react";
import ProductItem from "./ProductItem";

const ProductList: React.FC<ProductListInterface> = ({
  products,
  type = "product_listing",
}) => {
  return (
    <div
      className={classNames("grid", {
        "grid-cols-1 gap-6":
          type === "carts_listing" || type === "similar_listing",
        "grid-cols-1 gap-1.5": type == "order_listing",
        "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6":
          type == "product_listing",
      })}
    >
      {products.length > 0 &&
        products?.map((product, index) => (
          <ProductItem
            key={product.id || index}
            product={product}
            type={type}
          />
        ))}
    </div>
  );
};

export default ProductList;
