"use client";

import clsx from "clsx";

export type VerticalStep = {
  title: string;
  description: string;
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
          <div className="absolute left-[12px] top-0 h-full w-0.5 bg-gradient-to-b from-consumer-blue via-vigil-orange to-consumer-blue/30" />
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.title} className="relative flex gap-4">
                <div
                  className={clsx(
                    "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow",
                    index % 2 === 0
                      ? "bg-gradient-to-br from-consumer-blue to-[#0a99c9]"
                      : "bg-gradient-to-br from-[#f48061] to-[#f05f43]"
                  )}>
                  {index + 1}
                </div>
                <div className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-vigil-orange">
                    STEP {index + 1}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-gray-900">{step.title}</h3>
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
