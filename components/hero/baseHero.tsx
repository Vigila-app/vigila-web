import React from "react";
import clsx from "clsx";
import Image from "next/image";

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
    <div className={clsx("text-center", bgColor)}>
      <p className="inline-flex flex-wrap justify-center text-3xl font-bold mb-2">
        Un&nbsp;<span className="text-consumer-blue">ponte</span>
        &nbsp;tra&nbsp;
        <span className="text-vigil-orange">generazioni</span>
      </p>
      <div className="mx-auto w-fit h-auto mb-6">
        <Image
          src="/assets/home_banner.png"
          alt="home_banner"
          width={320}
          height={180}
        />
      </div>
      <section className="w-full bg-primary py-12 px-4 text-center ">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          L&apos;assistenza&nbsp;
          <span className="text-consumer-blue">del tuo quartiere</span> a
          portata di <span className="text-vigil-orange">click</span>
        </h1>
        <p className="mt-4 text-base md:text-lg max-w-md mx-auto">
          Con Vigila trovi in pochi secondi un Vigil di fiducia, proprio nella
          tua zona
        </p>
      </section>
    </div>
  );
};

export default BaseHero;
