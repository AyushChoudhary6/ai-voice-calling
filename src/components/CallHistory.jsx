import { useEffect, useRef, useState } from 'react';
import { History, Play, Download, Calendar, Clock } from 'lucide-react';
import gsap from 'gsap';

const callHistoryData = [
  {
    id: 1,
    name: 'Rahul Mehta',
    initials: 'RM',
    phone: '+91 98XXX 48210',
    date: 'Today, 10:30 AM',
    duration: '5:20',
    status: 'Completed',
    property: 'Westin Residences',
    score: 78
  },
  {
    id: 2,
    name: 'Priya Sharma',
    initials: 'PS',
    phone: '+91 97XXX 35142',
    date: 'Today, 09:15 AM',
    duration: '4:10',
    status: 'Completed',
    property: 'Westin Residences',
    score: 65
  },
  {
    id: 3,
    name: 'Arjun Kapoor',
    initials: 'AK',
    phone: '+91 99XXX 62481',
    date: 'Yesterday, 04:45 PM',
    duration: '6:30',
    status: 'Completed',
    property: 'Sector 103',
    score: 88
  },
  {
    id: 4,
    name: 'Neha Malhotra',
    initials: 'NM',
    phone: '+91 96XXX 85273',
    date: 'Yesterday, 02:20 PM',
    duration: '3:15',
    status: 'Missed',
    property: 'Dwarka Expressway',
    score: 45
  },
  {
    id: 5,
    name: 'Vikram Sethi',
    initials: 'VS',
    phone: '+91 95XXX 72164',
    date: 'Yesterday, 11:00 AM',
    duration: '4:50',
    status: 'Completed',
    property: 'Westin Residences',
    score: 72
  }
];

export default function CallHistory() {
  const containerRef = useRef(null);
  const [selectedCall, setSelectedCall] = useState(null);

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll('.fade-in');
    if (!elements) return;
    gsap.fromTo(elements, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 });
  }, []);

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="mb-4 fade-in">
        <h2 className="text-xl font-semibold text-text-primary">Call History</h2>
        <p className="text-[12px] text-text-secondary mt-1">View and playback all AI calls</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Call List */}
        <div className="bg-bg-card border border-border rounded-xl p-5 fade-in">
          <div className="flex items-center gap-2 mb-4">
            <History size={16} className="text-champagne" />
            <span className="text-[11px] tracking-[0.15em] text-text-muted">CALL RECORDS</span>
          </div>
          <div className="space-y-3">
            {callHistoryData.map(call => (
              <div
                key={call.id}
                onClick={() => setSelectedCall(call)}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedCall?.id === call.id ? 'bg-bg-elevated border-champagne/30' : 'bg-bg-elevated/50 border-border hover:border-border/80'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-luxury-green flex items-center justify-center text-[11px] font-semibold text-text-primary border border-border">
                  {call.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[13px] font-medium text-text-primary">{call.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-text-muted">{call.duration}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        call.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-hot/10 text-hot'
                      }`}>
                        {call.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-text-muted">{call.property}</span>
                    <span className="text-[10px] text-champagne">Score: {call.score}</span>
                  </div>
                  <div className="text-[10px] text-text-muted mt-1 flex items-center gap-1">
                    <Calendar size={10} />
                    {call.date}
                  </div>
                </div>
                <Play size={14} className="text-text-muted" />
              </div>
            ))}
          </div>
        </div>

        {/* Call Details */}
        <div className="bg-bg-card border border-border rounded-xl p-5 fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-muted-emerald" />
            <span className="text-[11px] tracking-[0.15em] text-text-muted">DETAILS</span>
          </div>
          {selectedCall ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-luxury-green flex items-center justify-center text-[13px] font-semibold text-text-primary border border-border">
                  {selectedCall.initials}
                </div>
                <div>
                  <h3 className="text-[14px] font-medium text-text-primary">{selectedCall.name}</h3>
                  <p className="text-[11px] text-text-secondary">{selectedCall.phone}</p>
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">Property</span>
                  <span className="text-[12px] text-text-primary">{selectedCall.property}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">Date</span>
                  <span className="text-[12px] text-text-primary">{selectedCall.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">Duration</span>
                  <span className="text-[12px] text-text-primary">{selectedCall.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">Lead Score</span>
                  <span className="text-[12px] text-champagne">{selectedCall.score}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
                <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border bg-bg-elevated text-[11px] text-text-secondary hover:text-champagne hover:border-champagne/30 transition-all">
                  <Play size={12} />
                  Play
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border bg-bg-elevated text-[11px] text-text-secondary hover:text-champagne hover:border-champagne/30 transition-all">
                  <Download size={12} />
                  Download
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <History size={24} className="mx-auto text-text-muted mb-2" />
              <p className="text-[12px] text-text-secondary">Select a call to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
