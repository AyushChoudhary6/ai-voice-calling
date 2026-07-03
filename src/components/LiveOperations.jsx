import { useEffect, useRef } from 'react';
import { Radio, Phone, Mic, Activity } from 'lucide-react';
import gsap from 'gsap';

const liveCalls = [
  {
    id: 1,
    name: 'Ankit Verma',
    initials: 'AV',
    duration: '2:15',
    status: 'Active',
    source: 'Meta Ads',
    property: 'Westin Residences'
  },
  {
    id: 2,
    name: 'Meera Patel',
    initials: 'MP',
    duration: '0:45',
    status: 'Connecting',
    source: 'Google Ads',
    property: 'Sector 103'
  },
  {
    id: 3,
    name: 'Karan Singh',
    initials: 'KS',
    duration: '4:30',
    status: 'Active',
    source: 'Website',
    property: 'Dwarka Expressway'
  }
];

const recentActivities = [
  {
    time: 'Just now',
    title: 'Call initiated',
    name: 'Ankit Verma'
  },
  {
    time: '1 min ago',
    title: 'Qualification started',
    name: 'Meera Patel'
  },
  {
    time: '3 mins ago',
    title: 'Lead scored: 72',
    name: 'Karan Singh'
  },
  {
    time: '5 mins ago',
    title: 'Call completed',
    name: 'Neha Sharma'
  }
];

export default function LiveOperations() {
  const containerRef = useRef(null);

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll('.fade-in');
    if (!elements) return;
    gsap.fromTo(elements, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 });
  }, []);

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between mb-4 fade-in">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Live Operations</h2>
          <p className="text-[12px] text-text-secondary mt-1">Monitor active AI calls in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success pulse-dot" />
          <span className="text-[12px] text-success font-medium">3 Active Calls</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Active Calls */}
        <div className="bg-bg-card border border-border rounded-xl p-5 fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Phone size={16} className="text-champagne" />
            <span className="text-[11px] tracking-[0.15em] text-text-muted">ACTIVE CALLS</span>
          </div>
          <div className="space-y-3">
            {liveCalls.map(call => (
              <div key={call.id} className="flex items-center gap-3 p-3 bg-bg-elevated rounded-lg border border-border">
                <div className="w-10 h-10 rounded-full bg-luxury-green flex items-center justify-center text-[11px] font-semibold text-text-primary border border-border">
                  {call.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[13px] font-medium text-text-primary">{call.name}</h3>
                    <span className="text-[11px] text-text-muted">{call.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${call.status === 'Active' ? 'bg-success/10 text-success' : 'bg-champagne/10 text-champagne'}`}>
                      {call.status}
                    </span>
                    <span className="text-[10px] text-text-muted">{call.property}</span>
                  </div>
                </div>
                <Mic size={14} className={call.status === 'Active' ? 'text-success animate-pulse' : 'text-text-muted'} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-bg-card border border-border rounded-xl p-5 fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-muted-emerald" />
            <span className="text-[11px] tracking-[0.15em] text-text-muted">RECENT ACTIVITY</span>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-champagne mt-2" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] text-text-primary">{activity.title}</p>
                    <span className="text-[10px] text-text-muted">{activity.time}</span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-0.5">{activity.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
