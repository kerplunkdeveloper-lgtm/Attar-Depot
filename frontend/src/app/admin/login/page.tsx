'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch } from '@/store';
import { setCredentials } from '@/store/authSlice';
import api from '@/lib/api';
import Image from 'next/image';
import { toast } from '@/lib/toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated as master admin, immediately redirect to dashboard
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('attar_token');
      const userStr = localStorage.getItem('attar_user');
      if (token && userStr) {
        try {
          const u = JSON.parse(userStr);
          if (u?.role === 'admin') {
            window.location.href = '/admin/dashboard';
          }
        } catch (e) {
          // Ignore invalid parse
        }
      }
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/admin-login', { email, password });
      dispatch(setCredentials({ user: data.user, token: data.token }));

      // Save toast to show immediately upon dashboard mount
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'attar_pending_toast',
          JSON.stringify({
            type: 'success',
            message: `Welcome back, ${data.user?.name || 'Administrator'}! Signed in successfully.`,
            options: {
              title: 'Admin Login Successful',
            },
          })
        );
      }

      // Instant hard redirect to dashboard to prevent router transition lag
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Access Denied: Invalid administrator credentials.';
      setError(errorMessage);
      toast.error(errorMessage, {
        title: 'Login Failed',
      });
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#022D24',
        backgroundImage: 'radial-gradient(ellipse at top, #064E3E 0%, #022D24 55%, #011E18 100%)',
      }}
      className="min-h-screen w-full flex flex-col justify-between items-center text-slate-800 font-poppins antialiased selection:bg-amber-400 selection:text-emerald-950 relative overflow-hidden p-4 sm:p-6 lg:p-8"
    >
      {/* Ambient luxury glows */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Luxury Authentication Card */}
      <main className="w-full max-w-md my-auto py-6 sm:py-8 relative z-10 space-y-6">
        {/* Official Brand Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center group">
            <Image
              src="/images/logo.png"
              alt="The Attar Depot"
              width={260}
              height={160}
              priority
              className="h-24 sm:h-28 lg:h-32 w-auto object-contain drop-shadow-[0_6px_25px_rgba(201,162,39,0.45)] group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
            />
          </Link>
        </div>

        {/* Master Glass Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-emerald-900/15 shadow-[0_20px_50px_rgba(0,0,0,0.35)] relative overflow-hidden transition-all duration-300">
          {/* Top Multi-Color Royal Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-500 to-amber-300" />

          <div className="mb-6 text-center space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-[#022D24] tracking-tight">
             Admin Sign In
            </h2>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4 sm:space-y-4.5" autoComplete="off">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-950">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@attardepot.com"
                  className="w-full rounded-2xl pl-11 pr-4 py-3 text-xs bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium shadow-2xs"
                />
                <div className="w-7 h-7 rounded-lg flex items-center justify-center absolute left-2.5 top-2.5 bg-neutral-100 text-neutral-700">
                  <Mail className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-950">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl pl-11 pr-11 py-3 text-xs bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium shadow-2xs"
                />
                <div className="w-7 h-7 rounded-lg flex items-center justify-center absolute left-2.5 top-2.5 bg-neutral-100 text-neutral-700">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-800 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 text-slate-50 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 shadow-xl shadow-emerald-900/20 active:scale-[0.99] transition-all disabled:opacity-50 mt-4 group border border-emerald-500/30 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing Master Administrator...</span>
                </div>
              ) : (
                <>
                  <span>Enter Admin Portal</span>
                  <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security Note Badge */}
          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-[10px] text-neutral-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Encrypted sovereign administrator protocol</span>
          </div>
        </div>
      </main>

      {/* Bottom Footer Agency Credit Badge */}
      <footer className="w-full max-w-5xl flex items-center justify-center pb-1 sm:pb-2 relative z-10">
        <div className="rounded-2xl px-4 py-2 border border-[#0C4E40] bg-[#02241D]/90 shadow-md flex items-center gap-2.5 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="text-[11px] font-medium tracking-wide text-emerald-100 select-none">
            Developed By{' '}
            <span className="font-bold tracking-wider font-poppins text-amber-300">
              Kerplunk Media
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
}
