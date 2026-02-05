"use client"

import clsx from "clsx"
import { ChevronRightIcon } from "@heroicons/react/24/outline"
import { ReactNode, useEffect, useRef, useState } from "react"

export type AccessFeature = {
  icon: ReactNode
  title: string
  description: string
}

export type LandingAccessGridProps = {
  label?: string
  labelColor?: "blue" | "orange"
  title: ReactNode
  subtitle?: string
  features: AccessFeature[]
  className?: string
}

const labelColorMap = {
  blue: "text-consumer-blue",
  orange: "text-vigil-orange",
}

const gapSize = 12

const LandingAccessGrid = ({
  label,
  labelColor = "blue",
  title,
  subtitle,
  features,
  className,
}: LandingAccessGridProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateWidth = () => {
      if (scrollRef.current) {
        setCardWidth(scrollRef.current.clientWidth)
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const handleDotClick = (index: number) => {
    setActiveIndex(index)
    const container = scrollRef.current
    if (container) {
      const width = cardWidth || container.clientWidth
      container.scrollTo({
        left: index * (width + gapSize),
        behavior: "smooth",
      })
    }
  }

  const handleScroll = () => {
    const container = scrollRef.current
    const width = cardWidth || container?.clientWidth || 0
    if (!container || width === 0) return
    const nextIndex = Math.round(container.scrollLeft / (width + gapSize))
    if (
      nextIndex !== activeIndex &&
      nextIndex >= 0 &&
      nextIndex < features.length
    ) {
      setActiveIndex(nextIndex)
    }
  }

  return (
    <section className={clsx("px-4 py-12", className)}>
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-6">
          {label && (
            <p
              className={clsx(
                "text-xs font-semibold uppercase tracking-[0.2em]",
                labelColorMap[labelColor],
              )}
            >
              {label}
            </p>
          )}
          <h2 className="mt-1 text-4xl px-3 font-bold text-gray-900 sm:text-xl">
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-mg text-gray-600">{subtitle}</p>}
        </div>

        <div
          className="relative"
        >
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="no-scrollbar mx-auto flex max-w-4xl gap-3 overflow-x-auto pb-2 text-left snap-x snap-mandatory"
          >
            {features.map((feature) => (
              <div
                key={feature.title}
                style={{ width: cardWidth ? `${cardWidth}px` : "100%" }}
                className="flex-shrink-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm snap-start text-center"
              >
                <div className="mb-2 flex h-12 w-12 items-center text-2xl justify-center rounded-lg bg-vigil-light-orange text-consumer-blue mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="Vai alla card successiva"
            onClick={() => handleDotClick(activeIndex + 1 >= features.length ? 0 : activeIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-consumer-blue text-white shadow-lg transition hover:bg-consumer-light-blue"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {features.map((feature, index) => (
            <button
              key={feature.title}
              aria-label={`Vai alla feature ${index + 1}`}
              onClick={() => handleDotClick(index)}
              className={clsx(
                "h-2 rounded-full transition-all",
                activeIndex === index
                  ? "w-6 bg-vigil-orange"
                  : "w-2 bg-gray-300",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingAccessGrid
