import Link from "next/link";
import clsx from "clsx";
import { ButtonStyle } from "./button.style";

type ButtonLinkI = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  customClass?: string;
  label: string;
  primary?: boolean;
  secondary?: boolean;
  text?: boolean;
  inline?: boolean;
  icon?: React.ReactNode;
};

const ButtonLink = (props: ButtonLinkI) => {
  const {
    customClass,
    label,
    href = "/",
    primary = true,
    secondary = false,
    text = false,
    inline = false,
    icon,
  } = props;

  const btnClass = `${ButtonStyle.baseBtnStyle} ${
    text
      ? ButtonStyle.textBtnStyle
      : secondary
      ? ButtonStyle.secondaryBtnStyle
      : primary
      ? ButtonStyle.primaryBtnStyle
      : ""
  }`;

  return (
    <Link
      className={clsx(btnClass, customClass)}
      style={inline ? { padding: 0 } : undefined}
      {...{
        ...props,
        action: undefined,
        customClass: undefined,
        primary: undefined,
        secondary: undefined,
        text: undefined,
        inline: undefined,
        icon: undefined,
      }}
      href={href}
    >
      {icon ? <span className="mr-2">{icon}</span> : null}
      {label}
    </Link>
  );
};

export default ButtonLink;
