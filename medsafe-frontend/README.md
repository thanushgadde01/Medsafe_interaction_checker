# MedSafe Frontend - AI-Driven Drug-Food Interaction Checker

A modern, responsive Next.js 14 frontend for checking potential drug-food interactions using machine learning.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Clerk account for authentication (https://clerk.com)
- Running MedSafe backend (port 8001)

### Installation

1. **Install dependencies:**
```bash
npm install
# or
pnpm install
```

2. **Set up environment variables:**
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

Required environment variables:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here
NEXT_PUBLIC_API_URL=http://127.0.0.1:8001
```

3. **Run the development server:**
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
medsafe-frontend/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Protected dashboard page
│   ├── layout.tsx         # Root layout with Clerk & theme
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   ├── interaction-checker.tsx    # Main form component
│   ├── results-card.tsx           # Results visualization
│   ├── landing-page.tsx           # Landing page
│   └── theme-provider.tsx         # Dark mode toggle
├── lib/
│   ├── api-client.ts              # Backend API integration
│   ├── smiles-converter.ts        # SMILES conversion logic
│   ├── db-sqlite.ts               # SQLite database setup
│   ├── db-mongodb.ts              # MongoDB database setup
│   ├── store.ts                   # Zustand state management
│   └── utils.ts                   # Utility functions
├── types/
│   └── index.ts                   # TypeScript type definitions
├── hooks/
│   └── (custom hooks)
├── public/                        # Static files
└── styles/                        # Additional styles
```

## 🎨 Features Implemented

- ✅ **Landing Page** - Professional design with sign-up/sign-in CTAs
- ✅ **Clerk Authentication** - Secure user registration and login
- ✅ **Dark Mode Toggle** - Light/dark theme support
- ✅ **Interaction Checker Form** - Clean, intuitive drug/food name inputs
- ✅ **SMILES Conversion** - Drug (PubMed) and Food (FooDB) name to SMILES
- ✅ **PubMed API Integration** - Fetch clinical text for interactions
- ✅ **Backend Integration** - Connect to ML prediction model
- ✅ **Results Visualization** - Interactive charts with probability breakdown
- ✅ **SQLite Database** - Local history storage
- ✅ **MongoDB Support** - Modular DB setup for easy swapping
- ✅ **Error Handling** - Graceful error messages with toast notifications
- ✅ **Rate Limiting Protection** - Asynchronous delays between API calls
- ✅ **Responsive Design** - Mobile and desktop optimized

## 🔄 Data Flow

### User Interaction Workflow:

```
User Input (Drug Name, Food Name)
    ↓
[STEP A] SMILES Conversion with Rate Limiting
    ├→ Convert Drug to SMILES (PubMed Dataset)
    ├→ Convert Food to SMILES (FooDB Dataset)
    ├→ Fetch Clinical Text (PubMed API)
    ↓
[STEP B] Backend ML Prediction
    ├→ POST /api/predict with SMILES + clinical text
    ├→ Backend returns severity + probabilities
    ↓
[STEP C] Results Display
    ├→ Show severity badge
    ├→ Display confidence percentage
    ├→ Visualize probability distribution
    ├→ Save to history (SQLite/MongoDB)
    ↓
Results Card & History Updated
```

## 🗄️ Database Setup

### SQLite (Default)
```bash
npm run db:init   # Initialize database
npm run db:seed   # Seed with sample data (optional)
```

### MongoDB (Optional)
1. Update `.env.local` with MongoDB URI:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/medsafe
```

2. Switch database implementation in code:
```typescript
// Use MongoDB instead of SQLite
import { saveCheckHistoryMongo } from '@/lib/db-mongodb';
```

## 🛠️ API Integration

### Backend Connection
The frontend connects to your MedSafe backend at `http://127.0.0.1:8001`:

```typescript
// POST /api/predict
{
  "drug_smiles": "CC(=O)NC1=CC=C(O)C=C1",
  "food_smiles": "CC(=O)NC1=CC=C(O)C=C1",
  "clinical_text": "Clinical interaction details..."
}

// Response
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

## 📚 SMILES Conversion

The SMILES converter uses mock datasets (currently). To use real data:

1. **For Drugs (PubMed):**
   - Update `lib/smiles-converter.ts` → `MOCK_PUBMED_DATA`
   - Import from `dataset_creation/` PubMed dataset

2. **For Foods (FooDB):**
   - Update `lib/smiles-converter.ts` → `MOCK_FOODDB_DATA`
   - Import from FooDB official source or `dataset_creation/`

```typescript
// Example integration
import * as pubmedData from '../../../dataset_creation/final_ML_ready_dataset.csv';
```

## 🔐 Authentication & Authorization

Protected routes use Clerk middleware:
- `/dashboard` - Protected (logged-in users only)
- `/` - Public (landing page)
- `/sign-in`, `/sign-up` - Clerk default pages

## 🌙 Dark Mode

Toggle dark mode via the button in the navbar. Preference is saved to localStorage.

```typescript
import { useTheme } from '@/components/theme-provider';

export function MyComponent() {
  const { theme, setTheme } = useTheme();
  // ...
}
```

## 📊 State Management

Global state is managed with Zustand:

```typescript
import { useMedSafeStore } from '@/lib/store';

export function MyComponent() {
  const { latestResult, history, setLatestResult } = useMedSafeStore();
  // ...
}
```

## 🚨 Error Handling

All errors are handled gracefully with toast notifications:

```typescript
import { toast } from 'sonner';

try {
  await backendAPI.predictInteraction(...);
} catch (error) {
  toast.error(error.message);
}
```

## 📦 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Deployment Options
- Vercel (recommended for Next.js)
- Docker
- Self-hosted servers

## 🔧 Configuration

### Tailwind CSS
Customize colors and themes in `tailwind.config.js`

### Next.js
Configure app behavior in `next.config.js`

### TypeScript
Adjust compiler options in `tsconfig.json`

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `MONGODB_URI` | MongoDB connection string | No |
| `PUBMED_API_KEY` | PubMed API key | No |

## 🤝 Contributing

1. Create a feature branch
2. Make changes and test
3. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## ⚠️ Important Notes

- This tool provides information only; always consult healthcare professionals
- Backend must be running for predictions to work
- Clerk authentication must be configured
- Rate limiting is implemented to avoid API throttling

## 🐛 Troubleshooting

### Port 8001 already in use
```bash
# Kill process using port 8001
netstat -ano | findstr :8001
taskkill /PID <PID> /F
```

### Database errors
```bash
# Reset database
rm -f data/medsafe.db
npm run db:init
```

### Clerk authentication not working
- Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
- Check Clerk dashboard for app configuration
- Ensure URLs match in Clerk dashboard

### Backend not responding
- Ensure backend is running: `python -m uvicorn main:app --port 8001`
- Check network connectivity
- Verify `NEXT_PUBLIC_API_URL` is correct

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review error messages in browser console
3. Check backend logs for API errors

---

**Made with ❤️ for better healthcare technology**
