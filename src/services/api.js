const API_BASE = '/api';

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
  callSummary:
    'Rahul is a high-intent investment buyer looking for a 4 BHK property near Dwarka Expressway. His budget is ₹7–8 crore and he plans to purchase within 2–3 months. He has expressed interest in a Saturday evening site visit. Immediate consultant follow-up is recommended.',
  recommendedAction:
    'Assign a senior property consultant and confirm the Saturday site visit.',
};

export async function analyzeTranscript(transcript) {
  try {
    const res = await fetch(`${API_BASE}/analyze-call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[API] Failed to reach backend, using fallback:', err.message);
    return {
      success: true,
      analysisMode: 'demo-fallback',
      analysis: FALLBACK_ANALYSIS,
    };
  }
}
