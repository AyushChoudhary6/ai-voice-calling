# White Collar AI — Voice Intelligence Operations

**Interactive Product Prototype**

> Voice calling and CRM actions are simulated for this prototype. AI transcript intelligence is powered by OpenAI.

---

## Problem Statement

White Collar Realty receives property leads from multiple acquisition channels — website, landing pages, Google Ads, Meta Ads, WhatsApp, property portals, and organic enquiries.

Sales consultants manually qualify each lead by asking the same set of questions:

- Are you buying for self-use or investment?
- What is your budget?
- Which location do you prefer?
- What property configuration do you need?
- When are you planning to purchase?
- Are you interested in a site visit?

This creates repetitive work, inconsistent qualification, and delays in identifying serious high-intent buyers.

---

## Solution

**White Collar AI** is an AI Voice Intelligence system that automates lead qualification through voice conversations.

```
Lead Sources
    ↓
Supabase / CRM
    ↓
n8n (Workflow Automation)
    ↓
Vapi (Voice Orchestration)
    ↓
OpenAI (AI Brain)
    ↓
Structured Qualification
    ↓
Explainable Lead Scoring
    ↓
CRM Update
    ↓
Sales Consultant Dashboard
```

---

## Why Vapi?

Vapi is the chosen production voice orchestration layer. It manages real-time voice agent infrastructure including:

- Voice conversation orchestration
- Transcriber integration
- LLM integration
- Text-to-speech integration
- Conversation events and call lifecycle

This removes the need to build low-level real-time audio infrastructure.

## Why OpenAI?

OpenAI is the AI brain responsible for:

- Understanding multi-turn conversation context
- Determining the next useful qualification question
- Extracting structured lead information from the final transcript
- Generating a call summary and recommending next sales actions

---

## Lead Scoring Logic

The LLM does **not** decide HOT / WARM / COLD. A deterministic JavaScript scoring engine calculates the score:

| Signal              | Max Points | Condition                      |
|---------------------|------------|--------------------------------|
| Purchase Timeline   | 25         | Within 1–3 months              |
| Budget Clarity      | 20         | Both min and max provided       |
| Property Preference | 15         | Configuration specified          |
| Site Visit Interest | 15         | Explicitly interested            |
| Location Clarity    | 10         | Location specified               |
| Engagement          | 7          | Conversation quality             |
| Buying Intent       | 5          | Purpose stated                   |

**Score Classification:**

- 80–100: **HOT**
- 50–79: **WARM**
- 0–49: **COLD**

---

## Prototype vs Production

| Feature                | Prototype          | Production          |
|------------------------|--------------------|---------------------|
| Voice Calling          | Simulated UI       | Vapi                |
| Telephony              | Simulated          | Twilio via Vapi     |
| CRM                    | Static data        | Supabase            |
| Workflow Automation    | Simulated          | n8n                 |
| Transcript Analysis    | OpenAI (optional)  | OpenAI              |
| Lead Scoring           | Live JS engine     | Live JS engine      |
| React Dashboard        | Live               | Live                |

---

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS v4
- GSAP
- Lucide React

### Backend
- Node.js
- Express 5
- OpenAI Node SDK
- dotenv
- cors

---

## Local Setup

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the project

```bash
cd white-collar-ai
```

### 2. Install client dependencies

```bash
npm install
```

### 3. Install server dependencies

```bash
cd server
npm install
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `server/.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-key-here
```

> If no API key is provided, the system will use demo fallback analysis.

### 5. Start the backend

```bash
cd server
node index.js
```

Server runs on `http://localhost:3001`.

### 6. Start the frontend

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

The Vite dev server proxies `/api` requests to the backend.

---

## Environment Variables

| Variable         | Required | Description                  |
|------------------|----------|------------------------------|
| `OPENAI_API_KEY` | Optional | OpenAI API key               |
| `PORT`           | Optional | Backend port (default: 3001) |

---

## Deployment Notes

- The frontend can be deployed to Vercel, Netlify, or any static host.
- The backend should be deployed as a Node.js service (Railway, Render, Fly.io).
- Update the API base URL in the frontend if not using the Vite proxy.

---

## Future Improvements

- Real Vapi voice agent integration
- Supabase CRM backend
- n8n workflow automation
- Multi-language voice support
- Real-time WebSocket call events
- Consultant mobile app
- Analytics and reporting dashboard
- Multi-property support
- A/B testing of qualification scripts
