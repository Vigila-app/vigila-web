/* eslint-disable @next/next/no-img-element */
import { ServiceI } from "@/src/types/services.types";
import { amountDisplay } from "@/src/utils/common.utils";
import clsx from "clsx";
import React from "react";

type ServiceCardI = {
  action?: React.ReactNode;
  onChange?: (service: ServiceI, isAdded?: boolean) => void;
  selected?: boolean;
  service: ServiceI;
};

const ServiceCard = (props: ServiceCardI) => {
  const { action, selected = false, onChange = () => ({}), service } = props;
  return (
    <div
      className={clsx(
        "relative overflow-hidden w-full max-w-52 h-56 rounded bg-white shadow border-2 border-transparent transition",
        selected && "!border-primary-400",
        !service.active &&
          "cursor-not-allowed !border-gray-300/25 !bg-gray-300/25",
        action && "h-64"
      )}
    >
      {/*<button className="absolute end-2 top-2 z-10 rounded-full bg-white p-1.5 text-gray-900 transition hover:text-gray-900/75">
        <span className="sr-only">Favourite</span>
        <StarIcon className="size-4" />
  </button>*/}

      <img
        src="https://images.unsplash.com/photo-1599481238640-4c1288750d7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2664&q=80"
        alt=""
        className="h-full max-h-24 w-full object-cover transition duration-500 hover:scale-105 sm:h-72"
      />

      <div
        className={clsx(
          "w-full h-32 relative p-2 flex flex-wrap gap-2",
          action && "h-40"
        )}
      >
        <div className="w-full">
          <h3 className="w-full text-lg font-medium text-gray-900 whitespace-nowrap text-ellipsis overflow-hidden">
            {service.name}
          </h3>

          {service.description && (
            <p className="text-xs text-gray-700 mt-1 max-h-8 text-ellipsis overflow-hidden">
              {service.description}
            </p>
          )}

          <p
            className={clsx(
              "text-sm text-right text-gray-700 mt-2",
              !action && "!mt-4"
            )}
          >
            {service.currency}
            {amountDisplay(service.price)}
          </p>
        </div>

        {action ? (
          <div className="w-full inline-flex justify-center items-center mt-1">
            {action}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ServiceCard;
