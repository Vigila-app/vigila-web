import React from "react";
import ButtonLink from "@/components/button/buttonLink";

type HeroActionI = {
  label: string;
  href: string;
};

export type BaseHeroI = {
  children?: React.ReactNode;
  bgColor?: string;
  title: string;
  subtitle?: string;
  payoff?: string;
  primaryAction?: HeroActionI;
  secondaryAction?: HeroActionI;
};

const BaseHero = (props: BaseHeroI) => {
  const {
    children,
    bgColor = "bg-gray-50",
    title,
    payoff,
    primaryAction,
    secondaryAction,
    subtitle,
  } = props;

  return (
    <div className={bgColor}>
      <div className="relative mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-xl text-center">
          {title || subtitle ? (
            <h1 className="text-3xl font-extrabold sm:text-5xl">
              {title}
              <br />
              {subtitle ? (
                <strong className="font-extrabold text-primary-700 sm:block">
                  {subtitle}
                </strong>
              ) : null}
            </h1>
          ) : null}

          {children}

          {payoff ? <p className="mt-4 sm:text-xl/relaxed">{payoff}</p> : null}

          {primaryAction || secondaryAction ? (
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {primaryAction ? (
                <ButtonLink
                  className="block w-full rounded bg-secondary-600 px-12 py-3 text-sm font-medium text-white shadow transition hover:bg-secondary-700 focus:outline-none focus:ring active:bg-secondary-500 sm:w-auto"
                  href={primaryAction.href}
                  primary={false}
                  label={primaryAction.label}
                />
              ) : null}

              {secondaryAction ? (
                <ButtonLink
                  className="block w-full rounded bg-white px-12 py-3 text-sm font-medium text-secondary-600 shadow transition hover:text-secondary-700 focus:outline-none focus:ring active:text-red-500 sm:w-auto"
                  href={secondaryAction.href}
                  primary={false}
                  label={secondaryAction.label}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BaseHero;
