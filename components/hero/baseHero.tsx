import React from "react";
import ButtonLink from "@/components/button/buttonLink";
import Button from "../button/button";
import { RolesEnum } from "@/src/enums/roles.enums";

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
      <div className="flex flex-col items-center bg-gray-50 min-h-screen pb-10">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-lg font-bold italic text-gray-700">
            Un <span className="text-consumer-blue">ponte</span> tra{" "}
            <span className="text-vigil-orange">generazioni</span>
          </p>
          <div className="mt-6 max-w-md mx-auto">{/* TODO immagine */}</div>
          {/* {title || subtitle ? (
          ) : // <h1 className="text-3xl font-extrabold sm:text-5xl">
          //   {title}
          //   <br />
          //   {subtitle ? (
          //     <strong className="font-extrabold text-primary-700 sm:block">
          //       {subtitle}
          //     </strong>
          //   ) : null}
          // </h1>
          null} */}

          <section className="w-full bg-primary py-12 px-4 text-center ">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              L'assistenza{" "}
              <span className="text-consumer-blue">del tuo quartiere</span> a
              portata di <span className="text-vigil-orange">click</span>
            </h1>
            <p className="mt-4 text-base md:text-lg max-w-md mx-auto">
              Con Vigila trovi in pochi secondi un Vigil di fiducia, proprio
              nella tua zona
            </p>
          </section>

          <section className="w-full max-w-md mx-auto -mt-8 px-4">
            <div className="p-6 shadow-lg rounded-lg bg-white">
              <h2 className="text-3xl font-bold text-center mb-6 ">
                Come vuoi iniziare?
              </h2>

              <div className="grid gap-4">
                {/* Hai bisogno di aiuto? */}
                <div className="p-4 border-2 border-consumer-blue rounded-3xl flex flex-col items-center text-center bg-consumer-light-blue">
                  {/* <Heart className="w-8 h-8 text-secondary mb-2" /> */}
                  <h3 className="font-semibold text-lg text-consumer-blue">
                    Hai bisogno di aiuto?
                  </h3>
                  <p className="text-sm text-consumer-blue mt-1">
                    Trova un Vigil di fiducia nella tua zona
                  </p>
                </div>
                <ButtonLink
                  label="Trova un vigil vicino a te"
                  role={RolesEnum.CONSUMER}
                  full
                  href={secondaryAction?.href} //todo Href corrispondente per la registrazione
                  type="button">
                  Trova un Vigil vicino a te
                </ButtonLink>

                {/* Vuoi lavorare? */}
                <div className="p-4 border-2 border-vigil-orange rounded-3xl flex flex-col items-center text-center bg-vigil-light-orange">
                  {/* <Smile className="w-8 h-8 text-primary mb-2" /> */}
                  <h3 className="font-semibold text-lg text-vigil-orange">
                    Vuoi lavorare?
                  </h3>
                  <p className="text-sm text-vigil-orange mt-1">
                    Lavoro flessibile, retribuito e valido per CFU
                  </p>
                </div>
                <ButtonLink
                  label="Diventa un Vigil"
                  full
                  href={secondaryAction?.href} //href corrispondente
                  type="button"
                  role={RolesEnum.VIGIL}>
                  Diventa un Vigil!
                </ButtonLink>
              </div>
            </div>
          </section>

          <section className="w-full max-w-md mx-auto mt-8 px-4">
            <div className="flex justify-around items-center py-4 bg-white rounded-lg shadow-sm">
              <div className="flex flex-col items-center text-center text-sm">
                {/* <ShieldCheck className="w-6 h-6 text-primary mb-1" /> */}
                <span>Vigil verificati</span>
              </div>
              <div className="flex flex-col items-center text-center text-sm">
                {/* <Home className="w-6 h-6 text-secondary mb-1" /> */}
                <span>Nella tua zona</span>
              </div>
              <div className="flex flex-col items-center text-center text-sm">
                {/* <Lock className="w-6 h-6 text-primary mb-1" /> */}
                <span>Pagamenti sicuri</span>
              </div>
            </div>
          </section>
          <section className="w-full max-w-md mx-auto mt-10 px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Momenti di condivisione che fanno la differenza
            </h2>
            <p className="mt-2 text-base text-gray-600">
              Piccoli gesti quotidiani che creano grandi legami tra generazioni
            </p>
            <div className="grid gap-4 mt-6">
              {/* card1 */}
              <div className="p-4 rounded-lg shadow-sm bg-white flex flex-col items-center text-center">
                {/* svg e prova per tailwind className="w-8 h-8 text-primary mb-2"  */}
                <h3 className="font-semibold text-lg text-gray-800">
                  Hai bisogno di aiuto?
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Trova un vigil di fiducia nella tua zona
                </p>
              </div>

              {/* card2 */}
              <div className="p-4 rounded-lg shadow-sm bg-white flex flex-col items-center text-center">
                {/* svg */}
                <h3 className="font-semibold text-lg text-gray-800">
                  Spesa insieme
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Condividere il tempo facendo commissioni quotidiane
                </p>
              </div>

              {/* card 3 */}
              <div className="p-4 rounded-lg shadow-sm bg-white flex flex-col items-center text-center">
                {/* svg */}
                <h3 className="font-semibold text-lg text-gray-800">
                  Viaggi condivisi
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Accompagnamento sicuro per uscite e appuntamenti
                </p>
              </div>

              {/* card 4 */}
              <div className="p-4 rounded-lg shadow-sm bg-white flex flex-col items-center text-center">
                {/* svg /> */}
                <h3 className="font-semibold text-lg text-gray-800">
                  Compagnia sincera
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Conversazioni, risate e momenti di vera connessione
                </p>
              </div>
            </div>
          </section>
          
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
