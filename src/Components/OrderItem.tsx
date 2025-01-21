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
    <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700/30 overflow-hidden transition-all duration-300 hover:border-gray-600/50">
      <button
        type="button"
        onClick={() => setViewProductDetails(!viewProductDetails)}
        className="w-full flex items-center justify-between p-6 transition-all duration-300 hover:bg-gray-700/20"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-orange-500/10 rounded-lg">
            <svg 
              className="w-6 h-6 text-orange-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
              />
            </svg>
          </div>
          <div className="text-left">
            {order.id && (
              <h1 className="text-xl font-semibold text-white mb-1">
                Order #{" "}
                <span className="text-orange-400">
                  OR{short(order.id, 6, false)}D
                </span>
              </h1>
            )}
            <p className="text-sm text-gray-400 font-medium tracking-wide">
              {date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right mr-4">
            <p className="text-sm text-gray-400 mb-1">Total Amount</p>
            <p className="text-lg font-semibold text-white">
              {price(order.instance.amount, "currency", 0)}
            </p>
          </div>
          <div className="p-2 rounded-lg transition-all duration-300 hover:bg-gray-700/50">
            {viewProductDetails ? (
              <svg
                className="w-5 h-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.575 13.729C4.501 15.033 5.43 17 7.12 17h9.762c1.69 0 2.618-1.967 1.544-3.271l-4.881-5.927a2 2 0 0 0-3.088 0l-4.88 5.927Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
      </button>

      {viewProductDetails && (
        <div className="border-t border-gray-700/30">
          <div className="p-6 space-y-6">
            {/* Products List */}
            <div className="bg-gray-700/20 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-4">
                Order Details
              </h3>
              <ProductList
                type="order_listing"
                products={order.products.map((item) => ({
                  ...{
                    cartQuantity: item.quantity,
                    discount: item.discount,
                  },
                  ...item.metadata,
                } as ProductItemType))}
                filterContainerEnabled={false}
              />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-700/20 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-300">Subtotal</p>
                  <p className="text-sm font-medium text-white">
                    {price(TotalProductPrice, "currency", 0)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-300">Transaction Fees</p>
                  <p className="text-sm font-medium text-white">
                    {price(
                      order.instance.amount - TotalProductPrice,
                      "currency",
                      0
                    )}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-700/30">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-300">Total</p>
                    <p className="text-base font-semibold text-orange-400">
                      {price(order.instance.amount, "currency", 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderItem;