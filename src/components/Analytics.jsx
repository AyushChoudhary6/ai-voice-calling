import { useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, Users, Phone, Zap, CheckCircle } from 'lucide-react';
import gsap from 'gsap';

const analyticsData = [
  { label: 'Mon', calls: 8, leads: 5 },
  { label: 'Tue', calls: 12, leads: 8 },
  { label: 'Wed', calls: 15, leads: 10 },
  { label: 'Thu', calls: 10, leads: 6 },
  { label: 'Fri', calls: 18, leads: 12 },
  { label: 'Sat', calls: 5, leads: 3 },
  { label: 'Sun', calls: 3, leads: 2 }
];

const sourceBreakdown = [
  { name: 'Meta Ads', percentage: 40, color: 'bg-champagne' },
  { name: 'Google Ads', percentage: 30, color: 'bg-muted-emerald' },
  { name: 'Website', percentage: 20, color: 'bg-success' },
  { name: 'Other', percentage: 10, color: 'bg-hot' }
];

export default function Analytics() {
  const containerRef = useRef(null);

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll('.fade-in');
    if (!elements) return;
    gsap.fromTo(elements, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 });
  }, []);

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="mb-4 fade-in">
        <h2 className="text-xl font-semibold text-text-primary">Analytics</h2>
        <p className="text-[12px] text-text-secondary mt-1">Performance insights and metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Phone, value: '71', label: 'Total Calls', change: '+18%', color: 'text-champagne' },
          { icon: Users, value: '24', label: 'Total Leads', change: '+12%', color: 'text-muted-emerald' },
          { icon: Zap, value: '7', label: 'Hot Leads', change: '+5', color: 'text-hot' },
          { icon: CheckCircle, value: '75%', label: 'Qual Rate', change: '+3%', color: 'text-success' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-bg-card border border-border rounded-xl p-5 fade-in">
              <div className="flex items-center justify-between mb-3">
                <Icon size={16} className={stat.color} />
                <span className="text-[10px] text-success">{stat.change}</span>
              </div>
              <div className="text-2xl font-semibold text-text-primary">{stat.value}</div>
              <div className="text-[11px] text-text-muted mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Activity */}
        <div className="bg-bg-card border border-border rounded-xl p-5 fade-in">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-champagne" />
            <span className="text-[11px] tracking-[0.15em] text-text-muted">WEEKLY ACTIVITY</span>
          </div>
          <div className="flex items-end justify-between h-40 gap-2">
            {analyticsData.map((day, idx) => (
              <div key={day.label} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-bg-elevated rounded-t-lg relative overflow-hidden" style={{ height: '100%' }}>
                  <div
                    className="absolute bottom-0 w-full bg-champagne/30 transition-all duration-500"
                    style={{ height: `${(day.calls / 18) * 100}%` }}
                  />
                  <div
                    className="absolute bottom-0 w-full bg-champagne rounded-t-lg transition-all duration-500"
                    style={{ height: `${(day.leads / 12) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-text-muted mt-2">{day.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-champagne" />
              <span className="text-[10px] text-text-muted">Leads</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-champagne/30" />
              <span className="text-[10px] text-text-muted">Calls</span>
            </div>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-bg-card border border-border rounded-xl p-5 fade-in">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-muted-emerald" />
            <span className="text-[11px] tracking-[0.15em] text-text-muted">LEAD SOURCES</span>
          </div>
          <div className="space-y-4">
            {sourceBreakdown.map(source => (
              <div key={source.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-text-primary">{source.name}</span>
                  <span className="text-[11px] text-text-muted">{source.percentage}%</span>
                </div>
                <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className={`h-full ${source.color} transition-all duration-500`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
