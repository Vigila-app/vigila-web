"use client";

import Link from "next/link";
import clsx from "clsx";
import React from "react";

export type LandingFinalCTAProps = {
  headline: string;
  description: string;
  bullets: { text: string; icon?: React.ReactNode }[];
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  helper?: string;
  className?: string;
};

const LandingFinalCTA = ({
  headline,
  description,
  bullets,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  helper,
  className,
}: LandingFinalCTAProps) => {
  return (
    <section className={clsx("px-4 pb-16", className)}>
      <div className="mx-auto max-w-5xl">
        <div className="relative mx-auto max-w-xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#05b6d7] via-consumer-blue to-[#e95d3c] p-8 text-center text-white shadow-xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-14 -bottom-14 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

          <h2 className="text-xl font-bold leading-snug sm:text-2xl" dangerouslySetInnerHTML={{ __html: headline }} />
          <p className="mx-auto mt-4 max-w-md text-sm text-white/85">{description}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-white/85">
            {bullets.map((bullet) => (
              <span key={bullet.text} className="inline-flex items-center gap-2">
                <span>{bullet.icon ?? "✓"}</span>
                <span>{bullet.text}</span>
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-consumer-blue shadow-md transition hover:bg-white/90">
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-full border-2 border-white px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-consumer-blue">
              {secondaryLabel}
            </Link>
          </div>

          {helper && <p className="mt-4 text-[11px] text-white/85">{helper}</p>}
        </div>
      </div>
    </section>
  );
};

export default LandingFinalCTA;
