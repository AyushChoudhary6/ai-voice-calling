import { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import StatsCards from './components/StatsCards';
import LeadTable from './components/LeadTable';
import ActivityFeed from './components/ActivityFeed';
import LeadDetails from './components/LeadDetails';
import ArchitectureModal from './components/ArchitectureModal';
import LiveOperations from './components/LiveOperations';
import LeadIntelligence from './components/LeadIntelligence';
import CallHistory from './components/CallHistory';
import Analytics from './components/Analytics';
import { leads } from './data/leads';

export default function App() {
  const [selectedLead, setSelectedLead] = useState(null);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Overview');

  const renderContent = () => {
    switch (activeNav) {
      case 'Overview':
        return (
          <>
            <StatsCards />
            <div className={`grid gap-6 ${selectedLead ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-[1fr_340px]'}`}>
              <LeadTable
                leads={leads}
                onLeadSelect={(lead) => setSelectedLead(lead)}
                selectedLeadId={selectedLead?.id}
              />
              {!selectedLead && <ActivityFeed />}
            </div>
          </>
        );
      case 'Live Operations':
        return <LiveOperations />;
      case 'Lead Intelligence':
        return <LeadIntelligence />;
      case 'Call History':
        return <CallHistory />;
      case 'Analytics':
        return <Analytics />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-main">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* Main content */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          selectedLead ? 'lg:mr-0' : ''
        }`}
      >
        <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1200px]">
          <DashboardHeader
            onArchitectureOpen={() => setShowArchitecture(true)}
            onMobileMenuToggle={() => setMobileMenuOpen(true)}
          />
          {renderContent()}
        </div>
      </main>

      {/* Lead Details Panel */}
      {selectedLead && (
        <LeadDetails
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}

      {/* Architecture Modal */}
      {showArchitecture && (
        <ArchitectureModal onClose={() => setShowArchitecture(false)} />
      )}
    </div>
  );
}
