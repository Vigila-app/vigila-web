"use client"

import Image from "next/image"
import clsx from "clsx"
import { useState } from "react"
import { ChevronRightIcon } from "@heroicons/react/24/outline"
import { Section } from "./Section"

export type LandingService = {
  badge?: string
  title: string
  description: string
  image: string
}

export type LandingServiceStackProps = {
  services: LandingService[]
  className?: string
  cardHeight?: number
}

const LandingServiceStack = ({
  services,
  className,
  cardHeight = 360,
}: LandingServiceStackProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerHeight = cardHeight + 80
  const baseOffset = 12
  const spacing = 10

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % services.length)
  }

  const handleActivate = (index: number) => setActiveIndex(index)

  return (
    <Section
      title={
        <span className="text-black">
          I <span className="text-vigil-orange"> servizi offerti </span> dai
          nostri <span className="text-consumer-blue">Vigil</span>
        </span>
      }
      subtitle="Fidati dei nostri Vigil. Sono stati formati e selezionati per
          garantire sempre la serenità."
      variant="white"
      className={clsx("px-4 pb-16 pt-10", className)}
    >
      <div className={clsx("relative mx-auto max-w-sm w-[300px]")}>
        <div className="relative" style={{ height: containerHeight }}>
          {services.map((service, index) => (
            <button
              type="button"
              key={service.title}
              tabIndex={0}
              aria-pressed={index === activeIndex}
              onClick={() => handleActivate(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  handleActivate(index)
                }
              }}
              className={clsx(
                "absolute left-0 top-0 w-full cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white text-left shadow-xl transition-all duration-300",
                index === activeIndex ? "z-20" : "z-10",
              )}
              style={{
                transform:
                  index === activeIndex
                    ? "translateY(0) scale(1) rotate(-3deg)"
                    : `translateY(${(index - activeIndex) * spacing + baseOffset}px) scale(0.94) rotate(3deg)`,
                opacity: index === activeIndex ? 1 : 0.8,
              }}
            >
              <div
                className="relative w-full overflow-hidden"
                style={{ height: cardHeight }}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
                <div
                  className={clsx(
                    "absolute inset-0 bg-gradient-to-t to-transparent",
                    index % 2 == 0
                      ? "from-[rgba(240,95,67,0.9)]"
                      : "from-[rgba(0,158,218,0.9)]",
                  )}
                />
                <div className="absolute bottom-4 left-4 right-4 text-white drop-shadow">
                  <h3 className="text-lg font-bold">{service.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/90">
                    {service.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Vai al servizio successivo"
            className="absolute right-[-14px] top-1/2 -translate-y-1/2 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full bg-vigil-orange text-white shadow-lg hover:bg-vigil-light-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vigil-orange"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {services.map((service, index) => (
            <button
              key={service.title}
              onClick={() => setActiveIndex(index)}
              className={clsx(
                "h-2 rounded-full transition-all",
                index === activeIndex
                  ? "w-6 bg-vigil-orange"
                  : "w-2 bg-gray-300",
              )}
              aria-label={`Mostra servizio ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}

export default LandingServiceStack
