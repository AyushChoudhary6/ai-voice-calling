import { useEffect, useRef } from 'react';
import { CircleDot, Flame, TrendingUp, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { activityFeed } from '../data/leads';

const typeIcon = {
  new: CircleDot,
  qualified: TrendingUp,
  hot: Flame,
  nurture: ArrowRight,
};

const typeColor = {
  new: 'text-success',
  qualified: 'text-champagne',
  hot: 'text-hot',
  nurture: 'text-text-muted',
};

export default function ActivityFeed() {
  const ref = useRef(null);

  useEffect(() => {
    const items = ref.current?.querySelectorAll('.activity-item');
    if (!items) return;
    gsap.fromTo(
      items,
      { opacity: 0, x: 12 },
      { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out', delay: 0.3 }
    );
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[15px] font-semibold text-text-primary">
            AI Activity
          </h2>
          <p className="text-[11px] text-text-muted mt-0.5">
            Real-time intelligence events
          </p>
        </div>
      </div>

      <div ref={ref} className="bg-bg-card border border-border rounded-xl p-4 space-y-1">
        {activityFeed.map((item, i) => {
          const Icon = typeIcon[item.type] || CircleDot;
          const color = typeColor[item.type] || 'text-text-muted';
          return (
            <div
              key={i}
              className="activity-item flex items-start gap-3 p-3 rounded-lg opacity-0 hover:bg-bg-elevated/50 transition-colors"
            >
              <div className="mt-0.5">
                <Icon size={14} className={color} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] text-text-muted">{item.time}</span>
                </div>
                <p className="text-[12px] text-text-primary font-medium leading-snug">
                  {item.title}
                </p>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  {item.name}
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prototype disclaimer */}
      <div className="mt-4 px-1">
        <p className="text-[9px] text-text-muted leading-relaxed">
          Voice calling and CRM actions are simulated for this prototype. AI transcript intelligence is powered by OpenAI.
        </p>
      </div>
    </div>
  );
}
