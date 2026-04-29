type CredentialCard = {
  value: string;
  label: string;
  description?: string;
};

const credentials: CredentialCard[] = [
  {
    value: "1 di 5",
    label: "Amazon / Develhope",
    description: "Selezionati su 300+ candidature",
  },
  {
    value: "100+",
    label: "Caregiver in waiting list",
    description: "Professionisti già pronti in piattaforma",
  },
  {
    value: "🏆",
    label: "Festival dell'Economia Civile",
    description: "Selezionati a livello nazionale",
  },
  {
    value: "📍",
    label: "VESTA Roma 2026",
    description: "Espositore ufficiale DOMINA",
  },
];

const PartnerCredentials = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Non siamo una startup in PowerPoint.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {credentials.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 text-center flex flex-col items-center gap-2"
            >
              <div className="text-3xl font-bold text-consumer-blue">
                {card.value}
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {card.label}
              </div>
              {card.description && (
                <div className="text-xs text-gray-500 leading-relaxed">
                  {card.description}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-gray-600 max-w-2xl mx-auto">
          Stiamo costruendo l&apos;infrastruttura dell&apos;assistenza
          domiciliare in Italia. I partner che entrano ora crescono con noi.
        </p>
      </div>
    </section>
  );
};

export default PartnerCredentials;
