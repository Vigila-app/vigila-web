"use client";

import { useState } from "react";
import clsx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export type CompactFaqItem = {
  question: string;
  answer: string;
};

export type LandingFaqCompactProps = {
  label?: string;
  title: string;
  subtitle?: string;
  faqs: CompactFaqItem[];
  className?: string;
};

const LandingFaqCompact = ({ label, title, subtitle, faqs, className }: LandingFaqCompactProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={clsx("px-4 py-12", className)}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-center">
          {label && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-consumer-blue">{label}</p>}
          <h2 className="text-3xl my-4 font-bold text-black sm:text-xl">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left">
                  <span className="text-md font-semibold text-gray-900">{faq.question}</span>
                  <ChevronDownIcon
                    className={clsx(
                      "h-5 w-5 text-vigil-orange transition-transform",
                      isOpen ? "rotate-180" : ""
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingFaqCompact;
