import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { LeadDetailsModal } from '../leads/LeadDetailsModal';
import { ActiveCallConsole } from '../calling/ActiveCallConsole';

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8f3] text-charcoal flex">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Top Navigation */}
        <TopNav setMobileOpen={setMobileOpen} />

        {/* Dynamic Screen Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Modals & Overlays */}
      <LeadDetailsModal />
      <ActiveCallConsole />
    </div>
  );
};
