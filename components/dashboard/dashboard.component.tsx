"use client";
import { DashboardCard } from "@/components/dashboard";
import { Avatar, ButtonLink, Tooltip, Undraw } from "@/components";
import { Routes } from "@/src/routes";
import { useEffect } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  amountDisplay,
  capitalize,
  replaceDynamicUrl,
} from "@/src/utils/common.utils";
import {
  dateDisplay,
  isDateInRange,
  timestampToDate,
} from "@/src/utils/date.utils";
import { HorizontalStats } from "@/components/stats";
import clsx from "clsx";
import { useSalesStore } from "@/src/store/sales/sales.store";
import { useTabActive } from "@/src/hooks";

type DashboardComponentI = {
  // Define your props here
};

const DashboardComponent = (props: DashboardComponentI) => {
  const { sales, getSales } = useSalesStore();
  const isTabActive = useTabActive();

  const getUpdatedData = (force = false) => {
    getSales(force);
  };

  useEffect(() => {
    if (isTabActive) getUpdatedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabActive]);

  const calcMonthlySales = () => {
    const date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    const startDate = new Date(y, m, 1);
    const endDate = new Date(y, m + 1, 0);

    return (
      "€" +
      (amountDisplay(
        sales
          .filter((sale) =>
            isDateInRange(
              startDate,
              endDate,
              timestampToDate(sale.creationDate as Timestamp)
            )
              ? sale
              : null
          )
          .map(
            ({ metadata = {} }) =>
              Number(metadata.qty) * Number(metadata.unitPrice)
          )
          .reduce((pv, cv) => pv + cv, 0)
      ) || "--,--")
    );
  };

  return (
    <div>
      {/* <HorizontalStats
        stats={[
          { label: "Monthly sales", value: calcMonthlySales() },
          {
            label: "Active units",
            value: userUnits.filter((unit) => unit.active).length || "-",
          },
          { label: "Monthly views", value: `-` },
        ]}
      /> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mt-4 lg:mt-6 xl:mt-8 gap-4 lg:gap-6 xl:gap-8">
        {/* <DashboardCard
          title="Check-in"
          headerAction={
            <ButtonLink
              text
              inline
              customClass="text-xs"
              label="View"
              href={Routes.checkins.url}
            />
          }
        >
          <div className="w-full flex flex-wrap divide-y divide-gray-100">
            {checkins
              .sort((a, b) =>
                new Date(dateDisplay(a.checkinDate, "dateType"))
                  .getTime()
                  .toString() >
                new Date(dateDisplay(b.checkinDate, "dateType"))
                  .getTime()
                  .toString()
                  ? -1
                  : 1
              )
              .slice(0, 5)
              .map((checkin) => (
                <div
                  key={checkin.id}
                  className="relative w-full px-1 py-4 gap-2 text-sm inline-flex items-center justify-between transition hover:bg-gray-100/25"
                >
                  <div className="inline-flex items-center gap-1 w-1/4 text-left text-ellipsis overflow-hidden text-nowrap capitalize">
                    <Avatar
                      value={
                        checkin.guest?.alias ||
                        `${checkin.guest?.name} ${checkin.guest?.surname}`
                      }
                      size="standard"
                    />
                    <span>
                      {checkin.guest?.alias ||
                        `${checkin.guest?.name} ${checkin.guest?.surname}`}
                    </span>
                  </div>
                  <div className="w-1/3 text-left text-ellipsis overflow-hidden text-nowrap">
                    {userUnits.find((unit) => unit.id === checkin.unitId)?.name}
                  </div>
                  <Link
                    href={`${replaceDynamicUrl(
                      Routes.checkinDetails.url,
                      ":checkinId",
                      checkin.id
                    )}`}
                  >
                    <ChevronRightIcon className="size-4" />
                  </Link>
                </div>
              ))}
            {checkins?.length > 5 ? (
              <div className="w-full p-1 pt-4 inline-flex items-center justify-center text-xs transition hover:text-primary-500">
                <Link href={Routes.checkins.url}>
                  View {checkins.length - 5} more checkin
                  {checkins.length - 5 > 1 ? "s" : null}
                </Link>
              </div>
            ) : null}
            {!checkins?.length && (
              <div className="w-full text-center py-2 text-sm text-gray-500">
                No checkin found
              </div>
            )}
          </div>
        </DashboardCard> */}
        <DashboardCard
          title="Sales"
          headerAction={
            <ButtonLink
              text
              inline
              customClass="text-xs"
              label="View"
              href={Routes.sales.url}
            />
          }
        >
          <div className="w-full flex flex-wrap divide-y divide-gray-100">
            {sales
              .sort((a, b) =>
                new Date(dateDisplay(a.creationDate, "dateType"))
                  .getTime()
                  .toString() >
                new Date(dateDisplay(b.creationDate, "dateType"))
                  .getTime()
                  .toString()
                  ? -1
                  : 1
              )
              .slice(0, 5)
              .map((sale) => (
                <div
                  key={sale.id}
                  className="relative w-full px-1 py-4 gap-2 text-sm inline-flex items-center justify-between transition hover:bg-gray-100/25"
                >
                  <div className="w-1/3 text-left text-ellipsis overflow-hidden text-nowrap">
                    {capitalize(
                      sale.metadata?.name || sale.customer || sale.id
                    )}
                  </div>
                  <div className="w-1/4 text-left text-ellipsis overflow-hidden text-nowrap">
                    {sale.currency}
                    {amountDisplay(sale.amount)}
                  </div>
                  <Link
                    href={`${replaceDynamicUrl(
                      Routes.saleDetails.url,
                      ":saleId",
                      sale.id
                    )}`}
                  >
                    <ChevronRightIcon className="size-4" />
                  </Link>
                </div>
              ))}
            {sales?.length > 5 ? (
              <div className="w-full p-1 pt-4 inline-flex items-center justify-center text-xs transition hover:text-primary-500">
                <Link href={Routes.sales.url}>
                  View {sales.length - 5} more sale
                  {sales.length - 5 > 1 ? "s" : null}
                </Link>
              </div>
            ) : null}
            {!sales?.length && (
              <div className="w-full text-center py-2 text-sm text-gray-500">
                No sales found
              </div>
            )}
          </div>
        </DashboardCard>
        {/* <DashboardCard
          title="Tickets"
          headerAction={
            <ButtonLink
              text
              inline
              customClass="text-xs"
              label="View"
              href={Routes.tickets.url}
            />
          }
        >
          <div className="w-full flex flex-wrap divide-y divide-gray-100">
            {tickets
              .filter(
                (ticket) =>
                  ticket.status !== TicketStatusEnum.DELETED &&
                  ticket.status !== TicketStatusEnum.RESOLVED &&
                  ticket.status !== TicketStatusEnum.REJECTED
              )
              .sort((a, b) =>
                new Date(dateDisplay(a.lastUpdateDate, "dateType"))
                  .getTime()
                  .toString() >
                new Date(dateDisplay(b.lastUpdateDate, "dateType"))
                  .getTime()
                  .toString()
                  ? -1
                  : 1
              )
              .slice(0, 5)
              .map((ticket) => (
                <div
                  key={ticket.id}
                  className="relative w-full px-1 py-4 gap-2 text-sm inline-flex items-center justify-between transition hover:bg-gray-100/25 overflow-hidden"
                >
                  <Tooltip
                    customClass="w-1/3 text-left text-ellipsis overflow-hidden text-nowrap"
                    content={capitalize(ticket.status).replace("_", " ")}
                  >
                    <div className="w-full inline-flex items-center gap-2">
                      <span
                        className={clsx(
                          "size-2 rounded-full",
                          `bg-${TicketUtils.getStatusColor(ticket.status)}-500`
                        )}
                      />
                      <div className="max-w-40 text-left text-ellipsis overflow-hidden text-nowrap">
                        {capitalize(ticket.subject)}
                      </div>
                    </div>
                  </Tooltip>

                  <div className="w-1/3 text-left text-ellipsis overflow-hidden text-nowrap">
                    {userUnits.find((unit) => unit.id === ticket.unitId)?.name}
                  </div>

                  <Link
                    href={`${replaceDynamicUrl(
                      Routes.ticketDetails.url,
                      ":ticketId",
                      ticket.id
                    )}`}
                  >
                    <ChevronRightIcon className="size-4" />
                  </Link>
                </div>
              ))}
            {tickets?.length > 5 ? (
              <div className="w-full p-1 pt-4 inline-flex items-center justify-center text-xs transition hover:text-primary-500">
                <Link href={Routes.tickets.url}>
                  View {tickets.length - 5} more ticket
                  {tickets.length - 5 > 1 ? "s" : null}
                </Link>
              </div>
            ) : null}
            {!tickets?.length && (
              <div className="w-full text-center py-2 text-sm text-gray-500">
                No ticket found
              </div>
            )}
          </div>
        </DashboardCard> */}
      </div>
      <Undraw graphic="data" className="my-8" />
    </div>
  );
};

export default DashboardComponent;
