#!/usr/bin/env node

/**
 * Script per promuovere un utente al ruolo ADMIN
 * Uso: node promote-admin.js <userId> <authToken>
 *
 * Esempio:
 * node promote-admin.js "123e4567-e89b-12d3-a456-426614174000" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

const userId = process.argv[2];
const authToken = process.argv[3];

if (!userId || !authToken) {
  console.error("❌ Uso: node promote-admin.js <userId> <authToken>");
  console.error("");
  console.error("Parametri:");
  console.error("  userId    - ID dell'utente da promuovere ad admin");
  console.error("  authToken - Token di autenticazione di un admin esistente");
  process.exit(1);
}

async function promoteUserToAdmin() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/v1/admin/users/${userId}/promote`;

    console.log(`🔄 Promuovendo utente ${userId} al ruolo ADMIN...`);
    console.log(`📡 URL: ${url}`);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Host: "localhost:3000", // Forza localhost per sicurezza
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log("✅ Utente promosso con successo!");
      console.log("📊 Dettagli:");
      console.log(`   - User ID: ${data.data.userId}`);
      console.log(`   - Ruolo precedente: ${data.data.previousRole}`);
      console.log(`   - Nuovo ruolo: ${data.data.newRole}`);
      console.log(`   - Promosso da: ${data.data.promotedBy}`);
      console.log(`   - Data promozione: ${data.data.promotedAt}`);
    } else {
      console.error("❌ Errore nella promozione:");
      console.error(`   - Codice: ${data.code}`);
      console.error(`   - Messaggio: ${data.message}`);
      if (data.error) {
        console.error(`   - Errore tecnico: ${data.error}`);
      }
    }
  } catch (error) {
    console.error("❌ Errore di connessione:", error.message);
  }
}

// Esegui la promozione
promoteUserToAdmin();
