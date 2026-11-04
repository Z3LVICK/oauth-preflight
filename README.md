## Features

- **Seeded guide library** — ready-to-use setup guides for providers with very different setup challenges:
  - **GitHub** — easy, no approval for internal apps
  - **Slack** — easy workspace install, harder public distribution
  - **Google Calendar** — consent screen, sensitive scopes, verification
- **Live agent generation** — submit any app name or website (e.g. `Linear`, `figma.com`) and an agent:
  1. Searches the web for official developer documentation (Tavily)
  2. Synthesizes a structured setup guide (Gemini or OpenAI)
  3. Returns difficulty, approval requirements, blockers, steps, sources, and confidence
- **Shareable output** — every generated guide has a shareable URL and a one-click **Copy as Markdown** export
- **Evidence-first design** — every guide shows sources, what was tested, what was not tested, and open uncertainties
- **Clear agent/human boundary** — each guide separates what the agent can do from what a human must do (accounts, legal terms, secrets, review submissions)

---

## How It Works

```
User submits app name / website
        │
        ▼
Normalize input (linear.app → Linear)
        │
        ▼
Web search for official docs (Tavily API)
        │
        ▼
LLM synthesizes structured guide (Gemini / OpenAI)
        │
        ▼
Guide validated + normalized
        │
        ▼
Rendered guide + shareable URL + Markdown export
```

If no API keys are configured, the app still runs and returns a clearly-labeled **low-confidence fallback guide** so the experience never hard-fails.

---

## Prerequisites

| Requirement | Version / Notes |
| :--- | :--- |
| Node.js | 18.17+ (LTS recommended) — https://nodejs.org |
| npm | Comes with Node.js |
| Git | For cloning the repo |
| Tavily API key | Free tier: https://tavily.com |
| Gemini API key | Free tier: https://aistudio.google.com/apikey |
| OpenAI API key (optional) | Only if you prefer OpenAI over Gemini — https://platform.openai.com |

---

## Getting Your API Keys

### 1. Tavily (web search) — required for live research

1. Go to https://tavily.com and create a free account
2. Open the dashboard → **API Keys**
3. Copy your key (starts with `tvly-`)

### 2. Gemini (guide generation) — required for live generation

1. Go to https://aistudio.google.com/apikey
2. Sign in with a Google account
3. Click **Create API key** and copy it

### 3. OpenAI (optional alternative to Gemini)

1. Go to https://platform.openai.com
2. Create an API key
3. Note: OpenAI API usage requires billing credit; a ChatGPT subscription does **not** include API access

---

## Setup Instructions

### Step 1 — Get the code

```bash
git clone https://github.com/Z3LV1CK/oauth-preflight.git
cd oauth-preflight
```

(Or download the ZIP from the GitHub page and extract it.)

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Create your `.env.local` file REQUIRED

In the **project root** (the same folder as `package.json`), create a file named exactly:

```
.env.local
```

You can create it:

- **In VS Code:** right-click the project root in the Explorer → New File → name it `.env.local`
- **Or in the terminal:**
  - macOS / Linux: `touch .env.local`
  - Windows PowerShell: `New-Item .env.local`

Paste this template inside it and **replace the placeholder values with your real keys**:

```env
# --- Required for live agent generation ---
TAVILY_API_KEY=tvly-PASTE-YOUR-TAVILY-KEY-HERE
GEMINI_API_KEY=PASTE-YOUR-GEMINI-KEY-HERE

# --- Optional ---
GEMINI_MODEL=gemini-2.5-flash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

Notes:

- Leave `OPENAI_API_KEY` empty unless you added OpenAI billing credit. If it is set, OpenAI is used instead of Gemini.
- Without any keys, the app still runs but returns low-confidence fallback guides.
- **Never commit this file.** It is already listed in `.gitignore`. Never share your keys or paste them into issues, PRs, or screenshots.

### Step 4 — Run the app

```bash
npm run dev
```

Open http://localhost:3000

> If you edit `.env.local`, restart the dev server (`Ctrl + C`, then `npm run dev`).

---


## Project Structure

```
oauth-preflight/
├── app/
│   ├── api/generate/route.ts   # Agent endpoint: search → LLM → structured guide
│   ├── generated/page.tsx      # Renders a generated guide from the share URL
│   ├── guide/[slug]/page.tsx   # Seeded guide detail pages
│   ├── page.tsx                # Home: search + submit form + guide library
│   └── layout.tsx
├── components/
│   ├── GuideView.tsx           # Shared guide renderer
│   └── SubmitForm.tsx          # App investigation form
├── lib/
│   ├── agent.ts                # Research + generation pipeline
│   ├── guides.ts               # Seeded guide library
│   ├── markdown.ts             # Guide → Markdown export
│   └── types.ts                # Guide data model
├── docs/
│   └── verification.md         # What was verified against real sources
├── .env.local                  # YOUR keys — create this, never commit it
└── README.md
```

---


## Limitations

- The seeded library contains 3 guides, demonstrating the pattern rather than all 100 apps
- Live generation depends on third-party search and LLM APIs
- Generated guides are research drafts — review before relying on them in production
- No provider approvals were completed as part of this project
- Providers with login-gated developer portals cannot be fully verified by the agent
- No credentials are stored, transmitted, or requested by the app itself

---

## Troubleshooting

| Problem | Fix |
| :--- | :--- |
| Generation returns a generic "low confidence" guide | API keys missing/invalid — check `.env.local` and restart the dev server |
| `Cannot find module '@/lib/types'` | Ensure `tsconfig.json` has `baseUrl: "."` and `paths: { "@/*": ["./*"] }`, then restart the TS server |
| Hydration error on `/generated` | Make sure `app/generated/page.tsx` is the `"use client"` version that reads the URL hash inside `useEffect` |
| Keys not picked up after editing `.env.local` | Restart: `Ctrl + C` then `npm run dev` |
| Port 3000 already in use | Close the other dev server, or run `npm run dev -- -p 3001` |

---

## Security Notes

- `.env.local` is gitignored — **never commit API keys**
- The app never asks users for provider credentials
- The agent only reads public documentation; it does not log in, submit forms, or bypass restrictions on provider sites

