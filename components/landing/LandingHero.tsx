"use client";

import React from "react";
import clsx from "clsx";
import Image from "next/image";

export type LandingHeroProps = {
  title: string;
  subtitle: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  bgColor?: string;
  className?: string;
};

const LandingHero = ({
  title,
  subtitle,
  description,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  imageSrc,
  imageAlt = "Hero image",
  bgColor = "bg-gray-50",
  className,
}: LandingHeroProps) => {
  return (
    <section
      className={clsx(
        "py-12 px-4 md:py-20",
        bgColor,
        className
      )}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 font-medium">
              {subtitle}
            </p>
            {description && (
              <p className="text-base md:text-lg text-gray-600">
                {description}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {primaryButtonText && primaryButtonHref && (
                <a
                  href={primaryButtonHref}
                  className="inline-flex justify-center items-center rounded-full border px-8 py-3 text-base font-semibold shadow border-consumer-blue bg-consumer-blue text-white hover:bg-white hover:text-consumer-blue transition">
                  {primaryButtonText}
                </a>
              )}
              {secondaryButtonText && secondaryButtonHref && (
                <a
                  href={secondaryButtonHref}
                  className="inline-flex justify-center items-center rounded-full border px-8 py-3 text-base font-semibold shadow border-vigil-orange bg-white text-vigil-orange hover:bg-vigil-orange hover:text-white transition">
                  {secondaryButtonText}
                </a>
              )}
            </div>
          </div>

          {/* Image */}
          {imageSrc && (
            <div className="flex justify-center md:justify-end">
              <div className="relative w-full max-w-md aspect-square">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
