"use client";

import { useEffect, useState } from "react";

interface PaymentRecord {
  id: string;
  booking_id: string;
  consumer_name: string;
  amount: number;
  payment_method: string;
  status: string;
  transaction_date: string;
  stripe_payment_id?: string;
  refund_amount?: number;
  commission: number;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Simulazione dati - da sostituire con API reale
        const mockPayments: PaymentRecord[] = [
          {
            id: "pay_1",
            booking_id: "1",
            consumer_name: "Mario Rossi",
            amount: 120.00,
            payment_method: "Carta di credito",
            status: "completato",
            transaction_date: "2025-07-15T10:30:00",
            stripe_payment_id: "pi_1234567890",
            commission: 12.00
          },
          {
            id: "pay_2",
            booking_id: "2",
            consumer_name: "Laura Verdi",
            amount: 80.00,
            payment_method: "PayPal",
            status: "completato",
            transaction_date: "2025-07-14T14:20:00",
            stripe_payment_id: "pi_0987654321",
            commission: 8.00
          },
          {
            id: "pay_3",
            booking_id: "3",
            consumer_name: "Giuseppe Blu",
            amount: 200.00,
            payment_method: "Carta di debito",
            status: "completato",
            transaction_date: "2025-07-13T16:45:00",
            stripe_payment_id: "pi_1122334455",
            commission: 20.00
          },
          {
            id: "pay_4",
            booking_id: "4",
            consumer_name: "Anna Rosa",
            amount: 150.00,
            payment_method: "Carta di credito",
            status: "in_elaborazione",
            transaction_date: "2025-07-15T18:10:00",
            stripe_payment_id: "pi_5566778899",
            commission: 15.00
          },
          {
            id: "pay_5",
            booking_id: "5",
            consumer_name: "Luca Neri",
            amount: 90.00,
            payment_method: "Carta di credito",
            status: "fallito",
            transaction_date: "2025-07-12T09:15:00",
            commission: 0
          }
        ];
        
        setPayments(mockPayments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const processRefund = async (paymentId: string, amount: number) => {
    try {
      // Implementare chiamata API per rimborso
      console.log(`Processing refund for payment ${paymentId}, amount: ${amount}`);
      // Aggiornare stato locale
      setPayments(prev => 
        prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, status: "rimborsato", refund_amount: amount }
            : payment
        )
      );
    } catch (error) {
      console.error("Error processing refund:", error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === "all" || payment.status === filter;
    const matchesDate = !dateFilter || payment.transaction_date.startsWith(dateFilter);
    
    return matchesFilter && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completato": return "bg-green-100 text-green-800";
      case "in_elaborazione": return "bg-yellow-100 text-yellow-800";
      case "fallito": return "bg-red-100 text-red-800";
      case "rimborsato": return "bg-purple-100 text-purple-800";
      case "in_attesa": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalRevenue = filteredPayments
    .filter(p => p.status === "completato")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCommissions = filteredPayments
    .filter(p => p.status === "completato")
    .reduce((sum, p) => sum + p.commission, 0);

  const totalRefunds = filteredPayments
    .filter(p => p.status === "rimborsato")
    .reduce((sum, p) => sum + (p.refund_amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestione Pagamenti</h1>
        <p className="text-gray-600">Monitora e gestisci tutti i pagamenti della piattaforma</p>
      </div>

      {/* Statistiche finanziarie */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💰</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ricavi Totali</p>
              <p className="text-2xl font-bold text-green-600">€{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💳</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Commissioni</p>
              <p className="text-2xl font-bold text-blue-600">€{totalCommissions.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">↩️</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Rimborsi</p>
              <p className="text-2xl font-bold text-purple-600">€{totalRefunds.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📊</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Transazioni</p>
              <p className="text-2xl font-bold text-gray-900">{filteredPayments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtri */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stato pagamento
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">Tutti</option>
              <option value="completato">Completato</option>
              <option value="in_elaborazione">In elaborazione</option>
              <option value="fallito">Fallito</option>
              <option value="rimborsato">Rimborsato</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilter("all");
                setDateFilter("");
              }}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Reset Filtri
            </button>
          </div>
        </div>
      </div>

      {/* Tabella pagamenti */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commissione
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metodo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.consumer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    €{payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    €{payment.commission.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.payment_method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.transaction_date).toLocaleString("it-IT")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {payment.status === "completato" && (
                        <button
                          onClick={() => processRefund(payment.id, payment.amount)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Rimborsa
                        </button>
                      )}
                      {payment.stripe_payment_id && (
                        <button className="text-blue-600 hover:text-blue-900">
                          Dettagli Stripe
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-900">
                        Export
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPayments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nessun pagamento trovato con i filtri selezionati
          </div>
        )}
      </div>

      {/* Grafico delle transazioni (placeholder) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Andamento Pagamenti Mensili</h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Grafico delle transazioni (da implementare con libreria chart)</p>
        </div>
      </div>
    </div>
  );
}
