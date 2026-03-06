"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { ReactNode } from "react";

export type LandingHeaderAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
};

export type LandingHeaderBarProps = {
  logoSrc: string;
  logoAlt?: string;
  badgeLabel?: string;
  badgeClassName?: string;
  actions: LandingHeaderAction[];
  className?: string;
};

const LandingHeaderBar = ({
  logoSrc,
  logoAlt = "Vigila logo",
  badgeLabel,
  badgeClassName,
  actions,
  className,
}: LandingHeaderBarProps) => {
  return (
    <header
      className={clsx(
        "flex items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8",
        className
      )}>
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logoSrc} alt={logoAlt} width={96} height={28} priority />
        </Link>
        {badgeLabel && (
          <span
            className={clsx(
              "rounded-full bg-vigil-orange/10 px-3 py-1 text-[11px] font-semibold text-vigil-orange",
              badgeClassName
            )}>
            {badgeLabel}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions.map((action) => {
          const baseClasses =
            "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition";

          let variantClasses = "border border-gray-200 bg-white text-gray-800 hover:border-consumer-blue";
          if (action.variant === "primary") {
            variantClasses = "bg-consumer-blue text-white hover:bg-consumer-light-blue";
          } else if (action.variant === "secondary") {
            variantClasses = "border border-consumer-blue text-consumer-blue bg-white hover:bg-consumer-light-blue/20";
          }

          return (
            <Link key={action.label} href={action.href} className={clsx(baseClasses, variantClasses)}>
              {action.icon}
              <span>{action.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};

export default LandingHeaderBar;
