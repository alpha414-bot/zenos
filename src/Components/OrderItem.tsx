import { date, price, short } from "@/System/function";
import _ from "lodash";
import { useState } from "react";
import ProductList from "./ProductList";

const OrderItem = ({ order }: { order: OrderDataInterface }) => {
  const [viewProductDetails, setViewProductDetails] = useState<boolean>(false);
  const TotalProductPrice = _.sumBy(order.products, (item): any => {
    if (item.metadata) {
      let discountedPrice = item.metadata.price;
      if (item.discount?.value) {
        discountedPrice =
          item.metadata.price * (1 - (item.discount?.value || 1) / 100);
      }
      return discountedPrice * item.quantity;
    }
  });
  return (
    <>
      <button
        type="button"
        onClick={() => setViewProductDetails(!viewProductDetails)}
        className="w-full flex-nowrap flex flex-row items-center justify-between px-3 py-3 shadow shadow-gray-300 rounded-xl"
      >
        <div className="inline-flex flex-col items-start justify-between">
          {order.id && (
            <h1 className="text-lg font-semibold">
              Order #OR{short(order.id, 6, false)}D
            </h1>
          )}
          <p className="text-sm tracking-widest font-normal">
            {date(order.createdAt).toLocaleString()}
          </p>
        </div>
        {/* drop down and up */}
        <div className="border border-gray-200 p-0.5 rounded group hover:bg-white">
          {(viewProductDetails && (
            <svg
              className="w-4 h-4  text-white group-hover:text-zenos-700"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M5.575 13.729C4.501 15.033 5.43 17 7.12 17h9.762c1.69 0 2.618-1.967 1.544-3.271l-4.881-5.927a2 2 0 0 0-3.088 0l-4.88 5.927Z"
                clipRule="evenodd"
              />
            </svg>
          )) || (
            <svg
              className="w-4 h-4 text-white group-hover:text-zenos-700"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </button>
      {viewProductDetails && (
        <div className="flex mt-2 flex-col pl-8 justify-between gap-4 lg:pl-0 lg:gap-12 lg:flex-row lg:px-0">
          {/* product list */}
          <div className="grow rounded-md py-2 px-4 lg:mt-2 lg:ml-9">
            <ProductList
              type="order_listing"
              products={order.products.map((item) => {
                const data = {
                  ...{
                    cartQuantity: item.quantity,
                    discount: item.discount,
                  },
                  ...item.metadata,
                } as ProductItemType;
                return data;
              })}
              filterContainerEnabled={false}
            />
          </div>
          {/* order metadata details */}
          <div className="space-y-2 py-2">
            {/* amount paid */}
            <div className="flex items-center justify-between gap-6">
              <p className="text-base font-semibold lg:text-sm">Amount Paid</p>
              <p className="text-base font-medium lg:text-sm">
                {price(order.instance.amount, "currency", 0)}
              </p>
            </div>
            {/* transaction fee */}
            <div className="flex items-center justify-between gap-6">
              <p className="text-base font-semibold lg:text-sm">
                Transaction Fees
              </p>
              <p className="text-base font-medium lg:text-sm">
                {price(
                  order.instance.amount - TotalProductPrice,
                  "currency",
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderItem;
