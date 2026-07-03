/**
 * Deterministic lead scoring engine.
 * The LLM does NOT decide HOT / WARM / COLD.
 * This JavaScript function calculates the score from structured data.
 */
export function calculateLeadScore(analysis) {
  let totalScore = 0;
  const scoreReasons = [];

  // 1. Purchase Timeline (max 25)
  const timeline = (analysis.purchaseTimeline || '').toLowerCase();
  if (
    timeline.includes('1 month') ||
    timeline.includes('30 days') ||
    timeline.includes('2 month') ||
    timeline.includes('3 month') ||
    timeline.includes('2-3') ||
    timeline.includes('2–3')
  ) {
    totalScore += 25;
    scoreReasons.push({
      label: 'Purchase Timeline',
      value: analysis.purchaseTimeline,
      points: 25,
    });
  } else if (timeline.includes('6 month') || timeline.includes('4 month') || timeline.includes('5 month')) {
    totalScore += 15;
    scoreReasons.push({
      label: 'Purchase Timeline',
      value: analysis.purchaseTimeline,
      points: 15,
    });
  } else if (timeline.length > 0) {
    totalScore += 5;
    scoreReasons.push({
      label: 'Purchase Timeline',
      value: analysis.purchaseTimeline,
      points: 5,
    });
  }

  // 2. Budget (max 20)
  if (analysis.budgetMin != null && analysis.budgetMax != null) {
    totalScore += 20;
    scoreReasons.push({
      label: 'Budget Clarity',
      value: analysis.budgetDisplay || `₹${(analysis.budgetMin / 10000000).toFixed(0)}–${(analysis.budgetMax / 10000000).toFixed(0)} Crore`,
      points: 20,
    });
  } else if (analysis.budgetMin != null || analysis.budgetMax != null) {
    totalScore += 10;
    scoreReasons.push({
      label: 'Budget Clarity',
      value: analysis.budgetDisplay || 'Partial',
      points: 10,
    });
  }

  // 3. Property Configuration (max 15)
  if (analysis.configuration && analysis.configuration.length > 0) {
    totalScore += 15;
    scoreReasons.push({
      label: 'Property Preference',
      value: analysis.configuration,
      points: 15,
    });
  }

  // 4. Site Visit Interest (max 15)
  if (analysis.siteVisitInterest === true) {
    totalScore += 15;
    scoreReasons.push({
      label: 'Site Visit Interest',
      value: 'Interested',
      points: 15,
    });
  }

  // 5. Location (max 10)
  if (analysis.preferredLocation && analysis.preferredLocation.length > 0) {
    totalScore += 10;
    scoreReasons.push({
      label: 'Location Clarity',
      value: analysis.preferredLocation,
      points: 10,
    });
  }

  // 6. Engagement (demo: 7)
  totalScore += 7;
  scoreReasons.push({
    label: 'Conversation Engagement',
    value: 'High',
    points: 7,
  });

  // 7. Buying Purpose (max 5)
  if (analysis.buyingPurpose && analysis.buyingPurpose.length > 0) {
    totalScore += 5;
    scoreReasons.push({
      label: 'Buying Intent',
      value: analysis.buyingPurpose,
      points: 5,
    });
  }

  // Cap at 100
  totalScore = Math.min(totalScore, 100);

  // Determine status
  let status;
  if (totalScore >= 80) status = 'Hot';
  else if (totalScore >= 50) status = 'Warm';
  else status = 'Cold';

  return { totalScore, status, scoreReasons };
}
