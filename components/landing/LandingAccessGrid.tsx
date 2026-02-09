"use client"

import clsx from "clsx"
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

  // no JS marquee state; CSS-driven marquee for mobile, static grid for desktop

  return (
    <Section title={title} label={label} subtitle={subtitle} variant="white">
      <section className={clsx("px-4 py-12", className)}>
        <div className="mx-auto max-w-5xl text-center">
          <div className="relative">
            {isMobile ? (
              <div className="overflow-hidden" ref={scrollRef}>
                <div className="access-marquee-track flex items-stretch gap-3 w-max">
                  {[...features, ...features].map((feature, index) => (
                    <div
                      key={`${feature.title}-${index}`}
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
            ) : (
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 text-left lg:grid-cols-3">
                {features.map((feature, index) => (
                  <div
                    key={`${feature.title}-${index}`}
                    className={clsx(
                      "h-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center",
                      "lg-aspect-[1/1]",
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
            )}
          </div>
        </div>
      </section>
      <style jsx global>{`
        @media (max-width: 1023px) {
          @keyframes access-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .access-marquee-track {
            animation: access-marquee 60s linear infinite;
            will-change: transform;
          }
        }
      `}</style>
    </Section>
  )
}

export default LandingAccessGrid
