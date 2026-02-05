"use client";

import clsx from "clsx";
import { ReactNode } from "react";

export type AccessFeature = {
  icon: ReactNode;
  title: string;
  description: string;
};

export type LandingAccessGridProps = {
  label?: string;
  title: string;
  subtitle?: string;
  features: AccessFeature[];
  className?: string;
};

const LandingAccessGrid = ({ label, title, subtitle, features, className }: LandingAccessGridProps) => {
  return (
    <section className={clsx("px-4 py-12", className)}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-left">
          {label && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-consumer-blue">{label}</p>
          )}
          <h2 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl" dangerouslySetInnerHTML={{ __html: title }} />
          {subtitle && <p className="mt-2 max-w-lg text-sm text-gray-600">{subtitle}</p>}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-consumer-light-blue text-consumer-blue">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingAccessGrid;
