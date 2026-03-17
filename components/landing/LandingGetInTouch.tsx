"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export type LandingGetInTouchProps = {
  sectionTitle?: string;
  sectionSubtitle?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  phonePlaceholder?: string;
  messagePlaceholder?: string;
  buttonText?: string;
  onSubmit?: (data: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) => void | Promise<void>;
  bgColor?: string;
  className?: string;
  showPhone?: boolean;
  showEmail?: boolean;
};

const LandingGetInTouch = ({
  sectionTitle = "Get In Touch",
  sectionSubtitle,
  namePlaceholder = "Il tuo nome",
  emailPlaceholder = "La tua email",
  phonePlaceholder = "Il tuo numero di telefono",
  messagePlaceholder = "Scrivi il tuo messaggio qui...",
  buttonText = "Invia Messaggio",
  onSubmit,
  bgColor = "bg-white",
  className,
  showPhone = true,
  showEmail = true,
}: LandingGetInTouchProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Contact Form */}
        <div className="bg-pureWhite rounded-2xl shadow-md p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2">
                Nome *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={namePlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-consumer-blue focus:border-transparent transition"
              />
            </div>

            {/* Email and Phone Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email Input */}
              {showEmail && (
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={emailPlaceholder}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-consumer-blue focus:border-transparent transition"
                    />
                    <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              {/* Phone Input */}
              {showPhone && (
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    Telefono *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder={phonePlaceholder}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-consumer-blue focus:border-transparent transition"
                    />
                    <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}
            </div>

            {/* Message Textarea */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2">
                Messaggio *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder={messagePlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-consumer-blue focus:border-transparent transition resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={clsx(
                "w-full py-3 px-6 rounded-full font-semibold text-white transition-all shadow-md",
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-consumer-blue hover:bg-consumer-blue/90 hover:shadow-lg"
              )}>
              {isSubmitting ? "Invio in corso..." : buttonText}
            </button>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="text-center text-green-600 font-medium">
                Messaggio inviato con successo!
              </div>
            )}
            {submitStatus === "error" && (
              <div className="text-center text-red-600 font-medium">
                Si è verificato un errore. Riprova.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default LandingGetInTouch;
