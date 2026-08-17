'use client';

import React from 'react';
import { Wrench, ShieldAlert } from 'lucide-react';

interface MaintenancePageProps {
  developerName?: string;
  maintenanceMessage?: string;
}

export default function MaintenancePage({
  developerName = 'PORTFOLIO_DEV',
  maintenanceMessage = 'We are currently performing scheduled system maintenance and content updates. Please check back shortly.'
}: MaintenancePageProps) {
  return (
    <div className="min-h-screen bg-[#141313] text-[#e5e2e1] flex flex-col justify-between p-6 md:p-16 relative overflow-hidden font-body select-none">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D8FF45]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Branding (NO nav links or footer) */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-2 font-display font-extrabold text-xl md:text-2xl uppercase tracking-wider text-[#e5e2e1]">
          <span className="w-3 h-3 bg-[#D8FF45] rounded-full pulse-indicator" />
          {developerName}
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#D8FF45] uppercase bg-[#1c1b1b] border border-[#D8FF45]/30 px-3.5 py-1.5 rounded-none">
          <ShieldAlert className="w-4 h-4 text-[#D8FF45]" />
          <span>STATUS: MAINTENANCE MODE</span>
        </div>
      </div>

      {/* Hero Maintenance Content */}
      <div className="max-w-3xl mx-auto my-auto py-12 z-10 flex flex-col items-start gap-8">
        
        {/* Status Badge */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#D8FF45] uppercase tracking-widest bg-[#1c1b1b] border border-[#292929] px-4 py-2">
          <Wrench className="w-4 h-4 text-[#D8FF45]" />
          <span>SCHEDULED SYSTEM UPGRADE // STANDBY</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl uppercase leading-[0.95] tracking-tight text-[#e5e2e1]">
          Site Under <br />
          <span className="text-[#D8FF45]">Maintenance.</span>
        </h1>

        {/* Dynamic Maintenance Message */}
        <div className="glass-panel p-8 w-full border-l-4 border-l-[#D8FF45] flex flex-col gap-4">
          <span className="font-mono text-xs text-[#8e9192] uppercase tracking-wider font-bold">
            SYSTEM NOTIFICATION
          </span>
          <p className="font-body text-base md:text-lg text-[#c4c7c7] leading-relaxed">
            {maintenanceMessage}
          </p>
        </div>
      </div>

      {/* Footer Branding (NO nav links) */}
      <div className="z-10 flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-[#292929] font-mono text-xs text-[#8e9192]">
        <div>
          &copy; {new Date().getFullYear()} {developerName}. All rights reserved.
        </div>
        <div className="flex items-center gap-2 text-[#D8FF45]">
          <span className="w-2 h-2 rounded-full bg-[#D8FF45] pulse-indicator" />
          <span>SYSTEM OFFLINE FOR UPDATES</span>
        </div>
      </div>

    </div>
  );
}
