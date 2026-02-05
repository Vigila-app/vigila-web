"use client";

import clsx from "clsx";
import { ReactNode } from "react";

export type VerticalStep = {
  icon: ReactNode;
  title: string;
  description: string;
  tone: "blue" | "orange";
};

export type LandingVerticalStepsProps = {
  label?: string;
  title: string;
  subtitle?: string;
  steps: VerticalStep[];
  className?: string;
};

const LandingVerticalSteps = ({ label, title, subtitle, steps, className }: LandingVerticalStepsProps) => {
  return (
    <section className={clsx("px-4 py-12", className)}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          {label && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-consumer-blue">{label}</p>}
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">{title}</h2>
          {subtitle && <p className="mt-2 max-w-xl text-sm text-gray-600">{subtitle}</p>}
        </div>

        <div className="relative">
          <div className="absolute left-[19px] top-0 h-full w-px bg-gradient-to-b from-consumer-blue via-vigil-orange to-consumer-blue/20" />
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.title} className="relative flex gap-4">
                <div
                  className={clsx(
                    "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white",
                    step.tone === "blue"
                      ? "bg-gradient-to-br from-consumer-blue to-[#0a99c9]"
                      : "bg-gradient-to-br from-[#f48061] to-[#f05f43]"
                  )}>
                  {step.icon}
                </div>
                <div className="flex-1 py-1">
                  <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingVerticalSteps;
