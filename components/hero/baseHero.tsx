import React from "react";
import ButtonLink from "@/components/button/buttonLink";
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
              L&apos;assistenza&nbsp;
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
                <div className="p-4 border-2 border-consumer-blue rounded-3xl flex flex-col items-center text-center bg-consumer-light-blue">
                  {/*  className="w-8 h-8 text-secondary mb-2"  */}
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
                  type="button"
                >
                  Trova un Vigil vicino a te
                </ButtonLink>

                {/* Vuoi lavorare? */}
                <div className="p-4 border-2 border-vigil-orange rounded-3xl flex flex-col items-center text-center bg-vigil-light-orange">
                  {/*  className="w-8 h-8 text-primary mb-2"  */}
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
                  role={RolesEnum.VIGIL}
                >
                  Diventa un Vigil!
                </ButtonLink>
              </div>
            </div>
          </section>

          <section className="w-full max-w-md mx-auto mt-8 px-4">
            <div className="flex justify-around items-center py-4 bg-white rounded-lg shadow-sm">
              <div className="flex flex-col items-center text-center text-sm">
                {/* svg className="w-6 h-6 text-primary mb-1"  */}
                <span>Vigil verificati</span>
              </div>
              <div className="flex flex-col items-center text-center text-sm">
                {/* svg tailwind da cambiare  className="w-6 h-6 text-secondary mb-1" */}
                <span>Nella tua zona</span>
              </div>
              <div className="flex flex-col items-center text-center text-sm">
                {/* svg tailwind da cambiare className="w-6 h-6 text-primary mb-1"  */}
                <span>Pagamenti sicuri</span>
              </div>
            </div>
          </section>
          <section className="w-full max-w-md mx-auto mt-10 px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Momenti di condivisione che fanno la differenza
            </h2>
            <p className="mt-2 text-base">
              Piccoli gesti quotidiani che creano grandi legami tra generazioni
            </p>
            <div className="grid gap-4 mt-6">
              {/* card1 */}
              <div className="p-4 rounded-lg shadow-sm bg-white flex flex-col items-center text-center">
                {/* svg e prova per tailwind className="w-8 h-8 text-primary mb-2"  */}
                <h3 className="font-semibold text-lg">Hai bisogno di aiuto?</h3>
                <p className="text-sm mt-1">
                  Trova un vigil di fiducia nella tua zona
                </p>
              </div>

              {/* card2 */}
              <div className="p-4 rounded-lg shadow-sm bg-white flex flex-col items-center text-center">
                {/* svg */}
                <h3 className="font-semibold text-lg">Spesa insieme</h3>
                <p className="text-sm  mt-1">
                  Condividere il tempo facendo commissioni quotidiane
                </p>
              </div>

              {/* card 3 */}
              <div className="p-4 rounded-lg shadow-sm bg-white flex flex-col items-center text-center">
                {/* svg */}
                <h3 className="font-semibold text-lg">Viaggi condivisi</h3>
                <p className="text-sm  mt-1">
                  Accompagnamento sicuro per uscite e appuntamenti
                </p>
              </div>

              {/* card 4 */}
              <div className="p-4 rounded-lg shadow-sm bg-white flex flex-col items-center text-center">
                {/* svg /> */}
                <h3 className="font-semibold text-lg">Compagnia sincera</h3>
                <p className="text-sm mt-1">
                  Conversazioni, risate e momenti di vera connessione
                </p>
              </div>
            </div>
          </section>
          <section className="bg-[#f5f5f5] py-12 md:py-24 lg:py-32">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                PERCHÉ VIGILA È NECESSARIA?
              </h2>
              <p className="text-lg ">
                I numeri che raccontano un bisogno reale
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {/* Statistic 1 */}
                <div className="space-y-2">
                  <p className="text-5xl font-bold text-consumer-blue">4,5M</p>
                  <p className="text-lg font-medium">
                    Anziani che vivono soli in Italia
                  </p>
                  <p className="text-sm text-gray-500">(Fonte ISTAT)</p>
                </div>
                {/* Statistic 2 */}
                <div className="space-y-2">
                  <p className="text-5xl font-bold text-vigil-orange">70%</p>
                  <p className="text-lg font-medium">
                    Non trova assistenza affidabile
                  </p>
                  <p className="text-sm text-gray-500">(Fonte Censis)</p>
                </div>
                {/* Statistic 3 */}
                <div className="space-y-2">
                  <p className="text-5xl font-bold text-consumer-blue">20%</p>
                  <p className="text-lg font-medium">
                    Giovani senza lavoro dignitoso
                  </p>
                  <p className="text-sm text-gray-500">(Fonte Eurostat)</p>
                </div>
              </div>
              {/* Opportunities Card */}
              <div className="mx-auto max-w-2xl p-6 mt-12 shadow-lg rounded-xl">
                <div className="p-0">
                  <h3 className="text-xl font-bold mb-4">
                    Con Vigila trasformiamo questi numeri in opportunità:
                  </h3>
                  <ul className="list-none space-y-2 text-left">
                    <li className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-vigil-orange mr-2"></span>
                      Supporto leggero per gli anziani
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-consumer-blue mr-2"></span>
                      Lavoro flessibile per i giovani Vigili
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-vigil-orange mr-2"></span>
                      Serenità per le famiglie
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Come iniziare con Vigila
              </h2>
              <p className="text-lg ">
                Tre semplici passi per trovare il tuo Vigil
              </p>

              {/* Per le Famiglie */}
              <div className="mt-12 space-y-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 rounded-full border-2 border-vigil-orange flex items-center justify-center">
                    {/* svg className="w-10 h-10 text-vigil-orange" */}
                  </div>
                  <h3 className="text-2xl font-bold text-vigil-orange">
                    Per le Famiglie
                  </h3>
                  <p className="text-md  max-w-sm">
                    Trovare un amico speciale per il tuo caro
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Step 1 Famiglie */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-vigil-orange text-white flex items-center justify-center text-lg font-bold">
                      1
                    </div>
                    <p className="text-lg font-medium">
                      Trova un vigil vicino a te
                    </p>
                    <p className="text-sm">
                      cerca nella tua zona e visualizza i profili disponibili
                    </p>
                  </div>
                  {/* Step 2 Famiglie */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-vigil-orange text-white flex items-center justify-center text-lg font-bold">
                      2
                    </div>
                    <p className="text-lg font-medium">
                      Scegli chi ti ispira fiducia
                    </p>
                    <p className="text-sm ">
                      Leggi recensioni e seleziona il Vigil più adatto
                    </p>
                  </div>
                  {/* Step 3 Famiglie */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-vigil-orange text-white flex items-center justify-center text-lg font-bold">
                      3
                    </div>
                    <p className="text-lg font-medium">Conosci il tuo Vigil</p>
                    <p className="text-sm ">
                      Prenota e inizia subito il servizio di cui hai bisogno
                    </p>
                  </div>
                </div>
              </div>

              {/* Per i Giovani */}
              <div className="mt-12 space-y-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 rounded-full border-2 border-consumer-blue flex items-center justify-center">
                    {/* svg className="w-10 h-10 text-consumer-blue"  */}
                  </div>
                  <h3 className="text-2xl font-bold text-consumer-blue">
                    Per i Giovani
                  </h3>
                  <p className="text-md max-w-sm">
                    Trovare un amico speciale per il tuo caro
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Step 1 Giovani */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-consumer-blue text-white flex items-center justify-center text-lg font-bold">
                      1
                    </div>
                    <p className="text-lg font-medium">Condividi chi sei</p>
                    <p className="text-sm">
                      Raccontaci i tuoi interessi e cosa ti piace fare
                    </p>
                  </div>
                  {/* Step 2 Giovani */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-consumer-blue text-white flex items-center justify-center text-lg font-bold">
                      2
                    </div>
                    <p className="text-lg font-medium">Incontra nuovi amici</p>
                    <p className="text-sm">
                      conosci anziani meravigliosi con storie da raccontare
                    </p>
                  </div>
                  {/* Step 3 Giovani */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-consumer-blue text-white flex items-center justify-center text-lg font-bold">
                      3
                    </div>
                    <p className="text-lg font-medium">Cresci insieme</p>
                    <p className="text-sm">
                      Scopri quanto è bello imparare l&apos;uno dall&apos;altro
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {children}

          {payoff ? <p className="mt-4 sm:text-xl/relaxed">{payoff}</p> : null}

          {primaryAction || secondaryAction ? (
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {primaryAction ? (
                <ButtonLink
                  className="block w-full rounded bg-vigil-orange px-12 py-3 text-sm font-medium text-white shadow transition hover:bg-secondary-700 focus:outline-none focus:ring active:bg-secondary-500 sm:w-auto"
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
