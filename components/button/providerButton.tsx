"use client";

import { LoaderSpinner } from "@/components";
import clsx from "clsx";
import { ProviderEnum } from "@/src/enums/common.enums";
import GoogleLogo from "@/src/assets/img/google-logo.svg";
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
const ICONS_MAP = {
  [ProviderEnum.GOOGLE]: GoogleLogo,
  // [ProviderEnum.APPLE]: AppleLogo,  
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

  const ProviderIcon = ICONS_MAP[provider];

  return (
    <button
      className={clsx(
        baseBtnStyle,
        isDisabled && disabledBtnStyle,
        isLoading && loadingBtnStyle,
        full && fullBtnStyle,
        customClass
      )}
      {...{
        ...props,
        action: undefined,
        isLoading: undefined,
        full: undefined,
      }}
      disabled={isDisabled}
      onClick={action}>
      <span className="mr-2">
        {isLoading ? (
          <LoaderSpinner size="small" />
        ) : (
          <>
            <img 
              src={ProviderIcon.src} 
              alt={`${label} logo`} 
              className="h-5 w-5" 
            />
          </>
        )}
      </span>
      {label}
    </button>
  );
};

export default ProviderButton;
