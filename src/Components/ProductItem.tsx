// ProductItem: Components containing a visual display of the product metadata

import {
  addToCartQuery,
  removeCartProduct,
  removeCartProductDiscount,
  updateCartProductDiscount,
  updateCartQuantity,
} from "@/Services/Query";
import { createSlug, price, short } from "@/System/function";
import classNames from "classnames";
import _ from "lodash";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Button from "./Button";
import Image from "./Image";
import SliderArrow from "./SliderArrow";

const ProductItem: React.FC<{
  product: ProductItemType;
  type: ListingProductType;
}> = ({ product, type }) => {
  const TypeCartListing = type === "carts_listing";
  const TypeSimilarListing = type === "similar_listing";
  const TypeOrderListing = type === "order_listing";
  const TypeProductListing = type === "product_listing";
  const QuantityInputRef = useRef<HTMLInputElement>(null);
  const [, setQuantity] = useState<number>(product.cartQuantity || 1);
  return (
    // TailwindCSS styles in ProductItem Component
    <div
      data-product-name={`${createSlug(product?.name.toLowerCase())}`}
      data-price={product?.price}
      className={classNames(
        `mix-target product-category-${createSlug(
          product?.category.value.toLowerCase()
        )} product-subcategory-${createSlug(
          product?.subcategory?.value.toLowerCase()
        )} ${createSlug(
          product?.name.toLowerCase()
        )} flex justify-start leading-normal rounded-xl`,
        {
          "flex-col items-center px-2 gap-2 md:flex-row shadow-sm shadow-gray-600":
            TypeCartListing || TypeSimilarListing,
          "pb-0 flex-col": TypeOrderListing,
          "pb-4 flex-col items-start justify-center bg-gray-950 shadow-sm shadow-gray-600":
            TypeProductListing,
        }
      )}
    >
      {/* Product image */}
      <div
        className={classNames("relative group", {
          "w-full h-auto": TypeProductListing,
          "w-24": TypeSimilarListing,
        })}
      >
        <Slider
          {...{
            dots: false,
            autoplay: true,
            // speed: 2000,
            autoplaySpeed: _.random(4000, 10000),
            cssEase: "linear",
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            nextArrow: TypeSimilarListing ? (
              <></>
            ) : (
              <SliderArrow
                type="next"
                arrowClassName="hidden group-hover:block animate-slideright"
              />
            ),
            prevArrow: TypeSimilarListing ? (
              <></>
            ) : (
              <SliderArrow
                type="prev"
                arrowClassName="hidden group-hover:block animate-slideleft"
              />
            ),
            adaptiveHeight: true,
          }}
          // className="h-full bg-white p-0 m-0 relative"
        >
          {typeof product?.image == "object" &&
            product?.image?.map((item, i) => {
              return (
                <Image
                  key={i}
                  src={item}
                  asDiv
                  className={classNames(
                    "bg-no-repeat  bg-center overflow-hidden",
                    {
                      "!h-96 !w-full bg-cover sm:!h-96 xl:!h-96 rounded-ss-2xl rounded-se-2xl":
                        TypeProductListing,
                      "bg-cover !h-24 !w-24 md:!h-24": TypeSimilarListing,
                    },
                    [
                      "bg-zenos-600/20",
                      "bg-blue-500/20",
                      "bg-violet-800/20",
                      "bg-white/20",
                      "bg-green-500/20",
                      "bg-fuchsia-500/20",
                      "bg-lime-500/20",
                    ][_.random(0, 5)]
                  )}
                />
              );
            })}
        </Slider>
      </div>
      {/* Product metadata */}
      <div
        className={classNames("flex flex-col justify-between", {
          "px-3 py-4 grow": TypeCartListing,
          "px-2 py-1": TypeSimilarListing,
          "p-0": TypeOrderListing,
          "px-4 mt-4 grow w-full": TypeProductListing,
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
              {TypeCartListing && (
                <p className={"text-gray-800 text-sm mt-4"}>
                  {product.description}
                </p>
              )}
            </Link>
            {!TypeSimilarListing && (
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
          {!TypeCartListing && !TypeOrderListing && !TypeSimilarListing && (
            <Link to={`/products/${product.id}`}>
              <p className="hidden lg:block text-gray-200 text-sm">
                {short(product.description, 120)}
              </p>
              <p className="block lg:hidden text-gray-200 text-sm">
                {short(product.description, 37)}
              </p>
            </Link>
          )}
          {TypeSimilarListing && (
            <p className={`text-lg text-zenos-600 font-bold`}>
              {price(
                product.price * (product.cartQuantity || 1),
                "currency",
                0
              )}
            </p>
          )}
        </div>
        {TypeCartListing && (
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
        {(TypeCartListing || TypeProductListing) && (
          <div
            className={`mt-3 flex ${
              TypeCartListing ? "justify-between" : "justify-end"
            } flex-wrap items-start gap-y-2`}
          >
            {/* Product Quantity reading */}
            {TypeCartListing && (
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
              className="w-full !text-center !justify-center gap-2 group"
              onClick={() => {
                if (TypeCartListing) {
                  // remove products from cart
                  removeCartProduct(product).then(() => {});
                } else {
                  addToCartQuery(product).then(() => {});
                }
              }}
            >
              {(!TypeCartListing && (
                <>
                  <svg
                    className="w-8 h-8 text-white"
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
                      strokeWidth="2"
                      d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                    />
                  </svg>
                  <span className="hidden transition-all delay-0 duration-200 group-hover:block group-hover:animate-slideleft">
                    Add to cart
                  </span>
                </>
              )) || (
                <>
                  <span>Remove</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
