# MedSafe Setup Guide

This guide covers the current local development setup for the MedSafe frontend and inference backend.

> **Important:** MedSafe is an experimental prototype, not a medical device or validated clinical decision-support tool. Do not use its output for healthcare decisions.

## Requirements

- Git
- Node.js 18+ and npm
- Python 3.10 or 3.11 recommended for the pinned PyTorch stack
- Internet access on first backend startup to download pretrained Hugging Face models
- Optional Clerk account for frontend authentication

The backend may run on CPU or CUDA, depending on the installed PyTorch build and available hardware. The model requires memory for two Transformer encoders and their tokenizers.

## 1. Get the code

```bash
git clone https://github.com/thanushgadde01/Medsafe_interaction_checker.git
cd Medsafe_interaction_checker
```

## 2. Install and start the backend

Run the backend from its directory because `main.py` loads the checkpoint by a path relative to the current directory.

```bash
cd medsafe-backend
python -m venv .venv
```

Activate the environment:

```bash
# Linux / macOS
source .venv/bin/activate

# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# Windows Command Prompt
.\.venv\Scripts\activate.bat
```

Install dependencies and run Uvicorn:

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8001
```

The service loads MoLFormer-XL, PubMedBERT, and `medsafe_optimized_model.pth` at startup. The first run may take longer while the pretrained encoders are downloaded.

### Backend links

| URL | Description |
|---|---|
| `http://127.0.0.1:8001/docs` | Interactive Swagger UI |
| `http://127.0.0.1:8001/redoc` | ReDoc API documentation |
| `http://127.0.0.1:8001/openapi.json` | OpenAPI schema |

## 3. Configure the frontend

Open a second terminal at the repository root:

```bash
cd medsafe-frontend
npm install
```

Create `.env.local` from the example:

```bash
# Linux / macOS
cp .env.example .env.local

# Windows PowerShell
Copy-Item .env.example .env.local
```

Set at least the local inference URL:

```dotenv
NEXT_PUBLIC_API_URL=http://127.0.0.1:8001
```

For Clerk authentication, configure your Clerk credentials:

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

Never commit `.env.local` or real credentials. The example file also includes database and PubMed-related variables, but the current frontend flow does not use all of them; see the root README's [configuration notes](README.md#-configuration-and-data).

## 4. Prepare local history storage

The SQLite adapter writes to `data/medsafe.db` relative to the frontend working directory. Create the directory before using history:

```bash
mkdir -p data
```

PowerShell equivalent:

```powershell
New-Item -ItemType Directory -Force data
```

History routes currently use SQLite directly. The MongoDB adapter is present in the source but is not wired to those routes.

## 5. Start the frontend

From `medsafe-frontend/`:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 6. Verify inference directly

With the backend running, use Swagger UI at `/docs` or submit a request:

```bash
curl -X POST "http://127.0.0.1:8001/api/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "drug_smiles": "CC(=O)NC1=CC=C(O)C=C1",
    "food_smiles": "C1=CC(=C(C=C1)O)O",
    "clinical_text": "Example clinical context"
  }'
```

This sample only demonstrates the API request shape; its prediction is not a clinical recommendation.

## Frontend commands

From `medsafe-frontend/`:

| Command | Purpose |
|---|---|
| `npm run dev` | Run local Next.js development server |
| `npm run build` | Create production build |
| `npm start` | Serve a production build |
| `npm run lint` | Run the configured Next.js lint script |

The package manifest also lists database scripts, but their referenced files are not currently present in the repository. The SQLite adapter creates its table when initialized at runtime.

## Troubleshooting

### Port 8001 is occupied

Choose another backend port and update `NEXT_PUBLIC_API_URL` in `.env.local` to match. Restart the frontend after changing environment variables.

### Model download fails

Check internet access and Hugging Face availability. The backend loads the configured encoders from:

- `ibm/MoLFormer-XL-both-10pct`
- `microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext`

### Checkpoint file not found

Start Uvicorn with the working directory set to `medsafe-backend`:

```bash
cd medsafe-backend
python -m uvicorn main:app --host 127.0.0.1 --port 8001
```

### Frontend cannot reach the backend

1. Confirm the API responds at `http://127.0.0.1:8001/docs`.
2. Confirm `.env.local` contains the correct `NEXT_PUBLIC_API_URL`.
3. Restart `npm run dev` after editing `.env.local`.
4. Check browser and backend logs for the request error.

The backend currently allows all CORS origins for development. Restrict the CORS policy before deployment.

### SQLite history error

Create `medsafe-frontend/data/` and retry. The database path is constructed relative to the frontend process working directory.
