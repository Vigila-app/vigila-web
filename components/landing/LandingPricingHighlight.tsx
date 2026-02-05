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
  label?: string;
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

const iconBgMap: Record<PricingHighlightItem["accentColor"], string> = {
  orange: "bg-[#ffe9df] text-[#f26b4f]",
  blue: "bg-[#e4f8ff] text-[#00b7df]",
  teal: "bg-[#e3f7f3] text-[#1abc9c]",
};

const LandingPricingHighlight = ({
  label,
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
        {label && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{label}</p>}
        <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-white/90">{subtitle}</p>}
        <Link
          href={buttonHref}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-consumer-blue px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-consumer-light-blue">
          {buttonLabel}
        </Link>
      </div>

      <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-4">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center shadow"
          >
            <div className={clsx("mx-auto flex h-12 w-12 items-center justify-center rounded-full", iconBgMap[item.accentColor])}>
              <span className="text-xl">{item.icon}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
            <p className="text-xs leading-relaxed text-gray-600">{item.description}</p>
            <span className={clsx("mx-auto h-2 w-2 rounded-full", colorMap[item.accentColor])} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingPricingHighlight;
