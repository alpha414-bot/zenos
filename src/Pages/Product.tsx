import Button from "@/Components/Button";
import ProductList from "@/Components/ProductList";
import MainLayout from "@/Layouts/MainLayout";
import PageMeta from "@/Layouts/PageMeta";
import {
  useMediaFile,
  useProductsData,
  useSimilarProductsData,
} from "@/Services/Hook";
import { addToCartQuery } from "@/Services/Query";
import { price } from "@/System/function";
import _ from "lodash";
import { Link, useParams } from "react-router-dom";

const Product = () => {
  // trigger view products
  const { product_id } = useParams();
  const { data: product } = useProductsData(product_id) as {
    data: ProductItemType;
  };
  const { data: SimilarProducts } = useSimilarProductsData(product) as {
    data: ProductItemType[];
  };
  const { data: image } = useMediaFile(product.image);

  return (
    <MainLayout>
      <PageMeta
        title={`${product?.name} - ${_.startCase(product?.category.value)}`}
        description={`Zenos product ${product?.name}, ${product?.description}`}
      >
        <div className="px-1.5 py-10 space-y-5 md:px-4">
          <div className="flex flex-col items-start justify-between gap-x-12 gap-y-32  px-2 lg:flex-row lg:px-6">
            <div className="w-full lg:w-3/4">
              {/* Products styler */}
              <div className="flex flex-col items-start justify-between gap-x-8 gap-y-2 md:flex-row md:items-stretch">
                <div className="w-full md:w-full">
                  <div
                    className={`bg-no-repeat bg-cover bg-center w-full h-80 rounded-xl md:bg-contain md:w-full md:min-h-full md:h-96 bg-white/5`}
                    style={{
                      backgroundImage: `url('${image || "/assets/images/favicon.svg"}')`,
                    }}
                  ></div>
                </div>
                <div className="w-full md:min-w-1/2">
                  <div className="w-full inline-flex justify-end">
                    {/* Favourite */}
                    <button>
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
                          d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                        />
                      </svg>
                    </button>
                  </div>
                  {/* name */}
                  <p className="text-6xl font-extrabold leading-[4.5rem]">
                    {product.name}
                  </p>
                  {/* Price & Category */}
                  <div className="flex items-start justify-between gap-12 mt-2">
                    <div>
                      <p
                        className={`text-2xl text-left text-zenos-600 font-bold lg:text-right`}
                      >
                        {price(
                          product.price * (product.cartQuantity || 1),
                          "currency",
                          0
                        )}
                        {product?.discount && (
                          <span
                            className="align-super ml-1 text-sm"
                            dangerouslySetInnerHTML={{
                              __html: `-${product.discount.value}%`,
                            }}
                          />
                        )}
                      </p>
                      {product.salePrice && (
                        <p className="text-sm text-left text-zenos-600 font-semibold line-through lg:text-right">
                          {price(product.salePrice, "currency", 0)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <p className="bg-zenos-700 px-2 py-0.5 rounded font-medium text-xs">
                        Category:
                      </p>
                      <p className="text-xs font-medium underline underline-offset-4 decoration-double">
                        {_.startCase(product.category.value)}
                      </p>
                    </div>
                  </div>
                  {/* Add to cart */}
                  <div className="inline-flex w-full mt-5 justify-end">
                    <Button
                      text={
                        <div className="w-full inline-flex items-center justify-center gap-2">
                          <svg
                            className="w-7 h-7 text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12.268 6A2 2 0 0 0 14 9h1v1a2 2 0 0 0 3.04 1.708l-.311 1.496a1 1 0 0 1-.979.796H8.605l.208 1H16a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L4.686 5H4a1 1 0 0 1 0-2h1.5a1 1 0 0 1 .979.796L6.939 6h5.329Z" />
                            <path d="M18 4a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0V8h2a1 1 0 1 0 0-2h-2V4Z" />
                          </svg>

                          <p className="text-lg text-center">Add to cart</p>
                        </div>
                      }
                      className="w-full py-0.5"
                      onClick={() => {
                        addToCartQuery(product).then(() => {});
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Product details */}
              <div className="py-4 mt-5">
                <p className="text-2xl font-semibold">Product details</p>
                <hr />
                {/* share */}
                <div className="mt-2 py-0.5 flex items-center gap-2.5">
                  <Link
                    to="#"
                    target="_blank"
                    className="inline-block border p-1 border-gray-200 rounded-full"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                  <Link
                    to="#"
                    target="_blank"
                    className="inline-block border p-1 border-gray-200 rounded-full"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 5.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.343 8.343 0 0 1-2.605.981A4.13 4.13 0 0 0 15.85 4a4.068 4.068 0 0 0-4.1 4.038c0 .31.035.618.105.919A11.705 11.705 0 0 1 3.4 4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 6.1 13.635a4.192 4.192 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 2 18.184 11.732 11.732 0 0 0 8.291 20 11.502 11.502 0 0 0 19.964 8.5c0-.177 0-.349-.012-.523A8.143 8.143 0 0 0 22 5.892Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
                <p className="mt-8 text-base font-normal">
                  {product?.description}
                </p>
                <div className="mt-4">
                  <span className="font-bold text-xl">Features:</span>
                  <div className="w-full pt-5 space-y-12">
                    {product.variants && (
                      <div className="flex items-start gap-8 justify-between">
                        <span className="font-semibold text-base">
                          Variants:
                        </span>
                        <div className="flex flex-col items-start gap-5 lg:flex-row">
                          {product.variants.map((item, index) => (
                            <div
                              key={index}
                              className="cursor-pointer space-y-2 border border-gray-200 px-2 min-w-44 py-2 rounded-md hover:bg-gray-200/10 group"
                            >
                              <p
                                className="inline-block text-lg font-semibold bg-gray-400/25 pl-3 pr-5 rounded group-hover:font-extrabold"
                                style={{ color: item.color }}
                              >
                                {item.color}
                              </p>
                              <div>
                                <p className="text-sm font-medium font-mono tracking-[0.5rem]">
                                  {item.size}
                                </p>
                                <p className="text-sm font-medium">
                                  Material: {item.material}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex items-start gap-8 justify-between">
                        <span className="font-semibold text-base">
                          Weight (kg):
                        </span>
                        <p className="inline-block text-lg font-semibold bg-gray-400/25 pl-3 pr-5 rounded">
                          {product.weight}
                        </p>
                      </div>
                    )}
                    {product.star && (
                      <div className="flex items-start gap-2 justify-between">
                        <span className="font-semibold text-base">
                          Ratings:
                        </span>
                        <div className="flex flex-nowrap items-center gap-1">
                          {new Array(5).fill(0).map((item, index) => (
                            <div key={index} data-item={item}>
                              {(product.star && product.star > index && (
                                <svg
                                  className="w-6 h-6 text-yellow-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                </svg>
                              )) || (
                                <svg
                                  className="w-6 h-6 dark:text-yellow-500"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"
                                  />
                                </svg>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Similar Products list */}
            <div className="w-full lg:w-3/12">
              <p className="text-2xl font-bold mb-5 underline underline-offset-4 decoration-dotted">
                Similar Products
              </p>
              {(SimilarProducts.length > 0 && (
                <ProductList
                  type="similar_listing"
                  products={SimilarProducts || []}
                />
              )) || (
                <div className="bg-gray-600/60 py-2 rounded">
                  <p className="font-bold text-base text-center">
                    No such entry yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageMeta>
    </MainLayout>
  );
};

export default Product;
