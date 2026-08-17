'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, MapPin, Building2, ArrowRight, X, Layers, TrendingDown, Terminal, Filter } from 'lucide-react';
import { EXPERIENCE_DATA, CASE_STUDY_DATA } from '@/lib/data';
import { ExperienceRole, CaseStudy } from '@/lib/types';

interface WorkExperienceProps {
  experience?: ExperienceRole[];
  defaultCaseStudy?: CaseStudy;
  sectionTag?: string;
  customWorkFilters?: string[];
}

export default function WorkExperience({
  experience = EXPERIENCE_DATA,
  defaultCaseStudy = CASE_STUDY_DATA,
  sectionTag = '// 01_WORK_&_CASE_STUDIES',
  customWorkFilters
}: WorkExperienceProps) {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('ALL');

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCaseStudy(null);
      }
    };
    if (selectedCaseStudy) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCaseStudy]);

  // Compute all unique skills across experience roles or custom filters
  const allSkills = useMemo(() => {
    if (customWorkFilters && customWorkFilters.length > 0) {
      const filters = customWorkFilters.includes('ALL')
        ? customWorkFilters
        : ['ALL', ...customWorkFilters];
      return Array.from(new Set(filters));
    }
    const set = new Set<string>();
    experience.forEach((exp) => exp.skills.forEach((s) => set.add(s)));
    return ['ALL', ...Array.from(set)];
  }, [experience, customWorkFilters]);

  // Filter roles based on selected skill
  const filteredExperience = useMemo(() => {
    if (selectedSkillFilter === 'ALL') return experience;
    return experience.filter((exp) => exp.skills.includes(selectedSkillFilter));
  }, [experience, selectedSkillFilter]);

  const handleRoleClick = (exp: ExperienceRole) => {
    if (exp.caseStudy) {
      setSelectedCaseStudy(exp.caseStudy);
    } else {
      // Fallback generator for roles without custom caseStudy object
      const fallbackStudy: CaseStudy = {
        id: exp.id + '-case-study',
        title: `${exp.company} — ${exp.role}`,
        subtitle: `System Architecture & Implementation for ${exp.company}`,
        role: exp.role,
        techStack: exp.skills,
        year: exp.period.split(' ')[0] || '2024',
        platform: exp.location,
        overview: exp.description,
        problem: `Architecting scalable infrastructure and client platforms at ${exp.company} to ensure low-latency performance and high reliability under heavy traffic load.`,
        problemPoints: [
          `> Optimizing P99 latency & query throughput across ${exp.company} services`,
          `> Enforcing strict TypeScript standards and modular frontend architecture`,
          `> Reducing infrastructure costs and bundle size overhead`
        ],
        myRoleDescription: `As ${exp.role} at ${exp.company}, led full-stack design, API microservices integration, and system performance optimizations.`,
        keyChallenges: [
          {
            title: 'High-Throughput Data Synchronization',
            description: `Engineered real-time state synchronization algorithms for ${exp.company} services.`,
            codeSnippet: `// ${exp.company} Service Handler\nconst handlePayload = async (data: Record<string, unknown>) => {\n  const sanitized = sanitizeInput(JSON.stringify(data));\n  return await dispatchServiceEvent(sanitized);\n};`
          }
        ],
        decisions: [
          {
            question: `Why ${exp.skills[0] || 'TypeScript'}?`,
            answer: `Selected to ensure strict type safety, zero layout shifts, and sub-100ms API response guarantees across all ${exp.company} client touchpoints.`
          }
        ],
        results: [
          { metric: '42%', label: 'P99 Latency Reduction' },
          { metric: '100%', label: 'System Uptime Guarantee' }
        ]
      };
      setSelectedCaseStudy(fallbackStudy);
    }
  };

  return (
    <section id="work" className="py-24 md:py-32 border-b border-[#292929] bg-[#141313] relative">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <div className="md:col-span-3">
            <h2 className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest sticky top-28 font-bold">
              {sectionTag}
            </h2>
          </div>
          <div className="md:col-span-9">
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#e5e2e1] mb-6">
              Track Record of Technical Leadership.
            </h3>
            <p className="font-body text-base md:text-lg text-[#c4c7c7] max-w-2xl mb-8">
              Click on any work experience role below to open its dedicated system architecture case study, performance metrics, and code references.
            </p>

            {/* Interactive Tech Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#292929]">
              <div className="flex items-center gap-2 font-mono text-xs text-[#D8FF45] mr-3 font-bold">
                <Filter className="w-3.5 h-3.5" />
                <span>FILTER BY TECH:</span>
              </div>
              {allSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkillFilter(skill)}
                  className={`font-mono text-xs px-3 py-1.5 border transition-all cursor-pointer ${
                    selectedSkillFilter === skill
                      ? 'bg-[#D8FF45] text-[#0A0A0A] border-[#D8FF45] font-bold'
                      : 'bg-[#1c1b1b] text-[#c4c7c7] border-[#292929] hover:border-[#D8FF45]/50 hover:text-[#e5e2e1]'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Experience Roles List with Click-to-Open Case Study */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-start-3 md:col-span-10 flex flex-col gap-6">
            {filteredExperience.length === 0 ? (
              <div className="p-8 border border-[#292929] bg-[#111111] font-mono text-xs text-[#c4c7c7] text-center">
                NO WORK ROLES FOUND MATCHING &quot;{selectedSkillFilter}&quot;.
              </div>
            ) : (
              filteredExperience.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => handleRoleClick(exp)}
                  className="border border-[#292929] p-8 md:p-10 bg-[#111111] hover:bg-[#171717] hover:border-[#D8FF45] transition-all duration-300 group cursor-pointer relative"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Metadata */}
                    <div className="md:col-span-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2 font-mono text-xs text-[#D8FF45] font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs text-[#c4c7c7]">
                        <MapPin className="w-3.5 h-3.5 text-[#8e9192]" />
                        <span>{exp.location}</span>
                      </div>
                    </div>

                    {/* Right Content */}
                    <div className="md:col-span-8 flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-display font-extrabold text-2xl md:text-3xl text-[#e5e2e1] group-hover:text-[#D8FF45] transition-colors">
                            {exp.role}
                          </h4>
                          <div className="flex items-center gap-2 font-mono text-sm text-[#c4c7c7] mt-1">
                            <Building2 className="w-4 h-4 text-[#D8FF45]" />
                            <span className="font-bold text-[#e5e2e1]">{exp.company}</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRoleClick(exp);
                          }}
                          className="font-mono text-xs bg-[#1c1b1b] border border-[#D8FF45]/40 text-[#D8FF45] px-3 py-1.5 flex items-center gap-1.5 group-hover:bg-[#D8FF45] group-hover:text-[#0A0A0A] font-bold transition-all shrink-0"
                        >
                          VIEW CASE STUDY <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="font-body text-base text-[#c4c7c7] leading-relaxed">
                        {exp.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {exp.skills.map((skill) => (
                          <span
                            key={skill}
                            className={`font-mono text-xs px-3 py-1 border transition-colors ${
                              selectedSkillFilter === skill
                                ? 'bg-[#D8FF45] text-[#0A0A0A] border-[#D8FF45] font-bold'
                                : 'bg-[#1c1b1b] border-[#292929] text-[#c4c7c7] group-hover:border-[#D8FF45]/30 group-hover:text-[#e5e2e1]'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Case Study Lightbox Modal */}
      {selectedCaseStudy && (
        <div className="fixed inset-0 z-50 bg-[#141313]/90 backdrop-blur-xl p-4 md:p-12 overflow-y-auto flex justify-center items-start">
          <div className="bg-[#111111] border border-[#292929] max-w-4xl w-full p-8 md:p-12 relative my-auto shadow-2xl">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedCaseStudy(null)}
              className="absolute top-6 right-6 p-2 text-[#c4c7c7] hover:text-[#D8FF45] border border-[#292929] hover:border-[#D8FF45] transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Case Study Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs text-[#D8FF45] uppercase bg-[#1c1b1b] px-3 py-1 border border-[#D8FF45]/30">
                CASE STUDY // {selectedCaseStudy.year}
              </span>
              <span className="font-mono text-xs text-[#c4c7c7]">{selectedCaseStudy.platform}</span>
            </div>

            <h3 className="font-display font-extrabold text-3xl md:text-5xl text-[#e5e2e1] mb-4">
              {selectedCaseStudy.title}
            </h3>

            <p className="font-body text-lg text-[#c4c7c7] mb-8 leading-relaxed">
              {selectedCaseStudy.subtitle}
            </p>

            {/* Benchmark Metrics Grid */}
            {selectedCaseStudy.results && selectedCaseStudy.results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {selectedCaseStudy.results.map((res, i) => (
                  <div key={i} className="bg-[#141313] p-6 border-l-4 border-[#D8FF45] border border-[#292929]">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingDown className="w-6 h-6 text-[#D8FF45]" />
                      <span className="font-display font-extrabold text-4xl text-[#e5e2e1]">{res.metric}</span>
                    </div>
                    <span className="font-mono text-xs text-[#D8FF45] uppercase font-bold">{res.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Problem & Overview */}
            <div className="space-y-6 bg-[#141313] p-6 border border-[#292929] mb-8">
              <h4 className="font-display font-bold text-xl text-[#e5e2e1] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#D8FF45]" />
                Architectural Problem &amp; Mandate
              </h4>
              <p className="font-body text-sm text-[#c4c7c7] leading-relaxed">
                {selectedCaseStudy.overview}
              </p>
              <p className="font-body text-sm text-[#c4c7c7] leading-relaxed">
                {selectedCaseStudy.problem}
              </p>
            </div>

            {/* Code Snippet Reference */}
            {selectedCaseStudy.keyChallenges && selectedCaseStudy.keyChallenges[0]?.codeSnippet && (
              <div className="bg-[#0A0A0A] border border-[#292929] p-6 font-mono text-xs mb-8">
                <div className="flex items-center gap-2 text-[#D8FF45] mb-3">
                  <Terminal className="w-4 h-4" />
                  <span>{selectedCaseStudy.keyChallenges[0].title} // Sync Snippet</span>
                </div>
                <pre className="text-[#e5e2e1] overflow-x-auto p-4 bg-[#141313] border border-[#292929]">
                  <code>{selectedCaseStudy.keyChallenges[0].codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Tech Stack List */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#292929]">
              <span className="font-mono text-xs text-[#c4c7c7] mr-2">TECH STACK:</span>
              {selectedCaseStudy.techStack.map((tech) => (
                <span key={tech} className="font-mono text-xs bg-[#1c1b1b] border border-[#292929] px-3 py-1 text-[#D8FF45]">
                  {tech}
                </span>
              ))}
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
