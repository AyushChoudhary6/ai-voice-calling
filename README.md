# White Collar AI — Voice Intelligence Operations

**Interactive Product Prototype**

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

### Prototype Architecture

```
User speaks
    ↓
Browser SpeechRecognition (Web Speech API)
    ↓
React conversation state
    ↓
Express backend
    ↓
Hugging Face Inference
    ↓
AI generates next question
    ↓
Browser SpeechSynthesis (Web Speech API)
    ↓
AI speaks
    ↓
Microphone listens again
    ↻
After conversation:
Full transcript → Hugging Face analysis → structured lead data → explainable JS scoring → dashboard result
```

---

## Prototype vs Production

| Feature                | Prototype                  | Production          |
|------------------------|----------------------------|---------------------|
| Voice Interface        | Browser Speech APIs        | Vapi                |
| AI Brain               | Hugging Face               | OpenAI              |
| Telephony              | Browser (no real calls)    | Twilio via Vapi     |
| Scoring Engine         | Live JS engine             | Live JS engine      |

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

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS v4
- GSAP
- Lucide React
- Web Speech API (SpeechRecognition, SpeechSynthesis)

### Backend
- Node.js
- Express 5
- @huggingface/inference
- dotenv
- cors

---

## Local Setup

### Prerequisites
- Node.js 18+
- npm
- Google Chrome (for SpeechRecognition support)

### 1. Clone the project

```bash
cd api
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

Edit `server/.env` and add your Hugging Face token:

```
HF_TOKEN=hf-your-token-here
HF_MODEL=Qwen/Qwen2.5-7B-Instruct
PORT=5000
CLIENT_URL=http://localhost:5173
```

> If no API key is provided, the system will use demo fallback responses.

### 5. Start the backend

```bash
cd server
npm run dev
```

Server runs on `http://localhost:5000`.

### 6. Start the frontend

```bash
npm run dev
```

Frontend runs on `http://localhost:5174` (or 5173 if available).

---

## Environment Variables

| Variable         | Required | Description                  |
|------------------|----------|------------------------------|
| `HF_TOKEN`       | Optional | Hugging Face API token       |
| `HF_MODEL`       | Optional | Model ID (default: Qwen2.5-7B-Instruct) |
| `PORT`           | Optional | Backend port (default: 5000) |
| `CLIENT_URL`     | Optional | Client URL (CORS origin)     |

---

## Usage

1. Open the app and go to **Voice Qualification** in the sidebar
2. Click "Start AI Qualification"
3. Allow microphone permissions when prompted
4. Speak naturally with the AI agent
5. After the conversation completes, view the analysis, lead score, and next actions

---

## Future Improvements

- Real Vapi voice agent integration
- Supabase CRM backend
- n8n workflow automation
- Multi-language voice support
- Real-time WebSocket call events
- Consultant mobile app
- Multi-property support
- A/B testing of qualification scripts
