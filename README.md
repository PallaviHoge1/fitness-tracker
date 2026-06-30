# Health Transformation Tracker

A mobile-first web app for tracking a 57-week body transformation journey. Built with Next.js, Supabase, and Gemini AI.

## Features

- **Weekly weigh-in** — Tuesday weigh-in with planned vs actual tracking from a 57-week roadmap
- **AI food logger** — Type natural language, Gemini analyzes macros + micronutrients
- **Daily check-in** — Diet, workout, walking, medication, sleep, mood, energy
- **Auto-compliance** — Protein and calorie targets calculated automatically from food log

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** (dark mode, mobile-first)
- **Supabase** (PostgreSQL database)
- **Gemini 2.0 Flash** (food nutrition analysis)
- **Vercel** (hosting)

---

## Setup — Step by Step

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/fitness-tracker.git
cd fitness-tracker
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → **New Project** (free tier is fine)
2. Wait for the project to initialize
3. Go to **SQL Editor** → **New Query**
4. Paste the contents of `supabase/schema.sql` → click **Run**
5. Go to **Settings** → **API** and copy:
   - **Project URL** (looks like `https://abcdef.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

### 3. Set up Gemini

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click **Create API Key**
3. Select or create a Google Cloud project
4. Copy the API key

### 4. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your keys:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
GEMINI_API_KEY=AIzaSy...
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your phone (or use Chrome DevTools mobile mode).

### 6. Deploy to Vercel

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/fitness-tracker.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → **Import Project** → select your repo

3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`

4. Click **Deploy**

Your app is live. Every `git push` auto-deploys.

---

## Project Structure

```
fitness-tracker/
├── app/
│   ├── api/analyze-food/route.ts   ← Gemini API (server-side)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                    ← Main app shell
├── components/
│   ├── ui/                         ← Reusable primitives
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Sheet.tsx
│   │   └── FormControls.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── BottomNav.tsx
│   ├── weight/
│   │   └── WeightTab.tsx
│   ├── food/
│   │   └── FoodTab.tsx
│   └── checkin/
│       └── CheckinTab.tsx
├── lib/
│   ├── types.ts                    ← TypeScript interfaces
│   ├── roadmap.ts                  ← 57-week projection data
│   ├── supabase.ts                 ← Supabase client
│   └── storage.ts                  ← Data access layer
├── supabase/
│   └── schema.sql                  ← Database schema
└── .env.local.example
```

## Security Notes

- Gemini API key is **server-side only** (never exposed to browser)
- Supabase RLS is enabled with open policies — **add auth-based policies before sharing the URL**
- `.env.local` is in `.gitignore` — never committed

## Phase 2 (Coming)

- Weight analytics chart (Recharts)
- Body measurements tracking
- Workout dashboard
- Protein/diet streaks
- Forecast engine
- Achievement badges
- Semaglutide injection log
- Health labs dashboard
- Photo comparison
- Journal/notes
