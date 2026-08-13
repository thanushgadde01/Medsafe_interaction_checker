# MedSafe — AI-driven Drug–Food Interaction Checker

MedSafe is a Next.js + TypeScript frontend paired with a Python inference backend that helps detect and explain potential interactions between medications and foods. It's designed for researchers, clinicians, and developers building clinical decision-support prototypes or demos.

## Key features
- Natural language and structured input for drug/food interaction checks (frontend UI components in `medsafe-frontend/components`)
- Visual results and history views (recharts-based visualizations and a history page)
- Local and remote storage options (SQLite and MongoDB support in the frontend library)
- On-device / server-side AI inference via a Python model (model file present in `medsafe-backend/medsafe_optimized_model.pth`)
- Authentication integrations (Clerk is included in dependencies)

### Stack
- **Language(s):** TypeScript (frontend), Python (backend)
- **Framework / runtime:** Next.js (App Router, `app/` directory)
- **Notable libraries:**
  - Frontend: Next.js 14, React 18, Tailwind CSS, Clerk (auth), Zustand (state), Recharts (charts), axios (HTTP)
  - Backend: Python (requirements in `medsafe-backend/requirements.txt`) — inference model included as a .pth file

## How it's organized
Top-level layout (important files/dirs only):

```
medsafe-frontend/
  app/                    Next.js App Router pages and layouts (landing, dashboard, history)
  components/             Reusable UI & app components (interaction-checker, results-card, landing-page)
  components/ui/          Small UI primitives (button, card, input)
  lib/                    Frontend utilities: api-client, DB adapters (SQLite/Mongo), SMILES converter, store
  types/                  TypeScript types
  package.json            Frontend scripts & dependencies
  .env.example            Example env file for frontend
  SETUP_GUIDE.md          Setup instructions for frontend
  PROJECT_SUMMARY.md      Project summary and notes
  setup.sh / setup.bat    Convenience setup scripts
medsafe-backend/
  main.py                 Python inference API entrypoint
  requirements.txt        Python dependencies
  medsafe_optimized_model.pth   Trained model used by the backend
  readme.md               Backend-specific notes and API info
LICENSE
.gitignore
.gitattributes
```

How it fits together:
- The Next.js frontend (in `medsafe-frontend/`) renders the UI and calls the inference API for interaction checks through the library client (`lib/api-client.ts`). The `app/` folder is the source of the pages (landing, dashboard, history). UI logic and state live in `components/` and `lib/store.ts`.
- The Python backend (under `medsafe-backend/`) hosts the inference model and exposes endpoints the frontend consumes. The model file (`medsafe_optimized_model.pth`) is bundled here; `main.py` is the runtime entrypoint for the AI inference service.
- The frontend has adapters for either a local SQLite database or MongoDB (`lib/db-sqlite.ts`, `lib/db-mongodb.ts`) so you can run with a file DB or a remote DB.

## How to run it

Prerequisites
- Node 18+ / npm or pnpm for the frontend
- Python 3.10+ and virtualenv for the backend
- If using MongoDB, a running MongoDB instance or Atlas URI

Frontend (quick start)
1. cd into the frontend:
   ```
   cd medsafe-frontend
   ```
2. Install:
   ```
   npm install
   ```
3. Copy environment variables:
   - Copy `.env.example` to `.env.local` and fill in the values required (see `.env.example`).
4. Start dev server:
   ```
   npm run dev
   ```
Common frontend scripts (from `package.json`):
- npm run dev         — start Next.js in development
- npm run build       — build for production
- npm run start       — start built app
- npm run db:init     — run DB init script (node scripts/db-init.js)
- npm run db:seed     — run DB seed script (node scripts/db-seed.js)

Backend (inference API)
1. cd into backend:
   ```
   cd medsafe-backend
   ```
2. Create venv and install:
   ```
   python -m venv .venv
   source .venv/bin/activate   # or `.venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   ```
3. Run the service:
   ```
   python main.py
   ```
   (See `medsafe-backend/readme.md` for any framework-specific instructions or alternate run commands if the backend uses an ASGI server.)

Notes:
- The model file `medsafe_optimized_model.pth` is large and included under `medsafe-backend/` — loading it can require sufficient memory and CPU/GPU depending on how inference is implemented.
- See `medsafe-frontend/SETUP_GUIDE.md` for step-by-step frontend setup and troubleshooting.

## Environment & configuration
- The repository provides `medsafe-frontend/.env.example` — copy it and fill in values such as API endpoints, database URIs, and any auth keys required for Clerk or other services.
- Frontend database options: see `lib/db-sqlite.ts` and `lib/db-mongodb.ts`. Choose SQLite for local dev or MongoDB for remote persistence.

## Development notes & pointers
- Frontend uses the Next.js App Router (the `app/` folder) and TypeScript. Components are in `components/` with small UI primitives in `components/ui/`.
- The SMILES converter and any chemistry-specific parsing logic are in `lib/smiles-converter.ts`.
- The frontend exposes convenience scripts for DB initialization and seeding (`scripts/db-init.js`, `scripts/db-seed.js` invoked via `package.json`).
- Authentication: Clerk integration is declared in dependencies. Check `medsafe-frontend` for Clerk setup (auth-protected routes/middleware).
- If you plan to change the DB backend, look at `lib/store.ts` and the DB adapter files for how the app switches adapters.

## Contributing
- Read the project files `medsafe-frontend/PROJECT_SUMMARY.md` and `medsafe-backend/readme.md` before opening issues or PRs — they contain design and API notes.
- Keep changes small and focused. For frontend changes, run `npm run lint` and ensure TypeScript types pass.
- If adding or updating the model, document its provenance and license, and include tests or a smoke-check script for inference.

## License
This repository includes a LICENSE file at the project root. Refer to it for license terms.

## Acknowledgements
- Built with Next.js, Tailwind CSS, and multiple OSS libraries (see `medsafe-frontend/package.json` for a full list).
- Model and inference implementation live in `medsafe-backend/`.

## Try asking
- How do I switch the frontend between SQLite and MongoDB (which files control that)? — look at `medsafe-frontend/lib/db-sqlite.ts`, `medsafe-frontend/lib/db-mongodb.ts`, and `medsafe-frontend/lib/store.ts`.
- Where and how is the AI model loaded in the backend? — check `medsafe-backend/main.py` and the model file `medsafe-backend/medsafe_optimized_model.pth`.
- What environment variables do I need to run the frontend and where are they listed? — see `medsafe-frontend/.env.example` and `medsafe-frontend/SETUP_GUIDE.md`.
