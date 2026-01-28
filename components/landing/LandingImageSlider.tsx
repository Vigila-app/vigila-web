"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export type SlideItem = {
  image: string;
  alt: string;
  title?: string;
  description?: string;
};

export type LandingImageSliderProps = {
  slides: SlideItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  bgColor?: string;
  className?: string;
};

const LandingImageSlider = ({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
  bgColor = "bg-gray-50",
  className,
}: LandingImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  if (slides.length === 0) return null;

  return (
    <section className={clsx("py-16 px-4", bgColor, className)}>
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-pureWhite shadow-lg">
          {/* Slides */}
          <div className="relative h-96 md:h-[500px]">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={clsx(
                  "absolute inset-0 transition-opacity duration-500",
                  index === currentIndex ? "opacity-100" : "opacity-0"
                )}>
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Text Overlay */}
                {(slide.title || slide.description) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                    {slide.title && (
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {slide.title}
                      </h3>
                    )}
                    {slide.description && (
                      <p className="text-white/90">{slide.description}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          {showControls && slides.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all hover:scale-110"
                aria-label="Previous slide">
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all hover:scale-110"
                aria-label="Next slide">
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Indicators */}
          {showIndicators && slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={clsx(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentIndex
                      ? "bg-white w-8"
                      : "bg-white/50 hover:bg-white/75"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LandingImageSlider;
