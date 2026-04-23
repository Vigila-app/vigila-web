"use client";

import { useEffect, useRef, useState } from "react";
import { useAdminStore } from "@/src/store/admin/admin.store";
import { VigilCandidatoI } from "@/src/types/admin.types";

type CsvRow = Omit<VigilCandidatoI, "id" | "status" | "created_at">;

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(text: string): CsvRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) =>
    h.toLowerCase().replace(/\s+/g, "_")
  );

  // Column name mapping
  const columnMap: Record<string, keyof CsvRow> = {
    nome: "nome",
    name: "nome",
    first_name: "nome",
    cognome: "cognome",
    surname: "cognome",
    last_name: "cognome",
    email: "email",
    telefono: "telefono",
    phone: "telefono",
    tel: "telefono",
    citta: "citta",
    city: "citta",
    cap: "cap",
    zip: "cap",
    postal_code: "cap",
    note: "note",
    notes: "note",
  };

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: Partial<CsvRow> = {};
    headers.forEach((header, idx) => {
      const mappedKey = columnMap[header];
      if (mappedKey) {
        row[mappedKey] = values[idx] || undefined;
      }
    });
    return row as CsvRow;
  });
}

const statusLabels: Record<string, string> = {
  pending: "In attesa",
  invited: "Invitato/a",
  registered: "Registrato/a",
  active: "Attivo/a",
};

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-800",
  invited: "bg-blue-100 text-blue-800",
  registered: "bg-yellow-100 text-yellow-800",
  active: "bg-green-100 text-green-800",
};

export default function AdminVigilCandidatiPage() {
  const {
    vigilCandidati,
    vigilCandidatiLoading,
    getVigilCandidati,
    inviteVigilCandidato,
    importVigilCandidati,
    createVigilCandidato,
  } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<CsvRow>({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    citta: "",
    cap: "",
    note: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getVigilCandidati();
  }, [getVigilCandidati]);

  const filteredCandidati = vigilCandidati.filter((c) => {
    const matchSearch =
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cognome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.citta || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleInvite = async (candidatoId: string) => {
    setInvitingId(candidatoId);
    try {
      await inviteVigilCandidato(candidatoId);
    } catch {
      // error handled in store
    } finally {
      setInvitingId(null);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const rows = parseCsv(text);

    if (!rows.length) {
      setImportMessage("Nessun dato valido trovato nel file CSV.");
      return;
    }

    try {
      const result = await importVigilCandidati(rows);
      setImportMessage(
        `✅ Importati ${result.imported} candidati con successo.`
      );
    } catch {
      setImportMessage("❌ Errore durante l'importazione. Riprova.");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.nome || !addForm.cognome || !addForm.email) return;
    try {
      await createVigilCandidato(addForm);
      setShowAddForm(false);
      setAddForm({
        nome: "",
        cognome: "",
        email: "",
        telefono: "",
        citta: "",
        cap: "",
        note: "",
      });
    } catch {
      // handled in store
    }
  };

  const countByStatus = (status: string) =>
    vigilCandidati.filter((c) => c.status === status).length;

  if (vigilCandidatiLoading && !vigilCandidati.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Candidati Vigil
        </h1>
        <p className="text-gray-600">
          Gestisci i candidati Vigil e invia gli inviti per l'attivazione
          del profilo
        </p>
      </div>

      {/* Statistiche rapide */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["pending", "invited", "registered", "active"] as const).map(
          (s) => (
            <div key={s} className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {countByStatus(s)}
              </p>
              <p className="text-sm text-gray-600">{statusLabels[s]}</p>
            </div>
          )
        )}
      </div>

      {/* Azioni */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Azioni rapide
        </h3>
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 text-sm"
          >
            + Aggiungi candidato
          </button>

          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
            📂 Importa da CSV
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          <button
            onClick={() => getVigilCandidati(true)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
          >
            🔄 Aggiorna lista
          </button>
        </div>

        {importMessage && (
          <p className="mt-3 text-sm text-gray-700 bg-gray-50 rounded p-2">
            {importMessage}
          </p>
        )}

        {/* Add form */}
        {showAddForm && (
          <form
            onSubmit={handleAddSubmit}
            className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 border-t pt-4"
          >
            <input
              type="text"
              placeholder="Nome *"
              value={addForm.nome}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, nome: e.target.value }))
              }
              className="border border-gray-300 rounded px-3 py-2 text-sm"
              required
            />
            <input
              type="text"
              placeholder="Cognome *"
              value={addForm.cognome}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, cognome: e.target.value }))
              }
              className="border border-gray-300 rounded px-3 py-2 text-sm"
              required
            />
            <input
              type="email"
              placeholder="Email *"
              value={addForm.email}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, email: e.target.value }))
              }
              className="border border-gray-300 rounded px-3 py-2 text-sm"
              required
            />
            <input
              type="text"
              placeholder="Telefono"
              value={addForm.telefono || ""}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, telefono: e.target.value }))
              }
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Città"
              value={addForm.citta || ""}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, citta: e.target.value }))
              }
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="CAP"
              value={addForm.cap || ""}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, cap: e.target.value }))
              }
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Note"
              value={addForm.note || ""}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, note: e.target.value }))
              }
              className="border border-gray-300 rounded px-3 py-2 text-sm md:col-span-2"
              rows={2}
            />
            <div className="flex gap-2 items-start md:col-span-3">
              <button
                type="submit"
                className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700"
              >
                Salva candidato
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300"
              >
                Annulla
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Filtri e ricerca */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtra per stato
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tutti gli stati</option>
              <option value="pending">In attesa</option>
              <option value="invited">Invitato/a</option>
              <option value="registered">Registrato/a</option>
              <option value="active">Attivo/a</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cerca candidato
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca per nome, email o città..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Lista candidati */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Candidati ({filteredCandidati.length})
          </h3>
        </div>

        {filteredCandidati.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <p className="text-lg">Nessun candidato trovato.</p>
            <p className="text-sm mt-1">
              Importa un file CSV o aggiungi manualmente i candidati.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contatto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Località
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invitato il
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidati.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {c.nome} {c.cognome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{c.email}</div>
                      {c.telefono && (
                        <div className="text-sm text-gray-500">{c.telefono}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {[c.citta, c.cap].filter(Boolean).join(" ") || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {c.note || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[c.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {statusLabels[c.status] || c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {c.invited_at
                        ? new Date(c.invited_at).toLocaleDateString("it-IT")
                        : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(c.status === "pending" || c.status === "invited") && (
                        <button
                          onClick={() => handleInvite(c.id)}
                          disabled={invitingId === c.id}
                          className="text-orange-600 hover:text-orange-900 text-xs bg-orange-50 px-2 py-1 rounded disabled:opacity-50"
                        >
                          {invitingId === c.id
                            ? "Invio..."
                            : c.status === "invited"
                            ? "Reinvia invito"
                            : "Invia invito"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CSV format hint */}
      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">
          📋 Formato CSV supportato:
        </p>
        <p>
          Il file deve avere una riga di intestazione con le colonne:{" "}
          <code className="bg-blue-100 px-1 rounded">nome</code>,{" "}
          <code className="bg-blue-100 px-1 rounded">cognome</code>,{" "}
          <code className="bg-blue-100 px-1 rounded">email</code> (obbligatorie)
          e opzionalmente{" "}
          <code className="bg-blue-100 px-1 rounded">telefono</code>,{" "}
          <code className="bg-blue-100 px-1 rounded">citta</code>,{" "}
          <code className="bg-blue-100 px-1 rounded">cap</code>,{" "}
          <code className="bg-blue-100 px-1 rounded">note</code>.
        </p>
      </div>
    </div>
  );
}
