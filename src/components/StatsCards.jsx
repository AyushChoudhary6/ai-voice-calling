import { useEffect, useRef } from 'react';
import { Users, PhoneCall, Flame, MapPin } from 'lucide-react';
import gsap from 'gsap';

const stats = [
  {
    icon: Users,
    value: 24,
    label: 'TOTAL LEADS',
    sub: '+12% this week',
    color: 'text-muted-emerald',
  },
  {
    icon: PhoneCall,
    value: 18,
    label: 'AI CALLS COMPLETED',
    sub: '75% qualification rate',
    color: 'text-champagne',
  },
  {
    icon: Flame,
    value: 7,
    label: 'HOT LEADS',
    sub: 'Requires attention',
    color: 'text-hot',
  },
  {
    icon: MapPin,
    value: 5,
    label: 'SITE VISITS',
    sub: '3 scheduled today',
    color: 'text-success',
  },
];

export default function StatsCards() {
  const containerRef = useRef(null);
  const numberRefs = useRef([]);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.stat-card');
    if (!cards) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }
    );

    // Animate numbers
    numberRefs.current.forEach((el, i) => {
      if (!el) return;
      const target = stats[i].value;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.2,
        delay: 0.2 + i * 0.1,
        ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].val); }
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="stat-card bg-bg-card border border-border rounded-xl p-5 card-hover opacity-0"
          >
            <div className="flex items-center justify-between mb-4">
              <Icon size={16} className={s.color} strokeWidth={1.5} />
              <span className="text-[9px] tracking-[0.15em] text-text-muted">
                {s.label}
              </span>
            </div>
            <div
              ref={(el) => (numberRefs.current[i] = el)}
              className="text-3xl font-semibold text-text-primary mb-1"
            >
              0
            </div>
            <div className="text-[11px] text-text-muted">{s.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
