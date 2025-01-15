import { useAppSelector } from "@/Services/Redux/Hook";
import {
  PhoneAccessoriesSubCategory,
  DisplayCategories,
} from "@/System/Constants";
import mixitup from "mixitup";
import mixitupmultifilter from "mixitup-multifilter";
import mixitupPagination from "mixitup-pagination";
import { useEffect, useState } from "react";

interface FilterProps {
  paginateLimit?: number;
  filter_by?: {
    type?: string;
    subcategory?: string;
  };
  onFilterChange?: (filters: { type: string; subcategory: string }) => void;
}

const Filter: React.FC<FilterProps> = ({
  paginateLimit = 12,
  filter_by,
  onFilterChange,
}) => {
  const { mixerContainerState } = useAppSelector((state) => state.mixer);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [mixer, setMixer] = useState<any>(null);

  useEffect(() => {
    if (filter_by?.type) {
      setSelectedType(filter_by.type);
    }
    if (filter_by?.subcategory) {
      setSelectedSubcategory(filter_by.subcategory);
    }
  }, [filter_by]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    mixitup.use(mixitupmultifilter);
    mixitup.use(mixitupPagination);

    const containerEl = document.querySelector(".mixitup-product-wrapper");
    if (!containerEl) return;

    try {
      const mixerInstance = mixitup(containerEl, {
        multifilter: {
          enable: true,
        },
        pagination: {
          limit: paginateLimit,
          maintainActivePage: true,
          hidePageListIfSinglePage: true,
        },
        selectors: {
          target: ".mix-target",
        },
        animation: {
          duration: 350,
          effects: "fade scale(0.5)",
        },
      });

      setMixer(mixerInstance);

      if (filter_by?.type || filter_by?.subcategory) {
        const filters: string[] = [];
        if (filter_by.type) filters.push(`.category-${filter_by.type}`);
        if (filter_by.subcategory) filters.push(`.subcategory-${filter_by.subcategory}`);
        mixerInstance.filter(filters.join(' '));
      }
    } catch (error) {
      console.error("MixItUp initialization error:", error);
    }

    return () => {
      mixer?.destroy();
    };
  }, [mixerContainerState, paginateLimit]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setSelectedType(type);
    
    if (!type) {
      setSelectedSubcategory("");
    }

    if (mixer) {
      const filters: string[] = [];
      if (type) filters.push(`.category-${type}`);
      if (selectedSubcategory && type === "phone-accessories") {
        filters.push(`.subcategory-${selectedSubcategory}`);
      }
      mixer.filter(filters.length ? filters.join(' ') : 'all');
    }

    onFilterChange?.({ type, subcategory: selectedSubcategory });
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategory = e.target.value;
    setSelectedSubcategory(subcategory);

    if (mixer) {
      const filters: string[] = [`.category-${selectedType}`];
      if (subcategory) {
        filters.push(`.subcategory-${subcategory}`);
      }
      mixer.filter(filters.join(' '));
    }

    onFilterChange?.({ type: selectedType, subcategory });
  };

  const handleClearFilters = () => {
    setSelectedType("");
    setSelectedSubcategory("");
    if (mixer) mixer.filter('all');
    onFilterChange?.({ type: "", subcategory: "" });
  };

  const showSubcategories = selectedType === 'phone-accessories';

  return (
    <div className="flex w-full flex-col-reverse md:flex-col">
      <form className="w-full bg-gray-800 rounded-lg sm:block">
        <div className="py-2 px-4 flex justify-end">
          <button
            type="button"
            onClick={handleClearFilters}
            className="underline underline-offset-2 text-base text-gray-300 hover:text-white transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <div className="border-b-2 border-gray-400 px-4 py-2">
          <p className="text-2xl font-semibold text-white">Product Filter</p>
        </div>

        <div className="py-2 px-2 space-y-2 md:space-y-5 md:py-8 md:px-4">
          <div className="relative flex flex-col">
            <label
              htmlFor="product-type"
              className="absolute top-2 left-4 text-xs text-gray-300 tracking-tighter"
            >
              Product Type
            </label>
            <select
              id="product-type"
              value={selectedType}
              onChange={handleTypeChange}
              className="pt-6 pb-2 px-4 bg-gray-700 text-white font-bold border-2 border-gray-400 rounded-md focus:border-blue-500 focus:outline-none"
            >
              <option value="">All Products</option>
              {DisplayCategories.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.value}
                </option>
              ))}
            </select>
          </div>

          {showSubcategories && (
            <div className="relative flex flex-col">
              <label
                htmlFor="subcategory"
                className="absolute top-2 left-4 text-xs text-gray-300 tracking-tighter"
              >
                Subcategory
              </label>
              <select
                id="subcategory"
                value={selectedSubcategory}
                onChange={handleSubcategoryChange}
                className="pt-6 pb-2 px-4 bg-gray-700 text-white font-bold border-2 border-gray-400 rounded-md focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Subcategories</option>
                {PhoneAccessoriesSubCategory.map((sub) => (
                  <option key={sub.key} value={sub.key}>
                    {sub.value}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Filter;