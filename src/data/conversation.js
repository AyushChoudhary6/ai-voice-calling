export const conversationMessages = [
  {
    role: 'ai',
    text: "Hi Rahul, this is White Collar Realty's AI property assistant. You recently enquired about Westin Residences. Is this a good time for a quick conversation?",
  },
  {
    role: 'customer',
    text: 'Yes, I have a few minutes.',
  },
  {
    role: 'ai',
    text: 'Great. Are you exploring the property for self-use or investment?',
  },
  {
    role: 'customer',
    text: 'Mostly investment.',
  },
  {
    role: 'ai',
    text: 'Understood. What budget range are you considering?',
  },
  {
    role: 'customer',
    text: 'Around 7 to 8 crore.',
  },
  {
    role: 'ai',
    text: 'Got it. Are you specifically looking near Dwarka Expressway or are you open to other locations?',
  },
  {
    role: 'customer',
    text: 'Dwarka Expressway is my preference. I am looking for a 4 BHK.',
  },
  {
    role: 'ai',
    text: 'That helps. When are you planning to make the purchase?',
  },
  {
    role: 'customer',
    text: 'Probably within the next 2 to 3 months.',
  },
  {
    role: 'ai',
    text: 'Would you be interested in scheduling a site visit this weekend?',
  },
  {
    role: 'customer',
    text: 'Yes. Saturday evening would work.',
  },
  {
    role: 'ai',
    text: "Perfect. I've noted your preferences. A White Collar Realty consultant will contact you to confirm the site visit.",
  },
];

export function buildTranscriptString(messages) {
  return messages
    .map((m) => {
      const speaker = m.role === 'ai' ? 'White Collar AI' : 'Rahul Mehta';
      return `${speaker}: ${m.text}`;
    })
    .join('\n');
}
