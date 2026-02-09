"use client"

import clsx from "clsx"
import { ReactNode } from "react"
import { Section } from "./Section"
import Link from "next/link"
import { ArrowRightIcon } from "@heroicons/react/24/outline"

export type VerticalStep = {
  icon: ReactNode
  title: string
  description: string
  tone: "blue" | "orange"
}

export type LandingVerticalStepsProps = {
  label?: string
  title: string
  subtitle?: string
  steps: VerticalStep[]
  className?: string
}

const LandingVerticalSteps = ({
  label,
  title,
  subtitle,
  steps,
  className,
}: LandingVerticalStepsProps) => {
  return (
    <Section label={label} title={title} subtitle={subtitle} variant="white">
      <div className="relative space-y-4 before:absolute before:h-9/10 before:left-[17px] before:top-[30px] before:bottom-[18px] before:w-[3px] before:bg-gradient-to-b before:from-consumer-blue before:to-vigil-orange">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative grid grid-cols-[36px_1fr] items-center gap-4"
          >
            <div
              className={clsx(
                "relative z-10 flex h-10 w-10 [&>svg]:w-full [&>svg]:h-full p-2 items-center justify-center rounded-full text-white",
                step.tone === "blue" ? "bg-consumer-blue" : "bg-vigil-orange",
              )}
            >
              {step.icon}
            </div>
            <div className="py-1">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600 ">
                Passo {index + 1}
              </div>
              <h3 className="text-lg font-semibold my-2 text-gray-900">
                {step.title}
              </h3>
              <p className="mt-1 leading-relaxed text-gray-600">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-10 text-center mt-20">
        <Link
          href="/auth/registration/consumer"
          className="inline-flex gap-3 items-center justify-center rounded-full bg-vigil-orange px-6 py-3 font-semibold text-white shadow-md transition hover:bg-vigil-orange/90"
        >
          Rispondi al questionario <ArrowRightIcon className="w-4" />
        </Link>
        <p className="mt-2 text-sm text-consumer-blue font-semibold">
          Hai urgenza? Assistenza prioritaria
        </p>
      </div>
    </Section>
  )
}

export default LandingVerticalSteps
