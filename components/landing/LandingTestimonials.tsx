"use client";

import React from "react";
import clsx from "clsx";

export type TestimonialItem = {
  name: string;
  role?: string;
  content: string;
  avatar?: string;
  rating?: number;
};

export type LandingTestimonialsProps = {
  sectionTitle?: string;
  sectionSubtitle?: string;
  testimonials: TestimonialItem[];
  bgColor?: string;
  className?: string;
};

const LandingTestimonials = ({
  sectionTitle = "What Our Users Say",
  sectionSubtitle,
  testimonials,
  bgColor = "bg-white",
  className,
}: LandingTestimonialsProps) => {
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

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-pureWhite shadow-md hover:shadow-lg transition-shadow border border-gray-200">
              {/* Rating */}
              {testimonial.rating && (
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={clsx(
                        "w-5 h-5",
                        i < testimonial.rating!
                          ? "text-secondary-500"
                          : "text-gray-300"
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}

              {/* Content */}
              <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {testimonial.avatar && (
                  <div className="w-12 h-12 rounded-full bg-consumer-light-blue flex items-center justify-center text-consumer-blue font-semibold">
                    {testimonial.avatar}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  {testimonial.role && (
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingTestimonials;
