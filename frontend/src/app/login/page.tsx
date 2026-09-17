'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronDown,
  KeyRound,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { useAppDispatch } from '@/store';
import { setCredentials } from '@/store/authSlice';
import api from '@/lib/api';
import { toast } from '@/lib/toast';
import { authenticateWithGoogle } from '@/lib/googleAuth';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const redirect = searchParams.get('redirect') || '/';

  // 3-step state: 'phone' -> 'otp' -> 'missing_fields'
  const [step, setStep] = useState<'phone' | 'otp' | 'missing_fields'>('phone');

  const [phone, setPhone] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('******3916');
  const [testOtp, setTestOtp] = useState<string | null>(null);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [secondsRemaining, setSecondsRemaining] = useState(177); // 02:57 timer

  const [title, setTitle] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== 'otp' || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, secondsRemaining]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Step 1: Request OTP
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
      setSecondsRemaining(177);
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
      toast.error(msg, { title: 'SMS Error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
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

      if (data.isProfileComplete && data.user) {
        dispatch(setCredentials({ user: data.user, token: data.token }));
        toast.success(`Welcome back, ${data.user.name}!`, { title: 'Login Successful' });
        router.push(redirect);
      } else {
        if (data.user?.name && !data.user.name.startsWith('Patron ')) {
          setFullName(data.user.name);
        }
        if (data.user?.email) {
          setEmail(data.user.email);
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

  // Step 3: Complete Profile
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

      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success(`Welcome to Attar Depot, ${title} ${fullName}!`, {
        title: 'Registration Complete',
      });
      router.push(redirect);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to complete registration.';
      setApiError(msg);
      toast.error(msg, { title: 'Registration Error' });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      const { user, token } = await authenticateWithGoogle();
      dispatch(setCredentials({ user, token }));
      toast.success(`Welcome back, ${user.name}! Authenticated with Google.`);
      router.push(redirect);
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

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row border border-neutral-200 rounded-md min-h-[520px]">
        {/* Left Form Area */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 flex flex-col justify-between bg-white relative">
          <div>
            {apiError && (
              <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
                {apiError}
              </div>
            )}

            {/* STEP 1: Login Or Signup */}
            {step === 'phone' && (
              <div className="space-y-7">
                <h1 className="text-2xl sm:text-3xl font-medium text-neutral-800 tracking-tight">
                  Login Or Signup
                </h1>

                <form onSubmit={handleRequestOtp} className="space-y-6">
                  <div className="flex gap-3">
                    <div className="relative w-28 border border-neutral-300 rounded-sm pt-2 pb-2 px-3 flex items-center justify-between">
                      <span className="absolute -top-2.5 left-2 bg-white px-1 text-[11px] text-neutral-500 font-sans">
                        Code
                      </span>
                      <span className="text-sm font-medium text-neutral-800">+91</span>
                      <ChevronDown className="w-4 h-4 text-neutral-600" />
                    </div>

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

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 border border-neutral-300 hover:border-neutral-400 rounded-sm flex items-center justify-center gap-3 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-all"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z" />
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                      </svg>
                      <span>Or continue with Google</span>
                    </button>
                  </div>

                  <div className="text-center space-y-1.5 text-[11px] text-neutral-600 leading-relaxed pt-2">
                    <p>
                      This site is protected by reCAPTCHA and the Google{' '}
                      <span className="underline cursor-pointer">Privacy Policy</span> &{' '}
                      <span className="underline cursor-pointer">Terms of Service</span> apply.
                    </p>
                    <p>
                      By continuing, I agree to{' '}
                      <span className="underline cursor-pointer">Terms of Use</span> &{' '}
                      <span className="underline cursor-pointer">Privacy Notice</span>
                    </p>
                  </div>

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

            {/* STEP 2: Verify Mobile OTP */}
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

                  <div className="text-center text-[11px] text-neutral-600 pt-1">
                    By continuing, I agree to{' '}
                    <span className="underline cursor-pointer">Terms of Use</span> &{' '}
                    <span className="underline cursor-pointer">Privacy Notice</span>
                  </div>

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

            {/* STEP 3: Almost there! */}
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
                        onChange={(e) => {
                          setTitle(e.target.value);
                          if (e.target.value) setTitleError(false);
                        }}
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

                  <div className="flex gap-3">
                    <div className="relative w-24 border border-neutral-300 rounded-sm pt-2 pb-2 px-3 bg-neutral-50">
                      <span className="absolute -top-2.5 left-2 bg-white px-1 text-[11px] text-neutral-500">
                        Country
                      </span>
                      <span className="text-sm font-medium text-neutral-700">IN</span>
                    </div>

                    <div className="relative flex-1 border border-neutral-300 rounded-sm pt-2 pb-2 px-3 bg-neutral-50">
                      <span className="absolute -top-2.5 left-2 bg-white px-1 text-[11px] text-neutral-500">
                        Enter Mobile Number
                      </span>
                      <span className="text-sm font-medium text-neutral-700 tracking-wider">
                        {phone.replace(/\D/g, '').slice(-10)}
                      </span>
                    </div>
                  </div>

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
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (e.target.value.includes('@')) setEmailError(false);
                        }}
                        placeholder="Enter Email ID"
                        className="w-full text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none bg-transparent"
                      />
                    </div>
                    {emailError && (
                      <p className="text-[11px] text-red-600 mt-1">Please Enter email ID</p>
                    )}
                  </div>

                  <div className="text-center text-[11px] text-neutral-600 pt-1">
                    By continuing, I agree to{' '}
                    <span className="underline cursor-pointer">Terms of Use</span> &{' '}
                    <span className="underline cursor-pointer">Privacy Notice</span>
                  </div>

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

          <div className="pt-6 border-t border-neutral-100 flex justify-between items-center text-[11px] text-neutral-400">
            <Link
              href="/admin/login"
              className="hover:text-neutral-800 transition-colors inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
              <span>Admin Portal (Email & Pass)</span>
            </Link>
            <Link href="/" className="hover:text-neutral-800 inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>

        {/* Right Promotional Banner */}
        <div className="hidden md:flex md:w-5/12 relative bg-[#023F36] text-white flex-col justify-between overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=85&w=800"
              alt="Attar Depot Royal Gift Box"
              fill
              priority
              sizes="40vw"
              className="object-cover object-center brightness-75 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#012620]/95 via-[#023F36]/85 to-[#046A5A]/85" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#012620]/30 to-[#012620]/80 pointer-events-none" />
          </div>

          <div className="relative z-10 space-y-3 pt-2">
            <div>
              <h3 className="text-2xl font-serif font-bold tracking-tight leading-none text-white">
                Gift ATTAR
              </h3>
              <p className="text-sm font-serif italic text-emerald-100 font-light tracking-wide">
                to the one you know by heart
              </p>
            </div>

            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200 block">
                UPTO
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-serif font-bold text-white">25%</span>
                <span className="text-xs uppercase tracking-widest font-semibold text-emerald-200">
                  OFF
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">on selected fragrances.</p>
            </div>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md p-4 rounded border border-white/20 space-y-2 mt-auto">
            <p className="text-xs font-serif text-white font-medium leading-snug">
              Find the perfect fragrance that you fall in love with.
            </p>
            <p className="text-xs text-emerald-200 font-semibold">
              Get ₹200 off on Discovery Sets
            </p>

            <div className="pt-1 flex items-center justify-between text-xs">
              <div className="border border-dashed border-white/60 px-2.5 py-1 text-white font-mono font-bold tracking-wider text-[11px] bg-white/5">
                DKIT22
              </div>
              <Link
                href="/products"
                className="px-3 py-1 bg-black text-white text-[11px] font-medium hover:bg-neutral-900 transition-colors uppercase tracking-wider"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-neutral-500">Loading vault sign in...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
