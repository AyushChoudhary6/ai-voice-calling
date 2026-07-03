import { useEffect, useRef } from 'react';
import { Brain, TrendingUp, Zap, Target, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { leads } from '../data/leads';
import { calculateLeadScore } from '../utils/calculateLeadScore';

export default function LeadIntelligence() {
  const containerRef = useRef(null);

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll('.fade-in');
    if (!elements) return;
    gsap.fromTo(elements, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 });
  }, []);

  const leadInsights = [
    {
      id: 1,
      name: 'Arjun Kapoor',
      score: 88,
      category: 'Hot',
      priority: 'High',
      budget: '8-10 Cr',
      timeline: '30 days',
      intent: 'Immediate',
      summary: 'Very high intent, ready for site visit'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      score: 65,
      category: 'Warm',
      priority: 'Medium',
      budget: '6-8 Cr',
      timeline: '60 days',
      intent: 'Shopping',
      summary: 'Exploring options, needs nurturing'
    },
    {
      id: 3,
      name: 'Rahul Mehta',
      score: 78,
      category: 'Warm',
      priority: 'Medium',
      budget: '7-8 Cr',
      timeline: '45 days',
      intent: 'Serious',
      summary: 'Site visit scheduled for Saturday'
    }
  ];

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="mb-4 fade-in">
        <h2 className="text-xl font-semibold text-text-primary">Lead Intelligence</h2>
        <p className="text-[12px] text-text-secondary mt-1">AI-powered insights and scoring</p>
      </div>

      {/* Lead Insights Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {leadInsights.map((lead, idx) => (
        <div key={lead.id} className="bg-bg-card border border-border rounded-xl p-5 fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-luxury-green flex items-center justify-center text-[11px] font-semibold text-text-primary border border-border">
                {lead.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-[13px] font-medium text-text-primary">{lead.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  lead.category === 'Hot' ? 'bg-hot/10 text-hot' :
                  lead.category === 'Warm' ? 'bg-champagne/10 text-champagne' :
                  'bg-muted-emerald/10 text-muted-emerald'
                }`}>
                  {lead.category}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-champagne">{lead.score}</div>
              <div className="text-[10px] text-text-muted">Score</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-text-muted">Budget</span>
              <span className="text-[12px] text-text-primary">{lead.budget}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-text-muted">Timeline</span>
              <span className="text-[12px] text-text-primary">{lead.timeline}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-text-muted">Intent</span>
              <span className="text-[12px] text-text-primary">{lead.intent}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-[11px] text-text-secondary">{lead.summary}</p>
          </div>
        </div>
        ))}
      </div>

      {/* Intelligence Breakdown */}
      <div className="bg-bg-card border border-border rounded-xl p-5 fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={16} className="text-muted-emerald" />
          <span className="text-[11px] tracking-[0.15em] text-text-muted">AI INSIGHTS</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-champagne" />
              <span className="text-[12px] text-text-primary">72% of leads this week are qualified</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-hot" />
              <span className="text-[12px] text-text-primary">3 hot leads identified today</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target size={14} className="text-success" />
              <span className="text-[12px] text-text-primary">5 site visits scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-muted-emerald" />
              <span className="text-[12px] text-text-primary">18 AI calls completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
