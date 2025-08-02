"use client";

import { LoaderSpinner } from "@/components";
import clsx from "clsx";
import { ProviderEnum } from "@/src/enums/common.enums";
import { lazy, Suspense } from "react";

const baseBtnStyle =
  "inline-flex items-center rounded bg-white border border-gray-300 text-black hover:text-black/75 hover:border-gray-500 px-12 py-3 text-sm font-medium focus:outline-none focus:ring transition";

const disabledBtnStyle = "opacity-50";
const loadingBtnStyle = "cursor-wait";
const fullBtnStyle = "w-full justify-center";

type ProviderButtonI = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  action?: () => void;
  label: string;
  isLoading?: boolean;
  full?: boolean;
  provider: ProviderEnum;
  customClass?: string;
};

const ProviderButton = (props: ProviderButtonI) => {
  const {
    action = () => ({}),
    label,
    isLoading = false,
    full = false,
    provider,
    customClass,
  } = props;

  const isDisabled = isLoading || props.disabled;

  const ProviderIcon = lazy(() => {
    return import(`@/src/assets/img/${provider}-logo.svg`);
  });

  return (
    <button
      className={clsx(
        baseBtnStyle,
        isDisabled && disabledBtnStyle,
        isLoading && loadingBtnStyle,
        full && fullBtnStyle,
        customClass,
      )}
      {...{
        ...props,
        action: undefined,
        isLoading: undefined,
        full: undefined,
      }}
      disabled={isDisabled}
      onClick={action}
    >
      <span className="mr-2">
        {isLoading ? (
          <LoaderSpinner size="small" />
        ) : (
          <>
            <Suspense>
              <ProviderIcon className="h-[20px] w-[20px]" />
            </Suspense>
          </>
        )}
      </span>
      {label}
    </button>
  );
};

export default ProviderButton;
