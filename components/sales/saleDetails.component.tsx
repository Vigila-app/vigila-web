"use client";
import {
  amountDisplay,
  replaceDynamicUrl,
} from "@/src/utils/common.utils";
import React, { useEffect } from "react";
import Link from "next/link";
import { Routes } from "@/src/routes";
import { dateDisplay } from "@/src/utils/date.utils";
import { useUnitsStore } from "@/src/store/units/units.store";
import { SaleI } from "@/src/types/sales.types";
import { useCrmStore } from "@/src/store/crm/crm.store";
import { Avatar } from "@/components";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

type SaleDetailsI = {
  sale: SaleI;
};

const SaleDetails = (props: SaleDetailsI) => {
  const { sale } = props;
  const { userUnits, getUserUnits } = useUnitsStore();
  const { customers, getCustomers } = useCrmStore();

  useEffect(() => {
    getUserUnits();
    getCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!sale?.id) return;

  const customer = customers.find(
    (customer) => customer.id === sale.guestId
  );

  return (
    <div>
      <div className="sr-only bg-blue-500/25 bg-green-500/25 bg-red-500/25 bg-yellow-500/25 bg-purple-500/25 bg-gray-500/25" />
      <div className="m-4">
        <div className="flow-root">
          <dl className="-my-3 divide-y divide-gray-200/50 text-sm">
            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">ID</dt>
              <dd className="text-gray-700 sm:col-span-2">{sale.id}</dd>
            </div>

            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Created at</dt>
              <dd className="text-gray-700 sm:col-span-2">
                {dateDisplay(sale.creationDate)}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Item</dt>
              <dd className="text-gray-700 sm:col-span-2 capitalize">
                <Link
                  className="inline-flex items-center gap-2 transition hover:underline"
                  href={
                    sale.metadata?.id
                      ? replaceDynamicUrl(
                          Routes.serviceDetails.url,
                          ":serviceId",
                          sale.metadata?.id || ""
                        )
                      : "#"
                  }
                  target="_blank"
                >
                  {sale.metadata?.name || "-"}
                  {sale.metadata?.id ? (
                    <ArrowTopRightOnSquareIcon className="size-4" />
                  ) : null}
                </Link>
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Quantity</dt>
              <dd className="text-gray-700 sm:col-span-2">
                {sale.metadata?.qty || "-"}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Amount</dt>
              <dd className="text-gray-700 sm:col-span-2">
                {`${sale.currency}${amountDisplay(Number(sale.amount))}`}
              </dd>
            </div>

            {customer ? (
              <div className="grid grid-cols-1 gap-1 py-3 items-center sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Customer</dt>
                <dd className="text-gray-700 sm:col-span-2 capitalize">
                  <Link
                    className="inline-flex items-center gap-2 transition hover:underline"
                    href={replaceDynamicUrl(
                      Routes.guestDetails.url,
                      ":guestId",
                      customer.id
                    )}
                    target="_blank"
                  >
                    <div className="inline-flex items-center gap-1">
                      <Avatar
                        value={`${customer.name} ${customer.surname}`}
                        size="standard"
                      />
                      {customer.name}&nbsp;{customer.surname}
                    </div>
                    <ArrowTopRightOnSquareIcon className="size-4" />
                  </Link>
                </dd>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Guest</dt>
              <dd className="text-gray-700 sm:col-span-2 capitalize">
                {sale.customer || customer
                  ? `${customer?.name} ${customer?.surname}`
                  : "-"}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Contact</dt>
              <dd className="text-gray-700 sm:col-span-2 transition hover:underline">
                {sale.receipt_email || customer?.email ? (
                  <a
                    href={`mailto:${
                      sale.receipt_email || customer?.email
                    }?subject=Re:${sale.id} | ${sale.metadata?.name}`}
                  >
                    {sale.receipt_email || customer?.email}
                  </a>
                ) : (
                  "-"
                )}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Unit</dt>
              <dd className="text-gray-700 sm:col-span-2">
                <Link
                  className="inline-flex items-center gap-2 transition hover:underline"
                  href={replaceDynamicUrl(
                    Routes.manageUnit.url,
                    ":unitId",
                    sale.unitId || ""
                  )}
                  target="_blank"
                >
                  {userUnits.find((u) => u.id === sale.unitId)?.name ||
                    sale.unitId ||
                    "-"}
                  <ArrowTopRightOnSquareIcon className="size-4" />
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default SaleDetails;
