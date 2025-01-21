// ProductList.tsx
import { useAppDispatch } from "@/Services/Redux/Hook";
import { setMixerContainerEnable } from "@/Services/Redux/MixerSlice";
import classNames from "classnames";
import React, { useEffect } from "react";
import ProductItem from "./ProductItem";

interface ProductListInterface {
  products: any[];
  type?:
    | "product_listing"
    | "carts_listing"
    | "similar_listing"
    | "order_listing";
  filter_by?: {
    type?: string;
    subcategory?: string;
  };
  filterContainerEnabled?: boolean;
}

const ProductList: React.FC<ProductListInterface> = ({
  products,
  type = "product_listing",
  filterContainerEnabled = false,
}) => {
  const dispatch = useAppDispatch();
  const TypeCartListing = type === "carts_listing";
  const TypeSimilarListing = type === "similar_listing";
  const TypeOrderListing = type === "order_listing";
  const TypeProductListing = type === "product_listing";

  useEffect(() => {
    dispatch(setMixerContainerEnable(true));
  }, [dispatch]);

  return (
    <div
      className={classNames("relative grid mixitup-product-wrapper", {
        "grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1": TypeSimilarListing,
        "grid-cols-1 gap-6": TypeCartListing,
        "grid-cols-1 gap-4": TypeOrderListing,
        "grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-12":
          TypeProductListing && !filterContainerEnabled, // Filter container is not included side-by-side with ProductsComponent
        "grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-12 items-stretch":
          TypeProductListing && filterContainerEnabled, // Filter is enabled for this component
      })}
    >
      {products.length > 0 ? (
        <>
          {products.map((product, index) => (
            <ProductItem product={product} type={type} key={index} />
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
        <div className="no-product-data bottom-0 space-y-2">
          <i className="fa-3x fa-solid fa-bug block text-zenos-600"></i>
          <p>Oops! No product found.</p>
        </div>
      )}
      <div className="hidden no-product-data bottom-0 space-y-2">
        <i className="fa-3x fa-solid fa-bug block text-zenos-600"></i>
        <p>Oops! No product found.</p>
      </div>
    </div>
  );
};

export default ProductList;
