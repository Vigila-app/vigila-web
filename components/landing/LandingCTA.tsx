"use client";

import React from "react";
import clsx from "clsx";

export type LandingCTAProps = {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonHref: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  bgColor?: string;
  className?: string;
};

const LandingCTA = ({
  title,
  subtitle,
  buttonText,
  buttonHref,
  secondaryButtonText,
  secondaryButtonHref,
  bgColor = "bg-consumer-blue",
  className,
}: LandingCTAProps) => {
  return (
    <section className={clsx("py-16 px-4", bgColor, className)}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg md:text-xl text-white/90 mb-8">
            {subtitle}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={buttonHref}
            className="inline-flex justify-center items-center rounded-full border px-8 py-3 text-base font-semibold shadow border-white bg-white text-consumer-blue hover:bg-consumer-blue hover:text-white hover:border-white transition">
            {buttonText}
          </a>
          {secondaryButtonText && secondaryButtonHref && (
            <a
              href={secondaryButtonHref}
              className="inline-flex justify-center items-center rounded-full border px-8 py-3 text-base font-semibold shadow border-white bg-transparent text-white hover:bg-white hover:text-consumer-blue transition">
              {secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default LandingCTA;
