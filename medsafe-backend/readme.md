1. How to Start the Backend Server

**⚠️ IMPORTANT: Check for Port Availability**
If port 8000 is already in use (error: "only one usage of each socket address"), use port 8001 or another available port.

Whenever you need to launch the server, open a terminal in the backend directory (c:\Users\thanu\Downloads\archive (3)\medsafe-backend) and run:

**Option A: PowerShell (Recommended)**
```powershell
.venv\Scripts\Activate.ps1
$env:PYTHONUTF8="1"
python -m uvicorn main:app --host 127.0.0.1 --port 8001
```

**Option B: Windows Command Prompt (CMD)**
```cmd
.venv\Scripts\activate.bat
set PYTHONUTF8=1
python -m uvicorn main:app --host 127.0.0.1 --port 8001
```

**Output (on success):**
```
🚀 Booting MedSafe API on cpu...
🧠 Loading MoLFormer-XL...
🧠 Loading PubMedBERT...
⚖️ Loading Trained MedSafe MLP...
✅ All systems go! API is ready for inference.
INFO:     Started server process [XXXXX]
INFO:     Uvicorn running on http://127.0.0.1:8001 (Press CTRL+C to quit)
```
2. How to Test the Backend

**Method A: Interactive API Docs (Recommended - Easiest)**

1. Open your browser and navigate to: **http://127.0.0.1:8001/docs**
2. You will see the **Swagger UI** with the `/api/predict` endpoint
3. Click on the `POST /api/predict` endpoint to expand it
4. Click **"Try it out"**
5. Enter the request body:
```json
{
  "drug_smiles": "CC(=O)NC1=CC=C(O)C=C1",
  "food_smiles": "CC(=O)NC1=CC=C(O)C=C1",
  "clinical_text": "no interactions expected"
}
```
6. Click **"Execute"** and you will see the response

**Method B: Test via PowerShell**

Open a new PowerShell window and run:
```powershell
$body = @{
    drug_smiles = "CC(=O)NC1=CC=C(O)C=C1"
    food_smiles = "CC(=O)NC1=CC=C(O)C=C1"
    clinical_text = "no interactions expected"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8001/api/predict" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

**Expected Response:**
```json
{
  "status": "success",
  "source": "ml",
  "prediction": {
    "severity_score": 2,
    "severity_label": "Safe",
    "confidence": "71.56%",
    "raw_probabilities": {
      "Major": 0.1702,
      "Moderate": 0.1142,
      "Safe": 0.7156
    }
  }
}
```
3. Frontend Integration

**CORS Configuration:**
✅ CORSMiddleware is enabled in `main.py` to allow all origins (*). This means your React/Next.js frontend can make requests without CORS errors.

**Update Frontend API_URL:**
In your frontend component (`medsafe-predictor.tsx`), update the API URL to match your backend port:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api/predict";
```

**Or set environment variable in your `.env` file:**
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8001/api/predict
```

The backend is now ready to receive predictions from your frontend!