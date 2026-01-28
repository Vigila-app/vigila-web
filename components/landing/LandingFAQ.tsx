"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export type FAQItem = {
  question: string;
  answer: string;
};

export type LandingFAQProps = {
  sectionTitle?: string;
  sectionSubtitle?: string;
  faqs: FAQItem[];
  bgColor?: string;
  className?: string;
  defaultOpenIndex?: number;
};

const LandingFAQ = ({
  sectionTitle = "Frequently Asked Questions",
  sectionSubtitle,
  faqs,
  bgColor = "bg-white",
  className,
  defaultOpenIndex,
}: LandingFAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(
    defaultOpenIndex ?? null
  );

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={clsx("py-16 px-4", bgColor, className)}>
      <div className="max-w-4xl mx-auto">
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

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-pureWhite shadow-sm overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <ChevronDownIcon
                  className={clsx(
                    "w-5 h-5 text-consumer-blue transition-transform flex-shrink-0",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div
                className={clsx(
                  "overflow-hidden transition-all duration-300",
                  openIndex === index ? "max-h-96" : "max-h-0"
                )}>
                <div className="p-6 pt-0 text-gray-600">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFAQ;
