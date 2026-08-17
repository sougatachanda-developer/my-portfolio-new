'use client';

import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Loader2, Copy, Check } from 'lucide-react';
import { sanitizeInput, validateEmail } from '@/lib/security';

interface ContactSectionProps {
  sectionTag?: string;
  contactEmail?: string;
}

export default function ContactSection({
  sectionTag = '// 04_GET_IN_TOUCH',
  contactEmail = 'hello@sougata.dev'
}: ContactSectionProps = {}) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    if (contactEmail) {
      navigator.clipboard.writeText(contactEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  // Fetch CSRF token on mount
  useEffect(() => {
    fetch('/api/contact')
      .then((res) => res.json())
      .then((data) => {
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
        }
      })
      .catch(() => {
        setCsrfToken('csrf_client_fallback_' + Date.now());
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side sanitization check
    const nameSanitized = sanitizeInput(formData.name);
    const emailSanitized = sanitizeInput(formData.email);
    const messageSanitized = sanitizeInput(formData.message);

    if (!nameSanitized || nameSanitized.length < 2) {
      setStatus('error');
      setStatusMsg('Please enter a valid name (at least 2 characters).');
      return;
    }

    if (!validateEmail(emailSanitized)) {
      setStatus('error');
      setStatusMsg('Please enter a valid email address.');
      return;
    }

    if (!messageSanitized || messageSanitized.length < 10) {
      setStatus('error');
      setStatusMsg('Please describe your project or inquiry in at least 10 characters.');
      return;
    }

    setStatus('submitting');
    setStatusMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameSanitized,
          email: emailSanitized,
          message: messageSanitized,
          csrfToken: csrfToken || 'csrf_default'
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setStatusMsg(data.message);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setStatusMsg(data.message || 'Error submitting message.');
      }
    } catch (err) {
      setStatus('error');
      setStatusMsg('Network error. Please check your connection and try again.');
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#141313] border-b border-[#292929] relative">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-3">
            <h2 className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest sticky top-28 font-bold">
              {sectionTag}
            </h2>
          </div>
          <div className="md:col-span-9">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D8FF45] pulse-indicator" />
              <span className="font-mono text-xs text-[#e5e2e1] uppercase tracking-widest font-bold">
                OPEN TO SELECT FULL-TIME &amp; CONSULTING OPPORTUNITIES
              </span>
            </div>
            <h3 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-[#e5e2e1] uppercase leading-[0.95] tracking-tight mb-8">
              Have a problem worth solving?
            </h3>
            <p className="font-body text-lg md:text-xl text-[#c4c7c7] max-w-2xl">
              Send a secure message below or connect directly via email. All submissions are sanitized and rate-limited for privacy &amp; security.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">

          {/* Left Direct Info & Mailto */}
          <div className="md:col-span-5 flex flex-col gap-8">
            <div className="glass-panel p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-[#D8FF45]">
                  <Mail className="w-6 h-6" />
                  <span className="font-mono text-xs uppercase tracking-wider font-bold">DIRECT EMAIL</span>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="font-mono text-xs text-[#c4c7c7] hover:text-[#D8FF45] border border-[#292929] hover:border-[#D8FF45] px-2.5 py-1 transition-all flex items-center gap-1.5 cursor-pointer bg-[#141313]"
                  title="Copy email address"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#D8FF45]" />
                      <span className="text-[#D8FF45] font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#c4c7c7]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <a
                href={`mailto:${contactEmail}`}
                className="font-display font-extrabold text-2xl md:text-3xl text-[#e5e2e1] hover:text-[#D8FF45] transition-colors break-all"
              >
                {contactEmail}
              </a>
              <p className="font-body text-sm text-[#c4c7c7]">
                Average response time: &lt; 12 hours. Based in Bangalore, India (IST).
              </p>
            </div>

            <div className="bg-[#111111] border border-[#292929] p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 font-mono text-xs text-[#D8FF45]">
                <ShieldCheck className="w-4 h-4" />
                <span>SECURITY ASSURANCE</span>
              </div>
              <p className="font-body text-xs text-[#c4c7c7] leading-relaxed">
                Form inputs are sanitized server-side against Cross-Site Scripting (XSS), SQL Injection, and protected via Double-Submit CSRF tokens and IP rate limiting.
              </p>
            </div>
          </div>

          {/* Right Secure Contact Form */}
          <div className="md:col-span-7 bg-[#111111] border border-[#292929] p-8 md:p-12">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Name Field */}
              <div>
                <label className="font-mono text-xs text-[#c4c7c7] uppercase tracking-wider block mb-2 font-bold">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3.5 text-[#e5e2e1] font-mono text-sm placeholder:text-[#444748] transition-colors"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="font-mono text-xs text-[#c4c7c7] uppercase tracking-wider block mb-2 font-bold">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. sarah@company.com"
                  className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3.5 text-[#e5e2e1] font-mono text-sm placeholder:text-[#444748] transition-colors"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="font-mono text-xs text-[#c4c7c7] uppercase tracking-wider block mb-2 font-bold">
                  Message / Project Details *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your architecture goals, engineering role, or project timeline..."
                  className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none p-4 text-[#e5e2e1] font-mono text-sm placeholder:text-[#444748] transition-colors resize-none"
                />
              </div>

              {/* Status Alert */}
              {statusMsg && (
                <div
                  className={`p-4 border flex items-center gap-3 text-xs font-mono ${status === 'success'
                      ? 'bg-[#1c2a1c] border-[#27c93f] text-[#27c93f]'
                      : 'bg-[#2a1c1c] border-[#ff5f56] text-[#ffb4ab]'
                    }`}
                >
                  {status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                  )}
                  <span>{statusMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary font-mono text-xs uppercase px-8 py-4 flex items-center justify-center gap-3 tracking-widest font-bold disabled:opacity-50 mt-2"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#0A0A0A]" />
                    <span>ENCRYPTING &amp; SENDING...</span>
                  </>
                ) : (
                  <>
                    <span>SEND SECURE MESSAGE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
