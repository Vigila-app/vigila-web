"use client";

import React from "react";
import clsx from "clsx";

export type StepItem = {
  stepNumber: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export type LandingHowItWorksProps = {
  sectionTitle?: string;
  sectionSubtitle?: string;
  steps: StepItem[];
  bgColor?: string;
  className?: string;
};

const LandingHowItWorks = ({
  sectionTitle = "How It Works",
  sectionSubtitle,
  steps,
  bgColor = "bg-gray-50",
  className,
}: LandingHowItWorksProps) => {
  return (
    <section className={clsx("py-16 px-4", bgColor, className)}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {sectionSubtitle}
            </p>
          )}
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {/* Step Number Circle */}
              <div className="mb-4 relative">
                <div className="w-16 h-16 rounded-full bg-consumer-blue text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  {step.stepNumber}
                </div>
                {/* Connector Line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300" style={{ width: '100%' }} />
                )}
              </div>

              {/* Icon (optional) */}
              {step.icon && (
                <div className="mb-4 text-vigil-orange">
                  {step.icon}
                </div>
              )}

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingHowItWorks;
