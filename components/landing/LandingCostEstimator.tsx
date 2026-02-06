"use client";

import React, { useState } from "react";
import clsx from "clsx";

export type LandingCostEstimatorProps = {
  sectionTitle?: string;
  sectionSubtitle?: string;
  minHours?: number;
  maxHours?: number;
  defaultHours?: number;
  hourlyRate?: number;
  bgColor?: string;
  className?: string;
  id?: string;
  showBenefits?: boolean;
  benefits?: string[];
};

const LandingCostEstimator = ({
  sectionTitle = "Calcolatore Costi Mensili",
  sectionSubtitle = "Scopri quanto potresti spendere per l'assistenza di cui hai bisogno",
  minHours = 8,
  maxHours = 160,
  defaultHours = 40,
  hourlyRate = 9, // Default to cheapest service rate
  bgColor = "bg-white",
  className,
  id,
  showBenefits = true,
  benefits = [
    "Assistenti verificati e qualificati",
    "Pagamento sicuro tramite piattaforma",
    "Supporto clienti dedicato",
    "Possibilità di modificare le prenotazioni",
  ],
}: LandingCostEstimatorProps) => {
  const [hours, setHours] = useState(defaultHours);

  // Calculate weekly hours and monthly cost
  const weeksPerMonth = 4.33; // Average weeks per month
  const weeklyHours = Math.round(hours / weeksPerMonth);
  const monthlyCost = hours * hourlyRate;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHours(Number(e.target.value));
  };

  return (
    <section id={id} className={clsx("py-16 px-4", bgColor, className)}>
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

        {/* Calculator Card */}
        <div className="bg-pureWhite rounded-2xl shadow-lg p-8 border border-gray-200">
          {/* Hours Slider Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Quante ore al mese hai bisogno di assistenza?
            </h3>

            {/* Slider */}
            <div className="relative mb-4">
              <input
                type="range"
                min={minHours}
                max={maxHours}
                value={hours}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #009eda 0%, #009eda ${((hours - minHours) / (maxHours - minHours)) * 100}%, #e5e7eb ${((hours - minHours) / (maxHours - minHours)) * 100}%, #e5e7eb 100%)`,
                }}
              />
            </div>

            {/* Slider Labels */}
            <div className="flex justify-between text-sm text-gray-600 mb-6">
              <span>{minHours} ore</span>
              <span className="text-2xl font-bold text-consumer-blue">
                {hours} ore
              </span>
              <span>{maxHours} ore</span>
            </div>

            {/* Weekly Hours Info */}
            <div className="text-center text-sm text-gray-600 mb-6">
              Circa <strong>{weeklyHours} ore a settimana</strong>
            </div>
          </div>

          {/* Cost Estimate Section */}
          <div className="bg-consumer-light-blue rounded-xl p-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-700 mb-2">
                Costo stimato mensile
              </p>
              <div className="text-5xl font-bold text-consumer-blue mb-2">
                €{monthlyCost.toLocaleString("it-IT")}
                <span className="text-2xl text-gray-600">/mese</span>
              </div>
              <p className="text-sm text-gray-600">
                Basato su {hours} ore al mese a €{hourlyRate}/ora
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          {showBenefits && benefits.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Incluso nel servizio
              </h4>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-consumer-blue flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Questi sono prezzi indicativi. Il costo finale dipenderà dal tipo di
              servizio scelto e dalle tue esigenze specifiche.
            </p>
            <a
              href="/auth/registraion"
              className="inline-flex justify-center items-center rounded-full border px-8 py-3 text-base font-semibold shadow border-consumer-blue bg-consumer-blue text-white hover:bg-consumer-blue/90 transition">
              Richiedi un Preventivo Gratuito
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingCostEstimator;
