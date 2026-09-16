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
  ArrowLeft,
  Crown,
  KeyRound,
  Sun,
  Moon,
  Sparkle,
  Flame,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useAppDispatch } from '@/store';
import { setCredentials } from '@/store/authSlice';
import api from '@/lib/api';
import AttarDepotLogo from '@/components/common/AttarDepotLogo';
import { useAdminTheme } from '@/context/AdminThemeContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useAdminTheme();
  const isLight = theme === 'light';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

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

  const handleQuickAutoFill = () => {
    setEmail('admin@attardepot.com');
    setPassword('Admin@123');
    setError('');
    setIsAutoFilled(true);
    setTimeout(() => setIsAutoFilled(false), 2500);
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col lg:flex-row ${
        isLight
          ? 'bg-gradient-to-br from-[#F0FDF4] via-[#F5FAF7] to-[#E5F3EB] text-slate-800'
          : 'bg-gradient-to-br from-[#021813] via-[#01120E] to-[#010907] text-white'
      } font-poppins antialiased selection:bg-emerald-500 selection:text-white relative overflow-hidden transition-colors duration-500`}
    >
      {/* Dynamic Ambient Glows */}
      <div
        className={`fixed -top-24 -left-24 w-[550px] h-[550px] rounded-full blur-[150px] pointer-events-none transition-opacity duration-500 ${
          isLight ? 'bg-emerald-400/25 opacity-70' : 'bg-emerald-500/20 opacity-100'
        }`}
      />
      <div
        className={`fixed bottom-0 right-0 w-[550px] h-[550px] rounded-full blur-[160px] pointer-events-none transition-opacity duration-500 ${
          isLight ? 'bg-amber-400/20 opacity-60' : 'bg-amber-500/15 opacity-100'
        }`}
      />
      <div
        className={`fixed top-1/2 right-1/4 w-[400px] h-[400px] rounded-full blur-[130px] pointer-events-none transition-opacity duration-500 ${
          isLight ? 'bg-teal-300/15 opacity-50' : 'bg-emerald-600/10 opacity-80'
        }`}
      />

      {/* ========================================================================= */}
      {/* 1. LEFT SIDE: Royal Heritage & Sovereign Atelier Presentation             */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative overflow-hidden flex-col justify-between p-12 xl:p-16 min-h-screen border-r border-[#0B4B3D]/70">
        {/* Background Perfume Flacon Image Showcase */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=85&w=1600"
            alt="Attar Depot Royal Reserve Flacon"
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover object-center scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          />
          {/* Deep Royal Emerald & Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#021D17]/98 via-[#022A21]/85 to-[#044436]/65" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#021D17]/50 to-[#021D17]/95 pointer-events-none" />
        </div>

        {/* Top: Brand Header & Royal Emblem */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#065A49] via-[#044B3D] to-[#022D24] border border-[#238B74] flex items-center justify-center p-2.5 shadow-[0_0_25px_rgba(16,185,129,0.35)] group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300">
              <AttarDepotLogo variant="icon" className="w-full h-full text-white drop-shadow-sm" />
            </div>
            <div>
              <span className="font-serif text-2xl xl:text-3xl font-bold tracking-[0.16em] text-white uppercase block drop-shadow-md group-hover:text-amber-300 transition-colors">
                Attar Depot
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                <span className="text-[10px] tracking-[0.28em] text-amber-300 font-semibold uppercase block">
                  Royal Atelier Backoffice
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Prestige Glass Card with Key Feature Highlights */}
        <div className="relative z-10 max-w-xl my-auto space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-950/90 to-[#032921] border border-amber-400/40 text-[11px] font-bold uppercase tracking-widest text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Crown className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Administrative Command Portal</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md">
              Guardians of the Sovereign Fragrance Vault
            </h2>
            <p className="text-xs xl:text-sm text-emerald-100/90 leading-relaxed font-light">
              Executive command for rare botanical extractions, Kannauj deg-distilled attars,
              real-time catalog taxonomy, and worldwide bespoke client consignments.
            </p>
          </div>

          {/* Feature Highlights 3-Card Grid */}
          <div className="grid grid-cols-3 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#062921]/90 to-[#031B15]/95 backdrop-blur-md border border-[#0F5A49] space-y-1.5 hover:border-amber-400/50 hover:shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-all group">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-2 text-amber-300 group-hover:scale-105 transition-transform">
                <Package className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">Flacon Catalog</p>
              <p className="text-[10px] text-emerald-200/70 leading-snug">
                Tiered pricing & stock allocations
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#062921]/90 to-[#031B15]/95 backdrop-blur-md border border-[#0F5A49] space-y-1.5 hover:border-amber-400/50 hover:shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-all group">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-2 text-emerald-300 group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">Taxonomy Hub</p>
              <p className="text-[10px] text-emerald-200/70 leading-snug">
                Collections, notes & occasions
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#062921]/90 to-[#031B15]/95 backdrop-blur-md border border-[#0F5A49] space-y-1.5 hover:border-amber-400/50 hover:shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-all group">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-2 text-amber-300 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">Dispatch Queue</p>
              <p className="text-[10px] text-emerald-200/70 leading-snug">
                Live consignment fulfillment
              </p>
            </div>
          </div>

          {/* Royal Heritage Signature Quote */}
          <div className="p-4 rounded-2xl bg-[#03231C]/70 border border-[#0D4B3D] text-[11px] text-emerald-200/90 italic flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <span>
              &ldquo;Handcrafted in the heart of Kannauj. Preserved for discerning patrons across the
              world.&rdquo;
            </span>
          </div>
        </div>

        {/* Bottom: Security Verification Stamp */}
        <div className="relative z-10 pt-6 border-t border-[#0B4B3D]/80 flex items-center justify-between text-[11px] text-emerald-200/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">256-Bit SSL Secured Sovereign Terminal</span>
          </div>
          <span className="font-mono text-[10px] text-amber-300/80 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
            VAULT v2.8 • KANNAUJ
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RIGHT SIDE: Executive Authentication Terminal (Fully Responsive)       */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 xl:w-5/12 min-h-screen flex flex-col justify-between p-3.5 sm:p-8 xl:p-14 relative z-10">
        {/* Top Bar Utilities: Return Storefront + Theme Switcher */}
        <div className="flex items-center justify-between gap-3 w-full max-w-md mx-auto pt-2 sm:pt-0">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isLight
                ? 'bg-white/80 hover:bg-white text-emerald-900 border border-emerald-200 shadow-xs'
                : 'bg-[#06241D]/70 hover:bg-[#08352B] text-emerald-200 border border-[#0D4B3D]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </Link>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className={`p-2 rounded-xl border transition-all duration-300 flex items-center gap-2 text-xs font-semibold ${
              isLight
                ? 'bg-white/80 hover:bg-white text-emerald-900 border-emerald-200 shadow-xs'
                : 'bg-[#06241D]/70 hover:bg-[#08352B] text-amber-300 border-[#0D4B3D]'
            }`}
          >
            {isLight ? (
              <>
                <Moon className="w-4 h-4 text-emerald-800" />
                <span className="hidden sm:inline">Dark View</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Light View</span>
              </>
            )}
          </button>
        </div>

        {/* Center: Luxury Authentication Card */}
        <div className="max-w-md w-full mx-auto my-auto py-4 sm:py-6 space-y-4 sm:space-y-6">
          {/* Mobile Top Brand Header (< lg screens) */}
          <div className="lg:hidden text-center space-y-2 pb-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#065A49] to-[#022D24] border border-[#238B74] flex items-center justify-center p-2 shadow-emerald-sm">
                <AttarDepotLogo variant="icon" className="w-full h-full text-white" />
              </div>
              <div className="text-left">
                <span
                  className={`font-serif text-xl font-bold tracking-[0.16em] uppercase block leading-tight ${
                    isLight ? 'text-[#022D24]' : 'text-white'
                  }`}
                >
                  Attar Depot
                </span>
                <span className="text-[9px] tracking-[0.28em] text-amber-600 font-bold uppercase block">
                  Royal Atelier Backoffice
                </span>
              </div>
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center sm:text-left space-y-1.5 sm:space-y-2">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border ${
                isLight
                  ? 'bg-emerald-100/90 text-emerald-900 border-emerald-300/80 shadow-xs'
                  : 'bg-emerald-950/80 text-amber-300 border-emerald-500/40 shadow-inner'
              }`}
            >
              <KeyRound className={`w-3.5 h-3.5 ${isLight ? 'text-amber-700' : 'text-amber-300'}`} />
              <span>Restricted Merchant Access</span>
            </div>

            <h1
              className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight uppercase ${
                isLight ? 'text-[#022D24]' : 'text-white'
              }`}
            >
              Master Authentication
            </h1>
            <p
              className={`text-xs ${
                isLight ? 'text-emerald-900/70' : 'text-emerald-100/70'
              }`}
            >
              Sign in with your master credentials to supervise flacon inventory, taxonomy, and consignments.
            </p>
          </div>

          {/* Master Glass Form Container */}
          <div
            className={`rounded-3xl p-5 sm:p-8 border shadow-2xl relative overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
              isLight
                ? 'bg-white/95 border-[#BCE3D7] shadow-emerald-950/10'
                : 'bg-gradient-to-b from-[#09221B]/95 via-[#061813]/98 to-[#03100C] border-[#165646] shadow-[0_25px_70px_rgba(0,0,0,0.85)]'
            }`}
          >
            {/* Top Multi-Color Royal Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300" />

            {/* Error Notification Banner */}
            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-950/85 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Credentials Fill Card (Mobile Flex Adaptive) */}
            <div
              className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner mb-5 ${
                isLight
                  ? 'bg-gradient-to-r from-[#EBF7F2] to-[#E2F2EB] border-emerald-300 text-emerald-950'
                  : 'bg-gradient-to-r from-[#032A20] via-[#043327] to-[#022018] border-[#22846E] text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]'
              }`}
            >
              <div className="min-w-0 flex-1">
                <span
                  className={`font-bold text-[10px] uppercase tracking-wider block ${
                    isLight ? 'text-amber-800' : 'text-amber-300'
                  }`}
                >
                  Demo Administrator Key
                </span>
                <span
                  className={`text-[11px] font-mono truncate block mt-0.5 ${
                    isLight ? 'text-emerald-900 font-semibold' : 'text-emerald-200'
                  }`}
                >
                  admin@attardepot.com • Admin@123
                </span>
              </div>
              <button
                type="button"
                onClick={handleQuickAutoFill}
                className={`text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 flex-shrink-0 shadow-md w-full sm:w-auto ${
                  isAutoFilled
                    ? 'bg-emerald-500 text-white shadow-[0_0_12px_#10b981]'
                    : isLight
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white border border-emerald-400/40 active:scale-95'
                }`}
              >
                {isAutoFilled ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Loaded!</span>
                  </>
                ) : (
                  <>
                    <Sparkle className="w-3.5 h-3.5 text-amber-300" />
                    <span>Auto Fill</span>
                  </>
                )}
              </button>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label
                  className={`block text-[10px] font-bold uppercase tracking-widest ${
                    isLight ? 'text-emerald-950' : 'text-emerald-100/90'
                  }`}
                >
                  Administrator Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@attardepot.com"
                    className={`w-full rounded-2xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:ring-2 transition-all font-medium ${
                      isLight
                        ? 'bg-emerald-50/50 border border-emerald-300/90 text-emerald-950 placeholder-emerald-800/40 focus:bg-white focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs'
                        : 'bg-[#021410] border border-[#174D3F] text-white placeholder-emerald-700/50 focus:bg-[#031C16] focus:ring-emerald-500/30 focus:border-emerald-400'
                    }`}
                  />
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center absolute left-2.5 top-2.5 ${
                      isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-950/80 text-emerald-400'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  className={`block text-[10px] font-bold uppercase tracking-widest ${
                    isLight ? 'text-emerald-950' : 'text-emerald-100/90'
                  }`}
                >
                  Master Passphrase
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full rounded-2xl pl-11 pr-11 py-3 text-xs focus:outline-none focus:ring-2 transition-all font-medium ${
                      isLight
                        ? 'bg-emerald-50/50 border border-emerald-300/90 text-emerald-950 placeholder-emerald-800/40 focus:bg-white focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs'
                        : 'bg-[#021410] border border-[#174D3F] text-white placeholder-emerald-700/50 focus:bg-[#031C16] focus:ring-emerald-500/30 focus:border-emerald-400'
                    }`}
                  />
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center absolute left-2.5 top-2.5 ${
                      isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-950/80 text-emerald-400'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors ${
                      isLight
                        ? 'text-emerald-700 hover:text-emerald-950'
                        : 'text-neutral-400 hover:text-white'
                    }`}
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
                className="w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 text-white bg-gradient-to-r from-[#0E7A63] via-[#0B6552] to-[#064B3D] hover:from-[#118F74] hover:to-[#085444] border border-[#238B74] hover:border-amber-400/80 shadow-lg shadow-emerald-950/50 active:scale-[0.99] transition-all disabled:opacity-50 mt-3 group"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing Master Merchant...</span>
                  </div>
                ) : (
                  <>
                    <span>Enter Atelier Command Portal</span>
                    <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Links & Help */}
            <div
              className={`pt-4 mt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left ${
                isLight ? 'border-emerald-200/80' : 'border-[#103D32]'
              }`}
            >
              <Link
                href="/"
                className={`text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                  isLight
                    ? 'text-emerald-800 hover:text-emerald-950'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Store</span>
              </Link>

              <span className={`text-[11px] ${isLight ? 'text-emerald-900/60' : 'text-neutral-400'}`}>
                Staff Support:{' '}
                <a
                  href="mailto:support@attardepot.com"
                  className="text-amber-600 font-bold hover:underline"
                >
                  Contact IT Desk
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Agency Credit Badge */}
        <div className="flex items-center justify-center pt-2 w-full max-w-md mx-auto">
          <div
            className={`rounded-2xl px-4 py-2 border flex items-center gap-2.5 shadow-xs transition-colors ${
              isLight
                ? 'bg-white/80 border-emerald-300 text-emerald-950'
                : 'bg-[#051C16]/90 border-[#125041] text-neutral-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-[11px] font-medium tracking-wide select-none">
              Crafted for Attar Depot by{' '}
              <span
                className={`font-bold tracking-wider font-poppins ${
                  isLight ? 'text-[#022D24]' : 'text-white'
                }`}
              >
                Kerplunk Media
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
