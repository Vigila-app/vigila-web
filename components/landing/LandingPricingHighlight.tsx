"use client";

import Link from "next/link";
import clsx from "clsx";
import { ReactNode } from "react";

export type PricingHighlightItem = {
  title: string;
  description: string;
  accentColor: "orange" | "blue" | "teal";
  icon: ReactNode;
};

export type LandingPricingHighlightProps = {
  title: string;
  subtitle?: string;
  buttonLabel: string;
  buttonHref: string;
  highlights: PricingHighlightItem[];
  className?: string;
};

const colorMap: Record<PricingHighlightItem["accentColor"], string> = {
  orange: "bg-[#f26b4f]",
  blue: "bg-[#00b7df]",
  teal: "bg-[#1abc9c]",
};

const LandingPricingHighlight = ({
  title,
  subtitle,
  buttonLabel,
  buttonHref,
  highlights,
  className,
}: LandingPricingHighlightProps) => {
  return (
    <section
      className={clsx(
        "relative overflow-hidden bg-gradient-to-b from-[#f26b4f] via-white to-[#00b7df] px-4 py-12 text-white",
        className
      )}>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-white/90">{subtitle}</p>}
        <Link
          href={buttonHref}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-consumer-blue px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-consumer-light-blue">
          {buttonLabel}
        </Link>
      </div>

      <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="flex flex-col gap-2 rounded-2xl bg-white p-4 text-left shadow">
            <div className="flex items-center justify-between">
              <span className="text-xl">{item.icon}</span>
              <span className={clsx("h-2 w-2 rounded-full", colorMap[item.accentColor])} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
            <p className="text-xs leading-relaxed text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingPricingHighlight;
