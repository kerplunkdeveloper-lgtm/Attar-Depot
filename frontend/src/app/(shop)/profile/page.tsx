'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  MapPin,
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Home,
  Briefcase,
  Building,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  Save,
  ArrowRight,
  X,
  AlertCircle,
  Camera,
  Loader2,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store';
import { openAuthModal } from '@/store/uiSlice';
import {
  useProfile,
  useUpdateProfile,
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useUploadAvatar,
} from '@/hooks/useProfile';
import { useMyOrders } from '@/hooks/useOrders';
import { UserAddress } from '@/types';
import { toast } from '@/lib/toast';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

interface AddressFormData {
  fullName: string;
  phone: string;
  addressType: 'Home' | 'Work' | 'Other';
  street: string;
  landmark: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

const initialAddressFormData: AddressFormData = {
  fullName: '',
  phone: '',
  addressType: 'Home',
  street: '',
  landmark: '',
  city: '',
  state: 'Tamil Nadu',
  postalCode: '',
  isDefault: false,
};

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user: authUser, isAuthenticated } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');

  // React Query Hooks
  const { data: profileUser, isLoading: isProfileLoading } = useProfile(isAuthenticated);
  const { data: addresses = [], isLoading: isAddressesLoading } = useAddresses(isAuthenticated);
  const { data: orders = [] } = useMyOrders(isAuthenticated);

  const updateProfileMutation = useUpdateProfile();
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const setDefaultAddressMutation = useSetDefaultAddress();
  const uploadAvatarMutation = useUploadAvatar();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, WEBP).', { title: 'Invalid File' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.', { title: 'File Too Large' });
      return;
    }

    try {
      await uploadAvatarMutation.mutateAsync(file);
      toast.success('Your patron profile picture has been updated.', { title: 'Avatar Saved' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload image.', { title: 'Upload Failed' });
    }
  };

  // Active user data fallback
  const currentUser = profileUser || authUser;

  // Personal Info Form State
  const [profileForm, setProfileForm] = useState({
    title: currentUser?.title || '',
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '',
  });

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        title: currentUser.title || '',
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '',
      });
    }
  }, [currentUser]);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressFormData, setAddressFormData] = useState<AddressFormData>(initialAddressFormData);
  const [addressFormError, setAddressFormError] = useState<string | null>(null);

  // Address Delete Confirm State
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-emerald-100 shadow-emerald-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
            <UserIcon className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 uppercase tracking-wide">
              Patron Account Access
            </h1>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              Sign in to manage your royal address book, track bespoke consignments, and customize your patron profile.
            </p>
          </div>
          <button
            onClick={() => dispatch(openAuthModal('login'))}
            className="w-full py-3.5 rounded-2xl btn-emerald text-white text-xs font-bold uppercase tracking-wider shadow-emerald-md hover:scale-[1.02] transition-all"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileForm.phone && profileForm.phone.trim().length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number.', { title: 'Invalid Phone Number' });
      return;
    }
    try {
      await updateProfileMutation.mutateAsync({
        title: profileForm.title,
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
      });
      toast.success('Your patron profile details have been updated successfully.', {
        title: 'Profile Saved',
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile. Please try again.', {
        title: 'Update Error',
      });
    }
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingAddressId(null);
    setAddressFormData({
      ...initialAddressFormData,
      fullName: currentUser?.name || '',
      phone: currentUser?.phone || '',
      isDefault: addresses.length === 0,
    });
    setAddressFormError(null);
    setIsAddressModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (addr: UserAddress) => {
    if (!addr._id) return;
    setEditingAddressId(addr._id);
    setAddressFormData({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      addressType: addr.addressType || 'Home',
      street: addr.street || '',
      landmark: addr.landmark || '',
      city: addr.city || '',
      state: addr.state || 'Tamil Nadu',
      postalCode: addr.postalCode || '',
      isDefault: Boolean(addr.isDefault),
    });
    setAddressFormError(null);
    setIsAddressModalOpen(true);
  };

  // Handle Address Submit
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressFormError(null);

    // Validation
    if (
      !addressFormData.fullName.trim() ||
      !addressFormData.phone.trim() ||
      !addressFormData.street.trim() ||
      !addressFormData.city.trim() ||
      !addressFormData.state.trim() ||
      !addressFormData.postalCode.trim()
    ) {
      setAddressFormError('Please fill in all mandatory fields.');
      return;
    }

    if (addressFormData.postalCode.trim().length !== 6) {
      setAddressFormError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    try {
      if (editingAddressId) {
        await updateAddressMutation.mutateAsync({
          id: editingAddressId,
          addressData: addressFormData,
        });
        toast.success('Address updated successfully.', { title: 'Address Book' });
      } else {
        await addAddressMutation.mutateAsync(addressFormData);
        toast.success('New delivery address added successfully.', { title: 'Address Added' });
      }
      setIsAddressModalOpen(false);
    } catch (err: any) {
      setAddressFormError(err.response?.data?.message || 'Error saving address. Please check input.');
    }
  };

  // Handle Delete
  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddressMutation.mutateAsync(id);
      setDeletingAddressId(null);
      toast.success('Address removed from your address book.', { title: 'Address Deleted' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete address.', { title: 'Error' });
    }
  };

  // Handle Set Default
  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddressMutation.mutateAsync(id);
      toast.success('Default delivery address updated.', { title: 'Default Address' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to set default address.', { title: 'Error' });
    }
  };

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  return (
    <div className="min-h-screen pb-20 pt-8 sm:pt-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* PATRON BANNER CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-[#0F392B] p-6 sm:p-8 text-white shadow-emerald-lg border border-emerald-800/40">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(217,119,6,0.15),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Avatar with Camera upload trigger */}
              <div className="relative group flex-shrink-0">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[2px] shadow-md overflow-hidden">
                  <div className="w-full h-full rounded-[14px] bg-emerald-950 flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold text-amber-200 overflow-hidden relative">
                    {currentUser?.avatar && !currentUser.avatar.includes('photo-1534528741775-53994a69daeb') ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name || 'Patron'}
                        className="w-full h-full object-cover"
                      />
                    ) : currentUser?.name ? (
                      currentUser.name.charAt(0).toUpperCase()
                    ) : (
                      'P'
                    )}

                    {uploadAvatarMutation.isPending && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-amber-300 animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={uploadAvatarMutation.isPending}
                  title="Upload profile picture"
                  aria-label="Upload profile picture"
                  className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400 hover:bg-amber-300 text-emerald-950 flex items-center justify-center shadow-md border-2 border-emerald-950 transition-all hover:scale-110 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide">
                    {currentUser?.title ? `${currentUser.title}. ` : ''}
                    {currentUser?.name || 'Valued Patron'}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Verified Patron
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-emerald-100/80 flex-wrap">
                  {currentUser?.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-300" />
                      {currentUser.email}
                    </span>
                  )}
                  {currentUser?.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-300" />
                      +91 {currentUser.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-emerald-800/60 pt-4 sm:pt-0">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/10 text-center min-w-[90px]">
                <p className="text-lg font-bold text-amber-300 font-mono">{orders.length}</p>
                <p className="text-[10px] uppercase font-semibold tracking-wider text-emerald-100/70">Orders</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/10 text-center min-w-[90px]">
                <p className="text-lg font-bold text-amber-300 font-mono">{addresses.length}</p>
                <p className="text-[10px] uppercase font-semibold tracking-wider text-emerald-100/70">Addresses</p>
              </div>
              {defaultAddress && (
                <div className="hidden md:block bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/10 text-left max-w-[140px]">
                  <p className="text-xs font-bold text-amber-200 truncate">{defaultAddress.city}</p>
                  <p className="text-[10px] text-emerald-100/70 truncate">Primary City</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-emerald-900 text-white shadow-emerald-sm'
                : 'text-neutral-600 hover:text-emerald-900 hover:bg-emerald-50/60'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Personal Information</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'bg-emerald-900 text-white shadow-emerald-sm'
                : 'text-neutral-600 hover:text-emerald-900 hover:bg-emerald-50/60'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Manage Addresses ({addresses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-emerald-900 text-white shadow-emerald-sm'
                : 'text-neutral-600 hover:text-emerald-900 hover:bg-emerald-50/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>
        </div>

        {/* TAB CONTENT */}

        {/* TAB 1: PERSONAL INFORMATION */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-2xs space-y-6">
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="font-serif text-xl font-bold text-neutral-900 uppercase tracking-wide">
                  Patron Identity Details
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Keep your personal contact details current for royal dispatches and bespoke communication.
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Title
                    </label>
                    <select
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    >
                      <option value="">Select</option>
                      <option value="Mr">Mr.</option>
                      <option value="Ms">Ms.</option>
                      <option value="Mrs">Mrs.</option>
                      <option value="Dr">Dr.</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="e.g. Sultan Ahmed"
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="patron@domain.com"
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Mobile Number (10 Digits) *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs font-bold text-neutral-400 select-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value.replace(/\D/g, '') })}
                        placeholder="9876543210"
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl btn-emerald text-white text-xs font-bold uppercase tracking-wider shadow-emerald-sm hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{updateProfileMutation.isPending ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Side Card: Account Security & Quick Link */}
            <div className="space-y-6">
              <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100/80 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-950">
                      Imperial Patron Vault
                    </h3>
                    <p className="text-[11px] text-emerald-800/80">Secured with 256-bit encryption</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Your delivery addresses and contact information are used exclusively for courier dispatch from our Kannauj & Chennai distilleries.
                </p>
                <div className="pt-2 border-t border-emerald-200/50">
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className="w-full flex items-center justify-between text-xs font-bold text-emerald-800 hover:text-emerald-950 py-1"
                  >
                    <span>Manage Saved Addresses</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE ADDRESSES (ADDRESS BOOK) */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-2xs">
              <div>
                <h2 className="font-serif text-xl font-bold text-neutral-900 uppercase tracking-wide">
                  Saved Delivery Addresses
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Manage multiple shipping destinations for personal orders, gifting, and corporate ateliers.
                </p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl btn-emerald text-white text-xs font-bold uppercase tracking-wider shadow-emerald-sm hover:scale-[1.02] active:scale-98 transition-all flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Addresses Grid */}
            {isAddressesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-56 rounded-3xl bg-neutral-100 animate-pulse" />
                ))}
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-neutral-300 p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-neutral-900 uppercase">
                    No Addresses Saved Yet
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Add your primary residence or workplace to enjoy effortless 1-click checkout for your perfume orders.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl btn-emerald text-white text-xs font-bold uppercase tracking-wider shadow-emerald-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Address</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* "Add Address" Card */}
                <button
                  onClick={handleOpenAddModal}
                  className="h-full min-h-[220px] rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/60 hover:border-emerald-400 transition-all flex flex-col items-center justify-center p-6 text-center group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 text-emerald-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-800 group-hover:text-white transition-all shadow-2xs mb-3">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-xs uppercase tracking-wider text-emerald-950 group-hover:text-emerald-800">
                    Add Another Address
                  </span>
                  <span className="text-[11px] text-neutral-500 mt-1">
                    Home, Office, or Gifting Destination
                  </span>
                </button>

                {/* Address Cards */}
                {addresses.map((addr) => {
                  const isDefault = Boolean(addr.isDefault);
                  return (
                    <div
                      key={addr._id}
                      className={`relative rounded-3xl p-6 bg-white border transition-all flex flex-col justify-between ${
                        isDefault
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-sm'
                          : 'border-neutral-200 hover:border-emerald-300 shadow-2xs'
                      }`}
                    >
                      {/* Top Badges & Type */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                              addr.addressType === 'Home'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : addr.addressType === 'Work'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {addr.addressType === 'Home' ? (
                              <Home className="w-3 h-3" />
                            ) : addr.addressType === 'Work' ? (
                              <Briefcase className="w-3 h-3" />
                            ) : (
                              <Building className="w-3 h-3" />
                            )}
                            {addr.addressType || 'Home'}
                          </span>

                          {isDefault && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              Default
                            </span>
                          )}
                        </div>

                        {/* Recipient info */}
                        <div>
                          <h4 className="font-bold text-sm text-neutral-900">{addr.fullName}</h4>
                          <p className="text-xs text-emerald-800 font-medium mt-0.5">
                            +91 {addr.phone}
                          </p>
                        </div>

                        {/* Detailed Address */}
                        <div className="text-xs text-neutral-600 leading-relaxed font-sans space-y-0.5 pt-1 border-t border-neutral-100">
                          <p className="line-clamp-2">{addr.street}</p>
                          {addr.landmark && (
                            <p className="text-neutral-500 italic text-[11px]">
                              Landmark: {addr.landmark}
                            </p>
                          )}
                          <p className="font-medium text-neutral-800">
                            {addr.city}, {addr.state} - {addr.postalCode}
                          </p>
                          <p className="text-[11px] text-neutral-500">{addr.country || 'India'}</p>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                        {!isDefault ? (
                          <button
                            onClick={() => addr._id && handleSetDefault(addr._id)}
                            className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
                          >
                            Set as Default
                          </button>
                        ) : (
                          <span className="text-[11px] text-neutral-400 italic">Primary dispatch address</span>
                        )}

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(addr)}
                            className="p-1.5 rounded-xl text-neutral-500 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                            title="Edit Address"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => addr._id && setDeletingAddressId(addr._id)}
                            className="p-1.5 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-neutral-900 uppercase tracking-wide">
                  Order Archives ({orders.length})
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Detailed ledger of your artisanal attar acquisitions and real-time shipment status.
                </p>
              </div>
              <Link
                href="/orders"
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950"
              >
                <span>Full Orders Page</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Package className="w-12 h-12 text-neutral-400 mx-auto" />
                <p className="text-xs text-neutral-600 font-medium">No fragrance orders placed yet.</p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-2.5 rounded-2xl btn-emerald text-white text-xs font-bold uppercase tracking-wider"
                >
                  Discover Fragrances
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 rounded-2xl border border-neutral-100 hover:border-emerald-200 bg-neutral-50/50 hover:bg-emerald-50/20 transition-all text-xs"
                  >
                    <div className="space-y-1">
                      <p className="font-mono font-bold text-emerald-900">#{order.orderNumber}</p>
                      <p className="text-neutral-500 text-[11px]">
                        {order.orderItems?.length || 1} Item(s) • Total: ₹{order.totalPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900">
                        {order.orderStatus}
                      </span>
                      <Link
                        href={`/orders?id=${order._id}`}
                        className="text-neutral-500 hover:text-emerald-800 font-semibold"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD / EDIT ADDRESS MODAL */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 uppercase tracking-wide">
                  {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Complete destination coordinates for royal consignment delivery.
                </p>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addressFormError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{addressFormError}</span>
              </div>
            )}

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              {/* Address Type Selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['Home', 'Work', 'Other'] as const).map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setAddressFormData({ ...addressFormData, addressType: type })}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all ${
                        addressFormData.addressType === type
                          ? 'border-emerald-800 bg-emerald-900 text-white shadow-xs'
                          : 'border-neutral-200 bg-neutral-50/60 text-neutral-700 hover:bg-emerald-50/50'
                      }`}
                    >
                      {type === 'Home' ? (
                        <Home className="w-3.5 h-3.5" />
                      ) : type === 'Work' ? (
                        <Briefcase className="w-3.5 h-3.5" />
                      ) : (
                        <Building className="w-3.5 h-3.5" />
                      )}
                      <span>{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Receiver Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.fullName}
                    onChange={(e) => setAddressFormData({ ...addressFormData, fullName: e.target.value })}
                    placeholder="Recipient name"
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Contact Phone (10 digits) *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-bold text-neutral-400 select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={addressFormData.phone}
                      onChange={(e) =>
                        setAddressFormData({
                          ...addressFormData,
                          phone: e.target.value.replace(/\D/g, ''),
                        })
                      }
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Flat / House No., Building Name, Street *
                </label>
                <input
                  type="text"
                  required
                  value={addressFormData.street}
                  onChange={(e) => setAddressFormData({ ...addressFormData, street: e.target.value })}
                  placeholder="e.g. Flat 402, Royal Residency, Palace Road"
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={addressFormData.landmark}
                  onChange={(e) => setAddressFormData({ ...addressFormData, landmark: e.target.value })}
                  placeholder="e.g. Near Grand Mosque / Behind Clock Tower"
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
              </div>

              {/* City, State, PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.city}
                    onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                    placeholder="e.g. Chennai"
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    State *
                  </label>
                  <select
                    required
                    value={addressFormData.state}
                    onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  >
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    PIN Code (6 digits) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addressFormData.postalCode}
                    onChange={(e) =>
                      setAddressFormData({
                        ...addressFormData,
                        postalCode: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    placeholder="600001"
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Set as Default Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={addressFormData.isDefault}
                    onChange={(e) =>
                      setAddressFormData({ ...addressFormData, isDefault: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-500 border-neutral-300"
                  />
                  <span className="text-xs font-medium text-neutral-700">
                    Set this as my default delivery address
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addAddressMutation.isPending || updateAddressMutation.isPending}
                  className="px-6 py-2.5 rounded-2xl btn-emerald text-white text-xs font-bold uppercase tracking-wider shadow-emerald-sm hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50"
                >
                  {editingAddressId ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingAddressId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-neutral-200 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-neutral-900 uppercase">
                Delete Address?
              </h4>
              <p className="text-xs text-neutral-500 mt-1">
                Are you sure you want to remove this delivery address from your account?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingAddressId(null)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50"
              >
                Keep Address
              </button>
              <button
                onClick={() => handleDeleteAddress(deletingAddressId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
