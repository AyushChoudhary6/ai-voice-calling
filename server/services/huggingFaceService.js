import { InferenceClient } from '@huggingface/inference';

const MODEL_ID = process.env.HF_MODEL || "Qwen/Qwen2.5-7B-Instruct";

export async function callVoiceAgent(conversation) {
  const HF_TOKEN = process.env.HF_TOKEN;
  if (!HF_TOKEN || HF_TOKEN === 'your-hugging-face-token') {
    return { success: false, message: 'Hugging Face token not configured', mode: 'ai-unavailable' };
  }
  
  const hfClient = new InferenceClient(HF_TOKEN);
  
  try {
    const messages = [
      { role: 'system', content: process.env.QUALIFICATION_SYSTEM_PROMPT },
      ...conversation.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
    ];
    const response = await hfClient.chatCompletion({
      model: MODEL_ID,
      messages,
      temperature: 0.4,
      max_tokens: 200,
    });
    const aiText = response.choices?.[0]?.message?.content?.trim() || '';
    if (!aiText) throw new Error('Empty response from model');
    return { success: true, response: aiText, mode: 'live-ai' };
  } catch (err) {
    console.error('[HuggingFace] callVoiceAgent error:', err);
    return { success: false, message: err.message, mode: 'ai-unavailable' };
  }
}

export async function callCallAnalysis(conversation) {
  const HF_TOKEN = process.env.HF_TOKEN;
  if (!HF_TOKEN || HF_TOKEN === 'your-hugging-face-token') {
    return { success: false, message: 'Hugging Face token not configured', mode: 'ai-unavailable' };
  }
  
  const hfClient = new InferenceClient(HF_TOKEN);
  
  try {
    // Convert conversation to transcript
    const transcript = conversation.map(msg => 
      `${msg.role === 'assistant' ? 'White Collar AI' : 'User'}: ${msg.content}`
    ).join('\n');
    const response = await hfClient.chatCompletion({
      model: MODEL_ID,
      messages: [
        { role: 'system', content: process.env.ANALYSIS_SYSTEM_PROMPT },
        { role: 'user', content: `Analyze this conversation:\n${transcript}` }
      ],
      temperature: 0.2,
      max_tokens: 1000,
    });
    let rawText = response.choices?.[0]?.message?.content?.trim() || '';
    // Remove any markdown fences
    rawText = rawText.replace(/^```json\s*/, '').replace(/```$/, '');
    const analysis = JSON.parse(rawText);
    return { success: true, analysis, mode: 'live-ai' };
  } catch (err) {
    console.error('[HuggingFace] callCallAnalysis error:', err);
    return { success: false, message: err.message, mode: 'ai-unavailable' };
  }
}
