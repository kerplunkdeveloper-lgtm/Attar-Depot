'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeAuthModal, setAuthModalMode } from '@/store/uiSlice';
import { setCredentials } from '@/store/authSlice';
import api from '@/lib/api';
import { toast } from '@/lib/toast';
import {
  X,
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

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const { isAuthModalOpen, authModalMode } = useAppSelector((state) => state.ui);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Prevent accidental close when selecting text or dragging mouse inside modal
  const mouseDownOnBackdrop = useRef(false);

  const handleBackdropMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      mouseDownOnBackdrop.current = true;
    } else {
      mouseDownOnBackdrop.current = false;
    }
  };

  const handleBackdropMouseUp = (e: React.MouseEvent) => {
    if (mouseDownOnBackdrop.current && e.target === e.currentTarget) {
      dispatch(closeAuthModal());
    }
    mouseDownOnBackdrop.current = false;
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        dispatch(closeAuthModal());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, dispatch]);

  // Reset form when modal opens or mode changes
  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(
        setCredentials({
          user: data.user,
          token: data.token,
        })
      );
      setSuccessMessage(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      toast.success(`Welcome back, ${data.user.name}! Your royal fragrance vault is unlocked.`, {
        title: 'Sign In Successful',
      });
      setTimeout(() => {
        dispatch(closeAuthModal());
      }, 700);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(msg);
      toast.error(msg, {
        title: 'Access Denied',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match. Please verify.';
      setError(msg);
      toast.warning(msg, { title: 'Password Mismatch' });
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        phone,
      });
      dispatch(
        setCredentials({
          user: data.user,
          token: data.token,
        })
      );
      setSuccessMessage(`Account created successfully! Welcome, ${name.split(' ')[0]}.`);
      toast.success(`Welcome to the House of Attar, ${name}! Your Attar Depot account is ready.`, {
        title: 'Account Created',
      });
      setTimeout(() => {
        dispatch(closeAuthModal());
      }, 700);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create account. Email may already be registered.';
      setError(msg);
      toast.error(msg, {
        title: 'Registration Failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onMouseDown={handleBackdropMouseDown}
      onMouseUp={handleBackdropMouseUp}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        {/* Emergent emerald banner header */}
        <div className="relative p-6 pb-4 bg-gradient-to-b from-[#ECFDF5] to-white border-b border-emerald-50 text-center">
          <button
            type="button"
            onClick={() => dispatch(closeAuthModal())}
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-white/80 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-[11px] font-bold text-emerald-800 uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>The House of Attar</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-wide uppercase">
            {authModalMode === 'login' ? 'Sign In' : 'Create Account'}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
            {authModalMode === 'login'
              ? 'Access your private fragrance vault, wishlist and consignment orders.'
              : 'Join our guild for exclusive attar allocations and member pricing.'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex bg-neutral-100/80 p-1 rounded-2xl mt-4 max-w-xs mx-auto border border-neutral-200/50">
            <button
              type="button"
              onClick={() => dispatch(setAuthModalMode('login'))}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                authModalMode === 'login'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => dispatch(setAuthModalMode('signup'))}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                authModalMode === 'signup'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 sm:p-7 pt-4 max-h-[78vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {authModalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password.."
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  />
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-emerald py-3 rounded-2xl text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-emerald-md hover:scale-[1.01] transition-all text-white disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Enter Private Vault</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 space-y-2">
                <p className="text-xs text-neutral-500">
                  New to Attar Depot?{' '}
                  <button
                    type="button"
                    onClick={() => dispatch(setAuthModalMode('signup'))}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Create Account
                  </button>
                </p>

                <div className="pt-2 border-t border-neutral-100">
                  <a
                    href="/admin/login"
                    onClick={() => dispatch(closeAuthModal())}
                    className="text-[11px] text-neutral-400 hover:text-emerald-700 font-medium transition-colors"
                  >
                    Store Admin / Merchant Access →
                  </a>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nawab Farooq"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farooq@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Phone Number <span className="text-neutral-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700 block">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700 block">Confirm</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-emerald py-3 rounded-2xl text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-emerald-md hover:scale-[1.01] transition-all text-white disabled:opacity-50 mt-3"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Join Fragrance Guild</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-neutral-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => dispatch(setAuthModalMode('login'))}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
