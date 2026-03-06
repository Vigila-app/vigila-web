"use client";

import React from "react";
import clsx from "clsx";

export type StatItem = {
  value: string;
  label: string;
  suffix?: string;
};

export type LandingStatsProps = {
  sectionTitle?: string;
  sectionSubtitle?: string;
  stats: StatItem[];
  bgColor?: string;
  className?: string;
};

const LandingStats = ({
  sectionTitle,
  sectionSubtitle,
  stats,
  bgColor = "bg-consumer-light-blue",
  className,
}: LandingStatsProps) => {
  return (
    <section className={clsx("py-16 px-4", bgColor, className)}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {(sectionTitle || sectionSubtitle) && (
          <div className="text-center mb-12">
            {sectionTitle && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {sectionTitle}
              </h2>
            )}
            {sectionSubtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {sectionSubtitle}
              </p>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-consumer-blue mb-2">
                {stat.value}
                {stat.suffix && <span className="text-3xl">{stat.suffix}</span>}
              </div>
              <div className="text-base md:text-lg text-gray-700 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingStats;
