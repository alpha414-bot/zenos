import Button from "@/Components/Button";
import ProductList from "@/Components/ProductList";
import PageMeta from "@/Layouts/PageMeta";
import UserLayout from "@/Layouts/UserLayout";
import { useAuthUser, useCartProducts } from "@/Services/Hooks";
import { newOrderQuery } from "@/Services/Queries/OrderQuery";
import { generateRandomString, price } from "@/System/function";
import _ from "lodash";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Require the library
const Carts = () => {
  const { data: carts } = useCartProducts() as { data: CartMetaItem[] };
  const { data: currentUser } = useAuthUser();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const reference = useMemo(
    () => generateRandomString(_.random(24, 32)),
    [carts]
  );
  const TotalProductPrice = useMemo(
    () =>
      _.sumBy(carts, (item): any => {
        if (item.metadata) {
          let discountedPrice = item.metadata.price;
          if (item.discount?.value) {
            discountedPrice =
              item.metadata.price * (1 - (item.discount?.value || 1) / 100);
          }
          return discountedPrice * item.quantity;
        }
      }),
    [carts]
  );
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
        username:
          currentUser.username || currentUser.email?.split("@")[0] || "guest", // Fallback values
        email: currentUser.email,
        phone_number: currentUser.phone_number,
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
    <UserLayout>
      <PageMeta
        title="User - My Carts"
        description="View, Manage and your carts"
      >
        <h3 className="text-4xl font-bold tracking-wider underline underline-offset-8 decoration-dotted">
          My Carts [{carts.length}]
        </h3>
        {(carts.length > 0 && (
          <>
            <div className="mt-9">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              <ProductList
                type="carts_listing"
                products={carts.map((item) => {
                  const data = {
                    ...{
                      cartQuantity: item.quantity,
                      discount: item.discount,
                    },
                    ...item.metadata,
                  } as ProductItemType;
                  return data;
                })}
              />
            </div>
            <div className="flex mt-2 items-center justify-end gap-2">
              <p className="text-lg font-semibold">Total:</p>
              <p className="text-base font-bold underline underline-offset-4 decoration-dotted">
                {price(TotalProductPrice)}
              </p>
            </div>
            <div className="flex flex-col items-end mt-8">
              <Button
                className="gap-2"
                onClick={handlePlaceOrder}
                disabled={!currentUser?.uid}
              >
                Checkout
              </Button>
            </div>
          </>
        )) || (
          <div className="mt-9 bg-gray-400 bg-opacity-50 rounded px-2 py-4">
            <p className="font-bold text-center text-lg">No item in cart</p>
          </div>
        )}
      </PageMeta>
    </UserLayout>
  );
};

export default Carts;
