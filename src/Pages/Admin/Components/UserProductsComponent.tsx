import {  useMemo } from 'react';
import { getAuth } from "firebase/auth";
import { useProductsData } from "@/Services/Hooks";
import { Timestamp } from 'firebase/firestore';
import { ColumnDef } from "@tanstack/react-table";
import classNames from "classnames";
import moment from "moment";
import { price } from "@/System/function";
import Table from "@/Components/Table";
import Image from "@/Components/Image";

interface ProductItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  salesPrice?: number;
  image: string[];
  status: string;
  category: {
    key: string;
    value: string;
  };
  subcategory: {
    key: string;
    value: string;
  };
  createdAt: Timestamp;
  createdBy: string;
}

const UserProductsComponent = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.error("No user is signed in.");
    return <div>No user signed in</div>;
  }

  const userUuid = currentUser.uid;

  // Fetch products
  let { data: products = [] } = useProductsData<ProductItemType[]>(undefined, true);

  // Filter products based on the user's UUID
  if (Array.isArray(products)) {
    products = products.filter((product) => product.createdBy === userUuid);
  }

  const columns = useMemo<ColumnDef<ProductItemType>[]>(
    () => [
      {
        header: "Status",
        accessorFn: (row) => row.status,
        cell: (info) => (
          <div className="flex items-center gap-2">
            <span
              className={classNames("block w-3 h-3 rounded-full", {
                "bg-green-500": info.getValue() === "active",
                "bg-red-500": info.getValue() === "draft",
                "bg-gray-500": info.getValue() === "archived"
              })}
            ></span>
            <span className="capitalize">{info.getValue() as string}</span>
          </div>
        ),
        footer: (props) => props.column.id,
        enableSorting: false,
      },
      {
        accessorKey: "image",
        cell: (info) => (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1 min-w-60">
            {(info.getValue() as string[]).map((item, index) => (
              <Image
                key={index}
                src={item}
                className="w-full max-w-full max-h-full bg-zenos-200 rounded-sm overflow-hidden"
                width={120}
                alt="Product Image"
              />
            ))}
          </div>
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
            {info.getValue() as string}
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
    ],
    []
  );

  return (
    <section id="UserProductsSection" tabIndex={-1}>
      <div className="pb-2 border-b-2 border-gray-500 mb-2">
        <h4 className="text-3xl font-bold">My Products</h4>
      </div>
      <div className="py-8">
        <Table
          columns={columns}
          data={products as ProductItemType[]}
          noDataText="No products available"
        />
      </div>
    </section>
  );
};

export default UserProductsComponent;