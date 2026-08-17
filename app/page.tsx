'use client';

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowIBuild from "@/components/HowIBuild";
import Certificates from "@/components/Certificates";
import WorkExperience from "@/components/WorkExperience";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import MaintenancePage from "@/components/MaintenancePage";
import CommandTerminal from "@/components/CommandTerminal";
import { INITIAL_CMS_DATA } from "@/lib/data";
import { CMSData } from "@/lib/types";

export default function Home() {
  const [cmsData, setCmsData] = useState<CMSData>(INITIAL_CMS_DATA);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Safely load CMS data dynamically if available
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
          setCmsData(resData.data);
        }
      })
      .catch(() => {
        // Silent fallback to INITIAL_CMS_DATA
      });
  }, []);

  // Global Cmd+K / Ctrl+K hotkey to open Developer Terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        if (cmsData.enableCommandTerminal !== false) {
          e.preventDefault();
          setIsTerminalOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cmsData.enableCommandTerminal]);

  // Render standalone Maintenance Page if Maintenance Mode is enabled in CMS
  if (cmsData.enableMaintenanceMode) {
    return (
      <MaintenancePage
        developerName={cmsData.hero.name}
        maintenanceMessage={cmsData.maintenanceMessage}
      />
    );
  }

  return (
    <>
      {/* Header Navigation */}
      <Navbar
        developerName={cmsData.hero.name}
        githubUrl={cmsData.hero.githubUrl}
        linkedinUrl={cmsData.hero.linkedinUrl}
        enableThemeToggle={cmsData.enableThemeToggle ?? true}
        enableCommandTerminal={cmsData.enableCommandTerminal ?? true}
        enableSoundEffects={cmsData.enableSoundEffects ?? true}
        onOpenTerminal={() => setIsTerminalOpen(true)}
      />

      {/* Hero & Identity Section */}
      <HeroSection heroData={cmsData.hero} />

      {/* Career Timeline & Interactive Case Studies */}
      <WorkExperience
        experience={cmsData.experience}
        sectionTag={cmsData.sectionTags?.work}
        customWorkFilters={cmsData.customWorkFilters}
      />

      {/* Verified Certificates & Credentials */}
      <Certificates
        certificates={cmsData.certificates}
        sectionTag={cmsData.sectionTags?.certificates}
      />

      {/* Capabilities & Tech Matrix */}
      <HowIBuild
        capabilities={cmsData.capabilities}
        sectionTag={cmsData.sectionTags?.capabilities}
      />

      {/* Editorial Bio & Engineering Philosophy */}
      <AboutSection
        aboutData={cmsData.about}
        sectionTag={cmsData.sectionTags?.about}
      />

      {/* Testimonials & Leadership Endorsements */}
      {cmsData.enableTestimonials !== false && (
        <TestimonialsSection
          testimonials={cmsData.testimonials}
        />
      )}

      {/* Secure Contact Form & Direct Links */}
      <ContactSection
        sectionTag={cmsData.sectionTags?.contact}
        contactEmail={cmsData.hero.contactEmail}
      />

      {/* Dynamic Footer */}
      <Footer
        developerName={cmsData.hero.name}
        githubUrl={cmsData.hero.githubUrl}
        linkedinUrl={cmsData.hero.linkedinUrl}
      />

      {/* Interactive Developer Command Terminal */}
      {cmsData.enableCommandTerminal !== false && (
        <CommandTerminal
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
          cmsData={cmsData}
        />
      )}
    </>
  );
}
