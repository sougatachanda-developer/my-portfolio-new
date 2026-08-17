'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Terminal, AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  const [currentPath, setCurrentPath] = useState<string>('/requested-route');

  // Hydration-safe client side path resolution
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#141313] text-[#e5e2e1] flex flex-col justify-between p-6 md:p-16 relative overflow-hidden font-body selection:bg-[#D8FF45] selection:text-[#0A0A0A]">
      
      {/* Background Accent Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f15_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Top Header Logo */}
      <div className="relative z-10 flex justify-between items-center">
        <Link href="/" className="font-display font-bold text-xl md:text-2xl text-[#e5e2e1] tracking-tighter hover:text-[#D8FF45] transition-colors flex items-center gap-2 uppercase">
          <span className="w-2.5 h-2.5 bg-[#D8FF45] rounded-full pulse-indicator" />
          SYSTEM_ERROR // 404
        </Link>
        <span className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest bg-[#1c1b1b] border border-[#292929] px-3 py-1.5 hidden sm:block">
          STATUS: 404_PAGE_NOT_FOUND
        </span>
      </div>

      {/* Center 404 Content */}
      <div className="max-w-3xl mx-auto my-auto relative z-10 text-center py-16 flex flex-col items-center">
        
        <div className="inline-flex items-center gap-2 font-mono text-xs text-[#ff5f56] bg-[#2a1c1c] border border-[#ff5f56]/30 px-4 py-2 mb-8">
          <AlertTriangle className="w-4 h-4" />
          <span>HTTP 404 // RESOURCE UNREACHABLE OR RESTRICTED</span>
        </div>

        <h1 className="font-display font-extrabold text-7xl sm:text-9xl text-[#e5e2e1] tracking-tighter mb-4 leading-none select-none">
          4<span className="text-[#D8FF45]">0</span>4
        </h1>

        <h2 className="font-display font-bold text-2xl sm:text-4xl text-[#e5e2e1] mb-6 uppercase">
          Route Terminated or Restricted.
        </h2>

        <p className="font-body text-base sm:text-lg text-[#c4c7c7] max-w-xl mb-10 leading-relaxed">
          The requested URL path does not exist, has been moved, or is restricted under security policies.
        </p>

        {/* Terminal Diagnostic Box */}
        <div className="w-full bg-[#0A0A0A] border border-[#292929] p-6 text-left font-mono text-xs mb-10 text-[#c4c7c7] max-w-lg shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#292929] pb-3 mb-3 text-[#D8FF45]">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>DIAGNOSTIC LOG</span>
            </div>
            <span className="text-[#8e9192]">ERR_404</span>
          </div>
          <p className="text-[#ff5f56]">$ GET {currentPath}</p>
          <p className="text-[#8e9192]">→ Result: 404 Not Found (Middleware Intercepted)</p>
          <p className="text-[#D8FF45] mt-2">→ Action: Return to main portfolio index</p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="btn-primary font-mono text-xs uppercase px-8 py-4 flex items-center gap-2 font-bold"
          >
            <Home className="w-4 h-4" /> Return To Portfolio Index
          </Link>
        </div>

      </div>

      {/* Footer Disclaimer */}
      <div className="relative z-10 text-center font-mono text-xs text-[#8e9192] uppercase pt-8 border-t border-[#292929]">
        © {new Date().getFullYear()} — SECURITY &amp; ROUTE ISOLATION ENFORCED
      </div>

    </div>
  );
}
