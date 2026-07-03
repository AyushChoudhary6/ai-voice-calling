import { useEffect, useRef } from 'react';
import { X, Globe, Database, Workflow, Mic, Brain, BarChart3, Users, ArrowDown } from 'lucide-react';
import gsap from 'gsap';

const archNodes = [
  {
    icon: Globe,
    label: 'LEAD SOURCES',
    sub: 'Website · Meta · Google · WhatsApp · Portals',
    status: 'simulated',
  },
  {
    icon: Database,
    label: 'SUPABASE / CRM',
    sub: 'Lead Storage & Management',
    status: 'simulated',
  },
  {
    icon: Workflow,
    label: 'n8n',
    sub: 'Workflow Automation',
    status: 'simulated',
  },
  {
    icon: Mic,
    label: 'VAPI',
    sub: 'Voice Orchestration',
    status: 'simulated',
  },
  {
    icon: Brain,
    label: 'OPENAI',
    sub: 'AI Brain — Conversation Intelligence',
    status: 'optional-live',
  },
  {
    icon: BarChart3,
    label: 'POST-CALL INTELLIGENCE',
    sub: 'Structured Extraction + Lead Scoring',
    status: 'live',
  },
  {
    icon: Users,
    label: 'CRM + SALES DASHBOARD',
    sub: 'Human Action & Follow-up',
    status: 'live',
  },
];

const statusLabel = {
  simulated: { text: 'SIMULATED IN PROTOTYPE', color: 'text-text-muted', bg: 'bg-bg-elevated' },
  live: { text: 'LIVE IN PROTOTYPE', color: 'text-success', bg: 'bg-success/10' },
  'optional-live': { text: 'OPTIONAL LIVE INTEGRATION', color: 'text-champagne', bg: 'bg-champagne/10' },
};

export default function ArchitectureModal({ onClose }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    );

    const nodes = contentRef.current?.querySelectorAll('.arch-item');
    if (nodes) {
      gsap.fromTo(
        nodes,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, []);

  const handleClose = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      onComplete: onClose,
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 drawer-overlay overflow-y-auto"
    >
      <div
        ref={contentRef}
        className="bg-bg-secondary border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border sticky top-0 bg-bg-secondary z-10">
          <div>
            <span className="text-[9px] tracking-[0.2em] text-text-muted uppercase">
              System Design
            </span>
            <h2 className="font-serif text-2xl font-semibold text-text-primary mt-1">
              Production Architecture
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
          >
            <X size={18} className="text-text-muted" />
          </button>
        </div>

        <div className="px-8 py-6">
          {/* Architecture flow */}
          <div className="space-y-2 mb-10">
            {archNodes.map((node, i) => {
              const Icon = node.icon;
              const st = statusLabel[node.status];
              return (
                <div key={node.label} className="arch-item opacity-0">
                  <div className="arch-node bg-bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-bg-elevated border border-border flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-champagne" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[13px] font-semibold text-text-primary">
                          {node.label}
                        </span>
                        <span className={`text-[8px] tracking-[0.1em] uppercase font-medium px-2 py-0.5 rounded ${st.bg} ${st.color} border border-current/10`}>
                          {st.text}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5">{node.sub}</p>
                    </div>
                  </div>
                  {i < archNodes.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown size={14} className="text-champagne/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Why Vapi / Why OpenAI */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-bg-card border border-border rounded-xl p-5">
              <div className="text-[9px] tracking-[0.15em] text-champagne uppercase font-medium mb-3">
                Why Vapi?
              </div>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                Vapi manages the real-time voice agent orchestration layer, allowing the
                application to configure the transcriber, AI model and voice without
                building low-level real-time audio infrastructure.
              </p>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-5">
              <div className="text-[9px] tracking-[0.15em] text-champagne uppercase font-medium mb-3">
                Why OpenAI?
              </div>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                OpenAI acts as the conversation intelligence layer. It understands
                multi-turn customer context, determines the next useful qualification
                response and converts the finalized conversation into structured sales
                data.
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-[10px]">
            {Object.entries(statusLabel).map(([key, st]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${key === 'live' ? 'bg-success' : key === 'optional-live' ? 'bg-champagne' : 'bg-text-muted'}`} />
                <span className="text-text-muted">{st.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
