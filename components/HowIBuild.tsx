'use client';

import React, { useState } from 'react';
import { Code2, Server, Cloud, Copy, Check } from 'lucide-react';
import { CAPABILITIES_DATA } from '@/lib/data';
import { CapabilityItem } from '@/lib/types';

interface HowIBuildProps {
  sectionTag?: string;
  capabilities?: CapabilityItem[];
}

export default function HowIBuild({
  sectionTag = '// 03_CAPABILITIES_&_SYSTEMS',
  capabilities = CAPABILITIES_DATA
}: HowIBuildProps = {}) {
  const capList = capabilities && capabilities.length > 0 ? capabilities : CAPABILITIES_DATA;
  const [activeCategory, setActiveCategory] = useState<string>(capList[0]?.id || 'frontend');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeCapability = capList.find((item) => item.id === activeCategory) || capList[0];

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'frontend':
        return <Code2 className="w-5 h-5" />;
      case 'backend':
        return <Server className="w-5 h-5" />;
      case 'cloud':
        return <Cloud className="w-5 h-5" />;
      default:
        return <Code2 className="w-5 h-5" />;
    }
  };

  return (
    <section id="expertise" className="py-24 md:py-32 border-b border-[#292929] relative bg-[#141313]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        {/* Section Title */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-3">
            <h2 className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest sticky top-28 font-bold">
              {sectionTag}
            </h2>
          </div>
          <div className="md:col-span-9">
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#e5e2e1] mb-6">
              Engineering Expertise & Core Systems.
            </h3>
            <p className="font-body text-base md:text-lg text-[#c4c7c7] max-w-2xl">
              From zero-latency client interfaces to resilient cloud microservices, every layer is designed for performance, modularity, and security.
            </p>
          </div>
        </div>

        {/* Interactive Capability Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Category Tabs Column */}
          <div className="md:col-span-4 flex flex-col gap-4">
            {capList.map((item) => {
              const isActive = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveCategory(item.id)}
                  className={`p-6 text-left border transition-all duration-300 flex flex-col gap-3 ${
                    isActive
                      ? 'bg-[#1c1b1b] border-[#D8FF45] shadow-[0_0_20px_rgba(216,255,69,0.08)]'
                      : 'bg-[#141313] border-[#292929] hover:border-[#444748] hover:bg-[#171717]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-[#D8FF45]' : 'text-[#c4c7c7]'}>
                        {getIcon(item.id)}
                      </span>
                      <span className={`font-display font-bold text-xl ${isActive ? 'text-[#e5e2e1]' : 'text-[#c4c7c7]'}`}>
                        {item.category}
                      </span>
                    </div>
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#D8FF45]" />}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.techTags.map((tag) => (
                      <span
                        key={tag}
                        className={`font-mono text-[11px] px-2 py-0.5 border ${
                          isActive
                            ? 'border-[#D8FF45]/40 text-[#D8FF45]'
                            : 'border-[#292929] text-[#c4c7c7]'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Category Technical Detail & Code Preview */}
          <div className="md:col-span-8 bg-[#111111] border border-[#292929] p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#292929] pb-6 mb-8">
                <div>
                  <span className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest">SELECTED DOMAIN</span>
                  <h4 className="font-display font-extrabold text-2xl md:text-3xl text-[#e5e2e1] mt-1">
                    {activeCapability.category} ARCHITECTURE
                  </h4>
                </div>
                <div className="font-mono text-xs text-[#c4c7c7]">
                  STATUS: <span className="text-[#D8FF45]">OPTIMIZED</span>
                </div>
              </div>

              <p className="font-body text-base md:text-lg text-[#c4c7c7] leading-relaxed mb-8">
                {activeCapability.description}
              </p>

              {/* Code Snippet Box */}
              <div className="relative bg-[#0A0A0A] border border-[#292929] rounded-sm p-5 font-mono text-xs overflow-x-auto">
                <div className="flex items-center justify-between border-b border-[#292929] pb-3 mb-3 text-[#c4c7c7]">
                  <span className="text-[11px] text-[#D8FF45]">// Code Reference & Implementation Pattern</span>
                  <button
                    onClick={() => handleCopyCode(activeCapability.id, activeCapability.codeSnippet)}
                    className="flex items-center gap-1.5 text-xs hover:text-[#D8FF45] transition-colors"
                  >
                    {copiedId === activeCapability.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#D8FF45]" />
                        <span className="text-[#D8FF45]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-[#e5e2e1] leading-relaxed whitespace-pre font-mono overflow-x-auto">
                  <code>{activeCapability.codeSnippet}</code>
                </pre>
              </div>
            </div>

            {/* Tech Tags List */}
            <div className="mt-8 pt-6 border-t border-[#292929] flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-[#c4c7c7] mr-2">TECH STACK:</span>
              {activeCapability.techTags.map((tag) => (
                <span key={tag} className="font-mono text-xs bg-[#1c1b1b] border border-[#292929] px-3 py-1 text-[#e5e2e1]">
                  {tag}
                </span>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
