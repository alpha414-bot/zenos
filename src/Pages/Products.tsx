/**
 * Products.tsx
 * @author dotmartcodes
 * @lastModified 2025-01-15 22:51:06
 */

import Filter from "@/Components/Filter";
import ProductList from "@/Components/ProductList";
import Spinner from "@/Components/Spinner";
import Title from "@/Components/Title";
import MainLayout from "@/Layouts/MainLayout";
import PageMeta from "@/Layouts/PageMeta";
import { useProductsData } from "@/Services/Hooks";
import { getProductType } from "@/System/Constants";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface FilterState {
  type: string;
  category?: string;
  subcategory?: string;
}

const NoProductsFound = () => (
  <div className="flex flex-col items-center justify-center h-[400px] text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
    <div className="space-y-4">
      <i className="fas fa-box-open text-5xl text-gray-400"></i>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-800">No Products Found</h3>
        <p className="text-gray-600 max-w-md">
          We couldn't find any products matching your current filters. Try adjusting your filters or browsing our other categories.
        </p>
      </div>
      <button 
        onClick={() => window.location.href = '/products'}
        className="mt-4 px-6 py-2 bg-zenos-600 text-white rounded-md hover:bg-zenos-700 transition-colors duration-200 ease-in-out"
      >
        View All Products
      </button>
    </div>
  </div>
);

const Products = () => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const [filterState, setFilterState] = useState<FilterState>({
    type: "",
    category,
    subcategory,
  });

  // Validate category and set initial filter state
  useEffect(() => {
    if (category) {
      if (!["oraimo", "uk-used",  "itel"].includes(category)) {
        throw new Response("", {
          status: 404,
          statusText: "Not Found",
        });
      }
      // Convert backend category to display type
      const displayType = getProductType(category);
      setFilterState(prev => ({
        ...prev,
        type: displayType,
        category,
        subcategory: subcategory || "",
      }));
    }
  }, [category, subcategory]);

  const { data: products, isLoading, isFetching } = useProductsData<ProductItemType[]>({});

  const handleFilterChange = (filters: { type: string; subcategory: string }) => {
    setFilterState(prev => ({
      ...prev,
      ...filters,
    }));

    // Update URL based on filter changes
    const newPath = filters.type
      ? `/products/${filters.type}${filters.subcategory ? `/${filters.subcategory}` : ''}`
      : '/products';
    navigate(newPath, { replace: true });
  };

  const renderContent = () => {
    if (isLoading || isFetching) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner
            className="w-20 h-20"
            text="Loading Products.."
            textClassName="text-xl"
          />
        </div>
      );
    }

    if (!products || products.length === 0) {
      return <NoProductsFound />;
    }

    return (
      <div className="space-y-6">
        <ProductList
          products={products}
          type="product_listing"
          filter_by={filterState}
        />
        <div className="mixitup-page-list" />
      </div>
    );
  };

  return (
    <MainLayout>
      <PageMeta
        title="Products | Zenos"
        description="View all our products on Zenos; New and UK Used Products"
      >
        <div className="py-8 px-3 space-y-6 md:px-10">
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
                paginateLimit={12}
                filter_by={filterState}
                onFilterChange={handleFilterChange}
              />
            </div>
            <div className="relative min-h-[200px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </PageMeta>
    </MainLayout>
  );
};

export default Products;