'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAppDispatch } from '@/store';
import { setCredentials } from '@/store/authSlice';
import api from '@/lib/api';
import { toast } from '@/lib/toast';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match. Please verify.';
      setError(msg);
      toast.warning(msg, { title: 'Password Mismatch' });
      return;
    }

    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters.';
      setError(msg);
      toast.warning(msg, { title: 'Password Too Short' });
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
      });

      dispatch(
        setCredentials({
          user: data.user,
          token: data.token,
        })
      );

      setSuccess(`Welcome to the Guild, ${data.user.name.split(' ')[0]}! Redirecting...`);
      toast.success(`Welcome to the House of Attar, ${data.user.name}! Your account is active.`, {
        title: 'Account Created',
      });
      setTimeout(() => {
        router.push(redirect);
      }, 700);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create patron account. Email may already be registered.';
      setError(msg);
      toast.error(msg, {
        title: 'Registration Error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FAF6] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-poppins emerald-overlay-bg">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-block group">
          <span className="font-serif text-3xl font-bold tracking-[0.2em] text-emerald-gradient uppercase">
            Attar Depot
          </span>
          <span className="text-[10px] tracking-[0.3em] text-emerald-800 uppercase font-medium block -mt-1">
            Pure Royal Essence
          </span>
        </Link>
        <h1 className="text-xl font-bold text-neutral-900 uppercase tracking-wider pt-2">
          Join the Royal Guild
        </h1>
        <p className="text-xs text-neutral-500 max-w-xs mx-auto">
          Create your patron account for sovereign attar discovery, order tracking, and private vintage allocations.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-emerald-md border border-emerald-100 rounded-3xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Haja Moideen"
                  className="w-full bg-white border border-neutral-300 rounded-xl pl-10 pr-4 py-2.5 text-neutral-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-medium"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-neutral-300 rounded-xl pl-10 pr-4 py-2.5 text-neutral-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-medium"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                Mobile Number (For Courier Tracking)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white border border-neutral-300 rounded-xl pl-10 pr-4 py-2.5 text-neutral-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-medium"
                />
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-neutral-300 rounded-xl pl-10 pr-4 py-2.5 text-neutral-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-medium"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Confirm *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-neutral-300 rounded-xl pl-10 pr-10 py-2.5 text-neutral-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-medium"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white font-bold uppercase tracking-wider transition-all shadow-md shadow-emerald-900/10 active:scale-98 flex items-center justify-center gap-2 mt-2"
            >
              <span>{isLoading ? 'Creating Account...' : 'Register as Patron'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-100 text-center space-y-2 text-xs">
            <p className="text-neutral-600">
              Already have an account?{' '}
              <Link
                href={`/login?redirect=${encodeURIComponent(redirect)}`}
                className="font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-neutral-500">Loading register...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
