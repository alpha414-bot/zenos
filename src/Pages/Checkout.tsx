import Button from "@/Components/Button";
import MainLayout from "@/Layouts/MainLayout";
import PageMeta from "@/Layouts/PageMeta";
import { useAuthUser, useCartProducts } from "@/Services/Hooks";
import { newOrderQuery } from "@/Services/Queries/OrderQuery";
import { generateRandomString, price } from "@/System/function";
import _ from "lodash";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Checkout = () => {
  const { data: carts } = useCartProducts() as { data: CartMetaItem[] };
  const { data: currentUser } = useAuthUser();
  const [error, setError] = useState("");
  const reference = useMemo(
    () => generateRandomString(_.random(24, 32)),
    [carts]
  );
  const navigate = useNavigate();

  const TotalProductPrice = _.sumBy(carts, (item): any => {
    if (item.metadata) {
      let discountedPrice = item.metadata.price;
      if (item.discount?.value) {
        discountedPrice =
          item.metadata.price * (1 - (item.discount?.value || 1) / 100);
      }
      return discountedPrice * item.quantity;
    }
  });

  const handlePlaceOrder = async () => {
    try {
      // Check if user is authenticated
      if (!currentUser?.uid) {
        setError("Please login to place an order");
        return;
      }

      // Prepare billing info with required fields
      const billingInfo = {
        uid: currentUser.uid,
        username: currentUser.username || currentUser.email?.split('@')[0] || 'guest', // Fallback values
        email: currentUser.email,
        phone_number: currentUser.phone_number
      };

      await newOrderQuery(
        {
          reference,
          amount: TotalProductPrice,
          status: "pending",
        },
        carts,
        billingInfo
      );

      navigate("/user/inbox", {
        state: {
          reference,
          amount: TotalProductPrice,
          carts,
        },
      });
    } catch (err) {
      setError("Failed to place order. Please try again.");
      console.error("Order placement error:", err);
    }
  };

  return (
    <MainLayout no_footer>
      <PageMeta
        title="Checkout"
        description="Complete your purchase"
      >
        <div className="relative flex flex-col-reverse lg:block">
          <div className="w-full px-4 md:w-[75%] md:px-8 py-12">
            <h3 className="text-2xl font-bold leading-none text-white mb-4">
              Payment & Billing
            </h3>
            <p className="text-xs font-medium italic mb-8">
              To complete and make payment reach out to our customer
              support to receive logistic support and track your order.
            </p>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {!currentUser?.uid && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                Please login to continue with your purchase.
              </div>
            )}
            
            <div className="flex flex-wrap items-stretch gap-4">
              <Button
                className="gap-2"
                onClick={handlePlaceOrder}
                disabled={!currentUser?.uid}
              >
                Place Order
              </Button>
            </div>
          </div>

          {/* Order summary */}
          <div className="w-full top-[12%] right-0 h-auto bg-gray-600 px-2 pt-5 pb-5 md:fixed lg:px-5 md:pt-20 md:w-[25%] md:min-h-screen md:h-full">
            <div className="bg-gray-800 px-4 py-3">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <Link
                  to="/user/carts"
                  className="text-sm text-zenos-600 underline underline-offset-4 decoration-zenos-600 decoration-dotted"
                >
                  Edit cart
                </Link>
              </div>
              <div className="space-y-1 mt-4 mb-5">
                {carts.map((item, index) => {
                  const product = item.metadata;
                  return (
                    <div
                      key={index}
                      className="flex items-start justify-between"
                    >
                      <p className="text-sm font-medium">{product?.name}:</p>
                      <div>
                        {price(
                          (product?.price || 1) * (product?.cartQuantity || 1),
                          "currency",
                          0
                        )}
                        {item.discount && (
                          <span
                            className="ml-1 text-xs"
                            dangerouslySetInnerHTML={{
                              __html: `-${item.discount.value}%`,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <hr />
              <div className="mt-5 flex items-center justify-between">
                <p className="text-base font-medium">Order Total:</p>
                <p className="text-lg font-extrabold">
                  {price(TotalProductPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageMeta>
    </MainLayout>
  );
};

export default Checkout;