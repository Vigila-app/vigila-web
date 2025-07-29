"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import { ButtonStyle } from "./button.style";
import { RolesEnum } from "@/src/enums/roles.enums";

const LoaderSpinner = dynamic(
  () => import("@/components/loaderSpinner/loaderSpinner"),
  { ssr: !!false }
);

type ButtonI = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  action?: () => void;
  customClass?: string;
  danger?: boolean;
  icon?: React.ReactNode;
  label: string | React.ReactNode;
  primary?: boolean;
  secondary?: boolean;
  small?: boolean;
  tab?: boolean;
  text?: boolean;
  isLoading?: boolean;
  full?: boolean;
  role?: RolesEnum;
};

const Button = (props: ButtonI) => {
  const {
    action = () => ({}),
    customClass,
    label,
    icon,
    primary = true,
    secondary = false,
    role,
    small = false,
    tab = false,
    text = false,
    danger = false,
    isLoading = false,
    full = false,
  } = props;

  const btnClass = clsx(
    ButtonStyle.baseBtnStyle,
    danger
      ? ButtonStyle.dangerBtnStyle
      : text
      ? ButtonStyle.textBtnStyle
      : secondary
      ? ButtonStyle.secondaryBtnStyle
      : tab
      ? ButtonStyle.tabBtnStyle
      : primary
      ? ButtonStyle.primaryBtnStyle
      : "",
    role === RolesEnum.VIGIL && ButtonStyle.vigilBtnStyle,
    role === RolesEnum.CONSUMER && ButtonStyle.consumerBtnStyle
  );
  const isDisabled = isLoading || props.disabled;

  return (
    <button
      className={clsx(
        btnClass,
        small && ButtonStyle.smallBtnStyle,
        isDisabled && ButtonStyle.disabledBtnStyle,
        isLoading && ButtonStyle.loadingBtnStyle,
        full && ButtonStyle.fullBtnStyle,
        props.disabled && "cursor-not-allowed",
        customClass
      )}
      {...{
        ...props,
        action: undefined,
        customClass: undefined,
        primary: undefined,
        secondary: undefined,
        danger: undefined,
        text: undefined,
        tab: undefined,
        icon: undefined,
        small: undefined,
        isLoading: undefined,
        full: undefined,
      }}
      disabled={isDisabled}
      onClick={action}>
      {isLoading ? (
        <span className="mr-2">
          <LoaderSpinner size="small" />
        </span>
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {label}
    </button>
  );
};

export default Button;
