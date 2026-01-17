# Vigila Web

Vigila Web è una moderna applicazione web sviluppata con [Next.js](https://nextjs.org/) e bootstrappata tramite [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). Il progetto utilizza TypeScript, React 19, Tailwind CSS 4 e una ricca collezione di componenti UI e utility per la gestione di utenti, servizi, CRM, mappe e pagamenti.

## Caratteristiche principali

- **Next.js 15**: Rendering SSR/SSG, API routes, routing avanzato.
- **React 19**: Componenti funzionali, hooks, suspense.
- **Tailwind CSS 4**: Styling utility-first e personalizzazione tramite [app/tailwind.config.css](app/tailwind.config.css).
- **Gestione stato**: [Zustand](https://github.com/pmndrs/zustand) per uno stato globale semplice e performante.
- **Autenticazione & Storage**: [Supabase](https://supabase.com/) per autenticazione, database e storage file.
- **Pagamenti**: Integrazione con [Stripe](https://stripe.com/) tramite `@stripe/stripe-js` e `@stripe/react-stripe-js`.
- **Mappe**: Visualizzazione e gestione POI con [Leaflet](https://leafletjs.com/) e [react-leaflet](https://react-leaflet.js.org/).
- **Notifiche Push**: Supporto a OneSignal per notifiche web push.
- **Componenti UI**: Ampia libreria di componenti riutilizzabili (Accordion, Avatar, Badge, Button, Table, Toast, ecc.).
- **Testing & Linting**: ESLint, TypeScript, e configurazione PostCSS.

## Struttura del progetto

- `/app`: Routing Next.js, pagine, layout, API routes.
- `/components`: Componenti UI riutilizzabili e core.
- `/mock`: Dati di esempio/mock.
- `/public`: Asset statici (icone, immagini, manifest, worker push).
- `/src`: Store Zustand, servizi, utility, costanti, tipi.
- `/server`: Funzioni server-side e admin.
- `/.github`: Instruzioni, prompts e documentazione per AI.
- Configurazioni: `next.config.js`, `postcss.config.js`, `tailwind.config.css`, `tsconfig.json`, `.env*`.

## Come iniziare

1. Installa le dipendenze:

   ```bash
   npm install
   ```

2. Crea un file `.env.local` con le variabili ambiente richieste (vedi esempio `.env`).

3. Avvia il server di sviluppo:

   ```bash
   npm run dev
   ```

4. Apri [http://localhost:3000](http://localhost:3000) nel browser.

## Script disponibili

- `dev`: Avvia il server di sviluppo Next.js.
- `build`: Compila l'applicazione per la produzione.
- `preview`: Avvia l'applicazione in modalità produzione.

## Personalizzazione

- Modifica la pagina principale in `app/page.tsx`.
- Personalizza i componenti UI in `components/`.
- Configura Tailwind in `app/tailwind.config.css`.
- Gestisci variabili ambiente in `.env.local`.

## Deploy

Il modo più semplice per pubblicare l'app è tramite [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Consulta la [documentazione Next.js sul deploy](https://nextjs.org/docs/deployment) per maggiori dettagli.

## Risorse utili

- Documentazione AI: `.github/copilot-instructions`
- [Documentazione Next.js](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Repository GitHub Next.js](https://github.com/vercel/next.js/)
- [Documentazione Supabase](https://supabase.com/docs)
- [Documentazione Stripe](https://stripe.com/docs)
- [Documentazione Tailwind CSS](https://tailwindcss.com/docs)

---