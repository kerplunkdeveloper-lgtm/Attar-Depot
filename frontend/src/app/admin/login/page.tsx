'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  Package,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { useAppDispatch } from '@/store';
import { setCredentials } from '@/store/authSlice';
import api from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/admin-login', { email, password });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Access Denied: Invalid administrator credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF8F2] font-sans antialiased">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDE: Luxury Visual & Brand Heritage Showcase (Desktop lg+)       */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative bg-neutral-900 overflow-hidden flex-col justify-between p-12 xl:p-16 text-white min-h-screen">
        {/* Background Perfume Flacon Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=85&w=1600"
            alt="Attar Depot Royal Reserve Flacon"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          />
          {/* Deep Royal Emerald & Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#012620]/95 via-[#023F36]/80 to-[#046A5A]/55" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#012620]/40 to-[#012620]/90 pointer-events-none" />
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Brand Header in Cormorant Garamond */}
        <div className="relative z-10 space-y-2">
          <Link href="/" className="inline-block group">
            <span className="font-serif text-2xl xl:text-3xl font-bold tracking-[0.22em] text-white uppercase block drop-shadow-md">
              Attar Depot
            </span>
            <span className="text-[10px] tracking-[0.35em] text-emerald-200 font-sans font-medium uppercase block -mt-0.5">
              Pure Essence of Royalty
            </span>
          </Link>
        </div>

        {/* Center: Prestige Glass Card with Key Highlights */}
        <div className="relative z-10 max-w-xl my-auto space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E3BE63] font-sans">
              <Sparkles className="w-4 h-4 text-[#E3BE63]" />
              <span>Administrative Command & Control</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
              Guardians of the Royal Fragrance Vault
            </h2>
            <p className="text-xs xl:text-sm text-emerald-100/90 leading-relaxed font-sans font-light">
              Real-time oversight for rare oudh allocations, master distillation inventories,
              dynamic collections, and royal client consignments worldwide.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1 hover:bg-white/15 transition-all">
              <Package className="w-5 h-5 text-emerald-300 mb-1.5" />
              <p className="text-xs font-bold text-white">Live Flacon Stock</p>
              <p className="text-[10px] text-emerald-100/70">Inventory & tola pricing controls</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1 hover:bg-white/15 transition-all">
              <Layers className="w-5 h-5 text-emerald-300 mb-1.5" />
              <p className="text-xs font-bold text-white">Dynamic Families</p>
              <p className="text-[10px] text-emerald-100/70">Categories, notes & sillage tags</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1 hover:bg-white/15 transition-all">
              <ShoppingBag className="w-5 h-5 text-emerald-300 mb-1.5" />
              <p className="text-xs font-bold text-white">Dispatch Ledger</p>
              <p className="text-[10px] text-emerald-100/70">Instant order tracking & fulfillment</p>
            </div>
          </div>
        </div>

        {/* Bottom: Security Verification Stamp */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-200/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL End-to-End Encryption</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-300/60">SYSTEM v2.6.4</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RIGHT SIDE: Form Terminal (Full width mobile, 50% / 5/12 on desktop)   */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 xl:w-5/12 min-h-screen flex items-center justify-center p-6 sm:p-10 xl:p-14 bg-[#F4FAF6] relative overflow-hidden">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-emerald-300/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />

        {/* Form Container */}
        <div className="max-w-md w-full relative z-10 space-y-6 sm:space-y-7">
          {/* Mobile Top Brand Bar (Visible only on < lg screens) */}
          <div className="lg:hidden text-center space-y-2 pb-2">
            <Link href="/" className="inline-block">
              <span className="font-poppins text-2xl font-bold tracking-[0.18em] text-emerald-gradient uppercase">
                Attar Depot
              </span>
              <span className="text-[9px] tracking-[0.3em] text-emerald-800 uppercase block font-medium">
                Pure Essence of Royalty
              </span>
            </Link>
          </div>

          {/* Form Card Header */}
          <div className="text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-[11px] font-bold text-emerald-900 uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Restricted Merchant Portal</span>
            </div>

            <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight uppercase">
              Admin Command
            </h1>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-emerald-100/90 shadow-emerald-lg space-y-5 font-sans">

            {/* Error Notification Banner */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Administrator Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@attardepot.com"
                    className="w-full bg-white border border-neutral-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium placeholder-neutral-400"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Master Passphrase
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-neutral-200 rounded-2xl pl-10 pr-10 py-3 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium placeholder-neutral-400"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600"
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
                className="w-full btn-emerald py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-emerald-md hover:scale-[1.01] active:scale-[0.99] transition-all text-white mt-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authorizing Administrator...</span>
                ) : (
                  <>
                    <span>Enter Admin Command Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Links & Navigation */}
            <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
              <Link
                href="/"
                className="text-xs text-neutral-500 hover:text-emerald-700 transition-colors font-medium inline-flex items-center gap-1"
              >
                <span>← Return to Public Store</span>
              </Link>

              <span className="text-[11px] text-neutral-400">
                Staff Help Desk:{' '}
                <a
                  href="mailto:support@attardepot.com"
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  Contact IT
                </a>
              </span>
            </div>
          </div>

          {/* Developed by Kerplunk Media with Animated Color Blinking Border */}
          <div className="flex items-center justify-center pt-1">
            <div className="border-glow-blink border-2 rounded-2xl px-4 py-2 bg-white/95 backdrop-blur-md transition-all duration-300 flex items-center gap-2.5 shadow-xs hover:scale-105 cursor-default">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-glow-dot shadow-xs" />
              <span className="text-[11px] font-medium text-neutral-600 tracking-wide select-none">
                Developed by{' '}
                <span className="font-bold text-neutral-900 tracking-wider font-poppins">
                  Kerplunk Media
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
