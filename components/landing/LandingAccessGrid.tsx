"use client"

import clsx from "clsx"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { ReactNode, useEffect, useRef, useState } from "react"
import { Section } from "./Section"

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

const gapSize = 12
const cardTargetWidth = 400

const LandingAccessGrid = ({
  label,
  labelColor = "blue",
  title,
  subtitle,
  features,
  className,
}: LandingAccessGridProps) => {
  const [isMobile, setIsMobile] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)")
    const applyMatch = (list: MediaQueryList | MediaQueryListEvent) => {
      setIsMobile("matches" in list ? list.matches : media.matches)
    }

    applyMatch(media)
    const handleChange = (event: MediaQueryListEvent) => applyMatch(event)
    media.addEventListener("change", handleChange)

    return () => media.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    if (!isMobile) return

    const container = scrollRef.current
    if (!container) return

    const syncScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setCanScrollLeft(scrollLeft > 4)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4)
    }

    syncScrollState()
    container.addEventListener("scroll", syncScrollState, { passive: true })
    window.addEventListener("resize", syncScrollState)

    return () => {
      container.removeEventListener("scroll", syncScrollState)
      window.removeEventListener("resize", syncScrollState)
    }
  }, [isMobile, features.length])

  const scrollByCard = (direction: "left" | "right") => {
    const container = scrollRef.current
    if (!container) return

    const firstCard = container.querySelector("[data-access-card]") as
      | HTMLElement
      | null

    const cardWidth = firstCard?.clientWidth ?? cardTargetWidth
    const scrollAmount = cardWidth + gapSize

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <Section title={title} label={label} subtitle={subtitle} variant="white">
      <section className={clsx("px-4 py-12", className)}>
        <div className="mx-auto max-w-5xl text-center">
          <div className="relative">
            {isMobile ? (
              <div className="relative">
                <div
                  className="access-scroll-container overflow-x-auto scroll-smooth"
                  ref={scrollRef}
                >
                  <div className="flex items-stretch gap-3 w-max pr-8">
                    {features.map((feature, index) => (
                      <div
                        key={`${feature.title}-${index}`}
                        data-access-card
                        className={clsx(
                          "min-w-[260px] max-w-[320px] flex-shrink-0 h-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center",
                          "aspect-[4/3]",
                          "flex flex-col justify-around",
                        )}
                      >
                        <div
                          className={clsx(
                            "mb-2 flex h-15 w-15 items-center p-3 justify-center rounded-lg mx-auto",
                            index % 2 == 0
                              ? "bg-vigil-light-orange text-vigil-orange"
                              : "bg-consumer-light-blue text-consumer-blue",
                          )}
                        >
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {feature.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {canScrollLeft && (
                  <button
                    type="button"
                    onClick={() => scrollByCard("left")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-md p-2 text-gray-700 border border-gray-200"
                    aria-label="Scroll left"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                )}

                {canScrollRight && (
                  <button
                    type="button"
                    onClick={() => scrollByCard("right")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-md p-2 text-gray-700 border border-gray-200"
                    aria-label="Scroll right"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 text-left lg:grid-cols-3">
                {features.map((feature, index) => (
                  <div
                    key={`${feature.title}-${index}`}
                    className={clsx(
                      "h-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center",
                      // "aspect-[4/3]",
                      "flex flex-col justify-around",
                    )}
                  >
                    <div
                      className={clsx(
                        "mb-2 flex h-15 w-15 items-center p-3 justify-center rounded-lg mx-auto",
                        index % 2 == 0
                          ? "bg-vigil-light-orange text-vigil-orange"
                          : "bg-consumer-light-blue text-consumer-blue",
                      )}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <style jsx global>{`
        .access-scroll-container {
          scrollbar-width: none;
        }
        .access-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </Section>
  )
}

export default LandingAccessGrid
