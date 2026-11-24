# MedSafe Frontend

Next.js 14 App Router application for the MedSafe drug–food interaction prototype.

## Start locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Configure Clerk credentials and `NEXT_PUBLIC_API_URL` in `.env.local` as required. The API base URL defaults to `http://127.0.0.1:8001`.

The complete cross-platform instructions, architecture, API details, and prototype limitations are in the repository [README](../README.md) and [Setup Guide](../SETUP_GUIDE.md).

## Main source areas

| Path | Responsibility |
|---|---|
| `app/` | Landing, dashboard, history pages, and Next.js history routes |
| `components/interaction-checker.tsx` | Input form and prediction request workflow |
| `components/results-card.tsx` | Severity and class-probability presentation |
| `lib/api-client.ts` | FastAPI client |
| `lib/smiles-converter.ts` | Current mock SMILES mappings and clinical text templates |
| `lib/db-sqlite.ts` | SQLite history adapter used by history routes |
| `lib/db-mongodb.ts` | MongoDB adapter, not currently wired to history routes |
| `lib/store.ts` | Zustand state for interaction flow |

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
```
