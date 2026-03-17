import clsx from "clsx"
import { PropsWithChildren, ReactNode } from "react"

interface SectionProps extends PropsWithChildren {
  className?: string
  variant: string
  title: string | ReactNode
  label?: string
  subtitle?: string
  id?: string
}

export const Section = ({
  children,
  className,
  title,
  label,
  variant,
  subtitle,
  id,
}: SectionProps) => {
  const getVariantClass = () => {
    switch (variant) {
      case "gradient-light-orange":
        return "bg-gradient-to-b from-[#ffe7de] via-white to-[#e6f7ff] [&>p]: text-consumer-blue"
      case "white":
        return "bg-white [&>p]: text-vigil-orange"
      case "gradient-orange-blue":
        return "bg-gradient-to-b from-vigil-orange to-consumer-blue text-white [&>p]:text-white"
      case "gradient-light-blue":
        return "bg-gradient-to-t from-consumer-light-blue/60 to-white"
    }
  }

  return (
    <section
      id={id}
      className={clsx(
        "px-4 py-12 [&>*]:mx-auto [&>*]:max-w-4xl [&>a]:text-md [&>button]:text-md [&>h2]:text-3xl",
        className,
        getVariantClass(),
      )}
    >
      <div className="mb-6 text-center">
        {label && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">
            {label}
          </p>
        )}
        <h2
          className={clsx(
            "text-3xl my-4 font-bold",
            className?.includes("[&>h2]") ? "" : "text-black",
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={clsx(
              "mt-2 text-md",
              variant === "gradient-orange-blue" ? "" : " text-gray-600",
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div className="[&>*]:text-md">{children}</div>
    </section>
  )
}
