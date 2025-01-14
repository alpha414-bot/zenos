import ProductList from "@/Components/ProductList";
import PageMeta from "@/Layouts/PageMeta";
import UserLayout from "@/Layouts/UserLayout";
import { useCartProducts } from "@/Services/Hooks";
import { price } from "@/System/function";
import _ from "lodash";
import { Link } from "react-router-dom";

// Require the library
const Carts = () => {
  const { data } = useCartProducts() as { data: CartMetaItem[] };
  return (
    <UserLayout>
      <PageMeta
        title="User - My Carts"
        description="View, Manage and your carts"
      >
        <h3 className="text-4xl font-bold tracking-wider underline underline-offset-8 decoration-dotted">
          My Carts [{data.length}]
        </h3>
        {(data.length > 0 && (
          <>
            <div className="mt-9">
              <ProductList
                type="carts_listing"
                products={data.map((item) => {
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
                {price(
                  _.sumBy(data, (item): any => {
                    if (item.metadata) {
                      let discountedPrice = item.metadata.price;
                      if (item.discount?.value) {
                        discountedPrice =
                          item.metadata.price *
                          (1 - (item.discount?.value || 1) / 100);
                      }
                      return discountedPrice * item.quantity;
                    }
                  })
                )}
              </p>
            </div>
            <div className="flex flex-col items-end mt-8">
              <Link
                to="/checkout"
                className="inline-flex items-center px-4 py-0.5 text-base font-medium text-center rounded-lg bg-zenos-700 hover:bg-zenos-800 border-4 border-transparent hover:border-gray-800 hover:ring-2 hover:outline-none hover:ring-zenos-600"
              >
                Checkout
              </Link>
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
