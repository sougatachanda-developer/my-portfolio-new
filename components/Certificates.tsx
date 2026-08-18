'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Award, ExternalLink, ShieldCheck, CheckCircle2, X, Eye } from 'lucide-react';
import { CERTIFICATES_DATA } from '@/lib/data';
import { Certificate } from '@/lib/types';

interface CertificatesProps {
  certificates?: Certificate[];
  sectionTag?: string;
}

export default function Certificates({
  certificates = CERTIFICATES_DATA,
  sectionTag = '// 02_VERIFIED_CERTIFICATES'
}: CertificatesProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCert(null);
      }
    };
    if (selectedCert) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert]);

  return (
    <section id="certificates" className="py-24 md:py-32 border-b border-[#292929] bg-[#0E0E0E] relative">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-3">
            <h2 className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest sticky top-28 font-bold">
              {sectionTag}
            </h2>
          </div>
          <div className="md:col-span-9">
            <div className="flex items-center gap-2 mb-3 font-mono text-xs text-[#D8FF45] uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>VERIFIED INDUSTRY CREDENTIALS</span>
            </div>
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#e5e2e1] mb-6">
              Certifications &amp; Accreditations.
            </h3>
            <p className="font-body text-base md:text-lg text-[#c4c7c7] max-w-2xl">
              Click any certificate below to view the verified credential document, credential ID, and official verification links.
            </p>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className="bg-[#141313] border border-[#292929] hover:border-[#D8FF45] p-8 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#1c1b1b] border border-[#292929] group-hover:border-[#D8FF45] text-[#D8FF45] transition-colors">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-[#D8FF45] font-bold uppercase block">
                        {cert.issuer}
                      </span>
                      <span className="font-mono text-xs text-[#8e9192]">ISSUED {cert.date}</span>
                    </div>
                  </div>

                  <span className="font-mono text-xs text-[#c4c7c7] group-hover:text-[#D8FF45] flex items-center gap-1 border border-[#292929] group-hover:border-[#D8FF45] px-2.5 py-1 transition-colors relative z-10 bg-[#141313]">
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-display font-extrabold text-xl md:text-2xl text-[#e5e2e1] group-hover:text-[#D8FF45] transition-colors mb-3">
                  {cert.title}
                </h4>

                {/* Credential ID */}
                {cert.credentialId && (
                  <div className="font-mono text-xs text-[#8e9192] mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D8FF45]" />
                    <span>ID: {cert.credentialId}</span>
                  </div>
                )}

                {/* Verified Skills Tags */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#292929]">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="font-mono text-xs bg-[#1c1b1b] border border-[#292929] px-2.5 py-1 text-[#c4c7c7] group-hover:border-[#D8FF45]/30 group-hover:text-[#e5e2e1] transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Subtly glowing background dot */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#D8FF45]/5 rounded-full blur-xl pointer-events-none group-hover:bg-[#D8FF45]/10 transition-all" />
            </div>
          ))}
        </div>

      </div>

      {/* Certificate Lightbox Preview Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-[#141313]/90 backdrop-blur-xl p-4 md:p-12 overflow-y-auto flex justify-center items-center">
          <div className="bg-[#111111] border border-[#292929] max-w-3xl w-full p-5 sm:p-8 md:p-12 relative my-auto shadow-2xl">
            
            {/* Modal Header with Issuer Badge & Non-Overlapping Close Button */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <span className="font-mono text-xs text-[#D8FF45] uppercase bg-[#1c1b1b] px-3 py-1 border border-[#D8FF45]/30 break-all">
                {selectedCert.issuer} // {selectedCert.date}
              </span>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-2 text-[#c4c7c7] hover:text-[#D8FF45] border border-[#292929] hover:border-[#D8FF45] transition-colors shrink-0 cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="font-display font-extrabold text-xl sm:text-3xl md:text-4xl text-[#e5e2e1] mb-2 leading-tight">
              {selectedCert.title}
            </h3>

            {selectedCert.credentialId && (
              <p className="font-mono text-xs text-[#D8FF45] mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Official Credential ID: {selectedCert.credentialId}
              </p>
            )}

            {/* Certificate Document / Image Preview Box */}
            <div className="bg-[#141313] border border-[#292929] p-4 mb-6 relative aspect-[16/9] w-full overflow-hidden flex items-center justify-center">
              {selectedCert.certificateImage ? (
                <Image
                  src={selectedCert.certificateImage}
                  alt={selectedCert.title}
                  fill
                  className="object-cover contrast-125"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-[#c4c7c7]">
                  <Award className="w-12 h-12 text-[#D8FF45]" />
                  <span className="font-mono text-xs uppercase">Official Digital Badge Certificate</span>
                </div>
              )}
            </div>

            {/* Skills & Action */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-[#292929]">
              <div className="flex flex-wrap gap-2">
                {selectedCert.skills.map((skill) => (
                  <span key={skill} className="font-mono text-xs bg-[#1c1b1b] border border-[#292929] px-2.5 py-1 text-[#e5e2e1]">
                    {skill}
                  </span>
                ))}
              </div>

              {selectedCert.verificationUrl && (
                <a
                  href={selectedCert.verificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary font-mono text-xs uppercase px-6 py-3 flex items-center gap-2 font-bold shrink-0"
                >
                  Verify Online <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
