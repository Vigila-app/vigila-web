"use client"

import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { ReactNode } from "react"

export type HeroCTA = {
  label: string
  href: string
  variant: "primary" | "secondary"
  icon?: ReactNode
}

export type TrustBadge = {
  icon: ReactNode
  label: string
}

export type AppointmentCTA = {
  label: string
  href: string
  helper?: string
  icon?: ReactNode
}

export type LandingHeroCompactProps = {
  headline: ReactNode
  description: string
  primaryCTA: HeroCTA
  secondaryCTA: HeroCTA
  trustBadges: TrustBadge[]
  appointmentCTA?: AppointmentCTA
  imageSrc: string
  imageAlt?: string
  pressLogos?: string[]
  className?: string
}

const LandingHeroCompact = ({
  headline,
  description,
  primaryCTA,
  secondaryCTA,
  trustBadges,
  imageSrc,
  imageAlt = "Hero",
  pressLogos,
  className,
}: LandingHeroCompactProps) => {
  const renderCTA = (cta: HeroCTA) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition w-full"
    const variantClass =
      cta.variant === "primary"
        ? "bg-vigil-orange text-white hover:bg-vigil-light-orange"
        : "bg-consumer-blue text-white hover:bg-consumer-light-blue"

    return (
      <Link href={cta.href} className={clsx(base, variantClass)}>
        {cta.icon}
        <span>{cta.label}</span>
      </Link>
    )
  }

  return (
    <section
      className={clsx(
        "relative overflow-hidden bg-gradient-to-b from-[#ffe7de] via-[#fff1eb] to-white px-4 pb-12 pt-10 ",
        className,
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl font-bold leading-[1.15] text-gray-900 sm:text-4xl">
            {headline}
          </h1>
          <p className="mx-auto mt-3 px-3 max-w-md text-lg leading-relaxed text-gray-600 lg:mx-0">
            {description}
          </p>

          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            {renderCTA(primaryCTA)}
            {renderCTA(secondaryCTA)}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-700 lg:justify-start">
            {trustBadges.map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-2 font-semibold"
              >
                {badge.icon}
                <span>{badge.label}</span>
              </span>
            ))}
          </div>
        </div>

        <Image
          src={imageSrc}
          alt={imageAlt}
          width={300}
          height={300}
          className="object-cover w-full"
          priority
        />
      </div>

      {pressLogos && pressLogos.length > 0 && (
        <div className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-6 text-[11px] font-semibold text-gray-400">
          {pressLogos.map((logo) => {
            let logoClass = "tracking-wide"
            if (logo === "Linkiesta") {
              logoClass = "italic"
            } else if (logo === "StartupItalia") {
              logoClass = "text-vigil-orange"
            }

            return (
              <span key={logo} className={logoClass}>
                {logo}
              </span>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default LandingHeroCompact
