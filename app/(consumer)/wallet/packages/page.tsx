import React from 'react';

const WalletPackages = () => {
  // Dati dei pacchetti
  const packages = [
    {
      id: 1,
      name: "Starter",
      bonus: "Bonus +10%",
      price: "50",
      credit: "55",
      savings: "5",
      features: [
        "Credito immediato disponibile",
        "Nessuna scadenza",
        "Utilizzo flessibile",
        "Storico movimenti"
      ],
      isPopular: false
    },
    {
      id: 2,
      name: "Family",
      bonus: "Bonus +30%",
      price: "500",
      credit: "650",
      savings: "150",
      features: [
        "Credito immediato disponibile",
        "Nessuna scadenza",
        "Utilizzo flessibile",
        "Storico movimenti",
        "Priorità nelle prenotazioni",
        "Supporto dedicato 24/7",
        "Condivisione con familiari"
      ],
      isPopular: false
    },
    {
      id: 3,
      name: "Standard",
      bonus: "Bonus +20%",
      price: "100",
      credit: "120",
      savings: "20",
      features: [
        "Credito immediato disponibile",
        "Nessuna scadenza",
        "Utilizzo flessibile",
        "Storico movimenti",
        "Priorità nelle prenotazioni"
      ],
      isPopular: true // Questo attiverà lo stile evidenziato
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-10 px-4 font-sans">
      <div className="max-w-[380px] w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Scegli il tuo <br /> pacchetto
          </h1>
          <p className="text-gray-500 text-sm px-4 leading-relaxed">
            Più ricarichi, più risparmi. Semplice e conveniente.
          </p>
        </div>

        {/* Lista Pacchetti */}
        <div className="space-y-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative border rounded-2xl p-6 transition-all duration-300 hover:shadow-md
                ${pkg.isPopular ? 'border-sky-500 shadow-sm ring-1 ring-sky-100' : 'border-gray-200 hover:border-gray-300'}`}
            >
              
              {/* Badge "Più scelto" se necessario */}
              {pkg.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-sky-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  <span className="flex items-center gap-1">
                    ★ Più scelto
                  </span>
                </div>
              )}

              {/* Titolo e Bonus */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 text-lg">{pkg.name}</h3>
              </div>
              <p className="text-xs text-gray-400 font-medium mb-4">{pkg.bonus}</p>

              {/* Prezzo */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">€{pkg.price}</span>
                <div className="mt-1 flex flex-col">
                  <span className="text-sky-500 text-sm font-semibold">
                    → €{pkg.credit} di credito
                  </span>
                  <span className="text-gray-400 text-xs">
                    Risparmi €{pkg.savings}
                  </span>
                </div>
              </div>

              {/* Lista Features */}
              <ul className="space-y-2 mb-6">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                    <svg className="w-4 h-4 text-sky-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Bottone */}
              <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors duration-200
                ${pkg.isPopular 
                  ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-200' 
                  : 'bg-transparent text-sky-500 border border-sky-500 hover:bg-sky-50'
                }`}>
                Acquista ora
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default WalletPackages;