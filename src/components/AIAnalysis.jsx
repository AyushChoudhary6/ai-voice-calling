import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { User, Briefcase, MapPin, Home, Calendar, CheckCircle, FileText, ArrowRightCircle } from 'lucide-react';
import LeadScore from './LeadScore';

export default function AIAnalysis({ analysis, scoreData, mode }) {
  const containerRef = useRef(null);
  useEffect(() => {
    const items = containerRef.current?.querySelectorAll('.analysis-item');
    if (items) {
      gsap.fromTo(items, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' });
    }
  }, []);

  const requirements = [
    { label: 'Purpose', value: analysis.buyingPurpose || 'NOT CAPTURED', icon: <User size={16} /> },
    { label: 'Budget', value: analysis.budgetDisplay || 'NOT CAPTURED', icon: <Briefcase size={16} /> },
    { label: 'Location', value: analysis.preferredLocation || 'NOT CAPTURED', icon: <MapPin size={16} /> },
    { label: 'Configuration', value: analysis.configuration || 'NOT CAPTURED', icon: <Home size={16} /> },
    { label: 'Purchase Timeline', value: analysis.purchaseTimeline || 'NOT CAPTURED', icon: <Calendar size={16} /> },
    { label: 'Site Visit', value: analysis.siteVisitInterest ? 'Interested' : 'Not interested', icon: <CheckCircle size={16} /> },
    { label: 'Preferred Visit Time', value: analysis.preferredVisitTime || 'NOT CAPTURED', icon: <Calendar size={16} /> },
  ];

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="analysis-item text-center mb-4">
        <h2 className="text-2xl font-serif text-[#F4F1E8] mb-2">OPEN-SOURCE AI ANALYSIS COMPLETE</h2>
        {mode === 'demo-fallback' && (
          <p className="text-sm text-[#C5A46D] italic">DEMO ANALYSIS MODE</p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <LeadScore score={scoreData.totalScore} status={scoreData.status} scoreReasons={scoreData.scoreReasons} />

        <div className="space-y-4">
          <div className="analysis-item bg-[#111B17] border border-[#68756E]/20 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#C5A46D] mb-4 tracking-[0.2em] uppercase flex items-center gap-2">
              <FileText size={16} />
              AI EXTRACTED REQUIREMENTS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[#16221D]">
                  <div className="text-[#527A68] mt-0.5">{req.icon}</div>
                  <div>
                    <p className="text-xs text-[#68756E] uppercase">{req.label}</p>
                    <p className="text-sm text-[#A9B3AD]">{req.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="analysis-item bg-[#111B17] border border-[#68756E]/20 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#C5A46D] mb-4 tracking-[0.2em] uppercase flex items-center gap-2">
              <FileText size={16} />
              AI CALL INTELLIGENCE
            </h3>
            <p className="text-sm text-[#A9B3AD] leading-relaxed">{analysis.callSummary}</p>
          </div>

          <div className="analysis-item bg-[#111B17] border border-[#68756E]/20 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#C5A46D] mb-4 tracking-[0.2em] uppercase flex items-center gap-2">
              <ArrowRightCircle size={16} />
              NEXT BEST ACTION
            </h3>
            <p className="text-sm text-[#A9B3AD]">{analysis.recommendedAction}</p>
          </div>

          <div className="analysis-item bg-[#111B17] border border-[#C5A46D]/30 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#C5A46D] mb-4 tracking-[0.2em] uppercase">SIMULATED SALES WORKFLOW</h3>
            <button className="w-full py-3 rounded-lg bg-[#C5A46D] text-[#080D0B] font-semibold hover:bg-[#E0C28D] transition">ASSIGN TO CONSULTANT</button>
          </div>
        </div>
      </div>
    </div>
  );
}
