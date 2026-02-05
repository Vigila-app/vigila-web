"use client";

import Image from "next/image";
import clsx from "clsx";
import { useState } from "react";

export type LandingService = {
  badge: string;
  title: string;
  description: string;
  image: string;
};

export type LandingServiceStackProps = {
  services: LandingService[];
  className?: string;
  cardHeight?: number;
};

const LandingServiceStack = ({ services, className, cardHeight = 320 }: LandingServiceStackProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleActivate = (index: number) => setActiveIndex(index);

  return (
    <div className={clsx("relative mx-auto max-w-sm", className)}>
      <div className="relative" style={{ height: cardHeight }}>
        {services.map((service, index) => (
          <button
            type="button"
            key={service.title}
            tabIndex={0}
            aria-pressed={index === activeIndex}
            onClick={() => handleActivate(index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleActivate(index);
              }
            }}
            className={clsx(
              "absolute left-0 top-0 w-full cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white text-left shadow-xl transition-all duration-300",
              index === activeIndex ? "z-20" : "z-10"
            )}
            style={{
              transform:
                index === activeIndex
                  ? "translateY(0) scale(1) rotate(-3deg)"
                  : `translateY(${(index - activeIndex) * 26 + 20}px) scale(0.94) rotate(3deg)`,
              opacity: index === activeIndex ? 1 : 0.8,
            }}>
            <div className="relative h-56 w-full overflow-hidden">
              <Image src={service.image} alt={service.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(240,95,67,0.9)] via-[rgba(240,95,67,0.25)] to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-vigil-orange shadow-sm">
                {service.badge}
              </span>
              <div className="absolute bottom-4 left-4 right-4 text-white drop-shadow">
                <h3 className="text-base font-bold">{service.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/90">{service.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {services.map((service, index) => (
          <button
            key={service.title}
            onClick={() => setActiveIndex(index)}
            className={clsx(
              "h-2 rounded-full transition-all",
              index === activeIndex ? "w-6 bg-vigil-orange" : "w-2 bg-gray-300"
            )}
            aria-label={`Mostra servizio ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingServiceStack;
