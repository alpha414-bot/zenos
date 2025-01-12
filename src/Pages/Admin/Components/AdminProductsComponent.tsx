import Button from "@/Components/Button";
import ButtonAsLink from "@/Components/ButtonAsLink";
import Image from "@/Components/Image";
import Input from "@/Components/Input";
import Media from "@/Components/Media";
import RichEditor from "@/Components/RichEditor";
import SelectDropdown from "@/Components/SelectDropdown";
import Table from "@/Components/Table";
import VariantsType from "@/Components/VariantsType";
import { useProductsData, useUkUsedProductData } from "@/Services/Hooks";
import { addCollectionDoc, updateCollectionDoc } from "@/Services/Queries";
import { queryToDeleteProduct } from "@/Services/Queries/ProductQuery";
import {
  ZenosCategory,
  ZenosNewAgeSubCategory,
  ZenosOraimoSubCategory,
} from "@/System/Constants";
import { price } from "@/System/function";
import { ColumnDef } from "@tanstack/react-table";
import classNames from "classnames";
import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { InstanceOptions, Modal } from "flowbite";
import _ from "lodash";
import moment from "moment";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

// Components to handle product in the ecommerce website
const ProductsAction = ({ values }: { values: ProductItemType }) => {
  const { control, handleSubmit, reset, watch } = useForm();
  const [editProductModal, setEditProductModal] = useState<Modal>();
  const updateProductSubmission = (data?: any) => {
    if (data.image && data.image.length > 0) {
      let image = _.flatMap(data.image, (item) =>
        item?.media?.name ? item?.media?.name : item
      );
      data.image = image;
    }
    const productData: ProductItemType = {
      ...values,
      ...data,
    };
    updateCollectionDoc(
      "Products",
      values?.id,
      JSON.parse(JSON.stringify(productData)),
      `<span class="font-extrabold underline underline-offset-4 decoration-dotted decoration-green-500">${productData.name}</span> updated successfully.`
    ).then(() => {
      if (editProductModal) {
        editProductModal?.hide();
      }
      return reset();
    });
  };
  useLayoutEffect(() => {
    const $targetEl: HTMLElement | null = document.getElementById(
      `${values?.id}-edit-product-modal`
    );
    // instance options object
    const instanceOptions: InstanceOptions = {
      id: `${values?.id}-edit-product-modal`,
      override: true,
    };
    const modalInstance = new Modal(
      $targetEl,
      {
        placement: "bottom-right",
        backdrop: "dynamic",
        closable: true,
        onHide: () => {
          reset();
          console.log("Hiding modal!");
        },
      },
      instanceOptions
    );
    setEditProductModal(modalInstance);
    return modalInstance.hide();
  }, [values]);
  return (
    <>
      <div className="flex items-center gap-2 flex-nowrap">
        <ButtonAsLink
          to={`/product/${values?.id}`}
          target="_blank"
          className="btn !bg-blue-500 !px-2 flex gap-0.5"
          custom
        >
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M4.998 7.78C6.729 6.345 9.198 5 12 5c2.802 0 5.27 1.345 7.002 2.78a12.713 12.713 0 0 1 2.096 2.183c.253.344.465.682.618.997.14.286.284.658.284 1.04s-.145.754-.284 1.04a6.6 6.6 0 0 1-.618.997 12.712 12.712 0 0 1-2.096 2.183C17.271 17.655 14.802 19 12 19c-2.802 0-5.27-1.345-7.002-2.78a12.712 12.712 0 0 1-2.096-2.183 6.6 6.6 0 0 1-.618-.997C2.144 12.754 2 12.382 2 12s.145-.754.284-1.04c.153-.315.365-.653.618-.997A12.714 12.714 0 0 1 4.998 7.78ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              clipRule="evenodd"
            />
          </svg>
          <span className=" sr-only">view</span>
        </ButtonAsLink>
        <Button
          type="button"
          className="btn !bg-green-500 !px-2 !py-1 flex gap-0.5"
          custom
          onClick={(e) => {
            e.preventDefault();
            editProductModal?.show();
          }}
        >
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
              clipRule="evenodd"
            />
          </svg>
          <span className=" sr-only">edit</span>
        </Button>
        <Button
          type="button"
          data-modal-target={`${values?.id}-delete-product-modal`}
          data-modal-toggle={`${values?.id}-delete-product-modal`}
          className="btn !bg-red-500 !px-2 !py-1 flex gap-0.5"
          custom
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
              clipRule="evenodd"
            />
          </svg>

          <span className=" sr-only">delete</span>
        </Button>
      </div>
      {/* Edit Modal */}
      <div
        id={`${values?.id}-edit-product-modal`}
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-0 w-full max-w-xl max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Product
              </h3>
              <button
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => {
                  editProductModal?.hide();
                }}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div className="p-4 md:p-5">
              <form
                className="space-y-6 font-normal"
                action="#"
                onSubmit={handleSubmit(updateProductSubmission)}
              >
                <Input
                  control={control}
                  name={`name`}
                  //   name={`${values?.id}_name`}
                  placeholder="Product Name"
                  label="Product Name"
                  defaultValue={values?.name}
                  rules={{ required: "Product name is required" }}
                />
                <RichEditor
                  serialize="html"
                  name="description"
                  control={control}
                  rules={{ required: "Product description is required" }}
                  defaultValue={values?.description}
                />
                <SelectDropdown
                  name={`category`}
                  options={ZenosCategory}
                  control={control}
                  placeholder="Category"
                  label="Category"
                  containerClassName="z-20"
                  rules={{ required: "Category is required" }}
                  defaultValue={values?.category}
                />
                {watch("category")?.key == "oraimo" && (
                  <SelectDropdown
                    name="subcategory"
                    options={ZenosOraimoSubCategory}
                    control={control}
                    containerClassName="z-10"
                    placeholder="Subcategory"
                    label="Subcategory"
                    defaultValue={values?.subcategory}
                    rules={{ required: "Subcategory is required" }}
                  />
                )}
                {watch("category")?.key == "new-age" && (
                  <SelectDropdown
                    name="subcategory"
                    options={ZenosNewAgeSubCategory}
                    control={control}
                    containerClassName="z-10"
                    placeholder="Subcategory"
                    label="Subcategory"
                    defaultValue={values?.subcategory}
                    rules={{ required: "Subcategory is required" }}
                  />
                )}
                <Input
                  control={control}
                  name="price"
                  placeholder="Price"
                  label="Price"
                  rules={{ required: "Price is required" }}
                  defaultValue={values?.price}
                />
                <Input
                  control={control}
                  name="salesPrice"
                  label="Sales Price"
                  placeholder="Discounted/Old Price"
                  defaultValue={values?.salesPrice}
                />
                <div className="flex justify-end">
                  <Button type="submit" className="!block py-1 px-6 text-lg">
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div
        id={`${values?.id}-delete-product-modal`}
        tabIndex={-1}
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              queryToDeleteProduct(values?.id);
            }}
            className="relative bg-white rounded-lg shadow dark:bg-gray-700"
          >
            <button
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide={`${values?.id}-delete-product-modal`}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <svg
                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this product?
              </h3>
              <button
                data-modal-hide={`${values?.id}-delete-product-modal`}
                type="submit"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              >
                Yes, I'm sure
              </button>
              <button
                data-modal-hide={`${values?.id}-delete-product-modal`}
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                No, cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const SelectProductAction = ({
  id,
  status,
  include_archived,
}: {
  id: string;
  status?: any;
  include_archived?: boolean;
}) => {
  const [productStatus, setProductStatus] = useState<string>(status);
  const [showProductStatusDropdown, setShowProductStatusDropdown] =
    useState<boolean>(false);
  const onChange = (status: string) => {
    updateCollectionDoc(
      "Products",
      id,
      {
        status: status,
      },
      "Product status has been successfully updated"
    ).finally(() => {
      setProductStatus(status);
      setShowProductStatusDropdown(false);
    });
  };
  useEffect(() => {
    setProductStatus(status);
  }, [status]);
  return (
    <div className="space-y-1.5 flex flex-col items-center">
      <button
        type="button"
        className="relative flex items-center justify-start gap-2"
        onClick={() => {
          setShowProductStatusDropdown(!showProductStatusDropdown);
        }}
      >
        <span
          className={classNames("block w-4 h-4 rounded-full", {
            "bg-green-500": productStatus == "active",
            "bg-red-500": productStatus == "draft",
            "bg-yellow-500": productStatus == "archived",
          })}
        ></span>
        <svg
          className="w-4 h-4 text-gray-300"
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
            strokeWidth="4"
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={classNames(
          "overflow-hidden p-0 bg-gray-600 rounded-md transition-all duration-500 ease-in-out",
          {
            "h-0 opacity-0": !showProductStatusDropdown,
            "h-auto opacity-100": !!showProductStatusDropdown,
          }
        )}
      >
        {[
          { status: "active", color: "green", visible: true },
          { status: "draft", color: "red", visible: true },
          { status: "archived", color: "yellow", visible: include_archived },
        ].map(
          (item, index) =>
            item.visible && (
              <button
                type="button"
                key={index}
                className="flex items-center text-xs gap-2 w-full px-4 py-2 hover:bg-gray-700"
                onClick={() => onChange(item.status)}
              >
                <span
                  className={classNames("block w-2.5 h-2.5 rounded-full", {
                    "bg-red-500": item.color == "red",
                    "bg-green-500": item.color == "green",
                    "bg-yellow-500": item.color == "yellow",
                  })}
                ></span>
                {_.startCase(item.status)}
              </button>
            )
        )}
      </div>
    </div>
  );
};

const AdminProductsComponent = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { data: products } = useProductsData({ admin: true });
  const { data: ukusedproducts } = useUkUsedProductData();
  const { control, handleSubmit, reset, watch } = useForm({ mode: "all" });
  const ukused_columns = useMemo<ColumnDef<ProductItemType>[]>(
    () => [
      {
        header: "Status",
        accessorFn: (row) => row,
        cell: (info) => (
          <>
            <SelectProductAction
              id={(info.getValue() as any).id}
              status={(info.getValue() as any).status}
              include_archived
            />
          </>
        ),
        footer: (props) => props.column.id,
        enableSorting: false,
      },
      {
        accessorKey: "image",
        cell: (info) => (
          <>
            {/* <div className="flex items-center gap-1 flex-wrap"> */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 min-w-60">
              {(info.getValue() as any[]).map((item, index) => (
                <Image
                  key={index}
                  src={item}
                  className="w-full max-w-full max-h-full bg-zenos-200 rounded-sm overflow-hidden"
                  width={120}
                />
              ))}
            </div>
          </>
        ),
        header: () => <span>Product Image</span>,
        footer: (props) => props.column.id,
        enableSorting: false,
      },
      {
        accessorFn: (row) => row.name,
        id: "name",
        cell: (info) => (
          <span className="underline underline-offset-4 decoration-dotted whitespace-nowrap">
            {info.getValue() as any}
          </span>
        ),
        header: () => <span>Product Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "createdBy",
        header: () => <span>Created By</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "price",
        header: () => "Price",
        cell: (info) => <span>{price(info.getValue(), "currency", 0)}</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "subcategory.value",
        header: () => <span>Total Sold</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: (info) => (
          <span>
            {moment((info.getValue() as Timestamp).seconds * 1000).format(
              "MMM DD, YYYY hh:mma"
            )}
          </span>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: "Action",
        accessorFn: (row) => row,
        cell: (info) => {
          return <ProductsAction values={info.getValue() as any} />;
        },
        footer: (props) => props.column.id,
        enableSorting: false,
      },
    ],
    []
  );
  const columns = useMemo<ColumnDef<ProductItemType>[]>(
    () => [
      {
        header: "Status",
        accessorFn: (row) => row,
        cell: (info) => (
          <>
            <SelectProductAction
              id={(info.getValue() as any).id}
              status={(info.getValue() as any).status}
            />
          </>
        ),
        footer: (props) => props.column.id,
        enableSorting: false,
      },
      {
        accessorKey: "image",
        cell: (info) => (
          <>
            {/* <div className="flex items-center gap-1 flex-wrap"> */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 min-w-60">
              {(info.getValue() as any[]).map((item, index) => (
                <Image
                  key={index}
                  src={item}
                  className="w-full max-w-full max-h-full bg-zenos-200 rounded-sm overflow-hidden"
                  width={120}
                />
              ))}
            </div>
          </>
        ),
        header: () => <span>Product Image</span>,
        footer: (props) => props.column.id,
        enableSorting: false,
      },
      {
        accessorFn: (row) => row.name,
        id: "name",
        cell: (info) => (
          <span className="underline underline-offset-4 decoration-dotted whitespace-nowrap">
            {info.getValue() as any}
          </span>
        ),
        header: () => <span>Product Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "price",
        header: () => "Price",
        cell: (info) => <span>{price(info.getValue(), "currency", 0)}</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "category.value",
        header: () => <span>Category</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "subcategory.value",
        header: () => <span>Subcategory</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: (info) => (
          <span>
            {moment((info.getValue() as Timestamp).seconds * 1000).format(
              "MMM DD, YYYY hh:mma"
            )}
          </span>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: "Action",
        accessorFn: (row) => row,
        cell: (info) => {
          return <ProductsAction values={info.getValue() as any} />;
        },
        footer: (props) => props.column.id,
        enableSorting: false,
      },
    ],
    []
  );
  const [addProductModal, setAddProductModal] = useState<Modal>();
  const [variants, setVariants] = useState([{}]);
  const submitProductsForm = (data: any) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("No user is signed in.");
      return;
    }

    // Get the user's unique identifier (UUID)
    const userUuid = currentUser.uid;

    // Process images
    let image = _.flatMap(data.image, (item) => item.media.name);

    // Add document to Firestore
    addCollectionDoc(
      "Products",
      [
        JSON.parse(
          JSON.stringify({
            ...data,
            ...{
              image: image,
              status: "active",
              createdBy: userUuid, // Assign the user UUID to the "createdBy" field
              description: data.description?.replace(/\n/g, "\\n"),
            },
          })
        ),
      ],
      `<span class="font-extrabold underline underline-offset-4 decoration-dotted decoration-green-500">${data.name}</span> added successfully.`
    )
      .then(() => {
        addProductModal?.hide();
        formRef.current?.reset();
      })
      .finally(() => {
        // Reset form or perform redirect
        reset();
      });
  };
  useLayoutEffect(() => {
    const $targetEl: HTMLElement | null =
      document.getElementById(`add-product-modal`);
    // instance options object
    const instanceOptions: InstanceOptions = {
      id: `add-product-modal`,
      override: true,
    };
    const modalInstance = new Modal(
      $targetEl,
      {
        placement: "bottom-right",
        backdrop: "dynamic",
        closable: true,
      },
      instanceOptions
    );
    setAddProductModal(modalInstance);
    return modalInstance.hide();
  }, []);
  return (
    <section id="AdminProductsSection" tabIndex={-1}>
      <div className="pb-2 border-b-2 border-zenos-600 mb-2 flex items-center justify-between">
        <h4 className="text-3xl font-bold">Products</h4>
        <Button
          type="button"
          className="!px-3 !py-2 gap-1.5"
          onClick={() => {
            addProductModal?.show();
          }}
        >
          <svg
            className="w-6 h-6 text-white"
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
              strokeWidth="4"
              d="M5 12h14m-7 7V5"
            />
          </svg>
        </Button>
      </div>
      <div className="space-y-12">
        <div className="py-8">
          <Table
            columns={columns}
            data={products as any}
            noDataText="No products available"
          />
        </div>
        <div>
          <h4 className="text-3xl font-semibold">Uk Used Products</h4>
          <hr className="border-zenos-600 mt-4" />
          <div className="py-8">
            <Table
              columns={ukused_columns}
              data={ukusedproducts as any}
              noDataText="No Uk Used product listed yet."
            />
          </div>
        </div>
      </div>
      {/* add Products modal */}
      <div
        id="add-product-modal"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 py-6 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-800/30"
      >
        <div className="relative w-full max-w-4xl max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Create New Product
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => {
                  addProductModal?.hide();
                }}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <form
              ref={formRef}
              className="px-4 py-4 space-y-5"
              //   className="relative bg-white rounded-lg shadow dark:bg-gray-700"
              onSubmit={handleSubmit(submitProductsForm)}
            >
              <div className="flex flex-col items-start gap-6 md:flex-row">
                <div
                  data-type="dropzone"
                  className="min-w-full md:min-w-[40%] max-w-[40%]"
                >
                  <Media
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
                  <RichEditor
                    serialize="html"
                    name="description"
                    control={control}
                    rules={{ required: "Product description is required" }}
                  />
                  <SelectDropdown
                    name="category"
                    options={ZenosCategory}
                    control={control}
                    placeholder="Category"
                    containerClassName="z-30"
                    rules={{ required: "Category is required" }}
                  />
                  {watch("category")?.key == "oraimo" && (
                    <SelectDropdown
                      name="subcategory"
                      options={ZenosOraimoSubCategory}
                      control={control}
                      containerClassName="z-10"
                      placeholder="Subcategory"
                      rules={{ required: "Subcategory is required" }}
                    />
                  )}
                  {watch("category")?.key == "new-age" && (
                    <SelectDropdown
                      name="subcategory"
                      options={ZenosNewAgeSubCategory}
                      control={control}
                      containerClassName="z-10"
                      placeholder="Subcategory"
                      rules={{ required: "Subcategory is required" }}
                    />
                  )}
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
                          return (
                            <VariantsType control={control} i={i} key={i} />
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AdminProductsComponent;
