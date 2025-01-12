import Filter from "@/Components/Filter";
import ProductList from "@/Components/ProductList";
import Spinner from "@/Components/Spinner";
import Title from "@/Components/Title";
import MainLayout from "@/Layouts/MainLayout";
import PageMeta from "@/Layouts/PageMeta";
import { useProductsData } from "@/Services/Hooks";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Products = () => {
  const { category, subcategory } = useParams();
  useEffect(() => {
    if (!!category) {
      if (!["oraimo", "uk-used", "new-age"].includes(category)) {
        throw new Response("", {
          status: 404,
          statusText: "Not Found",
        });
      }
    }
  }, [category]);
  const { data, isLoading, isFetching } = useProductsData<ProductItemType[]>(
    {}
  );
  return (
    <MainLayout>
      <PageMeta
        title="Products"
        description="View all our products on Zenos; New and UK Used Products"
      >
        <div className="py-8  px-3 space-y-6 md:px-10">
          <div className="flex flex-col text-center gap-y-4 items-center justify-between md:flex-row md:text-left md:justify-between">
            <div>
              <Title>Top Products</Title>
              <p className="text-sm font-semibold py-1 px-2">
                Browse through all our products.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr] gap-10">
            <div className="grow">
              <Filter
                products={data || []}
                paginateLimit={12}
                filter_by={{
                  name: "",
                  category,
                  subcategory,
                }}
              />
            </div>
            <div className="">
              {isLoading ||
                (isFetching && (
                  <Spinner
                    className="w-20 h-20"
                    text="Loading Products.."
                    textClassName="text-xl"
                  />
                )) ||
                (data &&
                  ((data?.length > 0 && (
                    <>
                      <ProductList products={data || []} />
                      <div className="mixitup-page-list" />
                    </>
                  )) || (
                    <div className="no-container-products">
                      <p className="no-product-data">No Product found!</p>
                    </div>
                  )))}
            </div>
          </div>
        </div>
      </PageMeta>
    </MainLayout>
  );
};

export default Products;
