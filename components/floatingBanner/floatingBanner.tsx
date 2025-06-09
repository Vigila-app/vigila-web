"use client";
import clsx from "clsx";

const colors =
  "bg-green-500 bg-red-500 bg-yellow-500 bg-blue-500 bg-purple-500 bg-pink-500 bg-primary-500 bg-secondary-500";

type FloatingBannerI = {
  animated?: boolean;
  bgColor?: string;
  customClass?: string;
  children?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  text?: string;
  position?: "top" | "bottom";
};

const FloatingBanner = (props: FloatingBannerI) => {
  const {
    animated = false,
    bgColor = "bg-primary-500",
    customClass,
    children,
    closable = false,
    onClose,
    text,
    position = "top",
  } = props;
  return (
    <div
      className={clsx("fixed inset-x-0 p-4 z-40", position && `${position}-0`, animated && "animate-pulse")}
    >
      <div
        className={clsx(
          "relative flex items-center justify-between gap-4 rounded px-4 py-3 text-white shadow transition",
          bgColor,
          customClass
        )}
      >
        <p className="text-sm font-medium">{children || text}</p>

        {closable ? (
          <button
            aria-label="Close"
            onClick={onClose}
            className="shrink-0 rounded-lg bg-black/10 p-1 transition hover:bg-black/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default FloatingBanner;
