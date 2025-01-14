import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import classNames from "classnames";
import { FC, useRef, useState } from "react";
import Label from "./Label";

const Table: FC<{
  data: any[];
  columns: ColumnDef<any>[];
  noDataText?: string;
}> = ({ data, columns, noDataText }) => {
  const tableRef = useRef(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
    },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });
  return (
    <div>
      <section className="space-y-5">
        <div className="flex flex-col items-stretch justify-between gap-y-3 sm:flex-row">
          <div className="grow flex items-center justify-center sm:justify-start space-x-2">
            <Label htmlFor="per-page" value="Per page" />
            <select
              id="per-page"
              className="bg-gray-800 px-4 py-2 border-gray-300 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 rounded-md shadow-sm"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50, data?.length > 50 ? "ALL" : undefined].map(
                (pageSize, index) =>
                  pageSize && (
                    <option
                      key={`${index}-${pageSize}`}
                      value={pageSize == "ALL" ? data?.length : pageSize}
                    >
                      Show {pageSize}
                    </option>
                  )
              )}
            </select>
          </div>
          <div className="grow flex gap-2 items-stretch sm:justify-end">
            <input
              type="text"
              value={table.getState().globalFilter}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              placeholder="Search table..."
              className="block w-full sm:w-3/4 md:w-1/2 px-4 py-2 bg-gray-800 border border-gray-700 text-white text-base rounded-lg focus:ring-zenos-500 focus:border-zenos-500 placeholder:text-gray-400"
            />
          </div>
        </div>
        <div className="space-y-3">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table
              ref={tableRef}
              id="table"
              className="w-full text-base text-left rtl:text-right text-gray-400"
            >
              <thead className="text-xsuppercase bg-gray-700 text-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          scope="col"
                          key={header.id}
                          {...{
                            className: classNames("px-6 py-3", {
                              "cursor-pointer select-none":
                                header.column.getCanSort(),
                            }),
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          <div className="flex justify-between gap-2 items-center">
                            <span>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>

                            {/* Sorting */}
                            {header.column.getCanSort() && (
                              <div className="flex flex-col gap-0">
                                <svg
                                  className={classNames("block w-4 h-4", {
                                    "text-zenos-500":
                                      header.column.getIsSorted() == "asc",
                                    "text-gray-400":
                                      header.column.getIsSorted() != "asc",
                                  })}
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.575 13.729C4.501 15.033 5.43 17 7.12 17h9.762c1.69 0 2.618-1.967 1.544-3.271l-4.881-5.927a2 2 0 0 0-3.088 0l-4.88 5.927Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <svg
                                  className={classNames(
                                    "w-4 h-4 text-gray-200",
                                    {
                                      "text-zenos-500":
                                        header.column.getIsSorted() == "desc",
                                      "text-gray-400":
                                        header.column.getIsSorted() != "desc",
                                    }
                                  )}
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="align-top">
                {(table.getRowModel()?.rows?.length > 0 &&
                  table.getRowModel().rows.map((row) => {
                    return (
                      <tr
                        key={row.id}
                        className="border-b bg-gray-900 border-gray-700 hover:bg-gray-800"
                      >
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td
                              key={cell.id}
                              className="px-6 py-4 font-semibold text-white"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })) || (
                  <tr>
                    <td
                      className="px-6 py-4 text-center text-lg font-medium text-gray-300 bg-gray-800"
                      colSpan={columns?.length}
                    >
                      {noDataText || "No records available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="h-0.5 bg-gray-700" />
          <div className="flex items-center justify-center gap-2 font-semibold sm:justify-start">
            <button
              className="border border-gray-300 rounded-md px-4 py-0.5 disabled:bg-zinc-500 disabled:text-gray-400 disabled:cursor-not-allowed"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<< Previous"}
            </button>
            <span className="flex items-center gap-1 text-sm underline underline-offset-4 decoration-dotted">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount().toLocaleString()}
              </strong>
            </span>
            <button
              className="border border-gray-300 rounded-md px-4 py-0.5 disabled:bg-zinc-500 disabled:text-gray-400 disabled:cursor-not-allowed"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {"Next >>"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Table;
