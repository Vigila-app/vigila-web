"use client"

import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { ReactNode, useEffect, useRef, useState } from "react"

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

export type PressMention = {
  name: string
  href?: string
  logoSrc?: string
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
  pressMentions?: PressMention[]
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
  pressMentions,
  className,
}: LandingHeroCompactProps) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)")
    const apply = (event: MediaQueryList | MediaQueryListEvent) => {
      setIsMobile("matches" in event ? event.matches : media.matches)
    }

    apply(media)
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [])

  // Pure CSS marquee for mobile: duplicate items and translate the track

  const renderCTA = (cta: HeroCTA) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition w-full"
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
        <div className="flex justify-center w-full flex-1">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={600}
            height={600}
            className="object-cover sm-max-w-[50vw]"
            priority
          />
        </div>
      </div>

      {pressMentions && pressMentions.length > 0 && (
        <div className="mx-auto mt-8 max-w-6xl">
          <div className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
            Parlano di noi
          </div>
          {isMobile ? (
            <div className="overflow-hidden px-2">
              <div className="press-marquee-track flex items-center gap-6 w-max">
                {[...pressMentions, ...pressMentions].map((press, index) => {
                  const logo = press.logoSrc ? (
                    <Image
                      src={press.logoSrc}
                      alt={press.name}
                      width={150}
                      height={80}
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold uppercase text-gray-700">
                      {press.name.slice(0, 2)}
                    </div>
                  )

                  const content = (
                    <div className="flex items-center gap-3">{logo}</div>
                  )

                  const wrapperClass =
                    "flex items-center shrink-0 min-w-[150px]"

                  if (press.href) {
                    return (
                      <Link
                        key={`${press.name}-${index}`}
                        href={press.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={wrapperClass}
                      >
                        {content}
                      </Link>
                    )
                  }

                  return (
                    <div
                      key={`${press.name}-${index}`}
                      className={wrapperClass}
                    >
                      {content}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-around flex-wrap gap-6 max-w-[80vh] mx-auto">
              {pressMentions.map((press) => {
                const logo = press.logoSrc ? (
                  <Image
                    src={press.logoSrc}
                    alt={press.name}
                    width={150}
                    height={80}
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold uppercase text-gray-700">
                    {press.name.slice(0, 2)}
                  </div>
                )

                return press.href ? (
                  <Link
                    key={press.name}
                    href={press.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center"
                  >
                    {logo}
                  </Link>
                ) : (
                  <div key={press.name} className="flex items-center">
                    {logo}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 1023px) {
          @keyframes press-marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }

          .press-marquee-track {
            animation: press-marquee 24s linear infinite;
            will-change: transform;
          }
        }
      `}</style>
    </section>
  )
}

export default LandingHeroCompact
