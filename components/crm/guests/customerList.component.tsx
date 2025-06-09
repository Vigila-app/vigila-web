"use client";
import { useEffect, useState } from "react";
import { Avatar, Badge, Button, LastUpdate, Table } from "@/components";
import {
  capitalize,
  replaceDynamicUrl,
  timestampToDate,
} from "@/src/utils/common.utils";
import { ChevronRightIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Routes } from "@/src/routes";
import { DropdownFilter } from "@/components/filters";
import { useModalStore } from "@/src/store/modal/modal.store";
import { isValidDate } from "@/src/utils/date.utils";
import { useTabActive } from "@/src/hooks";
import { useCrmStore } from "@/src/store/crm/crm.store";
import CustomerFormModal, {
  CustomerFormModalId,
} from "@/components/crm/guests/guestForm/customerForm.modal";

const CustomerListComponent = () => {
  const {
    getCustomers,
    customers: customersStore = [],
    lastUpdate,
    resetLastUpdate,
  } = useCrmStore();
  const { openModal } = useModalStore();
  const isTabActive = useTabActive();

  const [customers, setCustomers] = useState(customersStore);
  const [filters, setFilters] = useState<{ [filter: string]: string }>({
    customer: "",
  });

  const updateCustomerList = async (force = false) => {
    getCustomers(force);
  };

  useEffect(() => {
    if (isTabActive) updateCustomerList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabActive]);

  useEffect(() => {
    setCustomers(customersStore);
  }, [customersStore]);

  const updateFilters = (filter: string, value: string) => {
    setFilters({ ...filters, [filter]: value });
  };

  return (
    <>
      <div className="sr-only bg-blue-500 bg-green-500 bg-red-500 bg-yellow-500 bg-purple-500" />
      <div className="w-full inline-flex items-center justify-between">
        <h2>
          Guest List (
          {customers?.length <= 99
            ? customers?.length
            : customers?.length
            ? "99+"
            : "0"}
          )
        </h2>
        <div className="inline-flex items-center gap-4">
          <Button
            icon={<UserPlusIcon className="size-4" />}
            customClass="!px-3 !py-0"
            text
            label="New Customer"
            action={() => openModal(CustomerFormModalId)}
          />
          <LastUpdate
            lastUpdate={lastUpdate as Date}
            onUpdate={() => updateCustomerList(true)}
          />
        </div>
      </div>
      <div className="my-4">
        <div className="space-y-2">
          <div className="w-full inline-flex items-center gap-8">
            <DropdownFilter
              label="Search"
              type="text"
              placeholder="Search Customer by ID or Name"
              onChange={(v) =>
                (v && v.length >= 3) || v === ""
                  ? updateFilters("customer", v)
                  : null
              }
              value={filters.customer}
            />
          </div>
          {filters.customer ? (
            <div className="w-full px-1 inline-flex items-center flex-wrap gap-2">
              {filters.customer ? (
                <Badge color="sky" label={`Search: ${filters.customer}`} />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <Table
        cols={[
          { field: "id", align: "left", label: "ID" },
          { field: "name", align: "left", sortable: true },
          //{ field: "unit", align: "left", sortable: true },
          { field: "updated_at", label: "Last update", sortable: true },
          { field: "action", content: <></>, align: "right", size: "sm" },
        ]}
        order={{ field: "updated_at", direction: "asc" }}
        rows={customers
          .filter((customer) => {
            let flag = true;
            flag =
              flag && filters.customer
                ? customer.id
                    .toLowerCase()
                    .includes((filters.customer as string).toLowerCase()) ||
                  `${customer.name} ${customer.surname}`
                    .toLowerCase()
                    .includes((filters.customer as string).toLowerCase())
                : flag;

            return flag;
          })
          .map((customer) => ({
            ...customer,
            created_at: isValidDate(customer.created_at as unknown as string)
              ? new Date(
                  customer.created_at as unknown as string
                )?.toLocaleString()
              : timestampToDate(customer.created_at)?.toLocaleString(),
            updated_at: isValidDate(customer.updated_at as unknown as string)
              ? new Date(
                  customer.updated_at as unknown as string
                )?.toLocaleString()
              : timestampToDate(customer.updated_at)?.toLocaleString(),
            id:
              filters.customer && customer.id.includes(filters.customer) ? (
                <>
                  {customer.id.split(filters.customer)[0]}
                  <span className="text-sky-400 font-medium">
                    {filters.customer}
                  </span>
                  {customer.id.split(filters.customer)[1]}
                </>
              ) : (
                customer.id
              ),
            name: (
              <div className="inline-flex items-center gap-1 capitalize">
                <Avatar
                  value={`${customer.name} ${customer.surname}`}
                  size="standard"
                />
                {filters.customer &&
                `${customer.name} ${customer.surname}`
                  .toLowerCase()
                  .includes(filters.customer.toLowerCase()) ? (
                  <>
                    {
                      `${customer.name} ${customer.surname}`
                        .toLowerCase()
                        .split(filters.customer.toLowerCase())[0]
                    }
                    <span className="text-sky-400 font-medium">
                      {filters.customer}
                    </span>
                    {
                      `${customer.name} ${customer.surname}`
                        .toLowerCase()
                        .split(filters.customer.toLowerCase())[1]
                    }
                  </>
                ) : (
                  `${capitalize(customer.name)} ${capitalize(customer.surname)}`
                )}
              </div>
            ),
            //unit: userUnits.find((unit) => unit.id === costumer.unitId)?.name || "-",
            action: (
              <Link
                className="absolute right-4 top-1/2 translate-y-[-50%]"
                href={`${replaceDynamicUrl(
                  Routes.guestDetails.url,
                  ":guestId",
                  customer.id
                )}`}
              >
                <ChevronRightIcon className="size-4" />
              </Link>
            ),
          }))}
      />
      {/*<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {customers
          .filter((customer) => {
            let flag = true;
            flag =
              flag && filters.customer
                ? customer.id.includes(filters.customer) ||
                  customer.name.includes(filters.customer)
                : flag;

            return flag;
          })
          .map((customer) => (
            <ServiceCard key={customer.id} service={service} />
          ))}
        </div>*/}
      <CustomerFormModal
        onSubmit={() => {
          resetLastUpdate?.();
          getCustomers?.(true);
        }}
      />
    </>
  );
};

export default CustomerListComponent;
