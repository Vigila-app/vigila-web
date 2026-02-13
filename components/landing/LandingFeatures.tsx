"use client";

import React from "react";
import clsx from "clsx";

export type FeatureItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export type LandingFeaturesProps = {
  sectionTitle?: string;
  sectionSubtitle?: string;
  features: FeatureItem[];
  bgColor?: string;
  className?: string;
};

const LandingFeatures = ({
  sectionTitle = "Our Features",
  sectionSubtitle,
  features,
  bgColor = "bg-white",
  className,
}: LandingFeaturesProps) => {
  return (
    <section className={clsx("py-16 px-4", bgColor, className)}>
      <div className="max-w-7xl mx-auto">
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

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-pureWhite shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4 p-4 rounded-full bg-consumer-light-blue text-consumer-blue">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
