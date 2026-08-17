'use client';

import React from 'react';
import { ArrowUp, ShieldCheck } from 'lucide-react';

interface FooterProps {
  developerName?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export default function Footer({
  developerName = 'SOUGATA_CHANDA',
  githubUrl = 'https://github.com',
  linkedinUrl = 'https://linkedin.com'
}: FooterProps) {
  const isDevMode = process.env.NODE_ENV != 'production';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#141313] border-t border-[#292929] relative z-10 py-12 px-6 md:px-16">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">

        {/* Left Brand */}
        <div className="flex items-center gap-4">
          <span className="font-display font-bold text-xl text-[#e5e2e1] tracking-tighter uppercase">
            {developerName}
          </span>
          <span className="text-[#292929]">|</span>
          <span className="font-mono text-xs text-[#c4c7c7] uppercase">
            © {new Date().getFullYear()} — BUILT FOR PERFORMANCE
          </span>
        </div>

        {/* Center Links */}
        <div className="flex flex-wrap justify-center gap-8 font-mono text-xs uppercase tracking-widest text-[#c4c7c7]">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#D8FF45] transition-colors underline-offset-4 hover:underline"
            >
              GitHub
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#D8FF45] transition-colors underline-offset-4 hover:underline"
            >
              LinkedIn
            </a>
          )}
          <a
            href="#work"
            className="hover:text-[#D8FF45] transition-colors underline-offset-4 hover:underline"
          >
            Work
          </a>
          <a
            href="#certificates"
            className="hover:text-[#D8FF45] transition-colors underline-offset-4 hover:underline"
          >
            Certificates
          </a>
          {isDevMode && (
            <a
              href="/admin"
              className="hover:text-[#D8FF45] transition-colors underline-offset-4 hover:underline"
            >
              CMS Admin
            </a>
          )}
          <a
            href="#contact"
            className="hover:text-[#D8FF45] transition-colors underline-offset-4 hover:underline"
          >
            Contact
          </a>
        </div>

        {/* Right Scroll To Top Button & Security status */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1.5 font-mono text-xs text-[#D8FF45] bg-[#1c1b1b] border border-[#292929] px-3 py-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CSP ENFORCED</span>
          </div>

          <button
            onClick={scrollToTop}
            className="btn-ghost p-3 flex items-center justify-center hover:border-[#D8FF45]"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-4 h-4 text-[#D8FF45]" />
          </button>
        </div>

      </div>
    </footer>
  );
}
