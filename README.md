# NIBS Super-App

This repository contains a Netlify-ready monorepo for farmer onboarding, NIBS wallet utilities, and an investor room. The project is bilingual (English/Spanish) and uses serverless functions for backend logic.

## Structure
See `/docs/ARCHITECTURE.md` for details.

## Development
- `npm install`
- `npm run dev` – start Next.js dev server
- `npm run build` – production build
- `npm test` – placeholder tests

## Deployment
The project deploys to Netlify via GitHub. Functions live under `netlify/functions` and edge logic under `netlify/edge-functions`.
