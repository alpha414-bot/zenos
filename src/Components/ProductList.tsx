// ProductList.tsx
import { useAppDispatch } from "@/Services/Redux/Hook";
import { setMixerContainerEnable } from "@/Services/Redux/MixerSlice";
import classNames from "classnames";
import React, { useEffect } from "react";
import ProductItem from "./ProductItem";
import { getProductType } from "@/System/Constants";

interface ProductListInterface {
  products: any[];
  type?: "product_listing" | "carts_listing" | "similar_listing" | "order_listing";
  filter_by?: {
    type?: string;
    subcategory?: string;
  };
}

const ProductList: React.FC<ProductListInterface> = ({
  products,
  type = "product_listing",
  
}) => {
  const dispatch = useAppDispatch();
  const TypeCartListing = type === "carts_listing";
  const TypeSimilarListing = type === "similar_listing";
  const TypeOrderListing = type === "order_listing";
  const TypeProductListing = type === "product_listing";

  useEffect(() => {
    dispatch(setMixerContainerEnable(true));
  }, [dispatch]);

  const getProductClasses = (product: any) => {
    const displayType = getProductType(product.category.key);
    return `mix-target category-${displayType} ${
      product.subcategory ? `subcategory-${product.subcategory.key}` : ''
    }`;
  };

  return (
    <div
      className={classNames("relative grid mixitup-product-wrapper", {
        "grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1": TypeSimilarListing,
        "grid-cols-1 gap-6": TypeCartListing,
        "grid-cols-1 gap-4": TypeOrderListing,
        "grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-12": TypeProductListing,
      })}
    >
      {products.length > 0 ? (
        <>
          {products.map((product, index) => (
            <div key={product.id || index} className={getProductClasses(product)}>
              <ProductItem
                product={product}
                type={type}
              />
            </div>
          ))}
          {false && (
            <img
              src="/assets/images/BannerE.png"
              alt="Banner"
              className="w-full rounded-lg transition-all duration-700 product-placeholder"
            />
          )}
        </>
      ) : (
        <div className="hidden no-product-data bottom-0 space-y-2">
          <i className="fa-3x fa-solid fa-bug block text-zenos-600"></i>
          <p>Oops! No product found.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;