"use client";

import clsx from "clsx";
import { lazy, Suspense } from "react";

const colors =
  "text-primary-600 text-secondary-600 text-gray-600 text-purple-600 text-sky-600 text-blue-600 text-green-600 text-red-600 text-yellow-600";

type UndrawI = {
  graphic?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
};

const baseGraphicsURL = "/graphics/";

const Undraw = (props: UndrawI) => {
  const {
    className,
    color = "primary",
    graphic = "welcome",
    size = "xs",
  } = props;

  const LazyIcon = lazy(() => {
    return import(`@/src/assets${baseGraphicsURL}undraw_${graphic}.svg`);
  });

  return (
    <div
      className={clsx(
        "mx-auto my-4",
        size && `max-w-${size}`,
        color && `text-${color}-600`,
        className
      )}
    >
      <Suspense>
        <LazyIcon className="h-full w-full" />
      </Suspense>
    </div>
  );
};

export default Undraw;
