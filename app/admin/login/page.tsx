'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Terminal, Eye, EyeOff } from 'lucide-react';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || 'Invalid login credentials.');
      } else if (data.session) {
        router.push('/admin');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg('Failed to authenticate with Supabase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141313] text-[#e5e2e1] flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-body selection:bg-[#D8FF45] selection:text-[#0A0A0A]">
      
      {/* Subtle Background Accent Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f15_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Header Logo */}
      <div className="relative z-10 flex justify-between items-center max-w-[1440px] mx-auto w-full">
        <Link href="/" className="font-display font-bold text-xl md:text-2xl text-[#e5e2e1] tracking-tighter hover:text-[#D8FF45] transition-colors flex items-center gap-2 uppercase">
          <span className="w-2.5 h-2.5 bg-[#D8FF45] rounded-full pulse-indicator" />
          CMS_PORTAL // ADMIN AUTH
        </Link>
        <span className="font-mono text-xs text-[#D8FF45] uppercase tracking-widest bg-[#1c1b1b] border border-[#292929] px-3.5 py-1.5 hidden sm:flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> SUPABASE AUTH ENFORCED
        </span>
      </div>

      {/* Main Login Form Container */}
      <div className="max-w-md w-full mx-auto my-auto relative z-10 py-12">
        <div className="bg-[#111111] border border-[#292929] p-8 md:p-10 shadow-2xl relative">
          
          <div className="flex items-center gap-2 font-mono text-xs text-[#D8FF45] uppercase tracking-widest mb-2 font-bold">
            <Terminal className="w-4 h-4" /> SECURE ADMIN GATEWAY
          </div>

          <h1 className="font-display font-extrabold text-3xl text-[#e5e2e1] mb-2 uppercase tracking-tight">
            Administrator Sign In
          </h1>
          
          <p className="font-body text-xs text-[#c4c7c7] mb-8 leading-relaxed">
            Enter your Supabase admin email and password to access the CMS management dashboard.
          </p>

          {errorMsg && (
            <div className="p-4 mb-6 bg-[#2a1c1c] border border-[#ff5f56]/50 text-[#ffb4ab] font-mono text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-[#ff5f56]" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-2 font-bold flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D8FF45]" /> Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none px-4 py-3.5 text-sm font-mono text-[#e5e2e1] transition-all"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-[#c4c7c7] uppercase block mb-2 font-bold flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#D8FF45]" /> Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#141313] border border-[#292929] focus:border-[#D8FF45] outline-none pl-4 pr-12 py-3.5 text-sm font-mono text-[#e5e2e1] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#8e9192] hover:text-[#D8FF45] transition-colors p-1.5 focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary font-mono text-xs uppercase py-4 flex items-center justify-center gap-3 font-bold disabled:opacity-50 mt-4"
            >
              {loading ? (
                'AUTHENTICATING SESSION...'
              ) : (
                <>
                  SIGN IN TO CMS DASHBOARD <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#292929] text-center">
            <Link href="/" className="font-mono text-xs text-[#8e9192] hover:text-[#D8FF45] transition-colors inline-flex items-center gap-1.5 uppercase">
              ← Return to Portfolio Main Index
            </Link>
          </div>

        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 text-center font-mono text-xs text-[#8e9192] uppercase pt-6 max-w-[1440px] mx-auto w-full">
        © {new Date().getFullYear()} — MAX 2 AUTHORIZED ADMIN ACCOUNTS ENFORCED VIA SUPABASE
      </div>

    </div>
  );
}
