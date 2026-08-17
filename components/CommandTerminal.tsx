'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, CornerDownLeft, Sparkles } from 'lucide-react';
import { CMSData } from '@/lib/types';
import { playClickSound, playSuccessSound } from '@/lib/audio';

interface CommandTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  cmsData: CMSData;
  onToggleTheme?: () => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
}

export default function CommandTerminal({
  isOpen,
  onClose,
  cmsData,
  onToggleTheme
}: CommandTerminalProps) {
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'welcome',
      command: 'system.init()',
      output: (
        <div className="space-y-1 text-[#c4c7c7]">
          <p className="text-[#D8FF45] font-bold">
            WELCOME TO {cmsData.hero.name || 'SOUGATA_CHANDA'} TERMINAL v2.5.0 (ARM64)
          </p>
          <p>Type <span className="text-[#D8FF45] font-bold">&quot;help&quot;</span> to view available interactive CLI commands.</p>
        </div>
      )
    }
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      playSuccessSound();
    }
  }, [isOpen]);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Close terminal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    playClickSound();

    let responseNode: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        responseNode = (
          <div className="space-y-1 text-[#c4c7c7] font-mono text-xs">
            <p className="text-[#D8FF45] font-bold">AVAILABLE COMMANDS:</p>
            <p><span className="text-[#e5e2e1] font-bold">help</span> — Show this help menu</p>
            <p><span className="text-[#e5e2e1] font-bold">skills</span> — List core technical stack &amp; capabilities</p>
            <p><span className="text-[#e5e2e1] font-bold">experience</span> — View career positions &amp; companies</p>
            <p><span className="text-[#e5e2e1] font-bold">bio</span> — Read engineering philosophy summary</p>
            <p><span className="text-[#e5e2e1] font-bold">contact</span> — Get direct contact email</p>
            <p><span className="text-[#e5e2e1] font-bold">theme</span> — Toggle Day/Night mode</p>
            <p><span className="text-[#e5e2e1] font-bold">clear</span> — Clear terminal output</p>
            <p><span className="text-[#e5e2e1] font-bold">exit</span> — Close terminal overlay</p>
          </div>
        );
        break;

      case 'skills':
      case 'stack':
        responseNode = (
          <div className="space-y-1 text-[#c4c7c7] font-mono text-xs">
            <p className="text-[#D8FF45] font-bold">CORE TECHNICAL STACK:</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {(cmsData.hero.skillsTicker || []).map((s, idx) => (
                <span key={idx} className="bg-[#1c1b1b] border border-[#D8FF45]/30 text-[#D8FF45] px-2 py-0.5">
                  [{s}]
                </span>
              ))}
            </div>
          </div>
        );
        break;

      case 'experience':
      case 'work':
        responseNode = (
          <div className="space-y-2 text-[#c4c7c7] font-mono text-xs">
            <p className="text-[#D8FF45] font-bold">CAREER ROLES:</p>
            {cmsData.experience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-[#D8FF45] pl-3 py-0.5">
                <p className="text-[#e5e2e1] font-bold">{exp.role} @ {exp.company}</p>
                <p className="text-[11px] text-[#8e9192]">{exp.period} | {exp.location}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'bio':
      case 'about':
        responseNode = (
          <div className="space-y-1 text-[#c4c7c7] font-mono text-xs">
            <p className="text-[#D8FF45] font-bold">{cmsData.about?.title || 'Curious by Default.'}</p>
            <p className="text-[#e5e2e1]">{cmsData.about?.paragraph1}</p>
          </div>
        );
        break;

      case 'contact':
      case 'email':
        const email = cmsData.hero.contactEmail || 'hello@sougata.dev';
        if (typeof navigator !== 'undefined') {
          navigator.clipboard.writeText(email);
        }
        responseNode = (
          <div className="space-y-1 text-[#c4c7c7] font-mono text-xs">
            <p className="text-[#D8FF45] font-bold">DIRECT EMAIL:</p>
            <p className="text-[#e5e2e1] font-bold">{email}</p>
            <p className="text-[11px] text-[#D8FF45]">[Copied to clipboard!]</p>
          </div>
        );
        break;

      case 'theme':
        if (onToggleTheme) onToggleTheme();
        responseNode = <p className="text-[#D8FF45] font-mono text-xs">[Toggled color theme!]</p>;
        break;

      case 'clear':
        setLogs([]);
        setInputVal('');
        return;

      case 'exit':
      case 'quit':
        onClose();
        setInputVal('');
        return;

      default:
        responseNode = (
          <p className="text-[#ff5f56] font-mono text-xs">
            Command not recognized: &quot;{cmd}&quot;. Type <span className="text-[#D8FF45] font-bold">&quot;help&quot;</span> for commands list.
          </p>
        );
        break;
    }

    setLogs((prev) => [
      ...prev,
      {
        id: 'cmd-' + Date.now(),
        command: inputVal,
        output: responseNode
      }
    ]);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141313]/90 backdrop-blur-xl p-4 md:p-12 flex justify-center items-center">
      <div className="bg-[#0A0A0A] border border-[#292929] max-w-3xl w-full h-[520px] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Terminal Header */}
        <div className="bg-[#141313] border-b border-[#292929] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
            </div>
            <div className="flex items-center gap-2 text-[#D8FF45] font-mono text-xs font-bold">
              <Terminal className="w-4 h-4" />
              <span>SOUGATA_CLI // {cmsData.hero.name || 'SOUGATA_CHANDA'}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#c4c7c7] hover:text-[#D8FF45] border border-[#292929] p-1 hover:border-[#D8FF45] transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Output Logs */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-xs space-y-4 no-scrollbar">
          {logs.map((log) => (
            <div key={log.id} className="space-y-1.5">
              <div className="flex items-center gap-2 text-[#D8FF45]">
                <span className="text-[#8e9192]">&gt;</span>
                <span className="font-bold">{log.command}</span>
              </div>
              <div className="pl-4">{log.output}</div>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>

        {/* Terminal Input Line */}
        <form onSubmit={handleRunCommand} className="bg-[#141313] border-t border-[#292929] px-4 py-3 flex items-center gap-3">
          <span className="font-mono text-xs text-[#D8FF45] font-bold">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type command ('help', 'skills', 'experience', 'contact', 'clear')..."
            className="w-full bg-transparent outline-none font-mono text-xs text-[#e5e2e1] placeholder-[#8e9192]"
          />
          <button type="submit" className="text-[#D8FF45] hover:text-[#e5e2e1] transition-colors cursor-pointer">
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
