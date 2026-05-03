import Link from "next/link";
import clsx from "clsx";
import { ButtonStyle } from "@/components/button/button.style";
import { RolesEnum } from "@/src/enums/roles.enums";

type ButtonLinkI = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  customClass?: string;
  label: string;
  primary?: boolean;
  secondary?: boolean;
  small?: boolean;
  full?: boolean;
  role?: RolesEnum;
  text?: boolean;
  inline?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onboard?: boolean;
};

const ButtonLink = (props: ButtonLinkI) => {
  const {
    customClass,
    small = false,
    label,
    href = "/",
    primary = true,
    secondary = false,
    text = false,
    role,
    full = false,
    inline = false,
    icon,
    iconPosition = "left",
    onboard = false,
  } = props;

  const btnClass = clsx(
    ButtonStyle.baseBtnStyle,

    text
      ? ButtonStyle.textBtnStyle
      : secondary
        ? ButtonStyle.secondaryBtnStyle
        : onboard
          ? ButtonStyle.onboardingBtnStyle
          : primary
            ? ButtonStyle.primaryBtnStyle
            : "",
    role === RolesEnum.VIGIL && ButtonStyle.vigilBtnStyle,
    role === RolesEnum.CONSUMER && ButtonStyle.consumerBtnStyle,
    full && ButtonStyle.fullBtnStyle,
    small && ButtonStyle.smallBtnStyle,
  );

  return (
    <Link
      className={clsx(btnClass, customClass)}
      style={inline ? { padding: 0 } : undefined}
      {...{
        ...props,
        action: undefined,
        primary: undefined,
        secondary: undefined,
        text: undefined,
        full: undefined,
        inline: undefined,
        icon: undefined,
        onboard: undefined,
      }}
      href={href}
    >
      {icon && iconPosition === "left" ? (
        <span className="mr-2">{icon}</span>
      ) : null}

      {label}

      {icon && iconPosition === "right" ? (
        <span className="ml-2">{icon}</span>
      ) : null}
    </Link>
  );
};

export default ButtonLink;
