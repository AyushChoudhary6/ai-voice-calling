import { Bell, Cpu, Menu } from 'lucide-react';

export default function DashboardHeader({ onArchitectureOpen, onMobileMenuToggle }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  return (
    <header className="flex items-start justify-between mb-8 gap-4 flex-wrap">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          {/* Mobile menu button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg border border-border bg-bg-card btn-hover"
            aria-label="Open menu"
          >
            <Menu size={16} className="text-text-secondary" />
          </button>
          <span className="text-[10px] tracking-[0.2em] text-text-muted uppercase">
            AI Voice Operations
          </span>
          <span className="text-[9px] px-2.5 py-1 rounded-full bg-champagne/10 text-champagne border border-champagne/20 font-medium tracking-wider uppercase">
            Interactive Prototype
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text-primary mt-2 leading-tight">
          {greeting}, Ayush.
        </h1>
        <p className="text-[13px] text-text-secondary mt-2 leading-relaxed max-w-lg">
          Your AI qualification pipeline has identified{' '}
          <span className="text-champagne font-medium">7 high-intent opportunities</span>{' '}
          today.
        </p>
      </div>

      <div className="flex items-center gap-3 mt-1">
        <span className="text-[11px] text-text-muted hidden md:block">
          {today}
        </span>
        <button
          onClick={onArchitectureOpen}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-bg-card text-text-secondary hover:text-champagne hover:border-champagne/30 transition-all text-[11px] font-medium tracking-wide btn-hover"
        >
          <Cpu size={13} />
          <span className="hidden sm:inline">ARCHITECTURE</span>
        </button>
        <button className="p-2.5 rounded-lg border border-border bg-bg-card text-text-secondary hover:text-text-primary transition-colors btn-hover relative">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-champagne" />
        </button>
        <div className="w-9 h-9 rounded-lg bg-luxury-green flex items-center justify-center text-[11px] font-semibold text-text-primary border border-border">
          AC
        </div>
      </div>
    </header>
  );
}
