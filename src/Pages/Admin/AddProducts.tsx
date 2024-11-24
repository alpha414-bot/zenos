import Button from "@/Components/Button";
import Input from "@/Components/Input";
import MediaModal from "@/Components/MediaModal";
import SelectDropdown from "@/Components/SelectDropdown";
import TextArea from "@/Components/TextArea";
import VariantsType from "@/Components/VariantsType";
import MainLayout from "@/Layouts/MainLayout";
import _ from "lodash";
import { useState } from "react";
import { useForm } from "react-hook-form";

const AddProducts = () => {
  const { control, handleSubmit, watch } = useForm({ mode: "all" });
  const [variants, setVariants] = useState([{}]);
  const submitProductsForm = (data: any) => {
    console.log("products data", data);
  };
  return (
    <MainLayout title="Add Products">
      <form
        className="px-4 py-20 space-y-5"
        onSubmit={handleSubmit(submitProductsForm)}
      >
        <div className="border-b border-white py-2">
          <h4 className="text-white text-2xl font-bold">Add New Products</h4>
        </div>
        {JSON.stringify(watch())}<br/>
        {JSON.stringify(_.compact([watch()]))}
        <div className="flex flex-col items-start gap-6 md:flex-row">
          <div data-type="dropzone" className="min-w-full md:min-w-[40%]">
            <MediaModal
              control={control}
              name="image"
              placeholder="Upload Product Image(s)"
              align="col"
              multiSelect
              rules={{ required: "Image is required" }}
            />
          </div>
          <div className="space-y-4 grow w-full">
            <Input
              control={control}
              name="name"
              placeholder="Product Name"
              rules={{ required: "Product name is required" }}
            />
            <TextArea
              control={control}
              name="description"
              placeholder="Product Description"
              rules={{ required: "Product name is required" }}
              rows={7}
            />
            <SelectDropdown
              name="category"
              options={[
                { key: "oraimo", value: "Oraimo" },
                { key: "new_age", value: "New Age" },
                { key: "fairly_used", value: "UK Used" },
              ]}
              control={control}
              placeholder="Category"
              rules={{ required: "Category is required" }}
            />
            <Input
              control={control}
              name="price"
              placeholder="Price"
              rules={{ required: "Price is required" }}
            />
            <Input
              control={control}
              name="salesPrice"
              placeholder="Discounted/Old Price"
            />
            <div className="flex justify-end">
              <Button type="submit" className="py-1 px-6 text-lg">
                Save
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-dotted">
                <p className="text-2xl font-semibold">Variants</p>
                <button
                  type="button"
                  className="border p-0.5 rounded-md"
                  onClick={() => {
                    setVariants([...variants, ...[{}]]);
                  }}
                >
                  <svg
                    className="w-9 h-9 text-white"
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
                      d="M5 12h14m-7 7V5"
                    />
                  </svg>
                </button>
              </div>
              {/* <div className="grid grid-cols-2 gap-4 md:grid-cols-4"> */}
              <div className="space-y-6">
                {variants &&
                  variants.map((_item, i) => {
                    return <VariantsType control={control} i={i} key={i} />;
                  })}
              </div>
            </div>
          </div>
        </div>
      </form>
    </MainLayout>
  );
};

export default AddProducts;
