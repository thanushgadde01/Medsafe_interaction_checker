from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel
import torch.nn.functional as F

# ==========================================
# 1. DEFINE THE AI ARCHITECTURE (Must match training exactly)
# ==========================================
class MedSafeMLP(nn.Module):
    def __init__(self, input_dim=2304, num_classes=3):
        super(MedSafeMLP, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, 1024),
            nn.BatchNorm1d(1024),
            nn.LeakyReLU(0.1),
            nn.Dropout(0.4),
            
            nn.Linear(1024, 256),
            nn.BatchNorm1d(256),
            nn.LeakyReLU(0.1),
            nn.Dropout(0.3),
            
            nn.Linear(256, num_classes)
        )
        
    def forward(self, x):
        return self.network(x)

# ==========================================
# 2. INITIALIZE APP & LOAD MODELS ON STARTUP
# ==========================================
app = FastAPI(title="MedSafe AI Inference API")

# Add CORS Middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print(f"🚀 Booting MedSafe API on {device}...")

# Load Frozen Transformers (Global variables so they load only once)
print("🧠 Loading MoLFormer-XL...")
mol_tokenizer = AutoTokenizer.from_pretrained("ibm/MoLFormer-XL-both-10pct", trust_remote_code=True)
mol_model = AutoModel.from_pretrained("ibm/MoLFormer-XL-both-10pct", deterministic_eval=True, trust_remote_code=True).to(device).eval()

print("🧠 Loading PubMedBERT...")
text_tokenizer = AutoTokenizer.from_pretrained("microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext")
text_model = AutoModel.from_pretrained("microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext").to(device).eval()

# Load the Trained MLP
print("⚖️ Loading Trained MedSafe MLP...")
ml_model = MedSafeMLP().to(device)
# Load the weights from the .pth file
ml_model.load_state_dict(torch.load("medsafe_optimized_model.pth", map_location=device))
ml_model.eval() # Set to evaluation mode (turns off dropout)

print("✅ All systems go! API is ready for inference.")

# ==========================================
# 3. DEFINE API DATA SCHEMAS
# ==========================================
class InteractionRequest(BaseModel):
    drug_smiles: str
    food_smiles: str
    clinical_text: str = "" # Default to empty string if no text is provided

# ==========================================
# 4. HELPER FUNCTION: GET EMBEDDINGS
# ==========================================
def get_embedding(text: str, model_type: str):
    with torch.no_grad():
        if model_type == 'mol':
            inputs = mol_tokenizer(text, padding=True, truncation=True, max_length=128, return_tensors="pt").to(device)
            outputs = mol_model(**inputs)
        else:
            inputs = text_tokenizer(text, padding=True, truncation=True, max_length=256, return_tensors="pt").to(device)
            outputs = text_model(**inputs)
        return outputs.pooler_output.squeeze(0).cpu()

# ==========================================
# 5. THE PREDICTION ENDPOINT
# ==========================================
@app.post("/api/predict")
async def predict_interaction(req: InteractionRequest):
    try:
        # 1. Convert strings to numerical embeddings using Transformers
        drug_emb = get_embedding(req.drug_smiles, 'mol')
        food_emb = get_embedding(req.food_smiles, 'mol')
        text_emb = get_embedding(req.clinical_text, 'text')
        
        # 2. Fuse the features into the 2304-D array
        fused_vector = torch.cat([drug_emb, food_emb, text_emb], dim=0).unsqueeze(0).to(device)
        
        # 3. Run the array through your trained MLP
        with torch.no_grad():
            logits = ml_model(fused_vector)
            probabilities = F.softmax(logits, dim=1).squeeze()
            predicted_class_idx = torch.argmax(probabilities).item()
            
        # 4. Map the integer back to human-readable labels
        label_map = {0: "Major", 1: "Moderate", 2: "Safe"}
        severity_label = label_map[predicted_class_idx]
        confidence_score = round(probabilities[predicted_class_idx].item() * 100, 2)
        
        # 5. Return the JSON payload to your React frontend!
        return {
            "status": "success",
            "source": "ml",
            "prediction": {
                "severity_score": predicted_class_idx,
                "severity_label": severity_label,
                "confidence": f"{confidence_score}%",
                "raw_probabilities": {
                    "Major": round(probabilities[0].item(), 4),
                    "Moderate": round(probabilities[1].item(), 4),
                    "Safe": round(probabilities[2].item(), 4)
                }
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))