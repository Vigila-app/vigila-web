"use client";

import { LoaderSpinner } from "@/components";
import clsx from "clsx";
import GoogleLogo from "@/src/assets/img/google-logo.svg";
import AppleLogo from "@/src/assets/img/apple-logo.svg";
import Image from "next/image";
import { ProviderEnum } from "@/src/enums/common.enums";

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
};

const getProviderLogo = (provider: ProviderEnum) => {
  switch (provider) {
    case ProviderEnum.GOOGLE:
      return GoogleLogo;
    case ProviderEnum.APPLE:
      return AppleLogo;
    default:
      return;
  }
};

const ProviderButton = (props: ProviderButtonI) => {
  const {
    action = () => ({}),
    label,
    isLoading = false,
    full = false,
    provider,
  } = props;

  const isDisabled = isLoading || props.disabled;

  return (
    <button
      className={clsx(
        baseBtnStyle,
        isDisabled && disabledBtnStyle,
        isLoading && loadingBtnStyle,
        full && fullBtnStyle
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
          <Image
            alt={provider}
            src={getProviderLogo(provider)}
            height={20}
            width={20}
          />
        )}
      </span>
      {label}
    </button>
  );
};

export default ProviderButton;
