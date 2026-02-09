"use client"

import clsx from "clsx"
import { ReactNode, useCallback, useEffect, useRef, useState } from "react"
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
  const [activeIndex, setActiveIndex] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
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

    const updateWidth = () => {
      if (scrollRef.current) {
        setCardWidth(Math.min(scrollRef.current.clientWidth, cardTargetWidth))
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [isMobile])

  const scrollToIndex = useCallback(
    (index: number) => {
      if (!isMobile) return

      const container = scrollRef.current
      if (!container) return

      const width = cardWidth || container.clientWidth
      if (!width) return

      container.scrollTo({
        left: index * (width + gapSize),
        behavior: "smooth",
      })
    },
    [cardWidth, isMobile],
  )

  const handleDotClick = (index: number) => {
    if (!isMobile) return

    setActiveIndex(index)
    scrollToIndex(index)
  }

  useEffect(() => {
    if (!isMobile || features.length <= 1) return

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => {
        const nextIndex = (current + 1) % features.length
        scrollToIndex(nextIndex)
        return nextIndex
      })
    }, 4500)

    return () => window.clearInterval(intervalId)
  }, [isMobile, features.length, cardWidth, scrollToIndex])

  const handleScroll = () => {
    if (!isMobile) return

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
    <Section title={title} label={label} subtitle={subtitle} variant="white">
      <section className={clsx("px-4 py-12", className)}>
        <div className="mx-auto max-w-5xl text-center">
          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="no-scrollbar mx-auto flex max-w-4xl gap-3 overflow-x-auto pb-2 text-left snap-x snap-mandatory lg:grid lg:max-w-5xl lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 lg:snap-none"
              role={isMobile ? "list" : undefined}
            >
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  style={
                    isMobile
                      ? { width: cardWidth ? `${cardWidth}px` : "100%" }
                      : undefined
                  }
                  className={clsx(
                    "flex-shrink-0 h-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center",
                    "lg-aspect-[1/1]",
                    "aspect-[4/3]",
                    "snap-start",
                    "lg:w-full lg:max-w-[400px] lg:flex-shrink",
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

          <div className="mt-4 flex justify-center gap-2 lg:hidden">
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
    </Section>
  )
}

export default LandingAccessGrid
