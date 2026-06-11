# MedSafe Frontend - Complete Setup Guide

This comprehensive guide walks you through setting up the MedSafe frontend application from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation & Configuration](#installation--configuration)
3. [Starting the Application](#starting-the-application)
4. [Testing the Application](#testing-the-application)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

### Required Software
- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **pnpm** ([Install pnpm](https://pnpm.io/installation))
- **Git** for version control

### Required Services
- **MedSafe Backend** running on `http://127.0.0.1:8001`
- **Clerk Account** for authentication ([Sign up free](https://clerk.com))
- **SQLite3** (built-in on most systems) or **MongoDB** (optional)

### Verify Installation
```bash
node --version   # Should be v18+
npm --version    # Should be v8+
git --version    # Any recent version
```

---

## Installation & Configuration

### Step 1: Navigate to Frontend Directory

```bash
cd "c:\Users\thanu\Downloads\archive (3)\medsafe-frontend"
```

### Step 2: Create Environment File

Copy the example environment file:
```bash
cp .env.example .env.local
```

### Step 3: Configure Clerk Authentication

1. **Create Clerk Account:**
   - Go to [https://clerk.com](https://clerk.com)
   - Sign up and create a new application
   - Copy your credentials

2. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
   CLERK_SECRET_KEY=your_secret_key_here
   ```

3. **Configure Clerk URLs:**
   In Clerk Dashboard → Application → API Keys → Allowed origins, add:
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`

### Step 4: Set Backend URL

Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8001
```

Make sure the backend is running on this port! ✅

### Step 5: Install Dependencies

Using npm:
```bash
npm install
```

Or using pnpm:
```bash
pnpm install
```

Expected output:
```
added XXX packages in Xm
```

### Step 6: Initialize Database (Optional)

For SQLite history storage:
```bash
npm run db:init
```

This creates the `data/medsafe.db` file.

---

## Starting the Application

### Development Mode

```bash
npm run dev
```

Output should show:
```
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in XXXms
```

### Access the Application

Open your browser and navigate to:
- **Main URL:** http://localhost:3000
- **Landing Page:** Shows at `/`
- **Sign-In:** http://localhost:3000/sign-in
- **Sign-Up:** http://localhost:3000/sign-up
- **Dashboard:** http://localhost:3000/dashboard (after login)

---

## Testing the Application

### Test 1: Landing Page
1. Go to http://localhost:3000
2. Verify:
   - ✅ Header with MedSafe logo
   - ✅ Hero section with call-to-action
   - ✅ Features section displays correctly
   - ✅ Dark/light mode toggle works

### Test 2: Authentication
1. Click "Sign Up" button
2. Create a test account with Clerk
3. Verify redirect to dashboard
4. Test "Sign Out" functionality

### Test 3: Theme Toggle
1. Click the sun/moon icon in the navbar
2. Verify page theme changes to dark/light mode
3. Refresh page - theme preference should persist

### Test 4: Main Functionality (Backend Running)

**Prerequisites:** MedSafe backend must be running

1. Log in to dashboard
2. Enter a drug name: `Aspirin`
3. Enter a food name: `Banana`
4. Click "Check Interaction"
5. Observe:
   - Loading states appear
   - Results card shows
   - Severity label displays (Major/Moderate/Safe)
   - Confidence percentage shown
   - Probability chart renders

### Test 5: Error Handling (Backend Down)

1. Stop the backend server
2. Try to check an interaction
3. Verify error toast notification appears
4. Application doesn't crash ✅

### Test 6: History Management
1. Perform 2-3 checks successfully
2. Navigate to /history
3. Verify previous checks display
4. Test delete functionality
5. Check database persistence

### Test with Real Data

```bash
# Try these drug/food combinations:
# Drug: Warfarin → Food: Spinach (potential interaction)
# Drug: Metformin → Food: Alcohol (contraindication)
# Drug: Aspirin → Food: Ginger (safe combination)
```

---

## Project Structure Deep Dive

```
medsafe-frontend/
│
├── app/                          # Next.js 14 App Router
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout (Clerk + Theme + Toaster)
│   ├── globals.css              # Global styles
│   │
│   ├── dashboard/               # Protected dashboard route
│   │   ├── page.tsx            # Main dashboard
│   │   └── layout.tsx          # Dashboard layout with nav
│   │
│   ├── history/                 # Check history page
│   │   └── page.tsx            # History list & management
│   │
│   └── api/                      # API routes (Next.js)
│       ├── history/
│       │   ├── route.ts         # GET/POST /api/history
│       │   └── [id]/route.ts    # DELETE /api/history/[id]
│       └── webhooks/
│           └── clerk.ts         # Clerk webhook handler
│
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   │
│   ├── interaction-checker.tsx   # Main form component
│   ├── results-card.tsx          # Results with charts
│   ├── landing-page.tsx          # Landing page layout
│   ├── dashboard-layout.tsx      # Dashboard navbar & layout
│   └── theme-provider.tsx        # Dark mode context
│
├── lib/
│   ├── api-client.ts             # Backend API integration
│   ├── smiles-converter.ts       # Drug/Food → SMILES logic
│   ├── db-sqlite.ts              # SQLite database setup
│   ├── db-mongodb.ts             # MongoDB setup (optional)
│   ├── store.ts                  # Zustand state management
│   └── utils.ts                  # Helper utilities
│
├── types/
│   └── index.ts                  # TypeScript interfaces
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts
│   ├── use-toast.ts
│   └── use-user-checks.ts
│
├── styles/
│   └── globals.css               # Additional styles
│
├── public/                       # Static assets
│   └── favicon.ico
│
├── middleware.ts                 # Clerk authentication middleware
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
├── .env.example                  # Environment template
├── .env.local                    # Local env (git-ignored)
└── .gitignore                    # Git ignore rules
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Landing Page / Authentication (Clerk)                 │   │
│  └────────────────────┬────────────────────────────────────┘   │
│                       │                                         │
│  ┌────────────────────▼────────────────────────────────────┐   │
│  │  Protected Dashboard                                    │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  InteractionChecker Component                    │  │   │
│  │  │  - Drug Name Input                               │  │   │
│  │  │  - Food Name Input                               │  │   │
│  │  │  - Submit Button                                 │  │   │
│  │  └──────────────┬───────────────────────────────────┘  │   │
│  │                │                                        │   │
│  │  ┌─────────────▼────────────────────────────────────┐  │   │
│  │  │  Results Card Component                          │  │   │
│  │  │  - Severity Badge                                │  │   │
│  │  │  - Confidence Score                              │  │   │
│  │  │  - Probability Chart (Recharts)                  │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                                        │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  History Management                            │  │   │
│  │  │  - View past checks                            │  │   │
│  │  │  - Delete records                              │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └────────────────────┬────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
┌───────▼──────────┐           ┌────────▼──────────┐
│  EXTERNAL APIS   │           │   BACKEND APIS    │
│                  │           │                   │
│ ┌──────────────┐ │           │ ┌──────────────┐  │
│ │ PubMed API   │ │           │ │ /api/predict │  │
│ │ Clinical     │ │           │ │ ML Model     │  │
│ │ Text         │ │           │ │ Inference    │  │
│ └──────────────┘ │           │ └──────────────┘  │
└──────────────────┘           └───────────────────┘
        ↓                               ↓
┌────────────────────────────────────────────┐
│  DATA PROCESSING (lib/smiles-converter)     │
│                                            │
│  1. Drug Name → SMILES (PubMed Dataset)   │
│  2. Food Name → SMILES (FooDB Dataset)     │
│  3. Rate Limiting Protection               │
│  4. Clinical Text Fetching                 │
└────────────────────────┬───────────────────┘
                         │
        ┌────────────────▼────────────────┐
        │   Backend Processing            │
        │                                 │
        │   MoLFormer-XL (Drug SMILES)   │
        │   + PubMedBERT (Clinical Text)  │
        │   + MedSafe MLP (Classifier)    │
        │                                 │
        │   Returns:                      │
        │   - Severity Score (0-2)        │
        │   - Label (Safe/Moderate/Major) │
        │   - Confidence Score            │
        │   - Probabilities               │
        └────────────────┬────────────────┘
                         │
        ┌────────────────▼────────────────┐
        │  Frontend Display & Storage     │
        │                                 │
        │  1. Show Results Card           │
        │  2. Save to SQLite DB           │
        │  3. Update History View         │
        │  4. Display Charts & Breakdown  │
        └────────────────────────────────┘
```

---

## Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_test_...` | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_...` | ✅ |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://127.0.0.1:8001` | ✅ |
| `MONGODB_URI` | MongoDB connection | `mongodb+srv://...` | ❌ (optional) |
| `PUBMED_API_KEY` | PubMed API key | Your API key | ❌ (optional) |
| `DATABASE_URL` | SQLite path | `sqlite:./data/medsafe.db` | ❌ (default) |

---

## Production Build

### Build Command
```bash
npm run build
```

### Production Deployment

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel deploy
```

#### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t medsafe-frontend .
docker run -p 3000:3000 medsafe-frontend
```

#### Self-Hosted
```bash
npm run build
npm start  # Runs on port 3000
```

---

## Key Features Implemented

✅ **Authentication** - Secure sign-in/sign-up with Clerk
✅ **Dark Mode** - Light/dark theme toggle with persistence
✅ **Form Input** - Clean drug and food name inputs
✅ **API Integration** - Connects to MedSafe ML backend
✅ **SMILES Conversion** - Drug/food names to molecular structures
✅ **Results Display** - Interactive charts and probability breakdowns
✅ **History Management** - SQLite-based check history
✅ **Error Handling** - Graceful error messages with toast notifications
✅ **Rate Limiting** - Async delays to prevent API throttling
✅ **Responsive Design** - Mobile and desktop optimized
✅ **TypeScript** - Full type safety throughout
✅ **Database Modularity** - Easy swap between SQLite/MongoDB

---

## Troubleshooting

### Issue: "Cannot find module '@/components/...'"

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Issue: Clerk Not Loading

**Check:**
1. `.env.local` has correct `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
2. Clerk URLs configured in dashboard for `localhost:3000`
3. Browser cache cleared

**Fix:**
```bash
rm -rf .next node_modules/.cache
npm run dev
```

### Issue: Backend Connection Error

**Check:**
1. Backend running: `http://127.0.0.1:8001`
2. `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. CORS enabled in backend

**Test:**
```bash
curl http://127.0.0.1:8001/docs
```

### Issue: Database Errors

**Reset SQLite:**
```bash
rm -f data/medsafe.db
npm run db:init
```

### Issue: Port 3000 Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Issue: Module Not Found Errors

**Solution:**
```bash
# Clear everything and reinstall
rm -rf node_modules .next pnpm-lock.yaml
npm install  # or pnpm install
npm run dev
```

---

## Next Steps

1. ✅ Start frontend development server
2. ✅ Test all features with backend running
3. ✅ Customize UI with your branding
4. ✅ Add real data sources (PubMed, FooDB)
5. ✅ Set up MongoDB for production
6. ✅ Deploy to Vercel or your server
7. ✅ Monitor and optimize performance

---

## Support & Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Recharts](https://recharts.org)

---

**Happy coding! 🚀 Let's make healthcare safer with AI.**
