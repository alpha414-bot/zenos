// ProductItem: Components containing a visual display of the product metadata

import { useMediaFile } from "@/Services/Hook";
import {
  addToCartQuery,
  removeCartProduct,
  removeCartProductDiscount,
  updateCartProductDiscount,
  updateCartQuantity,
} from "@/Services/Query";
import { price, short } from "@/System/function";
import classNames from "classnames";
import _ from "lodash";
import { useRef, useState } from "react";
import { Img } from "react-image";
import { Link } from "react-router-dom";
import Button from "./Button";
import Spinner from "./Spinner";

const ProductItem: React.FC<{
  product: ProductItemType;
  type: ListingProductType;
}> = ({ product, type }) => {
  const TypeCartListing = type === "carts_listing";
  const TypeSimilarListing = type === "similar_listing";
  const TypeOrderListing = type === "order_listing";
  const TypeProductListing = type === "product_listing";
  const { data: image } = useMediaFile(product.image);
  const QuantityInputRef = useRef<HTMLInputElement>(null);
  const [, setQuantity] = useState<number>(product.cartQuantity || 1);
  return (
    // TailwindCSS styles in ProductItem Component
    <div
      className={classNames("flex justify-start leading-normal rounded-xl", {
        "flex-col items-stretch gap-2 md:flex-row shadow-sm shadow-gray-600":
          TypeCartListing || TypeSimilarListing,
        "pb-0 flex-col": TypeOrderListing,
        "pb-4 flex-col items-start justify-center shadow-sm shadow-gray-600": TypeProductListing,
      })}
    >
      {/* Product image */}
      <Link to={`/products/${product.id}`} className="overflow-hidden inline-block">
        <Img
          src={"/"}
          className="w-full rounded-2xl md:rounded-3xl overflow-hidden"
          alt={image as string}
          container={(children) => {
            return <div className="foo bg-red-500">{children}</div>;
          }}
          unloader={
            <div
              className={classNames(
                `w-full p-0 max-h-[27rem] flex flex-col gap-5 items-center justify-center bg-ray-100/95 md:max-h-auto`,
                {
                  "w-56 h-full rounded-t-xl md:rounded-t-none md:rounded-ss-xl md:rounded-es-xl":
                    TypeCartListing,
                  "w-32 h-32 rounded-t-xl md:rounded-t-none md:rounded-ss-xl md:rounded-es-xl":
                    TypeSimilarListing,
                  "h-auto rounded-xl": TypeProductListing,
                }
              )}
            >
              <Img
                src="/assets/images/zenosmainlogo.svg"
                className={classNames("w-full h-full border border-gray-700", {
                  "rounded-t-xl": true,
                })}
              />
            </div>
          }
          loader={
            <div
              className={`w-full min-w-56 h-[20rem] flex flex-col gap-5 items-center justify-center bg-ray-100/95`}
            >
              <Spinner className="w-12 h-12" />
            </div>
          }
        />
      </Link>
      {/* Product metadata */}
      <div
        className={classNames("flex flex-col justify-between", {
          "px-3 py-4 grow": TypeCartListing,
          "px-2 py-1": TypeSimilarListing,
          "p-0": TypeOrderListing,
          "px-4 mt-4 grow": TypeProductListing,
        })}
      >
        <div>
          <div className="flex flex-col items-start justify-between gap-1.5 mb-1 lg:flex-row">
            {/* Product name-description and quantity */}
            <Link to={`/products/${product.id}`}>
              {/* Product name/ <description> */}
              <div>
                <h3
                  className={`${
                    TypeSimilarListing
                      ? "text-base font-bold"
                      : TypeOrderListing
                      ? "text-base font-medium"
                      : "text-xl font-bold"
                  }`}
                >
                  {product.name}
                </h3>
                <div className="mt-0.5 flex items-center justify-start gap-2">
                  <p className="bg-zenos-500 px-2 py-0.5 rounded font-medium text-xs text-white">
                    Category:
                  </p>
                  <p className="text-xs font-medium underline underline-offset-4 decoration-double">
                    {_.startCase(product.category?.value)}
                  </p>
                </div>
              </div>
              {type === "carts_listing" && (
                <p className={"text-gray-800 text-sm mt-4"}>
                  {product.description}
                </p>
              )}
            </Link>
            {type !== "similar_listing" && (
              <div>
                <p
                  className={`${
                    TypeOrderListing ? "text-lg" : "text-2xl"
                  } text-left text-zenos-600 font-bold lg:text-right`}
                >
                  {price(
                    product.price * (product.cartQuantity || 1),
                    "currency",
                    0
                  )}
                  {product?.discount && (
                    <span
                      className="align-super ml-1 text-sm whitespace-nowrap"
                      dangerouslySetInnerHTML={{
                        __html: `-${product.discount.value}%`,
                      }}
                    />
                  )}
                </p>
                {product.salesPrice && (
                  <p className="text-sm text-left text-zenos-600 font-semibold line-through lg:text-right">
                    {price(product.salesPrice, "currency", 0)}
                  </p>
                )}
              </div>
            )}
          </div>
          {type !== "carts_listing" && type !== "order_listing" && (
            <Link to={`/products/${product.id}`}>
              <p className="hidden lg:block text-gray-200 text-sm">
                {type === "similar_listing"
                  ? short(product.description, 37)
                  : product.description}
              </p>
              <p className="block lg:hidden text-gray-200 text-sm">
                {product.description}
              </p>
            </Link>
          )}
          {type == "similar_listing" && (
            <p className={`text-lg text-zenos-600 font-bold`}>
              {price(
                product.price * (product.cartQuantity || 1),
                "currency",
                0
              )}
            </p>
          )}
        </div>
        {type === "carts_listing" && (
          <div className="border-b border-dotted py-2">
            {/* Discount page */}
            <p className="text-xs py-2 italic font-medium border-y border-dotted decoration-dotted md:py-1">
              Use any of the discount code below to receive promo on this
              product price
            </p>
            <div className="flex flex-col-reverse gap-1 items-start justify-start py-2 md:gap-2 md:flex-row">
              {/* Dicount group button */}
              <div
                className="inline-flex flex-col gap-y-3 items-start rounded-md shadow-sm md:flex-row"
                role="group"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (product.discount?.name !== "#chameleon") {
                      updateCartProductDiscount(product, {
                        name: "#chameleon",
                        value: 5,
                      });
                    }
                  }}
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-sm font-medium text-chameleon rounded-s-lg rounded-e-lg md:rounded-s-lg md:rounded-e-none ${
                    product.discount?.name == "#chameleon"
                      ? "bg-white"
                      : "bg-gray-700"
                  }`}
                >
                  {product.discount?.name == "#chameleon" && (
                    <svg
                      className="w-4 h-4 text-chameleon"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="4"
                        d="M5 11.917 9.724 16.5 19 7.5"
                      />
                    </svg>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="italic text-xs">#chameleon</span>
                    <div className="border text-xs border-chameleon px-1 py-0.5 rounded">
                      5%
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 px-1.5 py-0.5 text-sm font-medium text-chameleon rounded-s-lg rounded-e-lg md:rounded-s-none md:rounded-e-lg md:border-l-2 md:border-gray-300  ${
                    product.discount?.name == "#hackathonchameleon"
                      ? "bg-white"
                      : "bg-gray-700"
                  }`}
                  onClick={() => {
                    if (product.discount?.name !== "#hackathonchameleon") {
                      updateCartProductDiscount(product, {
                        name: "#hackathonchameleon",
                        value: 10,
                      });
                    }
                  }}
                >
                  {product.discount?.name == "#hackathonchameleon" && (
                    <svg
                      className="w-4 h-4 text-chameleon"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="4"
                        d="M5 11.917 9.724 16.5 19 7.5"
                      />
                    </svg>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="italic text-xs">#hackathonchameleon</span>
                    <div className="border text-xs border-chameleon px-1 py-0.5 rounded">
                      10%
                    </div>
                  </div>
                </button>
              </div>
              {product?.discount && (
                <div
                  onClick={() => removeCartProductDiscount(product)}
                  className="flex items-center gap-0.5 text-sm p-0 cursor-pointer underline underline-offset-2 decoration-dotted"
                >
                  &times;
                  <span>clear</span>
                </div>
              )}
            </div>
          </div>
        )}
        {(type === "carts_listing" || TypeProductListing) && (
          <div
            className={`mt-3 flex ${
              TypeCartListing ? "justify-between" : "justify-end"
            } flex-wrap items-start gap-y-2`}
          >
            {/* Product Quantity reading */}
            {type === "carts_listing" && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-x-1.5">
                  <p className="text-base font-bold underline underline-offset-2 decoration-dotted">
                    Quantity:
                  </p>
                  <p>{product.cartQuantity}</p>
                </div>
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  {/* decrement */}
                  <button
                    type="button"
                    onClick={() => {
                      if (QuantityInputRef.current) {
                        QuantityInputRef.current.value = "";
                      }
                      updateCartQuantity(product, -1);
                      setQuantity((count) => count - 1);
                    }}
                    className="inline-flex items-center px-2 py-1 text-sm font-medium bg-transparent border rounded-s-md  focus:z-10 focus:ring-2 focus:ring-gray-500 focus:text-white border-white text-white hover:text-white hover:bg-gray-700 focus:bg-gray-700"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 12h14"
                      />
                    </svg>
                  </button>
                  <input
                    type="text"
                    min={0}
                    ref={QuantityInputRef}
                    placeholder={product?.cartQuantity?.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numericValue = Number(value);

                      if (!isNaN(numericValue)) {
                        updateCartQuantity(product, numericValue, "insert");
                        setQuantity(numericValue);
                      }
                    }}
                    className="inline text-white placeholder:text-gray-400 text-base bg-transparent max-w-12 text-center border border-white focus:outline-none focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (QuantityInputRef.current) {
                        QuantityInputRef.current.value = "";
                      }
                      updateCartQuantity(product, 1);
                      setQuantity((count) => count + 1);
                    }}
                    className="inline-flex items-center px-2 py-1 text-sm font-medium bg-transparent border rounded-e-md  focus:z-10 focus:ring-2 focus:ring-gray-500 focus:text-white border-white text-white hover:text-white hover:bg-gray-700 focus:bg-gray-700"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 12h14m-7 7V5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            <Button
              text={type !== "carts_listing" ? "Add to cart" : "Remove"}
              onClick={() => {
                if (type === "carts_listing") {
                  // remove products from cart
                  removeCartProduct(product).then(() => {});
                } else {
                  addToCartQuery(product).then(() => {});
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
