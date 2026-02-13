"use client"

import Link from "next/link"
import clsx from "clsx"
import { ReactNode } from "react"
import { CalculatorIcon } from "@heroicons/react/24/outline"
import { Section } from "./Section"

export type PricingHighlightItem = {
  title: string
  description: string
  accentColor: "orange" | "blue"
  icon: ReactNode
}

export type LandingPricingHighlightProps = {
  label?: string
  title: string
  subtitle?: string
  buttonLabel: string
  buttonHref: string
  highlights: PricingHighlightItem[]
  className?: string
}

const iconBgMap: Record<PricingHighlightItem["accentColor"], string> = {
  orange: "bg-vigil-light-orange text-vigil-orange",
  blue: "bg-consumer-light-blue text-consumer-blue",
}

const LandingPricingHighlight = ({
  label,
  title,
  subtitle,
  buttonLabel,
  buttonHref,
  highlights,
  className,
}: LandingPricingHighlightProps) => {
  return (
    <Section
      label={label}
      title={title}
      subtitle={subtitle}
      variant="gradient-orange-blue"
      className={clsx("[&>h2]:text-white", className)}
    >
        <div className="mx-auto max-w-4xl text-center">
          <Link
            href={buttonHref}
            className="mt-4 inline-flex gap-3 items-center justify-center rounded-full bg-consumer-blue px-6 py-3 font-semibold text-white shadow transition hover:bg-consumer-light-blue"
          >
            <CalculatorIcon className="w-[20px]" /> {buttonLabel}
          </Link>
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-4">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center shadow"
            >
              <div
                className={clsx(
                  "mx-auto flex h-15 w-15 items-center justify-center rounded-full",
                  iconBgMap[item.accentColor],
                )}
              >
                <span className="text-2xl p-3 [&>svg]:w-full [&>svg]:h-full ">{item.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-md leading-relaxed text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
    </Section>
  )
}

export default LandingPricingHighlight
