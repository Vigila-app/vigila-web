"use client";
import React, { useEffect } from "react";
import { useModalStore } from "@/src/store/modal/modal.store";
import { capitalize } from "@/src/utils/common.utils";
import clsx from "clsx";
import { GuestI } from "@/src/types/crm.types";
import { useCrmStore } from "@/src/store/crm/crm.store";
import CustomerFormModal, {
  CustomerFormModalId,
} from "@/components/crm/guests/guestForm/customerForm.modal";
import { dateDisplay } from "@/src/utils/date.utils";
import {
  ChatBubbleOvalLeftIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  PhoneIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

type CustomerDetailsI = {
  guestId: GuestI["id"];
  editable?: boolean;
};

const GuestDetails = (props: CustomerDetailsI) => {
  const { guestId, editable = false } = props;
  const { deleteCustomer, getCustomers, resetLastUpdate, getCustomerDetails } =
    useCrmStore();
  const guestDetails = useCrmStore
    .getState()
    .customers.find((guest) => guest.id === guestId);
  const { openModal } = useModalStore();

  useEffect(() => {
    if (guestId && guestDetails?.id !== guestId) {
      getCustomerDetails(guestId, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guestId]);

  if (!(guestId && guestDetails?.id === guestId)) return;

  return (
    <div>
      <div className="flow-root bg-white rounded-lg border border-gray-100 py-3 shadow-sm">
        {editable ? (
          <div className="w-full px-3 inline-flex justify-end">
            <div className="inline-flex items-center gap-4">
              <span
                className="transition hover:text-primary-600"
                role="button"
                aria-label="Edit"
                onClick={() => openModal(CustomerFormModalId)}
              >
                <PencilSquareIcon className="size-4" />
              </span>
              <span
                className="transition hover:text-red-500"
                role="button"
                aria-label="Delete"
                // TODO insert double action to confirm
                onClick={() => deleteCustomer(guestDetails.id)}
              >
                <TrashIcon className="size-4" />
              </span>
            </div>
          </div>
        ) : null}
        <dl className="my-3 divide-y divide-gray-100 text-sm">
          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Name</dt>
            <dd className="text-gray-700 select-all sm:col-span-2">
              {`${capitalize(guestDetails.name)} ${capitalize(
                guestDetails.surname
              )}`}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Status</dt>
            <dd className="text-gray-700 text-xs sm:col-span-2">
              <span
                className={clsx(
                  "py-1 px-2 rounded-full uppercase",
                  guestDetails.active
                    ? "bg-green-500/25 text-green-700"
                    : "bg-gray-500/25 text-gray-700"
                )}
              >
                {guestDetails.active ? "Active" : "Not active"}
              </span>
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Created at</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {dateDisplay(guestDetails.created_at)}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Last update</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {dateDisplay(guestDetails.updated_at)}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Birthday</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {dateDisplay(guestDetails.birthday || "-", "date")}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Gender</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {capitalize(guestDetails.gender as string)}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Contact</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {!(
                guestDetails.email &&
                (guestDetails.phone || guestDetails.whatsapp)
              )
                ? "-"
                : null}
              {guestDetails.email ? (
                <a
                  className="inline-flex items-center gap-2 transition hover:underline"
                  href={`mailto:${guestDetails.email}`}
                >
                  <EnvelopeIcon className="size-4" />
                  {guestDetails.email}
                </a>
              ) : null}
              {guestDetails.email &&
              (guestDetails.phone || guestDetails.whatsapp) ? (
                <>&nbsp;|&nbsp;</>
              ) : null}
              {guestDetails.phone ? (
                <a
                  className="inline-flex items-center gap-2 transition hover:underline"
                  href={`tel:${guestDetails.phone}`}
                >
                  <PhoneIcon className="size-4" />
                  {guestDetails.phone}
                </a>
              ) : null}
              {guestDetails.phone && guestDetails.whatsapp ? (
                <>&nbsp;|&nbsp;</>
              ) : null}
              {guestDetails.whatsapp ? (
                <a
                  className="inline-flex items-center gap-2 transition hover:underline"
                  href={`https://wa.me/${guestDetails.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ChatBubbleOvalLeftIcon className="size-4" />
                  {guestDetails.phone}
                </a>
              ) : null}
            </dd>
          </div>
        </dl>
      </div>
      <CustomerFormModal
        customer={guestDetails}
        onSubmit={() => {
          resetLastUpdate?.();
          getCustomers?.(true);
        }}
      />
    </div>
  );
};

export default GuestDetails;
