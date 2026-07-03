import { useState } from 'react';
import {
  LayoutDashboard,
  Radio,
  Brain,
  History,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';

import { Mic2 } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview' },
  { icon: Mic2, label: 'Voice Qualification' },
  { icon: Radio, label: 'Live Operations' },
  { icon: Brain, label: 'Lead Intelligence' },
  { icon: History, label: 'Call History' },
  { icon: BarChart3, label: 'Analytics' },
];

export default function Sidebar({ mobileOpen, onMobileClose, activeNav, setActiveNav }) {
  const handleNavClick = (label) => {
    setActiveNav(label);
    if (onMobileClose) onMobileClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          {/* W Logo Mark */}
          <div className="w-9 h-9 rounded-md bg-bg-elevated border border-border flex items-center justify-center">
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
              <path
                d="M2 2L6 14L10 4L14 14L18 2"
                stroke="#C5A46D"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-[0.15em] text-text-primary">
              WHITE COLLAR AI
            </div>
            <div className="text-[9px] tracking-[0.2em] text-text-muted mt-0.5">
              VOICE INTELLIGENCE
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.label;
          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-bg-elevated text-champagne border border-border'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50 border border-transparent'
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span className="text-[13px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="px-5 pb-6">
        <div className="text-[9px] tracking-[0.2em] text-text-muted mb-3">
          SYSTEM STATUS
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-success pulse-dot" />
          <span className="text-[12px] text-success font-medium">
            AI Operations Online
          </span>
        </div>
        <div className="text-[10px] text-text-muted mt-3 px-0.5">
          Prototype Environment
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => (mobileOpen ? onMobileClose() : null)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-bg-card border border-border rounded-lg"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 drawer-overlay"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-[230px] bg-bg-secondary border-r border-border flex-shrink-0 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
