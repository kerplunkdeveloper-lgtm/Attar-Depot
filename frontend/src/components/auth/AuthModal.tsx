'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeAuthModal } from '@/store/uiSlice';
import { setCredentials } from '@/store/authSlice';
import api from '@/lib/api';
import { toast } from '@/lib/toast';
import { authenticateWithGoogle } from '@/lib/googleAuth';
import { getQueryClient } from '@/components/providers/Providers';
import {
  X,
  ChevronDown,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropVariants, modalVariants, luxuryEase } from '@/lib/animations';
import WelcomePromoBanner from '@/components/auth/WelcomePromoBanner';

export default function AuthModal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthModalOpen, authRedirectUrl } = useAppSelector((state) => state.ui);

  const finishAuth = (delay = 0) => {
    const target = authRedirectUrl;
    if (delay > 0) {
      setTimeout(() => {
        dispatch(closeAuthModal());
        if (target) {
          router.push(target);
        }
      }, delay);
    } else {
      dispatch(closeAuthModal());
      if (target) {
        router.push(target);
      }
    }
  };

  // Flow steps: 'phone' (Image 1) -> 'otp' (Image 2) -> 'missing_fields' (Image 3)
  const [step, setStep] = useState<'phone' | 'otp' | 'missing_fields'>('phone');

  // Step 1: Phone input
  const [phone, setPhone] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('******3916');
  const [testOtp, setTestOtp] = useState<string | null>(null);

  // Step 2: 6-Digit OTP input
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [secondsRemaining, setSecondsRemaining] = useState(177); // 02:57 timer as shown in reference

  // Step 3: Missing fields (Image 3)
  const [title, setTitle] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const mouseDownOnBackdrop = useRef(false);

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

  // Reset form when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('phone');
      setPhone('');
      setOtp(['', '', '', '', '', '']);
      setTitle('');
      setFullName('');
      setEmail('');
      setTitleError(false);
      setEmailError(false);
      setApiError(null);
      setTestOtp(null);
      setIsGoogleAuth(false);
      setSecondsRemaining(177);
    }
  }, [isAuthModalOpen]);

  // 02:57 countdown timer in Step 2
  useEffect(() => {
    if (step !== 'otp' || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, secondsRemaining]);

  // Format seconds to mm:ss (e.g. 02:57)
  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

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

  // STEP 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const clean = phone.replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) {
      setApiError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/send-otp', { phone: clean });

      setMaskedPhone(data.maskedPhone || `******${clean.slice(-4)}`);
      setTestOtp(data.testOtp || null);
      setSecondsRemaining(177); // 02:57
      setStep('otp');

      toast.success(`OTP Sent to mobile number ${data.maskedPhone || clean}`, {
        title: 'SMS Sent',
      });

      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      setApiError(msg);
      toast.error(msg, { title: 'Twilio SMS Error' });
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const code = otp.join('').trim();
    if (code.length !== 6) {
      setApiError('Please enter the 6-digit OTP');
      return;
    }

    const clean = phone.replace(/\D/g, '').slice(-10);
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/verify-otp', {
        phone: clean,
        otp: code,
      });

      // If user already has full profile (Title, Name, Email), finish login!
      if (data.isProfileComplete && data.user) {
        getQueryClient().clear();
        dispatch(setCredentials({ user: data.user, token: data.token }));
        toast.success(`Welcome back, ${data.user.name}!`, { title: 'Login Successful' });
        finishAuth(500);
      } else {
        // Proceed to Step 3: Almost there! Please Fill The Missing Fields
        if (data.user?.name && !data.user.name.startsWith('Customers ')) {
          setFullName(data.user.name);
        }
        if (data.user?.email) {
          setEmail(data.user.email);
        }
        if (data.user?.title) {
          setTitle(data.user.title);
        }
        setStep('missing_fields');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP. Please try again.';
      setApiError(msg);
      toast.error(msg, { title: 'Verification Failed' });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (secondsRemaining > 0 || isLoading) return;
    setApiError(null);
    setIsLoading(true);

    try {
      const clean = phone.replace(/\D/g, '').slice(-10);
      const { data } = await api.post('/auth/send-otp', { phone: clean });
      setSecondsRemaining(177);
      setTestOtp(data.testOtp || null);
      toast.success(`New OTP sent to +91 ${clean}`);
      setOtp(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 3: Complete Profile
  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    let hasError = false;
    if (!title) {
      setTitleError(true);
      hasError = true;
    } else {
      setTitleError(false);
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (!fullName.trim()) {
      setApiError('Please enter your full name');
      return;
    }

    if (hasError) return;

    const clean = phone.replace(/\D/g, '').slice(-10);
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/complete-profile', {
        phone: clean,
        title,
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
      });

      getQueryClient().clear();
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success(`Welcome to Attar Depot, ${title} ${fullName}!`, {
        title: 'Registration Complete',
      });
      finishAuth(600);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to complete registration. Email may already be in use.';
      setApiError(msg);
      toast.error(msg, { title: 'Registration Error' });
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Digit Change
  const handleOtpDigitChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || '';
    }
    setOtp(newOtp);
    const nextEmptyIndex = newOtp.findIndex((d) => !d);
    if (nextEmptyIndex !== -1) {
      otpInputsRef.current[nextEmptyIndex]?.focus();
    } else {
      otpInputsRef.current[5]?.focus();
    }
  };

  // Real-Time Google OAuth Handler (Google Identity Services)
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      const { user, token } = await authenticateWithGoogle();
      
      if (!user.isProfileComplete) {
        setIsGoogleAuth(true);
        if (user.name && user.name !== 'GoogleCustomers') setFullName(user.name);
        if (user.email) setEmail(user.email);
        if (user.title) setTitle(user.title);
        if (user.phone) setPhone(user.phone);
        setStep('missing_fields');
      } else {
        getQueryClient().clear();
        dispatch(setCredentials({ user, token }));
        toast.success(`Welcome back, ${user.name}! Authenticated with Google.`);
        finishAuth(0);
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg === 'POPUP_CLOSED') {
        // User dismissed popup — silent
      } else {
        const serverMsg = err?.response?.data?.message || msg || 'Google sign in encountered an issue.';
        setApiError(serverMsg);
        toast.error(serverMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTitle(e.target.value);
    if (e.target.value) setTitleError(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value.includes('@')) setEmailError(false);
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5"
          onMouseDown={handleBackdropMouseDown}
          onMouseUp={handleBackdropMouseUp}
        >
      {/* Backdrop with smooth fade */}
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs"
        onClick={() => dispatch(closeAuthModal())}
      />

      {/* 2-Column Luxury Modal Card matching Reference Screenshot */}
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-neutral-200 min-h-[520px] z-10"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Luxury Welcome Showcase (Image 2)                           */}
        {/* ========================================================================= */}
        <div className="hidden md:flex md:w-1/2 relative">
          <WelcomePromoBanner
            showCloseButton
            onClose={() => dispatch(closeAuthModal())}
          />
        </div>

        {/* ========================================================================= */}
        {/* LEFT COLUMN: Clean Form Area                                              */}
        {/* ========================================================================= */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-between bg-white relative">
          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => dispatch(closeAuthModal())}
            className="md:hidden absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
          <div>
            {/* Top error message */}
            {apiError && (
              <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                <span>{apiError}</span>
              </div>
            )}


            {/* --------------------------------------------------------------------- */}
            {/* STEP 1: Login Or Signup (Reference Image 1)                           */}
            {/* --------------------------------------------------------------------- */}
            {step === 'phone' && (
              <div className="space-y-7">
                <h2 className="text-2xl sm:text-3xl font-medium text-neutral-800 tracking-tight">
                  Login Or Signup
                </h2>

                <form onSubmit={handleRequestOtp} className="space-y-6">
                  {/* Phone input with outlined label */}
                  <div className="flex gap-3">
                    {/* Code dropdown box */}
                    <div className="relative w-28 border border-neutral-300 rounded-sm pt-2 pb-2 px-3 flex items-center justify-between">
                      <span className="absolute -top-2.5 left-2 bg-white px-1 text-[11px] text-neutral-500 font-sans">
                        Code
                      </span>
                      <span className="text-sm font-medium text-neutral-800">+91</span>
                      <ChevronDown className="w-4 h-4 text-neutral-600" />
                    </div>

                    {/* Enter Mobile Number input */}
                    <div className="relative flex-1 border border-neutral-300 rounded-sm px-3 pt-2 pb-2 flex items-center">
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter Mobile Number"
                        className="w-full text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Google OAuth Option */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 border border-neutral-300 hover:border-neutral-400 rounded-sm flex items-center justify-center gap-3 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-all"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                      <span>Or continue with Google</span>
                    </button>
                  </div>


                  {/* Primary Button matching reference */}
                  <div className="pt-2 flex justify-center">
                    <button
                      type="submit"
                      disabled={isLoading || phone.length !== 10}
                      className="px-10 py-3 bg-[#046A5A] hover:bg-[#035346] text-white text-sm font-medium tracking-wide transition-all shadow-sm active:scale-98 disabled:opacity-50 min-w-[200px]"
                    >
                      {isLoading ? 'Requesting...' : 'Request OTP'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* STEP 2: Verify Mobile OTP (Reference Image 2)                         */}
            {/* --------------------------------------------------------------------- */}
            {step === 'otp' && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-medium text-neutral-800 tracking-tight">
                    Verify Mobile OTP
                  </h2>
                  <p className="text-xs text-neutral-600">
                    OTP Sent to mobile number {maskedPhone}
                  </p>
                </div>

                {/* Dev Test Code Chip */}
                {testOtp && (
                  <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        Demo OTP: <strong className="font-mono text-xs">{testOtp}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtp(testOtp.split(''))}
                      className="px-2 py-0.5 rounded bg-amber-200 hover:bg-amber-300 font-bold text-[10px] text-amber-900"
                    >
                      Auto-Fill
                    </button>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-xs text-neutral-500 font-sans">Enter OTP</p>

                    {/* 6 Square Inputs matching reference */}
                    <div className="flex gap-2 sm:gap-3">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpInputsRef.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={idx === 0 ? handleOtpPaste : undefined}
                          className="w-10 h-12 sm:w-12 sm:h-14 text-center font-mono text-xl font-medium border border-neutral-400 focus:border-[#046A5A] focus:outline-none bg-white text-neutral-900 transition-all rounded-none"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Resend text matching reference (Haven't received the OTP ? Resend in 02:57) */}
                  <div className="text-center text-xs text-neutral-600 pt-1">
                    Haven&apos;t received the OTP ?{' '}
                    {secondsRemaining > 0 ? (
                      <span className="font-medium text-neutral-700">
                        <span className="underline cursor-default">Resend</span> in {formatTimer(secondsRemaining)}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-[#046A5A] font-semibold underline cursor-pointer hover:text-[#035346]"
                      >
                        Resend
                      </button>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="text-center text-[11px] text-neutral-600 pt-1">
                    By continuing, I agree to{' '}
                    <span className="underline cursor-pointer">Terms of Use</span> &amp;{' '}
                    <span className="underline cursor-pointer">Privacy Notice</span>
                  </div>

                  {/* Primary Button */}
                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || otp.join('').length !== 6}
                      className="px-10 py-3 bg-[#046A5A] hover:bg-[#035346] text-white text-sm font-medium tracking-wide transition-all shadow-sm active:scale-98 disabled:opacity-50 min-w-[200px]"
                    >
                      {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* STEP 3: Almost there! (Reference Image 3)                             */}
            {/* --------------------------------------------------------------------- */}
            {step === 'missing_fields' && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-medium text-neutral-800 tracking-tight">
                    Almost there!
                  </h2>
                  <p className="text-xs font-medium text-neutral-800">
                    Please Fill The Missing Fields.
                  </p>
                </div>

                <form onSubmit={handleCompleteProfile} className="space-y-4">
                  {/* Title Select Box with error state */}
                  <div>
                    <div
                      className={`relative border rounded-sm pt-2 pb-2 px-3 flex items-center justify-between ${
                        titleError ? 'border-red-500' : 'border-neutral-300'
                      }`}
                    >
                      <span
                        className={`absolute -top-2.5 left-2 bg-white px-1 text-[11px] ${
                          titleError ? 'text-red-500' : 'text-neutral-500'
                        }`}
                      >
                        Title
                      </span>
                      <select
                        value={title}
                        onChange={handleTitleChange}
                        className="w-full text-sm text-neutral-800 bg-transparent focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Select</option>
                        <option value="Mr">Mr</option>
                        <option value="Ms">Ms</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Dr">Dr</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-neutral-600 pointer-events-none" />
                    </div>
                    {titleError && (
                      <p className="text-[11px] text-red-600 mt-1">Please select title</p>
                    )}
                  </div>

                  {/* Enter Full Name */}
                  <div className="relative border border-neutral-300 rounded-sm pt-2 pb-2 px-3">
                    <span className="absolute -top-2.5 left-2 bg-white px-1 text-[11px] text-neutral-500">
                      Enter Full Name
                    </span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter Full Name"
                      className="w-full text-sm text-neutral-800 focus:outline-none bg-transparent"
                    />
                  </div>

                  {/* Country + Mobile Number row */}
                  <div className="flex gap-3">
                    <div className="relative w-24 border border-neutral-300 rounded-sm pt-2 pb-2 px-3 bg-neutral-50">
                      <span className="absolute -top-2.5 left-2 bg-white px-1 text-[11px] text-neutral-500">
                        Country
                      </span>
                      <span className="text-sm font-medium text-neutral-700">IN</span>
                    </div>

                    <div className={`relative flex-1 border rounded-sm pt-2 pb-2 px-3 ${isGoogleAuth ? 'border-neutral-300 bg-white' : 'border-neutral-300 bg-neutral-50'}`}>
                      <span className="absolute -top-2.5 left-2 bg-white px-1 text-[11px] text-neutral-500">
                        Enter Mobile Number
                      </span>
                      {isGoogleAuth ? (
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="w-full text-sm font-medium text-neutral-700 tracking-wider focus:outline-none bg-transparent"
                          placeholder="Mobile Number"
                        />
                      ) : (
                        <span className="text-sm font-medium text-neutral-700 tracking-wider">
                          {phone.replace(/\D/g, '').slice(-10)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Enter Email ID with error state */}
                  <div>
                    <div
                      className={`relative border rounded-sm pt-2 pb-2 px-3 ${
                        emailError ? 'border-red-500' : 'border-neutral-300'
                      }`}
                    >
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter Email ID"
                        className="w-full text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none bg-transparent"
                      />
                    </div>
                    {emailError && (
                      <p className="text-[11px] text-red-600 mt-1">Please Enter email ID</p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="text-center text-[11px] text-neutral-600 pt-1">
                    By continuing, I agree to{' '}
                    <span className="underline cursor-pointer">Terms of Use</span> &amp;{' '}
                    <span className="underline cursor-pointer">Privacy Notice</span>
                  </div>

                  {/* Continue Button */}
                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-10 py-3 bg-[#046A5A] hover:bg-[#035346] text-white text-sm font-medium tracking-wide transition-all shadow-sm active:scale-98 disabled:opacity-50 min-w-[200px]"
                    >
                      {isLoading ? 'Saving...' : 'Continue'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Footer Admin Switch */}
          <div className="pt-6 border-t border-neutral-100 flex justify-between items-center text-[11px] text-neutral-400">
            <a
              href="/admin/login"
              onClick={() => dispatch(closeAuthModal())}
            target="_blank"
              className="hover:text-neutral-800 transition-colors inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
              <span>Admin Command Portal (Email & Pass)</span>
            </a>
            <span className="text-[10px] text-neutral-300">ATTAR DEPOT SECURE</span>
          </div>
        </div>

      </motion.div>
    </div>
  )}
</AnimatePresence>
);
}
