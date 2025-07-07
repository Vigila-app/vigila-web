"use client";

import clsx from "clsx";
import { CardStyle } from "./card.style";
import { RolesEnum } from "@/src/enums/roles.enums";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  customClass?: string;
  bordered?: boolean;
  shadow?: boolean;
  hoverable?: boolean;
  full?: boolean;
  role?: RolesEnum;
};

const Card = ({
  title,
  subtitle,
  children,
  customClass,
  bordered = true,
  shadow = true,
  hoverable = false,
  full = false,
  role,
  ...rest
}: CardProps) => {
  const cardClass = clsx(
    CardStyle.baseCardStyle,
    bordered && CardStyle.borderedCardStyle,
    shadow && CardStyle.shadowCardStyle,
    hoverable && CardStyle.hoverableCardStyle,
    full && CardStyle.fullStyle,
    role === RolesEnum.VIGIL && CardStyle.vigilCardStyle,
    role === RolesEnum.CONSUMER && CardStyle.consumerCardStyle,
    customClass
  );

  return (
    <div className={cardClass} {...rest}>
      {title && <h3 className={CardStyle.titleStyle}>{title}</h3>}
      {subtitle && <p className={CardStyle.subtitleStyle}>{subtitle}</p>}
      <div>{children}</div>
    </div>
  );
};

export default Card;
