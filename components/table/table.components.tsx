"use client";
import { OrderDirectionEnum } from "@/src/types/app.types";
import {
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useEffect, useState } from "react";

export type TableColsI = {
  field: string;
  label?: string;
  content?: React.ReactNode;
  align?: "center" | "left" | "right";
  sortable?: boolean;
  size?: "sm" | "md" | "lg";
};

type TableI = {
  cols: TableColsI[];
  rows?: { [field: string]: any }[];
  page?: number;
  pageSize?: number;
  pages?: number;
  onPageChange?: (newPage: number) => void;
  order?: {
    field: string;
    direction: OrderDirectionEnum;
  };
};

const Table = (props: TableI) => {
  const {
    cols = [],
    rows = [],
    page = 0,
    pageSize = 25,
    pages: ePages,
    onPageChange = () => ({}),
    order: orderExt = {
      field: cols[0].field,
      direction: OrderDirectionEnum.DESC,
    },
  } = props;
  const [order, setOrder] = useState<{
    field: String;
    direction: OrderDirectionEnum;
  }>(orderExt);

  const [currentPage, setCurrentPage] = useState(page);
  const pages = ePages || Math.max(1, Math.ceil(rows.length / pageSize));

  const handleChangePage = (newPage = currentPage) => {
    setCurrentPage(Math.max(0, Math.min(newPage, pages - 1)));
  };

  useEffect(() => {
    if (currentPage !== page) onPageChange(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const orderBy = (col: TableColsI) => {
    if (col.sortable) {
      setOrder({
        field: col.field,
        direction:
          order.field === col.field &&
          order.direction === OrderDirectionEnum.DESC
            ? OrderDirectionEnum.ASC
            : OrderDirectionEnum.DESC,
      });
    }
  };

  return (
    <>
      <div className="w-full overflow-x-scroll pb-2">
        <table className="cursor-default min-w-full divide-y-2 divide-gray-200 bg-white rounded shadow text-xs md:text-sm">
          <thead className="bg-white ltr:text-left rtl:text-right">
            <tr>
              {cols.map((col) => (
                <th
                  key={col.field}
                  className={clsx(
                    "whitespace-nowrap px-2 py-2 font-medium text-gray-900 rounded capitalize",
                    col.sortable && "cursor-pointer cursor-ns-resize",
                    col.sortable && order.field === col.field && "bg-gray-100",
                    col.size === "sm"
                      ? "max-w-12"
                      : col.size === "lg"
                        ? "max-w-48"
                        : "max-w-24"
                  )}
                  onClick={() => col.sortable && orderBy(col)}
                >
                  <div className="inline-flex items-center justify-between px-2 gap-2 w-full relative overflow-hidden">
                    <span className="max-w-24 text-ellipsis overflow-hidden text-nowrap">
                      {col.content || col?.label || col.field}
                    </span>
                    {col.sortable && order.field === col.field ? (
                      <>
                        {order.direction === OrderDirectionEnum.ASC ? (
                          <BarsArrowUpIcon className="size-4" />
                        ) : (
                          <BarsArrowDownIcon className="size-4" />
                        )}
                      </>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {rows?.length ? (
            <tbody className="bg-gray-100/25 divide-y divide-gray-200">
              {rows
                .sort((a, b) => {
                  if (order.direction === OrderDirectionEnum.ASC) {
                    return (a[`${order.field}Value`] ||
                      a[order.field as string]?.toLowerCase?.()) >
                      (b[`${order.field}Value`] ||
                        b[order.field as string]?.toLowerCase?.())
                      ? -1
                      : 1;
                  }
                  return (a[`${order.field}Value`] ||
                    a[order.field as string]?.toLowerCase?.()) <
                    (b[`${order.field}Value`] ||
                      b[order.field as string]?.toLowerCase?.())
                    ? -1
                    : 1;
                })
                .slice(
                  currentPage * pageSize,
                  currentPage * pageSize + pageSize
                )
                .map((row, i) => (
                  <tr
                    key={`row-${i}`}
                    className="bg-transparent transition odd:bg-white even:bg-gray-100/25 hover:bg-gray-200"
                  >
                    {cols.map(
                      ({
                        field,
                        align = "center",
                        size = "md",
                        sortable = false,
                      }) => (
                        <td
                          key={`${i}-${field}`}
                          className={clsx(
                            "relative px-4 py-2 text-gray-900",
                            "whitespace-nowrap text-ellipsis overflow-hidden",
                            `text-${align}`,
                            //sortable && order.field === field && "bg-gray-100",
                            size === "sm"
                              ? "max-w-12	"
                              : size === "lg"
                                ? "max-w-48"
                                : "max-w-24"
                          )}
                        >
                          {row[field] || "-"}
                        </td>
                      )
                    )}
                  </tr>
                ))}
            </tbody>
          ) : null}
        </table>
        {!rows.length ? (
          <div className="w-full border-t border-gray-200 text-sm rounded bg-white py-2 px-4 text-center">
            No data to display
          </div>
        ) : null}
      </div>
      <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
        <ol className="flex justify-center gap-1 text-xs">
          <li>
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 transition hover:!bg-primary-600/25"
              onClick={() => handleChangePage(currentPage - 1)}
            >
              <span className="sr-only">Prev Page</span>
              <ChevronLeftIcon className="size-3" />
            </button>
          </li>

          {new Array(pages).fill("").map((n, i) => (
            <li key={i}>
              <button
                type="button"
                className={clsx(
                  "block size-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900 transition",
                  i === currentPage
                    ? "font-medium !border-primary-600 !bg-primary-600 !text-white"
                    : "hover:!bg-primary-600/25"
                )}
                onClick={() => handleChangePage(i)}
              >
                <span className="sr-only">Go to page</span>
                {i + 1}
              </button>
            </li>
          ))}

          <li>
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 transition hover:!bg-primary-600/25"
              onClick={() => handleChangePage(currentPage + 1)}
            >
              <span className="sr-only">Next Page</span>
              <ChevronRightIcon className="size-3" />
            </button>
          </li>
        </ol>
      </div>
    </>
  );
};

export default Table;
