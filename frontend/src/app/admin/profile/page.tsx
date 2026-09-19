'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Camera,
  Trash2,
  Loader2,
  Save,
  Sparkles,
  ExternalLink,
  LogOut,
  CheckCircle2,
  Lock,
  KeyRound,
  Clock,
  Radio,
  Layers,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useProfile, useUpdateProfile, useUploadAvatar } from '@/hooks/useProfile';
import { logout } from '@/store/authSlice';
import { toast } from '@/lib/toast';

export default function AdminProfilePage() {
  const dispatch = useAppDispatch();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { data: profileUser, isLoading: isProfileLoading } = useProfile(true);
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();

  const currentUser = profileUser || authUser;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        title: currentUser.title || 'Master Administrator',
      });
    }
  }, [currentUser]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WEBP).', {
        title: 'Invalid Format',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Avatar file size must be less than 5MB.', {
        title: 'File Too Large',
      });
      return;
    }

    try {
      await uploadAvatarMutation.mutateAsync(file);
      toast.success('Admin profile picture updated successfully!', {
        title: 'Avatar Saved',
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload avatar.', {
        title: 'Upload Failed',
      });
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    if (!currentUser?.avatar) return;
    try {
      await updateProfileMutation.mutateAsync({ avatar: '' });
      toast.success('Admin profile picture removed successfully.', {
        title: 'Photo Removed',
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove avatar.', {
        title: 'Action Failed',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Administrator name is required.', { title: 'Missing Field' });
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        title: formData.title.trim(),
      });
      toast.success('Executive profile changes saved successfully!', {
        title: 'Profile Updated',
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile.', {
        title: 'Save Failed',
      });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/admin/login';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-poppins">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
              Executive Credentials
            </span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-600">Administrator Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Admin Profile & Identity
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Curate your royal administrator credentials, photo identity, and system access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 shadow-xs transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
            <span>Storefront</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/60 text-xs font-semibold text-rose-700 hover:bg-rose-100/80 shadow-xs transition-all"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Avatar & Executive Status (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Avatar Identity Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/5 p-6 backdrop-blur-xl">
            <div className="flex flex-col items-center text-center">
              {/* Avatar Preview with Camera Overlay */}
              <div className="relative group/avatar mb-4">
                <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-emerald-500/20 shadow-xl shadow-emerald-950/15 bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center">
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name || 'Admin'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-4xl shadow-inner">
                      {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                </div>

                {/* Direct Camera Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadAvatarMutation.isPending}
                  title="Upload New Photo"
                  className="absolute bottom-1 right-1 w-9 h-9 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-950/30 ring-2 ring-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {uploadAvatarMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                className="hidden"
                onChange={handleAvatarUpload}
              />

              {/* Name & Role Details */}
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {currentUser?.name || 'Master Administrator'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser?.email || 'admin@attardepot.com'}
              </p>

              <div className="mt-2.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Master Administrator</span>
              </div>

              {/* Avatar Action Buttons */}
              <div className="w-full mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadAvatarMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                >
                  {uploadAvatarMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Camera className="w-3.5 h-3.5" />
                  )}
                  <span>{currentUser?.avatar ? 'Change Photo' : 'Upload Photo'}</span>
                </button>

                {currentUser?.avatar && (
                  <button
                    type="button"
                    onClick={handleDeleteAvatar}
                    disabled={updateProfileMutation.isPending}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer"
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>Remove</span>
                  </button>
                )}
              </div>

              <p className="text-[10px] text-slate-400 mt-3">
                Supported formats: PNG, JPG, WEBP. Maximum size 5MB.
              </p>
            </div>
          </div>

          {/* Privileges & System Scope Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/5 p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Executive Privileges Scope</span>
            </h4>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Full Catalog & Inventory Authority (Assam & Kannauj attars)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Royal Consignment & Dispatch Fulfillment</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Patron Relationship & Order Verification</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Realtime Order Telemetry & Sound Chimes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>System Security & Administrative Settings</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Profile Form & Credentials (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/5 p-6 sm:p-7 backdrop-blur-xl">
            <div className="mb-5 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Personal Information & Credentials
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your contact details and executive title.
                </p>
              </div>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Haja Moideen"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Official Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@attardepot.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Used for administrative communication and security alerts.
                </p>
              </div>

              {/* Phone & Title Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 99447 57526"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                {/* Executive Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Executive Title
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Master Administrator"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Security & Access Level (Readonly indicator) */}
              <div className="pt-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Lock className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Security Clearance</p>
                      <p className="text-[10px] text-slate-500">Super Administrator Level Access</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
                    Root Role: admin
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-md shadow-emerald-700/25 transition-all cursor-pointer disabled:opacity-60"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
