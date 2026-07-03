import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports!
dotenv.config();

import { QUALIFICATION_SYSTEM_PROMPT } from './prompts/qualificationPrompt.js';
import { ANALYSIS_SYSTEM_PROMPT } from './prompts/analysisPrompt.js';
import { callVoiceAgent, callCallAnalysis } from './services/huggingFaceService.js';

process.env.QUALIFICATION_SYSTEM_PROMPT = QUALIFICATION_SYSTEM_PROMPT;
process.env.ANALYSIS_SYSTEM_PROMPT = ANALYSIS_SYSTEM_PROMPT;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// GET /api/health
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    hfConfigured: !!(process.env.HF_TOKEN && process.env.HF_TOKEN !== 'your-hugging-face-token'), 
    timestamp: new Date().toISOString() 
  });
});

// POST /api/voice-agent
app.post('/api/voice-agent', async (req, res) => {
  console.log('[Server] /api/voice-agent called');
  const { conversation } = req.body;
  console.log('[Server] Conversation:', conversation);
  
  if (!conversation) return res.status(400).json({ success: false, message: 'Conversation is required' });
  
  try {
    const result = await callVoiceAgent(conversation);
    console.log('[Server] Call result:', result);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (err) {
    console.error('[Server] Voice agent error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/analyze-call
app.post('/api/analyze-call', async (req, res) => {
  const { conversation } = req.body;
  if (!conversation) return res.status(400).json({ success: false, message: 'Conversation is required' });
  try {
    const result = await callCallAnalysis(conversation);
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (err) {
    console.error('[Server] Analysis error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[White Collar AI Server] Running on port ${PORT}`);
  const hfConfigured = !!(process.env.HF_TOKEN && process.env.HF_TOKEN !== 'your-hugging-face-token');
  console.log(`[HuggingFace] Configured: ${hfConfigured}`);
  if (hfConfigured) {
    console.log(`[HuggingFace] Model: ${process.env.HF_MODEL || 'Qwen/Qwen2.5-7B-Instruct'}`);
  }
});
