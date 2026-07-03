import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function QualificationProgress({ initializing }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (initializing) {
      const items = containerRef.current?.querySelectorAll('.init-step');
      gsap.fromTo(items, { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.3, duration: 0.5, ease: 'power2.out' });
    }
  }, [initializing]);

  const steps = [
    'Browser voice session initialized',
    'Microphone access verified',
    'Open-source AI brain connected',
    'Qualification context loaded'
  ];

  return (
    <div ref={containerRef} className="bg-[#111B17] border border-[#68756E]/20 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-[#C5A46D] mb-4 tracking-[0.2em] uppercase">INITIALIZATION</h3>
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div key={idx} className="init-step flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#527A68]" />
            <p className="text-sm text-[#A9B3AD]">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
