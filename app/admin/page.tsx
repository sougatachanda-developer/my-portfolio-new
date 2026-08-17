'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Settings, Save, Plus, Trash2, ArrowLeft, CheckCircle2, AlertCircle, Award, Briefcase, Sparkles, Code2, Layers, Link as LinkIcon, Edit3, LogOut, Eye, EyeOff, Tag, Wrench, User, Filter, Quote, Terminal } from 'lucide-react';
import { INITIAL_CMS_DATA, CASE_STUDY_DATA, VERTEX_CASE_STUDY, ACME_CASE_STUDY, ABOUT_DATA, DEFAULT_WORK_FILTERS, TESTIMONIALS_DATA } from '@/lib/data';
import { CMSData, Certificate, ExperienceRole, CapabilityItem, CaseStudy, AboutData, Testimonial } from '@/lib/types';
import { createSupabaseClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminCMSPage() {
  const [cmsData, setCmsData] = useState<CMSData>(INITIAL_CMS_DATA);
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'caseStudy' | 'certificates' | 'experience' | 'testimonials' | 'expertise' | 'sectionTags'>('hero');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Case Studies list state
  const [caseStudiesList, setCaseStudiesList] = useState<CaseStudy[]>([
    CASE_STUDY_DATA,
    VERTEX_CASE_STUDY,
    ACME_CASE_STUDY
  ]);
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string>(CASE_STUDY_DATA.id);

  // Raw string states for smooth comma typing without losing trailing commas
  const [rawTicker, setRawTicker] = useState<string>('');
  const [rawCaseStack, setRawCaseStack] = useState<string>('');
  const [rawAboutHighlights, setRawAboutHighlights] = useState<string>('');
  const [rawWorkFilters, setRawWorkFilters] = useState<string>('');

  // Load existing data from API on mount
  useEffect(() => {
    fetch('/api/cms')
      .then((res) => {
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          return res.json();
        }
        return null;
      })
      .then((resData) => {
        if (resData && resData.success && resData.data) {
          const loadedData: CMSData = resData.data;
          setCmsData(loadedData);
          setRawTicker(loadedData.hero.skillsTicker ? loadedData.hero.skillsTicker.join(', ') : '');
          setRawAboutHighlights(loadedData.about?.highlights ? loadedData.about.highlights.join(', ') : (ABOUT_DATA.highlights || []).join(', '));
          setRawWorkFilters(loadedData.customWorkFilters ? loadedData.customWorkFilters.join(', ') : DEFAULT_WORK_FILTERS.join(', '));

          let list: CaseStudy[] = [];
          if (loadedData.caseStudies && loadedData.caseStudies.length > 0) {
            list = loadedData.caseStudies;
          } else {
            const extracted = loadedData.experience
              .map((e) => e.caseStudy)
              .filter((cs): cs is CaseStudy => Boolean(cs));
            list = extracted.length > 0 ? extracted : [CASE_STUDY_DATA, VERTEX_CASE_STUDY, ACME_CASE_STUDY];
          }
          
          setCaseStudiesList(list);
          if (list.length > 0) {
            setSelectedCaseStudyId(list[0].id);
            setRawCaseStack(list[0].techStack ? list[0].techStack.join(', ') : '');
          }
        }
      })
      .catch((err) => console.error('Failed to load CMS data:', err));
  }, []);

  const parseTags = (str: string) => {
    return str.split(',').map((s) => s.trim()).filter(Boolean);
  };

  const currentCaseStudy = caseStudiesList.find((cs) => cs.id === selectedCaseStudyId) || caseStudiesList[0];

  // Admin Secret Key state (prefilled from localStorage or default secret key)
  const [adminKey, setAdminKey] = useState<string>('super-secret-admin-key-change-in-production');
  const [showAdminKey, setShowAdminKey] = useState<boolean>(false);

  // Load saved Admin Key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('portfolio_admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
    }
  }, []);

  const handleAdminKeyChange = (keyVal: string) => {
    setAdminKey(keyVal);
    localStorage.setItem('portfolio_admin_key', keyVal);
  };

  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMsg(null);

    const updatedCurrentCaseStudy = currentCaseStudy ? {
      ...currentCaseStudy,
      techStack: parseTags(rawCaseStack)
    } : CASE_STUDY_DATA;

    const updatedCaseStudies = caseStudiesList.map((cs) =>
      cs.id === selectedCaseStudyId ? updatedCurrentCaseStudy : cs
    );

    const updatedData: CMSData = {
      ...cmsData,
      hero: {
        ...cmsData.hero,
        skillsTicker: parseTags(rawTicker)
      },
      about: {
        ...(cmsData.about || ABOUT_DATA),
        highlights: parseTags(rawAboutHighlights)
      },
      customWorkFilters: parseTags(rawWorkFilters),
      caseStudy: updatedCurrentCaseStudy,
      caseStudies: updatedCaseStudies
    };

    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({ data: updatedData }),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setCmsData(updatedData);
        setCaseStudiesList(updatedCaseStudies);
        setStatusMsg({ type: 'success', text: resData.message || 'Portfolio content saved successfully!' });
      } else {
        setStatusMsg({ type: 'error', text: resData.message || 'Failed to save changes.' });
      }
    } catch (e) {
      setStatusMsg({ type: 'error', text: 'Network error saving CMS changes.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAssignCaseStudyToExperience = (expId: string, caseStudyObj: CaseStudy) => {
    const updatedExp = cmsData.experience.map((exp) => {
      if (exp.id === expId) {
        return { ...exp, caseStudy: caseStudyObj };
      }
      return exp;
    });
    setCmsData({
      ...cmsData,
      experience: updatedExp
    });
    setStatusMsg({
      type: 'success',
      text: `Attached "${caseStudyObj.title}" to Work Experience role!`
    });
  };

  const handleCreateNewCaseStudy = () => {
    const newStudyId = 'cs-' + Date.now();
    const newStudy: CaseStudy = {
      id: newStudyId,
      title: 'New Enterprise Systems Case Study',
      subtitle: 'Architecting high-availability cloud platforms & microservices.',
      role: 'Lead Systems Architect',
      techStack: ['TypeScript', 'Next.js 15', 'PostgreSQL', 'Redis', 'Docker'],
      year: '2025',
      platform: 'Web & Cloud Platform',
      overview: 'Detail the architectural problem and system transformation here.',
      problem: 'High memory overhead and long query response bottlenecks under surge load.',
      problemPoints: ['> P99 latency exceeding 3,500ms', '> Unoptimized database query chains'],
      myRoleDescription: 'Directed full-stack engineering team through system migration.',
      keyChallenges: [
        {
          title: 'Event-Driven Real-time Synchronization',
          description: 'Implemented pub/sub Redis event channels.',
          codeSnippet: '// Real-time Event Handler\nconst syncPayload = async () => {};'
        }
      ],
      decisions: [
        {
          question: 'Why Next.js 15?',
          answer: 'Server components streaming and automatic bundle optimization.'
        }
      ],
      results: [
        { metric: '50%', label: 'P99 Latency Reduction' },
        { metric: '99.99%', label: 'Uptime Reliability' }
      ]
    };

    const newList = [...caseStudiesList, newStudy];
    setCaseStudiesList(newList);
    setSelectedCaseStudyId(newStudyId);
    setRawCaseStack(newStudy.techStack.join(', '));
    setStatusMsg({
      type: 'success',
      text: 'New Case Study added to list! You can now edit its details and attach it to an experience role below.'
    });
  };

  const handleDeleteCaseStudy = (csId: string) => {
    const newList = caseStudiesList.filter((cs) => cs.id !== csId);
    setCaseStudiesList(newList);
    if (newList.length > 0) {
      setSelectedCaseStudyId(newList[0].id);
      setRawCaseStack(newList[0].techStack.join(', '));
    }
    setStatusMsg({ type: 'success', text: 'Case study removed from list.' });
  };

  const handleAddCertificate = () => {
    const newCert: Certificate = {
      id: 'cert-' + Date.now(),
      title: 'New Professional Certificate',
      issuer: 'Certification Board',
      date: '2025',
      credentialId: 'CERT-000000',
      verificationUrl: 'https://example.com/verify',
      certificateImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGgb0lMr8W8yOqtXeuKp4mz_DG71xjaHwdRUS3ck1-b4y_l4fyyr3R-mExRj4MTe23VSHunjYcSi1d3g5SxdW1ps_BaVpINnHerq9tbqBoky6XkPCbUCvNlIP4zx6mz934h-OfKoMv9R5nrqDbnOO6QbB3P4LvsHvsns-R2Fi8CUZCo-iJbwmIwzcsdoLFvnsQjiaeSRGXVGEfhJ0he5O-3cnyanna21HZCNbIpYgEptuNctLEAIZz3w',
      skills: ['New Skill', 'Architecture'],
      badgeColor: '#D8FF45',
    };
    setCmsData({
      ...cmsData,
      certificates: [newCert, ...cmsData.certificates],
    });
  };

  const handleDeleteCertificate = (id: string) => {
    setCmsData({
      ...cmsData,
      certificates: cmsData.certificates.filter((c) => c.id !== id),
    });
  };

  const handleAddExperience = () => {
    const newExp: ExperienceRole = {
      id: 'exp-' + Date.now(),
      period: '2024 — PRESENT',
      location: 'San Francisco, CA',
      role: 'Senior Software Engineer',
      company: 'Innovate Tech',
      description: 'Architecting scalable web applications and microservices.',
      skills: ['TypeScript', 'Next.js', 'PostgreSQL'],
    };
    setCmsData({
      ...cmsData,
      experience: [newExp, ...cmsData.experience],
    });
  };

  const handleDeleteExperience = (id: string) => {
    setCmsData({
      ...cmsData,
      experience: cmsData.experience.filter((e) => e.id !== id),
    });
  };

  const handleAddExpertise = () => {
    const newCap: CapabilityItem = {
      id: 'cap-' + Date.now(),
      category: 'NEW DOMAIN',
      techTags: ['React', 'TypeScript'],
      description: 'Building modern software features.',
      codeSnippet: '// Sample Code Snippet',
    };
    setCmsData({
      ...cmsData,
      capabilities: [...cmsData.capabilities, newCap],
    });
  };

  const handleDeleteExpertise = (id: string) => {
    setCmsData({
      ...cmsData,
      capabilities: cmsData.capabilities.filter((c) => c.id !== id),
    });
  };

  const handleAddTestimonial = () => {
    const newTest: Testimonial = {
      id: 'test-' + Date.now(),
      name: 'Engineering Director',
      role: 'Head of Infrastructure',
      company: 'Tech Enterprise',
      quote: 'Outstanding software architecture work that accelerated our product launch timeline.',
      relationship: 'Collaborator'
    };
    setCmsData({
      ...cmsData,
      testimonials: [...(cmsData.testimonials || []), newTest]
    });
  };

  const handleDeleteTestimonial = (id: string) => {
    setCmsData({
      ...cmsData,
      testimonials: (cmsData.testimonials || []).filter((t) => t.id !== id)
    });
  };

  return (
    <>
      <Navbar
        developerName={cmsData.hero.name}
        githubUrl={cmsData.hero.githubUrl}
        linkedinUrl={cmsData.hero.linkedinUrl}
      />

      <div className="min-h-screen bg-[#141313] text-[#e5e2e1] pt-28 pb-20 px-6 md:px-16 font-body">
        <div className="max-w-[1440px] mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-[#292929] mb-8">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs text-[#D8FF45] hover:underline mb-3">
                <ArrowLeft className="w-4 h-4" /> Back to Live Portfolio
              </Link>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[#e5e2e1] flex items-center gap-3">
                <Settings className="w-8 h-8 text-[#D8FF45]" />
                Portfolio CMS Dashboard
              </h1>
              <p className="font-body text-sm text-[#c4c7c7] mt-1">
                Full CMS control: comma support for stack tags, case study creation &amp; experience mapping.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] text-[#8e9192] uppercase font-bold">Admin Security Key</label>
                <div className="relative flex items-center">
                  <input
                    type={showAdminKey ? 'text' : 'password'}
                    value={adminKey}
                    onChange={(e) => handleAdminKeyChange(e.target.value)}
                    placeholder="Enter ADMIN_SECRET_KEY"
                    className="bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none pl-3 pr-9 py-2 text-xs font-mono text-[#e5e2e1]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminKey(!showAdminKey)}
                    className="absolute right-2 text-[#8e9192] hover:text-[#D8FF45] transition-colors p-1"
                    title={showAdminKey ? 'Hide key' : 'Show key'}
                  >
                    {showAdminKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary font-mono text-xs uppercase px-8 py-4 flex items-center gap-3 font-bold disabled:opacity-50 self-end sm:self-auto"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'SAVING CHANGES...' : 'SAVE ALL CHANGES'}
              </button>

              <button
                onClick={handleSignOut}
                className="bg-[#2a1c1c] border border-[#ff5f56]/40 hover:bg-[#ff5f56] text-[#ffb4ab] hover:text-[#0A0A0A] font-mono text-xs uppercase px-5 py-4 flex items-center gap-2 font-bold transition-all"
                title="Sign out of Supabase Admin Session"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          {statusMsg && (
            <div
              className={`p-4 mb-8 border flex items-center gap-3 font-mono text-xs ${
                statusMsg.type === 'success'
                  ? 'bg-[#1c2a1c] border-[#27c93f] text-[#27c93f]'
                  : 'bg-[#2a1c1c] border-[#ff5f56] text-[#ffb4ab]'
              }`}
            >
              {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <div className="flex border-b border-[#292929] mb-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('hero')}
              className={`font-mono text-xs uppercase px-6 py-3.5 border-b-2 tracking-wider transition-colors flex items-center gap-2 ${
                activeTab === 'hero' ? 'border-[#D8FF45] text-[#D8FF45] font-bold' : 'border-transparent text-[#c4c7c7] hover:text-[#e5e2e1]'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Hero &amp; Core Stack
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`font-mono text-xs uppercase px-6 py-3.5 border-b-2 tracking-wider transition-colors flex items-center gap-2 ${
                activeTab === 'about' ? 'border-[#D8FF45] text-[#D8FF45] font-bold' : 'border-transparent text-[#c4c7c7] hover:text-[#e5e2e1]'
              }`}
            >
              <User className="w-4 h-4" /> About &amp; Bio
            </button>
            <button
              onClick={() => setActiveTab('caseStudy')}
              className={`font-mono text-xs uppercase px-6 py-3.5 border-b-2 tracking-wider transition-colors flex items-center gap-2 ${
                activeTab === 'caseStudy' ? 'border-[#D8FF45] text-[#D8FF45] font-bold' : 'border-transparent text-[#c4c7c7] hover:text-[#e5e2e1]'
              }`}
            >
              <Layers className="w-4 h-4" /> Case Studies ({caseStudiesList.length})
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`font-mono text-xs uppercase px-6 py-3.5 border-b-2 tracking-wider transition-colors flex items-center gap-2 ${
                activeTab === 'certificates' ? 'border-[#D8FF45] text-[#D8FF45] font-bold' : 'border-transparent text-[#c4c7c7] hover:text-[#e5e2e1]'
              }`}
            >
              <Award className="w-4 h-4" /> Certificates ({cmsData.certificates.length})
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`font-mono text-xs uppercase px-6 py-3.5 border-b-2 tracking-wider transition-colors flex items-center gap-2 ${
                activeTab === 'experience' ? 'border-[#D8FF45] text-[#D8FF45] font-bold' : 'border-transparent text-[#c4c7c7] hover:text-[#e5e2e1]'
              }`}
            >
              <Briefcase className="w-4 h-4" /> Work Experience ({cmsData.experience.length})
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`font-mono text-xs uppercase px-6 py-3.5 border-b-2 tracking-wider transition-colors flex items-center gap-2 ${
                activeTab === 'testimonials' ? 'border-[#D8FF45] text-[#D8FF45] font-bold' : 'border-transparent text-[#c4c7c7] hover:text-[#e5e2e1]'
              }`}
            >
              <Quote className="w-4 h-4" /> Endorsements ({(cmsData.testimonials || []).length})
            </button>
            <button
              onClick={() => setActiveTab('expertise')}
              className={`font-mono text-xs uppercase px-6 py-3.5 border-b-2 tracking-wider transition-colors flex items-center gap-2 ${
                activeTab === 'expertise' ? 'border-[#D8FF45] text-[#D8FF45] font-bold' : 'border-transparent text-[#c4c7c7] hover:text-[#e5e2e1]'
              }`}
            >
              <Code2 className="w-4 h-4" /> Expertise Domains ({cmsData.capabilities.length})
            </button>
            <button
              onClick={() => setActiveTab('sectionTags')}
              className={`font-mono text-xs uppercase px-6 py-3.5 border-b-2 tracking-wider transition-colors flex items-center gap-2 ${
                activeTab === 'sectionTags' ? 'border-[#D8FF45] text-[#D8FF45] font-bold' : 'border-transparent text-[#c4c7c7] hover:text-[#e5e2e1]'
              }`}
            >
              <Tag className="w-4 h-4" /> Section Tags &amp; Titles
            </button>
          </div>

          {activeTab === 'hero' && (
            <div className="bg-[#111111] border border-[#292929] p-8 space-y-6">
              <h2 className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest font-bold">// EDIT HERO &amp; CORE STACK</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-2 font-bold">
                    Developer / Logo Name (Updates Navbar &amp; Footer Logo)
                  </label>
                  <input
                    type="text"
                    value={cmsData.hero.name}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, name: e.target.value } })}
                    className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-2 font-bold">Title / Role Badge</label>
                  <input
                    type="text"
                    value={cmsData.hero.title}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, title: e.target.value } })}
                    className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                  />
                </div>
              </div>

              <div className="border-t border-[#292929] pt-6">
                <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-2 font-bold">
                  Core Stack Ticker Items (Type Commas freely to separate tags)
                </label>
                <input
                  type="text"
                  value={rawTicker}
                  onChange={(e) => setRawTicker(e.target.value)}
                  placeholder="TYPESCRIPT, REACT, NEXT.JS, NODE.JS, PYTHON, RUST, AWS"
                  className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                />
                <p className="font-mono text-[11px] text-[#8e9192] mt-1.5">
                  Current Parsed Tags: {parseTags(rawTicker).map((t) => `[${t}]`).join(' ')}
                </p>
              </div>

              {/* Theme Toggle Enable / Disable Control */}
              <div className="bg-[#141313] border border-[#292929] p-5 flex items-center justify-between gap-4 border-t border-[#292929]">
                <div>
                  <label className="font-mono text-xs text-[#D8FF45] uppercase font-bold block mb-1">
                    Enable Theme Toggle (Day / Night Button) on Main Website
                  </label>
                  <p className="font-mono text-xs text-[#c4c7c7]">
                    When checked, visitors see the Sun/Moon button on the navbar and can toggle Day & Night mode. Uncheck to lock website in Dark mode.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={cmsData.enableThemeToggle !== false}
                  onChange={(e) => setCmsData({ ...cmsData, enableThemeToggle: e.target.checked })}
                  className="w-5 h-5 accent-[#D8FF45] cursor-pointer shrink-0"
                />
              </div>

              {/* Feature Control: Developer Command Terminal */}
              <div className="bg-[#141313] border border-[#292929] p-5 flex items-center justify-between gap-4">
                <div>
                  <label className="font-mono text-xs text-[#D8FF45] uppercase font-bold block mb-1 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#D8FF45]" /> Enable Interactive Developer Command Terminal (Cmd + K)
                  </label>
                  <p className="font-mono text-xs text-[#c4c7c7]">
                    When checked, visitors can press Cmd+K or click the &quot;Cmd+K&quot; button in the header to launch the interactive terminal CLI.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={cmsData.enableCommandTerminal !== false}
                  onChange={(e) => setCmsData({ ...cmsData, enableCommandTerminal: e.target.checked })}
                  className="w-5 h-5 accent-[#D8FF45] cursor-pointer shrink-0"
                />
              </div>

              {/* Feature Control: Testimonials Section */}
              <div className="bg-[#141313] border border-[#292929] p-5 flex items-center justify-between gap-4">
                <div>
                  <label className="font-mono text-xs text-[#D8FF45] uppercase font-bold block mb-1 flex items-center gap-2">
                    <Quote className="w-4 h-4 text-[#D8FF45]" /> Enable Leadership Endorsements / Testimonials Section
                  </label>
                  <p className="font-mono text-xs text-[#c4c7c7]">
                    When checked, the Endorsements quote carousel is displayed on the main portfolio page.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={cmsData.enableTestimonials !== false}
                  onChange={(e) => setCmsData({ ...cmsData, enableTestimonials: e.target.checked })}
                  className="w-5 h-5 accent-[#D8FF45] cursor-pointer shrink-0"
                />
              </div>

              {/* Feature Control: Tactile Sound Effects */}
              <div className="bg-[#141313] border border-[#292929] p-5 flex items-center justify-between gap-4">
                <div>
                  <label className="font-mono text-xs text-[#D8FF45] uppercase font-bold block mb-1 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#D8FF45]" /> Enable Tactile Sound Effects Engine (with Navbar Mute Button)
                  </label>
                  <p className="font-mono text-xs text-[#c4c7c7]">
                    When checked, visitors hear subtle mechanical click audio feedback on actions, with a Mute/Unmute button in the navbar.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={cmsData.enableSoundEffects !== false}
                  onChange={(e) => setCmsData({ ...cmsData, enableSoundEffects: e.target.checked })}
                  className="w-5 h-5 accent-[#D8FF45] cursor-pointer shrink-0"
                />
              </div>

              {/* Site Maintenance Mode Control Card */}
              <div className="bg-[#171717] border border-[#292929] p-5 space-y-4 border-t border-[#292929]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <label className="font-mono text-xs text-[#D8FF45] uppercase font-bold block mb-1 flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-[#D8FF45]" />
                      Enable Maintenance Mode on Portfolio Website
                    </label>
                    <p className="font-mono text-xs text-[#c4c7c7]">
                      When checked, visitors see a full-screen Maintenance Page without navbar links or footer. You (admin) can still access /admin to edit content.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={cmsData.enableMaintenanceMode || false}
                    onChange={(e) => setCmsData({ ...cmsData, enableMaintenanceMode: e.target.checked })}
                    className="w-5 h-5 accent-[#D8FF45] cursor-pointer shrink-0"
                  />
                </div>

                {cmsData.enableMaintenanceMode && (
                  <div className="pt-3 border-t border-[#292929]">
                    <label className="font-mono text-xs text-[#D8FF45] uppercase font-bold block mb-2">
                      Custom Maintenance Message Shown to Visitors
                    </label>
                    <textarea
                      value={cmsData.maintenanceMessage || ''}
                      onChange={(e) => setCmsData({ ...cmsData, maintenanceMessage: e.target.value })}
                      placeholder="We are currently performing scheduled system maintenance and content updates. Please check back shortly."
                      rows={3}
                      className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none p-3 text-sm font-mono text-[#e5e2e1]"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-[#292929] pt-6">
                <div>
                  <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-2 font-bold">Contact Email Address</label>
                  <input
                    type="email"
                    value={cmsData.hero.contactEmail || ''}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, contactEmail: e.target.value } })}
                    placeholder="hello@yourdomain.com"
                    className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-2 font-bold">GitHub Profile URL</label>
                  <input
                    type="text"
                    value={cmsData.hero.githubUrl || ''}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, githubUrl: e.target.value } })}
                    placeholder="https://github.com/your-username"
                    className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-2 font-bold">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={cmsData.hero.linkedinUrl || ''}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, linkedinUrl: e.target.value } })}
                    placeholder="https://linkedin.com/in/your-username"
                    className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-2 font-bold">Resume PDF Link / Storage URL</label>
                  <input
                    type="text"
                    value={cmsData.hero.resumeUrl || ''}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, resumeUrl: e.target.value } })}
                    placeholder="/resume.pdf or https://your-storage/resume.pdf"
                    className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-2 font-bold">Headline</label>
                <textarea
                  rows={2}
                  value={cmsData.hero.headline}
                  onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, headline: e.target.value } })}
                  className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none p-4 text-sm font-mono text-[#e5e2e1]"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-2 font-bold">Subheadline / Bio Summary</label>
                <textarea
                  rows={3}
                  value={cmsData.hero.subheadline}
                  onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, subheadline: e.target.value } })}
                  className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none p-4 text-sm font-mono text-[#e5e2e1]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-2 font-bold">Experience Years</label>
                  <input
                    type="text"
                    value={cmsData.hero.experienceYears}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, experienceYears: e.target.value } })}
                    className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-2 font-bold">Location</label>
                  <input
                    type="text"
                    value={cmsData.hero.location}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, location: e.target.value } })}
                    className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-2 font-bold">Availability Status</label>
                  <input
                    type="text"
                    value={cmsData.hero.status}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, status: e.target.value } })}
                    className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-[#111111] border border-[#292929] p-8 space-y-6">
              <h2 className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest font-bold">// EDIT ABOUT &amp; ENGINEERING PHILOSOPHY</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-2 font-bold">Headline Title</label>
                  <input
                    type="text"
                    value={cmsData.about?.title || ''}
                    onChange={(e) => setCmsData({ ...cmsData, about: { ...cmsData.about, title: e.target.value } })}
                    placeholder="Curious by Default."
                    className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-2 font-bold">Headline Highlight (Grey Subtitle)</label>
                  <input
                    type="text"
                    value={cmsData.about?.titleHighlight || ''}
                    onChange={(e) => setCmsData({ ...cmsData, about: { ...cmsData.about, titleHighlight: e.target.value } })}
                    placeholder="Obsessed with Building."
                    className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-2 font-bold">Bio Paragraph 1</label>
                <textarea
                  value={cmsData.about?.paragraph1 || ''}
                  onChange={(e) => setCmsData({ ...cmsData, about: { ...cmsData.about, paragraph1: e.target.value } })}
                  placeholder="Software engineering is not just a technical discipline..."
                  rows={3}
                  className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none p-4 text-sm font-body text-[#e5e2e1]"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-2 font-bold">Bio Paragraph 2</label>
                <textarea
                  value={cmsData.about?.paragraph2 || ''}
                  onChange={(e) => setCmsData({ ...cmsData, about: { ...cmsData.about, paragraph2: e.target.value } })}
                  placeholder="My approach is rooted in pragmatism..."
                  rows={3}
                  className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none p-4 text-sm font-body text-[#e5e2e1]"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-2 font-bold">Portrait Photo Link / Storage URL</label>
                <input
                  type="text"
                  value={cmsData.about?.portraitImage || ''}
                  onChange={(e) => setCmsData({ ...cmsData, about: { ...cmsData.about, portraitImage: e.target.value } })}
                  placeholder="https://..."
                  className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                />
              </div>

              <div className="border-t border-[#292929] pt-6">
                <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-2 font-bold">
                  Key Engineering Principles / Highlights (Separate by Commas)
                </label>
                <input
                  type="text"
                  value={rawAboutHighlights}
                  onChange={(e) => setRawAboutHighlights(e.target.value)}
                  placeholder="Strict TypeScript Enforcement, Decoupled Microservices, Zero Layout Shift UI"
                  className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                />
                <p className="font-mono text-[11px] text-[#8e9192] mt-1.5">
                  Current Parsed Highlights: {parseTags(rawAboutHighlights).map((h) => `[${h}]`).join(' ')}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'caseStudy' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111111] p-6 border border-[#292929]">
                <div>
                  <h2 className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest font-bold">// CASE STUDIES MANAGER</h2>
                  <p className="font-body text-xs text-[#c4c7c7] mt-1">
                    Add new case studies and select which Work Experience role they attach to.
                  </p>
                </div>
                <button
                  onClick={handleCreateNewCaseStudy}
                  className="btn-primary font-mono text-xs uppercase px-5 py-3 flex items-center gap-2 font-bold shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add New Case Study
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {caseStudiesList.map((cs) => {
                  const isSelected = cs.id === selectedCaseStudyId;
                  const attachedRole = cmsData.experience.find(
                    (exp) => exp.caseStudy?.id === cs.id || exp.id === cs.id
                  );

                  return (
                    <div
                      key={cs.id}
                      onClick={() => {
                        setSelectedCaseStudyId(cs.id);
                        setRawCaseStack(cs.techStack ? cs.techStack.join(', ') : '');
                      }}
                      className={`p-5 border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#1c1b1b] border-[#D8FF45]'
                          : 'bg-[#111111] border-[#292929] hover:border-[#444748]'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center gap-2 mb-2">
                          <span className="font-mono text-[11px] text-[#D8FF45] font-bold uppercase">
                            {cs.year || '2025'} // {cs.platform || 'Platform'}
                          </span>
                          {isSelected && (
                            <span className="font-mono text-[10px] bg-[#D8FF45] text-[#0A0A0A] font-bold px-2 py-0.5 uppercase">
                              Active Editor
                            </span>
                          )}
                        </div>
                        <h4 className="font-display font-bold text-base text-[#e5e2e1] mb-1 line-clamp-1">
                          {cs.title}
                        </h4>
                        <p className="font-body text-xs text-[#c4c7c7] line-clamp-2 mb-3">
                          {cs.subtitle}
                        </p>
                      </div>

                      <div className="border-t border-[#292929] pt-3 flex items-center justify-between text-[11px] font-mono text-[#8e9192]">
                        <span>{attachedRole ? `Attached: ${attachedRole.company}` : 'Unattached'}</span>
                        <Edit3 className="w-3.5 h-3.5 text-[#D8FF45]" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {currentCaseStudy && (
                <div className="bg-[#111111] border border-[#292929] p-8 space-y-6">
                  
                  <div className="flex justify-between items-center border-b border-[#292929] pb-4">
                    <span className="font-mono text-xs text-[#D8FF45] font-bold uppercase">
                      EDITING: {currentCaseStudy.title}
                    </span>
                    {caseStudiesList.length > 1 && (
                      <button
                        onClick={() => handleDeleteCaseStudy(currentCaseStudy.id)}
                        className="text-[#ff5f56] hover:text-[#ffb4ab] flex items-center gap-1 font-mono text-xs"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Case Study
                      </button>
                    )}
                  </div>

                  <div className="bg-[#141313] border border-[#D8FF45]/40 p-4">
                    <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-2 font-bold flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" /> ATTACH THIS CASE STUDY TO WORK EXPERIENCE ROLE:
                    </label>
                    <select
                      className="w-full bg-[#1c1b1b] border border-[#292929] text-[#e5e2e1] font-mono text-sm px-4 py-3 focus:border-[#D8FF45] outline-none"
                      onChange={(e) => {
                        const expId = e.target.value;
                        if (expId) {
                          handleAssignCaseStudyToExperience(expId, currentCaseStudy);
                        }
                      }}
                    >
                      <option value="">-- Select Work Experience Role --</option>
                      {cmsData.experience.map((exp) => (
                        <option key={exp.id} value={exp.id}>
                          {exp.company} — {exp.role} ({exp.period})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-2 font-bold">Case Study Title</label>
                      <input
                        type="text"
                        value={currentCaseStudy.title}
                        onChange={(e) => {
                          const updated = caseStudiesList.map((cs) =>
                            cs.id === currentCaseStudy.id ? { ...cs, title: e.target.value } : cs
                          );
                          setCaseStudiesList(updated);
                        }}
                        className="w-full bg-[#141313] border border-[#292929] px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-2 font-bold">Year &amp; Platform</label>
                      <input
                        type="text"
                        value={currentCaseStudy.year + ' — ' + currentCaseStudy.platform}
                        onChange={(e) => {
                          const [yr, ...plat] = e.target.value.split('—');
                          const updated = caseStudiesList.map((cs) =>
                            cs.id === currentCaseStudy.id
                              ? {
                                  ...cs,
                                  year: yr ? yr.trim() : '2025',
                                  platform: plat.join('—').trim() || 'Web App'
                                }
                              : cs
                          );
                          setCaseStudiesList(updated);
                        }}
                        className="w-full bg-[#141313] border border-[#292929] px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-2 font-bold">
                      Tech Stack Tags (Full Comma Support Enabled)
                    </label>
                    <input
                      type="text"
                      value={rawCaseStack}
                      onChange={(e) => setRawCaseStack(e.target.value)}
                      placeholder="Next.js 15, Node.js, AWS ECS, GraphQL, Redis"
                      className="w-full bg-[#141313] border border-[#292929] px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                    />
                    <p className="font-mono text-[11px] text-[#8e9192] mt-1.5">
                      Parsed Tags: {parseTags(rawCaseStack).map((t) => `[${t}]`).join(' ')}
                    </p>
                  </div>

                  <div>
                    <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-2 font-bold">Subtitle / Summary</label>
                    <textarea
                      rows={2}
                      value={currentCaseStudy.subtitle}
                      onChange={(e) => {
                        const updated = caseStudiesList.map((cs) =>
                          cs.id === currentCaseStudy.id ? { ...cs, subtitle: e.target.value } : cs
                        );
                        setCaseStudiesList(updated);
                      }}
                      className="w-full bg-[#141313] border border-[#292929] p-4 text-sm font-mono text-[#e5e2e1]"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-2 font-bold">System Architecture Overview</label>
                    <textarea
                      rows={4}
                      value={currentCaseStudy.overview}
                      onChange={(e) => {
                        const updated = caseStudiesList.map((cs) =>
                          cs.id === currentCaseStudy.id ? { ...cs, overview: e.target.value } : cs
                        );
                        setCaseStudiesList(updated);
                      }}
                      className="w-full bg-[#141313] border border-[#292929] p-4 text-sm font-mono text-[#e5e2e1]"
                    />
                  </div>

                  {currentCaseStudy.results && (
                    <div className="border-t border-[#292929] pt-6">
                      <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-3 font-bold">
                        Benchmark Metric Results
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentCaseStudy.results.map((res, idx) => (
                          <div key={idx} className="bg-[#141313] border border-[#292929] p-4 flex flex-col gap-2">
                            <span className="font-mono text-[11px] text-[#8e9192]">METRIC #{idx + 1}</span>
                            <input
                              type="text"
                              value={res.metric}
                              onChange={(e) => {
                                const newRes = [...currentCaseStudy.results];
                                newRes[idx].metric = e.target.value;
                                const updated = caseStudiesList.map((cs) =>
                                  cs.id === currentCaseStudy.id ? { ...cs, results: newRes } : cs
                                );
                                setCaseStudiesList(updated);
                              }}
                              placeholder="e.g. 42%"
                              className="bg-[#1c1b1b] border border-[#292929] px-3 py-1.5 font-mono text-xs text-[#e5e2e1]"
                            />
                            <input
                              type="text"
                              value={res.label}
                              onChange={(e) => {
                                const newRes = [...currentCaseStudy.results];
                                newRes[idx].label = e.target.value;
                                const updated = caseStudiesList.map((cs) =>
                                  cs.id === currentCaseStudy.id ? { ...cs, results: newRes } : cs
                                );
                                setCaseStudiesList(updated);
                              }}
                              placeholder="e.g. Faster API Response"
                              className="bg-[#1c1b1b] border border-[#292929] px-3 py-1.5 font-mono text-xs text-[#c4c7c7]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-[#111111] p-6 border border-[#292929]">
                <div>
                  <h2 className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest font-bold">// CERTIFICATES &amp; CREDENTIALS</h2>
                  <p className="font-body text-xs text-[#c4c7c7] mt-1">Manage verified industry accreditations displayed on the portfolio.</p>
                </div>
                <button
                  onClick={handleAddCertificate}
                  className="btn-primary font-mono text-xs uppercase px-5 py-2.5 flex items-center gap-2 font-bold"
                >
                  <Plus className="w-4 h-4" /> Add Certificate
                </button>
              </div>

              <div className="space-y-6">
                {cmsData.certificates.map((cert, index) => (
                  <div key={cert.id} className="bg-[#111111] border border-[#292929] p-6 relative">
                    <div className="flex justify-between items-center border-b border-[#292929] pb-4 mb-4">
                      <span className="font-mono text-xs text-[#D8FF45] font-bold">CERTIFICATE #{index + 1}</span>
                      <button
                        onClick={() => handleDeleteCertificate(cert.id)}
                        className="text-[#ff5f56] hover:text-[#ffb4ab] flex items-center gap-1 font-mono text-xs"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-1">Title</label>
                        <input
                          type="text"
                          value={cert.title}
                          onChange={(e) => {
                            const updated = [...cmsData.certificates];
                            updated[index].title = e.target.value;
                            setCmsData({ ...cmsData, certificates: updated });
                          }}
                          className="w-full bg-[#141313] border border-[#292929] px-3 py-2 text-xs font-mono text-[#e5e2e1]"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-1">Issuer</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const updated = [...cmsData.certificates];
                            updated[index].issuer = e.target.value;
                            setCmsData({ ...cmsData, certificates: updated });
                          }}
                          className="w-full bg-[#141313] border border-[#292929] px-3 py-2 text-xs font-mono text-[#e5e2e1]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-1">Date</label>
                        <input
                          type="text"
                          value={cert.date}
                          onChange={(e) => {
                            const updated = [...cmsData.certificates];
                            updated[index].date = e.target.value;
                            setCmsData({ ...cmsData, certificates: updated });
                          }}
                          className="w-full bg-[#141313] border border-[#292929] px-3 py-2 text-xs font-mono text-[#e5e2e1]"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-1">Credential ID</label>
                        <input
                          type="text"
                          value={cert.credentialId || ''}
                          onChange={(e) => {
                            const updated = [...cmsData.certificates];
                            updated[index].credentialId = e.target.value;
                            setCmsData({ ...cmsData, certificates: updated });
                          }}
                          className="w-full bg-[#141313] border border-[#292929] px-3 py-2 text-xs font-mono text-[#e5e2e1]"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-1">Verification URL</label>
                        <input
                          type="text"
                          value={cert.verificationUrl || ''}
                          onChange={(e) => {
                            const updated = [...cmsData.certificates];
                            updated[index].verificationUrl = e.target.value;
                            setCmsData({ ...cmsData, certificates: updated });
                          }}
                          className="w-full bg-[#141313] border border-[#292929] px-3 py-2 text-xs font-mono text-[#e5e2e1]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-1">Skill Tags (Comma Separated)</label>
                      <input
                        type="text"
                        defaultValue={cert.skills.join(', ')}
                        onBlur={(e) => {
                          const updated = [...cmsData.certificates];
                          updated[index].skills = parseTags(e.target.value);
                          setCmsData({ ...cmsData, certificates: updated });
                        }}
                        className="w-full bg-[#141313] border border-[#292929] px-3 py-2 text-xs font-mono text-[#e5e2e1]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6">
              
              {/* Custom Tech Stack Filter Pills Editor */}
              <div className="bg-[#111111] border border-[#292929] p-6 space-y-4">
                <div className="flex items-center gap-2 font-mono text-xs text-[#D8FF45] font-bold">
                  <Filter className="w-4 h-4" />
                  <span>CUSTOM WORK EXPERIENCE TECH FILTERS</span>
                </div>
                <p className="font-body text-xs text-[#c4c7c7]">
                  Customize the tech filter pills displayed at the top of your Work Experience section (separate tags with commas). &quot;ALL&quot; option is included automatically.
                </p>
                <input
                  type="text"
                  value={rawWorkFilters}
                  onChange={(e) => setRawWorkFilters(e.target.value)}
                  placeholder="ALL, TypeScript, Next.js, React, Node.js, Python, Rust, PostgreSQL, AWS, Docker, GraphQL"
                  className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                />
                <p className="font-mono text-[11px] text-[#8e9192]">
                  Active Filter Pills Preview: {parseTags(rawWorkFilters).map((f) => `[${f}]`).join(' ')}
                </p>
              </div>

              <div className="flex justify-between items-center bg-[#111111] p-6 border border-[#292929]">
                <div>
                  <h2 className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest font-bold">// CAREER TIMELINE &amp; ROLES</h2>
                  <p className="font-body text-xs text-[#c4c7c7] mt-1">Manage positions, leadership roles, and company details.</p>
                </div>
                <button
                  onClick={handleAddExperience}
                  className="btn-primary font-mono text-xs uppercase px-5 py-2.5 flex items-center gap-2 font-bold"
                >
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>

              <div className="space-y-6">
                {cmsData.experience.map((exp, index) => (
                  <div key={exp.id} className="bg-[#111111] border border-[#292929] p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-[#292929] pb-4">
                      <span className="font-mono text-xs text-[#D8FF45] font-bold">ROLE #{index + 1}</span>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-[#ff5f56] hover:text-[#ffb4ab] flex items-center gap-1 font-mono text-xs"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-1">Role Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...cmsData.experience];
                            updated[index].role = e.target.value;
                            setCmsData({ ...cmsData, experience: updated });
                          }}
                          className="w-full bg-[#141313] border border-[#292929] px-3 py-2 text-xs font-mono text-[#e5e2e1]"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...cmsData.experience];
                            updated[index].company = e.target.value;
                            setCmsData({ ...cmsData, experience: updated });
                          }}
                          className="w-full bg-[#141313] border border-[#292929] px-3 py-2 text-xs font-mono text-[#e5e2e1]"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-1">Period</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => {
                            const updated = [...cmsData.experience];
                            updated[index].period = e.target.value;
                            setCmsData({ ...cmsData, experience: updated });
                          }}
                          className="w-full bg-[#141313] border border-[#292929] px-3 py-2 text-xs font-mono text-[#e5e2e1]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...cmsData.experience];
                          updated[index].description = e.target.value;
                          setCmsData({ ...cmsData, experience: updated });
                        }}
                        className="w-full bg-[#141313] border border-[#292929] p-3 text-xs font-mono text-[#e5e2e1]"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-1">Role Skill Tags (Comma Separated)</label>
                      <input
                        type="text"
                        defaultValue={exp.skills.join(', ')}
                        onBlur={(e) => {
                          const updated = [...cmsData.experience];
                          updated[index].skills = parseTags(e.target.value);
                          setCmsData({ ...cmsData, experience: updated });
                        }}
                        className="w-full bg-[#141313] border border-[#292929] px-3 py-2 text-xs font-mono text-[#e5e2e1]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-[#111111] p-6 border border-[#292929]">
                <div>
                  <h2 className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest font-bold">// LEADERSHIP ENDORSEMENTS &amp; RECOMMENDATIONS</h2>
                  <p className="font-body text-xs text-[#c4c7c7] mt-1">Manage testimonials from CTOs, Tech Leads, and Clients.</p>
                </div>
                <button
                  onClick={handleAddTestimonial}
                  className="btn-primary font-mono text-xs uppercase px-5 py-2.5 flex items-center gap-2 font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Recommendation
                </button>
              </div>

              <div className="space-y-6">
                {(cmsData.testimonials || []).map((t, index) => (
                  <div key={t.id} className="bg-[#111111] border border-[#292929] p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-[#292929] pb-3">
                      <span className="font-mono text-xs text-[#D8FF45] font-bold">ENDORSEMENT #{index + 1}</span>
                      <button
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="text-[#ff5f56] hover:text-[#ffb4ab] flex items-center gap-1 font-mono text-xs cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-1">Author Name</label>
                        <input
                          type="text"
                          value={t.name}
                          onChange={(e) => {
                            const updated = [...(cmsData.testimonials || [])];
                            updated[index].name = e.target.value;
                            setCmsData({ ...cmsData, testimonials: updated });
                          }}
                          className="w-full bg-[#141313] border border-[#292929] px-3 py-2 text-xs font-mono text-[#e5e2e1]"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-1">Job Role / Title</label>
                        <input
                          type="text"
                          value={t.role}
                          onChange={(e) => {
                            const updated = [...(cmsData.testimonials || [])];
                            updated[index].role = e.target.value;
                            setCmsData({ ...cmsData, testimonials: updated });
                          }}
                          className="w-full bg-[#141313] border border-[#292929] px-3 py-2 text-xs font-mono text-[#e5e2e1]"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-1">Company / Organization</label>
                        <input
                          type="text"
                          value={t.company}
                          onChange={(e) => {
                            const updated = [...(cmsData.testimonials || [])];
                            updated[index].company = e.target.value;
                            setCmsData({ ...cmsData, testimonials: updated });
                          }}
                          className="w-full bg-[#141313] border border-[#292929] px-3 py-2 text-xs font-mono text-[#e5e2e1]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-1">Relationship / Verification Tag</label>
                      <input
                        type="text"
                        value={t.relationship || ''}
                        onChange={(e) => {
                          const updated = [...(cmsData.testimonials || [])];
                          updated[index].relationship = e.target.value;
                          setCmsData({ ...cmsData, testimonials: updated });
                        }}
                        placeholder="e.g. Managed Sougata directly or Client"
                        className="w-full bg-[#141313] border border-[#292929] px-3 py-2 text-xs font-mono text-[#e5e2e1]"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-1 font-bold">Endorsement Quote Copy</label>
                      <textarea
                        rows={3}
                        value={t.quote}
                        onChange={(e) => {
                          const updated = [...(cmsData.testimonials || [])];
                          updated[index].quote = e.target.value;
                          setCmsData({ ...cmsData, testimonials: updated });
                        }}
                        className="w-full bg-[#141313] border border-[#292929] p-3 text-xs font-body text-[#e5e2e1]"
                      />
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'expertise' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-[#111111] p-6 border border-[#292929]">
                <div>
                  <h2 className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest font-bold">// EXPERTISE DOMAINS</h2>
                  <p className="font-body text-xs text-[#c4c7c7] mt-1">Manage technical capabilities, stack tags, and architecture code reference snippets.</p>
                </div>
                <button
                  onClick={handleAddExpertise}
                  className="btn-primary font-mono text-xs uppercase px-5 py-2.5 flex items-center gap-2 font-bold"
                >
                  <Plus className="w-4 h-4" /> Add Domain
                </button>
              </div>

              <div className="space-y-6">
                {cmsData.capabilities.map((cap, index) => (
                  <div key={cap.id} className="bg-[#111111] border border-[#292929] p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-[#292929] pb-3">
                      <span className="font-mono text-xs text-[#D8FF45] font-bold">DOMAIN #{index + 1}</span>
                      <button
                        onClick={() => handleDeleteExpertise(cap.id)}
                        className="text-[#ff5f56] hover:text-[#ffb4ab] flex items-center gap-1 font-mono text-xs"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>

                    <div>
                      <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-1">Category Title</label>
                      <input
                        type="text"
                        value={cap.category}
                        onChange={(e) => {
                          const updated = [...cmsData.capabilities];
                          updated[index].category = e.target.value;
                          setCmsData({ ...cmsData, capabilities: updated });
                        }}
                        className="w-full bg-[#141313] border border-[#292929] px-3 py-2 text-xs font-mono text-[#e5e2e1]"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-1">Tech Stack Tags (Comma Separated)</label>
                      <input
                        type="text"
                        defaultValue={cap.techTags.join(', ')}
                        onBlur={(e) => {
                          const updated = [...cmsData.capabilities];
                          updated[index].techTags = parseTags(e.target.value);
                          setCmsData({ ...cmsData, capabilities: updated });
                        }}
                        className="w-full bg-[#141313] border border-[#292929] px-3 py-2 text-xs font-mono text-[#e5e2e1]"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={cap.description}
                        onChange={(e) => {
                          const updated = [...cmsData.capabilities];
                          updated[index].description = e.target.value;
                          setCmsData({ ...cmsData, capabilities: updated });
                        }}
                        className="w-full bg-[#141313] border border-[#292929] p-3 text-xs font-mono text-[#e5e2e1]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sectionTags' && (
            <div className="bg-[#111111] border border-[#292929] p-8 space-y-6">
              <h2 className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest font-bold">// EDIT SECTION HEADER TAGS &amp; TITLES</h2>
              <p className="font-mono text-xs text-[#c4c7c7] leading-relaxed">
                Customize the code-style section header tags displayed on your portfolio website (e.g. <span className="text-[#D8FF45]">// 01_WORK_&amp;_CASE_STUDIES</span>).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-2 font-bold">
                    01. Work Experience Section Tag
                  </label>
                  <input
                    type="text"
                    value={cmsData.sectionTags?.work || '// 01_WORK_&_CASE_STUDIES'}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        sectionTags: {
                          work: e.target.value,
                          certificates: cmsData.sectionTags?.certificates || '// 02_VERIFIED_CERTIFICATES',
                          capabilities: cmsData.sectionTags?.capabilities || '// 03_CAPABILITIES_&_SYSTEMS',
                          contact: cmsData.sectionTags?.contact || '// 04_GET_IN_TOUCH'
                        }
                      })
                    }
                    placeholder="// 01_WORK_&_CASE_STUDIES"
                    className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-2 font-bold">
                    02. Certifications Section Tag
                  </label>
                  <input
                    type="text"
                    value={cmsData.sectionTags?.certificates || '// 02_VERIFIED_CERTIFICATES'}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        sectionTags: {
                          work: cmsData.sectionTags?.work || '// 01_WORK_&_CASE_STUDIES',
                          certificates: e.target.value,
                          capabilities: cmsData.sectionTags?.capabilities || '// 03_CAPABILITIES_&_SYSTEMS',
                          contact: cmsData.sectionTags?.contact || '// 04_GET_IN_TOUCH'
                        }
                      })
                    }
                    placeholder="// 02_VERIFIED_CERTIFICATES"
                    className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-2 font-bold">
                    03. Capabilities &amp; Systems Section Tag
                  </label>
                  <input
                    type="text"
                    value={cmsData.sectionTags?.capabilities || '// 03_CAPABILITIES_&_SYSTEMS'}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        sectionTags: {
                          work: cmsData.sectionTags?.work || '// 01_WORK_&_CASE_STUDIES',
                          certificates: cmsData.sectionTags?.certificates || '// 02_VERIFIED_CERTIFICATES',
                          capabilities: e.target.value,
                          contact: cmsData.sectionTags?.contact || '// 04_GET_IN_TOUCH'
                        }
                      })
                    }
                    placeholder="// 03_CAPABILITIES_&_SYSTEMS"
                    className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[#D8FF45] uppercase block mb-2 font-bold">
                    04. Contact Section Tag
                  </label>
                  <input
                    type="text"
                    value={cmsData.sectionTags?.contact || '// 04_GET_IN_TOUCH'}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        sectionTags: {
                          work: cmsData.sectionTags?.work || '// 01_WORK_&_CASE_STUDIES',
                          certificates: cmsData.sectionTags?.certificates || '// 02_VERIFIED_CERTIFICATES',
                          capabilities: cmsData.sectionTags?.capabilities || '// 03_CAPABILITIES_&_SYSTEMS',
                          contact: e.target.value
                        }
                      })
                    }
                    placeholder="// 04_GET_IN_TOUCH"
                    className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3 text-sm font-mono text-[#e5e2e1]"
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer
        developerName={cmsData.hero.name}
        githubUrl={cmsData.hero.githubUrl}
        linkedinUrl={cmsData.hero.linkedinUrl}
      />
    </>
  );
}
