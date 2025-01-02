import {
  ZenosCategory,
  ZenosNewAgeSubCategory,
  ZenosOraimoSubCategory,
} from "@/System/Constants";
import { createSlug } from "@/System/function";
import mixitup from "mixitup";
import mixitupmultifilter from "mixitup-multifilter";
import mixitupPagination from "mixitup-pagination";
import { useEffect, useState } from "react";

const Filter = ({
  products,
  paginateLimit = 12,
}: {
  products: ProductItemType[];
  paginateLimit?: number;
}) => {
  const [categoryType, setCategoryType] = useState<
    | ""
    | ".product-category-oraimo"
    | ".product-category-new-age"
    | ".product-category-uk-used"
  >("");
  const [mixer, setMixer] = useState<any>();
  useEffect(() => {
    function getParam(param: string) {
      var url = window.location.href
        .slice(window.location.href.indexOf("?") + 1)
        .split("&");
      for (var i = 0; i < url.length; i++) {
        var params = url[i].split("=");
        if (params[0] == param) return params[1];
      }
      return false;
    }
    const filter = getParam("filter");
    var $containerEl = document.querySelector(".mixitup-product-wrapper");
    mixitup.use(mixitupmultifilter);
    mixitup.use(mixitupPagination);
    if ($containerEl) {
      setMixer(
        mixitup($containerEl, {
          multifilter: {
            enable: true,
          },
          pagination: {
            limit: paginateLimit, // 12
            maintainActivePage: true,
            hidePageListIfSinglePage: true,
          },
          load: {
            filter:
              filter == "all" || !filter
                ? null
                : `.product-category-${getParam("filter")}`,
          },
          animation: {
            // effects: "fade rotateZ(-180deg)" /* fade scale */,
            duration: 700 /* 600 */,
          },
          selectors: {
            target: ".mix-target" /* .mix */,
          },
          callbacks: {
            onMixStart: function (state: any, futureState: any) {
              const selector =
                futureState.activeFilter.selector.match(/\.(\w[\w-]*)/);
              console.log("state", state);
              if (selector && selector.length > 0) {
                setCategoryType(selector[0]);
              }
            },
          },
        })
      );
    }
    return () => {
      // mixer?.paginate(paginateLimit);
      mixer?.destroy();
    };
  }, [products, paginateLimit]);
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="w-full bg-gray-800 rounded-lg sm:block"
      >
        <div className="py-2 px-4 flex justify-end">
          <button
            type="reset"
            className="underline underline-offset-2 text-base"
            data-filter="all"
          >
            Clear
          </button>
        </div>
        <div className="border-b-2 border-gray-400 px-4 py-2">
          <p className="text-2xl font-semibold">Product Filter</p>
        </div>
        <div className="py-8 px-4 space-y-4">
          {/* Category and subcategory*/}
          <div className="">
            <div className="relative flex flex-col" data-filter-group="search">
              <label
                htmlFor="name"
                className="absolute top-2 left-4 text-xs text-gray-300 tracking-tighter"
              >
                Search
              </label>
              <input
                id="name"
                type="search"
                placeholder="Search for product..."
                className="pt-6 pb-2 px-4 bg-gray-700 text-white font-extrabold placeholder:font-medium placeholder:text-gray-400 rounded-ss-xl rounded-se-xl border-2 border-gray-400 focus:outline-none focus:border-2 focus:ring-zenos-500 focus:border-zenos-500"
                data-search-attribute="data-product-name"
              />
            </div>
            <div
              className="relative flex flex-col"
              data-filter-group="category"
            >
              <label
                htmlFor="category"
                className="absolute top-2 left-4 text-xs text-gray-300 tracking-tighter"
              >
                Category
              </label>
              <select
                id="category"
                className="pt-6 pb-2 px-4 m-0 bg-gray-700 text-white font-bold border-x-2 border-gray-400 focus:border-2 focus:ring-zenos-500 focus:border-zenos-500"
                defaultValue=""
              >
                <option value="">All</option>
                {ZenosCategory.map((item, i) => (
                  <option
                    value={`.product-category-${createSlug(
                      item.value.toLowerCase()
                    )}`}
                    // data-search-attribute="data-category"
                    key={i}
                  >
                    {item.value}
                  </option>
                ))}
              </select>
            </div>
            <div
              className="relative flex flex-col"
              data-filter-group="subcategory"
            >
              {(categoryType == ".product-category-oraimo" ||
                categoryType == ".product-category-new-age") && (
                <label
                  htmlFor="subcategory"
                  className="absolute top-2 left-4 text-xs text-gray-300 tracking-tighter"
                >
                  Subcategory
                </label>
              )}
              {categoryType == ".product-category-oraimo" && (
                <select
                  id="subcategory"
                  className="pt-6 pb-2 px-4 m-0 bg-gray-700 text-white font-bold border-2 border-gray-400 focus:border-2 focus:ring-zenos-500 focus:border-zenos-500"
                  defaultValue=""
                >
                  <option value="">All</option>
                  {ZenosOraimoSubCategory.map((item, i) => (
                    <option
                      value={`.product-subcategory-${createSlug(
                        item.value.toLowerCase()
                      )}`}
                      key={i}
                    >
                      {item.value}
                    </option>
                  ))}
                </select>
              )}
              {categoryType == ".product-category-new-age" && (
                <select
                  id="subcategory"
                  className="pt-6 pb-2 px-4 m-0 bg-gray-700 text-white font-bold border-2 border-gray-400 focus:border-2 focus:ring-zenos-500 focus:border-zenos-500"
                  defaultValue=""
                >
                  <option value="">All</option>
                  {ZenosNewAgeSubCategory.map((item, i) => (
                    <option
                      value={`.product-subcategory-${createSlug(
                        item.value.toLowerCase()
                      )}`}
                      key={i}
                    >
                      {item.value}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          {/* Price Sorting */}
          <div className="py-5">
            <div className="relative flex flex-col w-full">
              <label
                htmlFor="price"
                className="absolute top-1 left-2.5 flex items-center text-xs text-gray-300 tracking-tighter"
              >
                <span>Price</span>
                <svg
                  className="w-4 h-4 text-white"
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
                    d="m8 10 4-6 4 6H8Zm8 4-4 6-4-6h8Z"
                  />
                </svg>
              </label>
              <select
                name="price"
                id="price"
                className="pt-4 pb-1 px-2.5 m-0 bg-gray-700 text-white font-bold rounded-lg border-2 border-gray-400 focus:border-2 focus:ring-zenos-500 focus:border-zenos-500"
                onChange={(e) => {
                  mixer?.sort(e.target.value);
                }}
                defaultValue=""
              >
                <option value="price:asc" data-sort="price:asc">
                  Lowest to Highest
                </option>
                <option value="price:desc" data-sort="price:desc">
                  Highest to Lowest
                </option>
              </select>
            </div>
          </div>
        </div>
      </form>
      <img
        src="/assets/images/BannerF.png"
        className="mt-4 w-full rounded-lg"
      />
    </div>
  );
};

export default Filter;
