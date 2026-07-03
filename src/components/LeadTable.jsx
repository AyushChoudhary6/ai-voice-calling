import { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

const filters = ['All Leads', 'New', 'Calling', 'Hot', 'Warm', 'Cold'];

function StatusBadge({ status }) {
  const cls = {
    New: 'badge-new',
    Hot: 'badge-hot',
    Warm: 'badge-warm',
    Cold: 'badge-cold',
  }[status] || 'badge-new';

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase ${cls}`}>
      {status}
    </span>
  );
}

export default function LeadTable({ leads, onLeadSelect, selectedLeadId }) {
  const [activeFilter, setActiveFilter] = useState('All Leads');
  const [search, setSearch] = useState('');
  const tableRef = useRef(null);

  const filtered = leads.filter((lead) => {
    const matchFilter = activeFilter === 'All Leads' || lead.status === activeFilter;
    const matchSearch =
      !search ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.source.toLowerCase().includes(search.toLowerCase()) ||
      lead.property.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  useEffect(() => {
    const rows = tableRef.current?.querySelectorAll('.lead-row');
    if (!rows) return;
    gsap.fromTo(
      rows,
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, stagger: 0.06, duration: 0.5, ease: 'power3.out' }
    );
  }, [activeFilter, search]);

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[15px] font-semibold text-text-primary">
            Lead Operations
          </h2>
          <p className="text-[11px] text-text-muted mt-0.5">
            AI qualification queue across all acquisition channels
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              activeFilter === f
                ? 'bg-luxury-green/30 text-champagne border border-champagne/20'
                : 'bg-bg-elevated/50 text-text-muted border border-transparent hover:text-text-secondary hover:border-border'
            }`}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-bg-elevated border border-border rounded-lg text-[11px] text-text-primary placeholder-text-muted focus:outline-none focus:border-champagne/30 w-40 lg:w-48 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div ref={tableRef} className="bg-bg-card border border-border rounded-xl overflow-hidden">
        {/* Desktop header */}
        <div className="hidden md:grid grid-cols-[1fr_0.8fr_1fr_0.6fr_0.6fr_32px] gap-4 px-5 py-3 border-b border-border">
          <span className="text-[9px] tracking-[0.15em] text-text-muted uppercase">Lead</span>
          <span className="text-[9px] tracking-[0.15em] text-text-muted uppercase">Source</span>
          <span className="text-[9px] tracking-[0.15em] text-text-muted uppercase">Property</span>
          <span className="text-[9px] tracking-[0.15em] text-text-muted uppercase">Status</span>
          <span className="text-[9px] tracking-[0.15em] text-text-muted uppercase">Time</span>
          <span />
        </div>

        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-[12px] text-text-muted">
            No leads matching current filter.
          </div>
        )}

        {filtered.map((lead) => (
          <button
            key={lead.id}
            onClick={() => onLeadSelect(lead)}
            className={`lead-row w-full text-left row-hover cursor-pointer border-b border-border last:border-b-0 px-5 py-4 transition-all ${
              selectedLeadId === lead.id ? 'bg-bg-elevated/80' : ''
            }`}
          >
            {/* Desktop row */}
            <div className="hidden md:grid grid-cols-[1fr_0.8fr_1fr_0.6fr_0.6fr_32px] gap-4 items-center">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-semibold border border-border ${
                  lead.status === 'New' ? 'bg-luxury-green/20 text-success' : 'bg-bg-elevated text-text-secondary'
                }`}>
                  {lead.initials}
                </div>
                <div>
                  <div className="text-[13px] font-medium text-text-primary">
                    {lead.name}
                  </div>
                  <div className="text-[10px] text-text-muted">{lead.phone}</div>
                </div>
              </div>
              <span className="text-[12px] text-text-secondary">{lead.source}</span>
              <span className="text-[12px] text-text-secondary">{lead.property}</span>
              <StatusBadge status={lead.status} />
              <span className="text-[11px] text-text-muted">{lead.createdAt}</span>
              <ChevronRight size={14} className="text-text-muted" />
            </div>

            {/* Mobile card */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-semibold border border-border ${
                    lead.status === 'New' ? 'bg-luxury-green/20 text-success' : 'bg-bg-elevated text-text-secondary'
                  }`}>
                    {lead.initials}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-text-primary">{lead.name}</div>
                    <div className="text-[10px] text-text-muted">{lead.source} · {lead.property}</div>
                  </div>
                </div>
                <StatusBadge status={lead.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-text-muted">{lead.createdAt}</span>
                <ChevronRight size={14} className="text-text-muted" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
