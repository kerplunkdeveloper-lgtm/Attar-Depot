'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Check, Loader2, Link as LinkIcon, Image as ImageIcon, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { useAdminTheme } from '@/context/AdminThemeContext';

interface AdminImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  disabled?: boolean;
}

export default function AdminImageUpload({
  value,
  onChange,
  label = 'Visual Image',
  folder = 'attar-depot',
  disabled = false,
}: AdminImageUploadProps) {
  const { theme } = useAdminTheme();
  const isLight = theme === 'light';

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.url) {
        onChange(res.data.url);
      } else {
        throw new Error(res.data?.message || 'Upload failed');
      }
    } catch (err: any) {
      console.error('Image upload error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to upload image to Cloudinary.';
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          className={`block font-bold uppercase tracking-wider text-[10.5px] transition-colors ${
            isLight ? 'text-slate-700' : 'text-neutral-300'
          }`}
        >
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className={`text-[11px] flex items-center gap-1 font-medium transition-colors ${
            isLight
              ? 'text-emerald-700 hover:text-emerald-900'
              : 'text-emerald-400 hover:text-emerald-300'
          }`}
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? 'Hide URL input' : 'Enter URL manually'}
        </button>
      </div>

      {/* Manual URL Input if toggled */}
      {showUrlInput && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
            disabled={disabled || isUploading}
            className={`w-full rounded-xl px-3.5 py-2 text-xs border font-mono transition-colors focus:outline-none focus:ring-1 ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600 focus:ring-emerald-500'
                : 'bg-[#070D0B] border-[#1E332B] text-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20'
            }`}
          />
        </div>
      )}

      {/* Dropzone & Preview Area */}
      {value ? (
        /* Image Preview Card */
        <div
          className={`p-3 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isLight
              ? 'bg-slate-50/80 border-slate-200 shadow-xs'
              : 'bg-[#0E1815] border-[#1E332B] shadow-inner'
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`relative w-20 h-24 sm:w-22 sm:h-26 rounded-xl overflow-hidden flex-shrink-0 border shadow-md ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#070D0B] border-[#1E332B]'
              }`}
            >
              <Image
                src={value}
                alt="Uploaded media preview"
                fill
                sizes="88px"
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Check className="w-2.5 h-2.5" /> Media Ready
                </span>
                {value.includes('cloudinary.com') && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Cloudinary CDN
                  </span>
                )}
              </div>
              <p
                className={`text-xs font-semibold mt-1.5 truncate max-w-[240px] sm:max-w-[320px] font-mono ${
                  isLight ? 'text-slate-800' : 'text-neutral-200'
                }`}
                title={value}
              >
                {value}
              </p>
              <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                Dynamically served across storefront flacon galleries and catalogs.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={() => fileInputRef.current?.click()}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                isLight
                  ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-emerald-700'
                  : 'bg-[#142420] text-neutral-300 border-[#1E332B] hover:bg-[#1A302A] hover:text-emerald-300'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={handleRemove}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                isLight
                  ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  : 'bg-rose-950/40 text-rose-400 border-rose-900/40 hover:bg-rose-900/60'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Upload Drag & Drop Zone */
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all text-center group ${
            isDragging
              ? isLight
                ? 'border-emerald-500 bg-emerald-50/50'
                : 'border-emerald-400 bg-emerald-950/20'
              : isLight
              ? 'border-slate-300 hover:border-emerald-500 bg-white hover:bg-slate-50/50'
              : 'border-[#1E332B] hover:border-emerald-500/60 bg-[#070D0B] hover:bg-[#0E1815]'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-3">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
              <p
                className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? 'text-emerald-800' : 'text-emerald-400'
                }`}
              >
                Uploading to Cloudinary CDN...
              </p>
              <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                Optimizing formulation visual & generating responsive variants
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 border ${
                  isLight
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-[#0E1815] text-emerald-400 border-[#1E332B] group-hover:border-emerald-500/40'
                }`}
              >
                <Upload className="w-6 h-6" />
              </div>
              <p
                className={`text-xs font-bold tracking-tight transition-colors ${
                  isLight ? 'text-slate-800 group-hover:text-emerald-800' : 'text-white group-hover:text-emerald-300'
                }`}
              >
                Click to browse or drag & drop media image
              </p>
              <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                Supports JPG, PNG, WEBP up to 5MB (automatically saved to Cloudinary)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={onFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Error display */}
      {error && (
        <div className="flex items-center gap-2 text-rose-500 text-xs mt-1 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
