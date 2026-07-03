import dotenv from 'dotenv';
dotenv.config();
import { InferenceClient } from '@huggingface/inference';

const HF_TOKEN = process.env.HF_TOKEN;
const MODEL_ID = process.env.HF_MODEL || "Qwen/Qwen2.5-7B-Instruct";

console.log('Testing Hugging Face API...');
console.log('Token:', HF_TOKEN ? 'Loaded' : 'Not loaded');
console.log('Model:', MODEL_ID);

async function test() {
  try {
    const hfClient = new InferenceClient(HF_TOKEN);
    console.log('Client created, calling model...');
    
    const response = await hfClient.chatCompletion({
      model: MODEL_ID,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello, test message!' }
      ],
      temperature: 0.4,
      max_tokens: 200,
    });
    
    console.log('Full response:', JSON.stringify(response, null, 2));
    const aiText = response.choices?.[0]?.message?.content?.trim() || '';
    console.log('AI text:', aiText);
    
  } catch (err) {
    console.error('Error testing HF:', err);
  }
}

test();
