"use client";

import { useState } from "react";
import { apiAdmin } from "@/src/constants/api.constants";
import { ApiService } from "@/src/services";

interface PromoteUserComponentProps {
  userId?: string;
  onSuccess?: () => void;
}

export default function PromoteUserComponent({ userId: initialUserId, onSuccess }: PromoteUserComponentProps) {
  const [userId, setUserId] = useState(initialUserId || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error" | null;
    message: string;
    details?: any;
  }>({ type: null, message: "" });

  const promoteUser = async () => {
    if (!userId.trim()) {
      setResult({
        type: "error",
        message: "Inserisci un ID utente valido"
      });
      return;
    }

    try {
      setLoading(true);
      setResult({ type: null, message: "" });

      const response = await ApiService.post(apiAdmin.PROMOTE_USER(userId)) as {
        success: boolean;
        message: string;
        data?: any;
      };

      if (response?.success) {
        setResult({
          type: "success",
          message: response.message,
          details: response.data
        });
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setResult({
          type: "error",
          message: response?.message || "Errore durante la promozione"
        });
      }
    } catch (error) {
      console.error("Error promoting user:", error);
      setResult({
        type: "error",
        message: "Errore di connessione durante la promozione"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Promuovi Utente ad Admin
        </h3>
        <p className="text-sm text-gray-600">
          ⚠️ Questa operazione è disponibile solo da localhost per motivi di sicurezza.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
            ID Utente
          </label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="es: 123e4567-e89b-12d3-a456-426614174000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <button
          onClick={promoteUser}
          disabled={loading || !userId.trim()}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
            loading || !userId.trim()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Promuovendo...
            </div>
          ) : (
            "Promuovi ad Admin"
          )}
        </button>

        {result.type && (
          <div className={`p-4 rounded-lg ${
            result.type === "success" 
              ? "bg-green-50 border border-green-200" 
              : "bg-red-50 border border-red-200"
          }`}>
            <div className={`flex items-start gap-2 ${
              result.type === "success" ? "text-green-800" : "text-red-800"
            }`}>
              <div className="mt-0.5">
                {result.type === "success" ? "✅" : "❌"}
              </div>
              <div className="flex-1">
                <p className="font-medium">{result.message}</p>
                {result.details && result.type === "success" && (
                  <div className="mt-2 text-sm space-y-1">
                    <p><strong>User ID:</strong> {result.details.userId}</p>
                    <p><strong>Ruolo precedente:</strong> {result.details.previousRole}</p>
                    <p><strong>Nuovo ruolo:</strong> {result.details.newRole}</p>
                    <p><strong>Promosso da:</strong> {result.details.promotedBy}</p>
                    <p><strong>Data:</strong> {new Date(result.details.promotedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">⚠️ Importante</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Questa API funziona solo da localhost</li>
          <li>• Solo gli admin esistenti possono promuovere altri utenti</li>
          <li>• L&apos;operazione viene loggata per audit</li>
          <li>• Usa con cautela: gli admin hanno accesso completo al sistema</li>
        </ul>
      </div>
    </div>
  );
}
