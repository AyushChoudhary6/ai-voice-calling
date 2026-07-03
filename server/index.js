import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize OpenAI client
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key') {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const SYSTEM_PROMPT = `You are an AI lead intelligence analyst for White Collar Realty, a luxury real estate consultancy.

Your job is to analyze a finalized AI qualification call transcript.

Extract only information explicitly stated or clearly supported by the conversation.

Never invent missing information.

Analyze:
- buying purpose
- minimum budget
- maximum budget
- preferred location
- property configuration
- purchase timeline
- site visit interest
- preferred site visit time

Also generate:
- concise sales call summary (2-4 sentences)
- recommended next sales action (1-2 sentences)

Return valid JSON only.

Required JSON structure:

{
  "buyingPurpose": "",
  "budgetMin": null,
  "budgetMax": null,
  "budgetDisplay": "",
  "preferredLocation": "",
  "configuration": "",
  "purchaseTimeline": "",
  "siteVisitInterest": false,
  "preferredVisitTime": "",
  "callSummary": "",
  "recommendedAction": ""
}

Budget values should be returned in INR numeric format.
Example: 7 crore = 70000000

If information is not available:
Use null for numeric values.
Use an empty string for text.
Use false for boolean values unless interest is clearly expressed.

Return JSON only. No markdown fences, no explanation.`;

// Fallback analysis data
const FALLBACK_ANALYSIS = {
  buyingPurpose: 'Investment',
  budgetMin: 70000000,
  budgetMax: 80000000,
  budgetDisplay: '₹7–8 Crore',
  preferredLocation: 'Dwarka Expressway',
  configuration: '4 BHK',
  purchaseTimeline: '2–3 Months',
  siteVisitInterest: true,
  preferredVisitTime: 'Saturday Evening',
  callSummary: 'Rahul is a high-intent investment buyer looking for a 4 BHK property near Dwarka Expressway. His budget is ₹7–8 crore and he plans to purchase within 2–3 months. He has expressed interest in a Saturday evening site visit. Immediate consultant follow-up is recommended.',
  recommendedAction: 'Assign a senior property consultant and confirm the Saturday site visit.'
};

// POST /api/analyze-call
app.post('/api/analyze-call', async (req, res) => {
  const { transcript } = req.body;

  if (!transcript || typeof transcript !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Transcript is required',
    });
  }

  // If no OpenAI client, return fallback
  if (!openai) {
    console.log('[Server] OpenAI not configured — returning fallback analysis');
    return res.json({
      success: true,
      analysisMode: 'demo-fallback',
      analysis: FALLBACK_ANALYSIS,
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Analyze this qualification call transcript:\n\n${transcript}` },
      ],
      temperature: 0.2,
      max_tokens: 800,
    });

    const raw = completion.choices[0]?.message?.content?.trim();

    if (!raw) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse JSON — strip markdown fences if present
    const cleaned = raw.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    const analysis = JSON.parse(cleaned);

    console.log('[Server] OpenAI analysis complete');

    return res.json({
      success: true,
      analysisMode: 'openai',
      analysis,
    });
  } catch (err) {
    console.error('[Server] OpenAI analysis failed:', err.message);

    return res.json({
      success: true,
      analysisMode: 'demo-fallback',
      analysis: FALLBACK_ANALYSIS,
    });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    openai: !!openai,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[White Collar AI Server] Running on port ${PORT}`);
  console.log(`[OpenAI] ${openai ? 'Connected' : 'Not configured — using fallback mode'}`);
});
