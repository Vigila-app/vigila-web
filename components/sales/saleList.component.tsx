"use client";
import { useEffect, useState } from "react";
import { Avatar, Badge, LastUpdate, Table } from "@/components";
import { amountDisplay, replaceDynamicUrl } from "@/src/utils/common.utils";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Routes } from "@/src/routes";
import { DropdownFilter } from "@/components/filters";
import { dateDisplay } from "@/src/utils/date.utils";
import { useSalesStore } from "@/src/store/sales/sales.store";
import { useTabActive } from "@/src/hooks";
import { useCrmStore } from "@/src/store/crm/crm.store";
import { SaleI } from "@/src/types/sales.types";

const SaleListComponent = () => {
  const { getSales, sales: salesStore = [], lastUpdate } = useSalesStore();
  const { customers, getCustomers } = useCrmStore();
  const isTabActive = useTabActive();

  const [sales, setSales] = useState(salesStore);
  const [filters, setFilters] = useState<{
    [filter: string]: string | string[];
  }>({
    sale: "",
    unit: [],
  });

  const updateSaleList = (force = false) => {
    getSales(force);
  };

  const getUpdatedData = (force = false) => {
    updateSaleList(force);
    getCustomers(force);
  };

  useEffect(() => {
    if (isTabActive) getUpdatedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabActive]);

  useEffect(() => {
    setSales(salesStore);
  }, [salesStore]);

  const updateFilters = (filter: string, value: string | string[]) => {
    setFilters({ ...filters, [filter]: value });
  };

  const getCustomerAvatar = (sale: SaleI) => {
    const customer = customers.find(
      (customer) => customer.id === sale.guestId
    );
    if (customer) {
      return (
        <div className="inline-flex items-center gap-1 capitalize">
          <Avatar
            value={`${customer.name} ${customer.surname}`}
            size="standard"
          />
          {customer.name}&nbsp;{customer.surname}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="sr-only bg-blue-500 bg-green-500 bg-red-500 bg-yellow-500 bg-purple-500" />
      <div className="w-full inline-flex items-center justify-between">
        <h2>
          Sale List (
          {sales?.length <= 99 ? sales?.length : sales?.length ? "99+" : "0"})
        </h2>
        <LastUpdate
          lastUpdate={lastUpdate as Date}
          onUpdate={() => updateSaleList(true)}
        />
      </div>
      <div className="my-4">
        <div className="space-y-2">
          <div className="w-full inline-flex items-center gap-8">
            <DropdownFilter
              label="Search"
              type="text"
              placeholder="Search Sale by ID"
              onChange={(v) =>
                (v && v.length >= 3) || v === ""
                  ? updateFilters("sale", v)
                  : null
              }
              value={filters.sale as string}
            />
            <DropdownFilter
              label="Unit"
              type="checkbox"
              // options={userUnits.map((unit) => ({
              //   label: unit.name,
              //   value: unit.id,
              // }))}
              placeholder="Search sale by Unit"
              onChange={(v) => {
                (v && v.length >= 3) || v === ""
                  ? updateFilters("unit", v ? v.split(", ") : [])
                  : null;
              }}
              value={(filters.unit as string[]).join(", ")}
            />
          </div>
          {filters.sale || filters.unit?.length ? (
            <div className="w-full px-1 inline-flex items-center flex-wrap gap-2">
              {filters.sale ? (
                <Badge
                  color="sky"
                  label={`Search: ${(filters.sale as string).toUpperCase()}`}
                />
              ) : null}
              {/* {filters.unit?.length
                ? (filters.unit as string[]).map((u) => (
                    <Badge
                      key={u}
                      color="purple"
                      label={`Unit: ${
                        userUnits.find((un) => un.id === u)?.name || u
                      }`}
                    />
                  ))
                : null} */}
            </div>
          ) : null}
        </div>
      </div>
      <Table
        cols={[
          { field: "id", align: "left", label: "ID" },
          { field: "unit", label: "Unit", align: "left", sortable: true },
          { field: "guest", label: "Guest", align: "left" },
          { field: "amount", label: "Amount", align: "right", sortable: true },
          { field: "creationDate", label: "Date", sortable: true },
          { field: "action", content: <></>, align: "right", size: "sm" },
        ]}
        order={{ field: "creationDate", direction: "asc" }}
        rows={sales
          .filter((sale) => {
            let flag = true;
            flag =
              flag && filters.sale
                ? sale.id
                    .toLowerCase()
                    .includes((filters.sale as string).toLowerCase())
                : flag;

            flag =
              flag && filters.unit?.length && sale.unitId
                ? filters.unit.includes(sale.unitId)
                : flag;

            return flag;
          })
          .map((sale) => ({
            ...sale,
            creationDate: dateDisplay(sale.creationDate, "date"),
            creationDateValue: new Date(
              dateDisplay(sale.creationDate, "dateType")
            )
              .getTime()
              .toString(),
            id:
              filters.sale &&
              sale.id
                .toLowerCase()
                .includes((filters.sale as string).toLowerCase()) ? (
                <>
                  {sale.id
                    .toLowerCase()
                    .split((filters.sale as string).toLowerCase())[0]
                    .toUpperCase()}
                  <span className="text-sky-400 font-medium">
                    {(filters.sale as string).toUpperCase()}
                  </span>
                  {sale.id
                    .toLowerCase()
                    .split((filters.sale as string).toLowerCase())[1]
                    .toUpperCase()}
                </>
              ) : (
                sale.id
              ),
            amount: `${sale.currency}${amountDisplay(Number(sale.amount))}`,
            // unit:
            //   userUnits.find((unit) => unit.id === sale.unitId)?.name || "-",
            guest: getCustomerAvatar(sale) || "-",

            action: (
              <Link
                className="absolute right-4 top-1/2 translate-y-[-50%]"
                href={`${replaceDynamicUrl(
                  Routes.saleDetails.url,
                  ":saleId",
                  sale.id
                )}`}
              >
                <ChevronRightIcon className="size-4" />
              </Link>
            ),
          }))}
      />
    </div>
  );
};

export default SaleListComponent;
