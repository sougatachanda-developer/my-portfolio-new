'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, FileText, Settings, Sun, Moon, Terminal, Volume2, VolumeX } from 'lucide-react';
import { setSoundEnabled, isSoundEnabled, playClickSound } from '@/lib/audio';

interface NavbarProps {
  developerName?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  enableThemeToggle?: boolean;
  enableCommandTerminal?: boolean;
  enableSoundEffects?: boolean;
  onOpenTerminal?: () => void;
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export default function Navbar({
  developerName = 'SOUGATA_CHANDA',
  githubUrl = 'https://github.com',
  linkedinUrl = 'https://linkedin.com',
  enableThemeToggle = true,
  enableCommandTerminal = true,
  enableSoundEffects = true,
  onOpenTerminal
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [soundMuted, setSoundMuted] = useState(false);
  const isDevMode = process.env.NODE_ENV != 'production';

  const toggleSound = () => {
    const nextState = !soundMuted;
    setSoundMuted(nextState);
    setSoundEnabled(!nextState);
    if (!nextState) playClickSound();
  };

  const navLinks = [
    { label: 'Work', href: '#work', sectionId: 'work' },
    { label: 'Certificates', href: '#certificates', sectionId: 'certificates' },
    { label: 'Expertise', href: '#expertise', sectionId: 'expertise' },
    { label: 'About', href: '#about', sectionId: 'about' },
    { label: 'Contact', href: '#contact', sectionId: 'contact' }
  ];

  // Load saved theme preference on mount (if theme toggle is enabled)
  useEffect(() => {
    if (!enableThemeToggle) {
      document.documentElement.classList.remove('light');
      document.documentElement.removeAttribute('data-theme');
      return;
    }
    const savedTheme = localStorage.getItem('portfolio_theme') as 'dark' | 'light' | null;
    if (savedTheme === 'light') {
      setTheme('light');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [enableThemeToggle]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('portfolio_theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.removeAttribute('data-theme');
    }
  };

  // Active section detection via IntersectionObserver / scroll offset
  useEffect(() => {
    const sectionIds = ['hero', 'work', 'certificates', 'expertise', 'about', 'contact'];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#141313]/90 backdrop-blur-md border-b border-[#292929] transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-5 flex justify-between items-center">
          {/* Dynamic Developer Logo */}
          <a href="#hero" className="font-display font-bold text-xl md:text-2xl text-[#e5e2e1] tracking-tighter hover:text-[#D8FF45] transition-colors flex items-center gap-2 uppercase">
            <span className="w-2.5 h-2.5 bg-[#D8FF45] rounded-full pulse-indicator"></span>
            {developerName}
          </a>

          {/* Desktop Nav Links with Active Highlighting */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.sectionId;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`font-mono text-xs uppercase tracking-wider transition-colors duration-200 relative py-1 ${isActive
                    ? 'text-[#D8FF45] font-bold'
                    : 'text-[#c4c7c7] hover:text-[#e5e2e1]'
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D8FF45] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Social Icons & Action Buttons & Day/Night Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Sound FX Mute/Unmute Toggle */}
            {enableSoundEffects && (
              <button
                onClick={toggleSound}
                className="p-2 text-[#c4c7c7] hover:text-[#D8FF45] border border-[#292929] hover:border-[#D8FF45] transition-all flex items-center justify-center cursor-pointer"
                title={soundMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
                aria-label="Toggle Sound Effects"
              >
                {soundMuted ? (
                  <VolumeX className="w-4 h-4 text-[#8e9192]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#D8FF45]" />
                )}
              </button>
            )}

            {/* Command Terminal Trigger Button */}
            {enableCommandTerminal && (
              <button
                onClick={() => {
                  if (onOpenTerminal) onOpenTerminal();
                }}
                className="px-3 py-1.5 text-xs font-mono text-[#D8FF45] border border-[#D8FF45]/40 hover:bg-[#D8FF45] hover:text-[#0A0A0A] transition-all flex items-center gap-1.5 cursor-pointer font-bold"
                title="Open Interactive Developer Terminal (Cmd + K)"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Cmd+K</span>
              </button>
            )}

            {/* Day / Night Theme Toggle Button */}
            {enableThemeToggle && (
              <button
                onClick={toggleTheme}
                className="p-2 text-[#c4c7c7] hover:text-[#D8FF45] border border-[#292929] hover:border-[#D8FF45] transition-all flex items-center justify-center cursor-pointer"
                title={theme === 'dark' ? 'Switch to Day (Light) Mode' : 'Switch to Night (Dark) Mode'}
                aria-label="Toggle Day Night Mode"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#D8FF45]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#4c6b00]" />
                )}
              </button>
            )}

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-[#c4c7c7] hover:text-[#D8FF45] border border-[#292929] hover:border-[#D8FF45] transition-colors"
                title="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-[#c4c7c7] hover:text-[#D8FF45] border border-[#292929] hover:border-[#D8FF45] transition-colors"
                title="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
            {isDevMode && (
              <a
                href="/admin"
                className="btn-ghost font-mono text-xs uppercase px-3 py-2 flex items-center gap-1.5 tracking-wider text-[#c4c7c7] hover:text-[#D8FF45]"
                title="Content Management CMS (Local Development Only)"
              >
                <Settings className="w-3.5 h-3.5 text-[#D8FF45]" />
                CMS Admin
              </a>
            )}
            <a
              href="/resume.pdf"
              download="Arthur_Dev_Resume.pdf"
              className="btn-ghost font-mono text-xs uppercase px-4 py-2 flex items-center gap-1.5 tracking-wider"
            >
              <FileText className="w-3.5 h-3.5 text-[#D8FF45]" />
              Resume
            </a>
            <a
              href="#contact"
              className="btn-primary font-mono text-xs uppercase px-4 py-2 flex items-center gap-1.5 tracking-wider font-semibold"
            >
              Get In Touch
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Hamburger & Day/Night Toggle */}
          <div className="md:hidden flex items-center gap-2">
            {enableThemeToggle && (
              <button
                onClick={toggleTheme}
                className="p-2 text-[#c4c7c7] hover:text-[#D8FF45] border border-[#292929] hover:border-[#D8FF45] transition-all flex items-center justify-center cursor-pointer"
                title={theme === 'dark' ? 'Switch to Day (Light) Mode' : 'Switch to Night (Dark) Mode'}
                aria-label="Toggle Day Night Mode"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-[#D8FF45]" />
                ) : (
                  <Moon className="w-5 h-5 text-[#4c6b00]" />
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#e5e2e1] hover:text-[#D8FF45] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#141313]/95 backdrop-blur-xl pt-20 px-6 flex flex-col justify-between pb-20 border-b border-[#292929] overflow-y-auto">
          <div className="flex flex-col gap-3.5 pt-2">
            <span className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest font-bold mb-1">// NAVIGATION</span>
            {navLinks.map((link) => {
              const isActive = activeSection === link.sectionId;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-display text-lg font-extrabold tracking-wide uppercase transition-colors flex items-center justify-between py-2 border-b border-[#292929]/50 ${isActive ? 'text-[#D8FF45]' : 'text-[#e5e2e1] hover:text-[#D8FF45]'
                    }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#D8FF45] pulse-indicator" />}
                </a>
              );
            })}
          </div>

          <div className="flex flex-col gap-2.5 border-t border-[#292929] pt-5 mt-4">
            <div className="flex items-center gap-2 justify-center mb-1">
              {enableThemeToggle && (
                <button
                  onClick={toggleTheme}
                  className="p-2.5 border border-[#292929] text-[#e5e2e1] hover:text-[#D8FF45] flex items-center gap-2 font-mono text-xs uppercase"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-[#D8FF45]" />
                      <span>DAY MODE</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-[#4c6b00]" />
                      <span>NIGHT MODE</span>
                    </>
                  )}
                </button>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 border border-[#292929] text-[#e5e2e1] hover:text-[#D8FF45]"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 border border-[#292929] text-[#e5e2e1] hover:text-[#D8FF45]"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
            </div>

            <a
              href="/resume.pdf"
              download="Arthur_Dev_Resume.pdf"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-ghost font-mono text-xs uppercase py-2.5 text-center flex justify-center items-center gap-2 tracking-wider"
            >
              <FileText className="w-3.5 h-3.5 text-[#D8FF45]" />
              Download Resume (PDF)
            </a>
            {isDevMode && (
              <a
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-ghost font-mono text-xs uppercase py-2.5 text-center flex justify-center items-center gap-2 text-[#c4c7c7] tracking-wider"
              >
                <Settings className="w-3.5 h-3.5 text-[#D8FF45]" />
                CMS Content Editor (Local Only)
              </a>
            )}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary font-mono text-xs uppercase py-2.5 text-center flex justify-center items-center gap-2 font-bold tracking-wider"
            >
              Contact Me
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
