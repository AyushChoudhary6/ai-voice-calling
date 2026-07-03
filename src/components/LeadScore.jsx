import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function LeadScore({ score, status, scoreReasons }) {
  const scoreRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(scoreRef.current, { innerHTML: 0 }, {
      innerHTML: score,
      duration: 1.5,
      snap: { innerHTML: 1 },
      ease: 'power2.out'
    });
  }, [score]);

  const getStatusColor = () => {
    switch (status) {
      case 'Hot': return 'text-[#E0C28D] bg-[#C5A46D]/10';
      case 'Warm': return 'text-[#527A68] bg-[#527A68]/10';
      default: return 'text-[#A9B3AD] bg-[#68756E]/10';
    }
  };

  return (
    <div className="bg-[#111B17] border border-[#68756E]/20 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-[#C5A46D] mb-6 tracking-[0.2em] uppercase">LEAD MOMENTUM SCORE</h3>
      <div className="text-center mb-6">
        <div className="text-6xl font-serif text-[#F4F1E8] mb-2">
          <span ref={scoreRef}>0</span>
          <span className="text-3xl">/100</span>
        </div>
        <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor()}`}>{status} LEAD</span>
      </div>
      {scoreReasons && scoreReasons.length > 0 && (
        <>
          <h4 className="text-sm font-medium text-[#F4F1E8] mb-3">Why this lead received this score</h4>
          <div className="space-y-2">
            {scoreReasons.map((reason, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded bg-[#16221D]">
                <div className="w-2 h-2 rounded-full bg-[#315C4B]" />
                <div className="flex-1">
                  <p className="text-sm text-[#A9B3AD]">{reason.label}</p>
                </div>
                <span className="text-xs text-[#C5A46D]">+{reason.points || 0}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
