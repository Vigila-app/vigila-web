# Copilot Instructions for Vigila App Codebase

## Project Overview
This is a Next.js + Supabase based web application with the aim to create an Operational Platform that match families needs with Caregivers.
It includes user authentication, real-time data updates, and a responsive UI built with Tailwind CSS.
The project follows a modular architecture with clear separation of concerns, making it easy to maintain and extend.
For more details, refer to the main README.md file.

## Architecture & Structure
- **Monorepo** with modular structure: core app, components, SSR, services, utilities, and store.
- **Major directories:**
  - `app`: Next.js App-Router structure with server and client components.
  - `components`: Frontend UI components, organized by feature and shared components.
  - `server`: Server-side utilities, including Supabase client and API routes.
  - `src/services/`: API interaction and business logic.
  - `src/store/`: State management using Zustand.
  - `src/utils/`: Utility functions and helpers.
  - `mock`: Mock data for development and testing and CMS content.
  - `build/`: Build artifacts and stats.
  - `.github`: GitHub configurations, including Copilot instructions, rules and features documentation.

## Styling
Style configurations in `app/tailwind.config.js` and global styles in `app/globals.css`.
- **Tailwind CSS** for utility-first styling.
- **Customization:** Components can have module-specific styles in their folders (eg. `components/button/button.style.ts`).

## Developer Workflows
- **Install dependencies:** `npm install`.
- **Start local dev server:** `npm run dev`.
- **Build:** `npm run build` (outputs to `build/`).
- **Deploy:** CI/CD via Vercel.

## Tips for AI Agents
- Use mocks for local development and testing.
- Follow the established directory and naming conventions.
- Prefer updating existing scripts/utilities over duplicating logic.
- Always consult `.github/rules/` and `.github/features/` to enforce context.
