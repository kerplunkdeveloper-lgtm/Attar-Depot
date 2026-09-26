'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  LogOut,
  ExternalLink,
  Search,
  Copy,
  Check,
  Clock,
  Truck,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store';
import { openAuthModal } from '@/store/uiSlice';
import { logout } from '@/store/authSlice';
import {
  useProfile,
  useUpdateProfile,
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useUploadAvatar,
  useDeleteAvatar,
  useDeleteAccount,
} from '@/hooks/useProfile';
import { useMyOrders } from '@/hooks/useOrders';
import { UserAddress, Order, OrderItem } from '@/types';
import { toast } from '@/lib/toast';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

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

  // Active view tab: on desktop, left is profile, right toggles addresses / orders. On mobile, all 3 tabs are selectable.
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('addresses');

  // React Query Hooks
  const { data: profileUser, isLoading: isProfileLoading } = useProfile(isAuthenticated);
  const { data: addresses = [], isLoading: isAddressesLoading } = useAddresses(isAuthenticated);
  const { data: orders = [], isLoading: isOrdersLoading } = useMyOrders(isAuthenticated);

  const updateProfileMutation = useUpdateProfile();
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const setDefaultAddressMutation = useSetDefaultAddress();
  const uploadAvatarMutation = useUploadAvatar();
  const deleteAvatarMutation = useDeleteAvatar();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  // Delete Address Confirm State
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

  // Orders Filter & Search State
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Avatar Handlers
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
      toast.success('Your profile picture has been updated.', { title: 'Avatar Saved' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload image.', { title: 'Upload Failed' });
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatarMutation.mutateAsync();
      toast.success('Profile photo removed.', { title: 'Photo Deleted' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove photo.', { title: 'Error' });
    }
  };

  // Profile Update Submit
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
      toast.success('Your profile details have been saved successfully.', {
        title: 'Profile Updated',
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile. Please try again.', {
        title: 'Update Error',
      });
    }
  };



  // Sign Out Handler
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    dispatch(logout());
    toast.success('You have been signed out safely.', { title: 'Signed Out' });
    router.push('/');
  };

  // Address Modal Openers
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

  // Address Submit Handler
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressFormError(null);

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
        toast.success('New delivery destination added successfully.', { title: 'Address Added' });
      }
      setIsAddressModalOpen(false);
    } catch (err: any) {
      setAddressFormError(err.response?.data?.message || 'Error saving address. Please check input.');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddressMutation.mutateAsync(id);
      setDeletingAddressId(null);
      toast.success('Address removed from your address book.', { title: 'Address Deleted' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete address.', { title: 'Error' });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddressMutation.mutateAsync(id);
      toast.success('Default delivery address updated.', { title: 'Default Address' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to set default address.', { title: 'Error' });
    }
  };

  const handleCopyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrderId(orderNumber);
    toast.success(`Copied #${orderNumber} to clipboard!`);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  // Filtered Orders Calculation
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        !orderSearchQuery ||
        order.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        order.orderItems?.some((item) => item.name.toLowerCase().includes(orderSearchQuery.toLowerCase()));

      const matchesStatus =
        orderStatusFilter === 'all' ||
        order.orderStatus.toLowerCase() === orderStatusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearchQuery, orderStatusFilter]);

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Delivered</span>
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Truck className="w-3.5 h-3.5 text-indigo-600" />
            <span>In Transit / Shipped</span>
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Preparing Flacons</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
            <X className="w-3.5 h-3.5 text-red-600" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 border border-neutral-300">
            <Clock className="w-3.5 h-3.5 text-neutral-600" />
            <span>Order Placed (Pending)</span>
          </span>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-emerald-100 shadow-emerald-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
            <UserIcon className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 uppercase tracking-wide">
              Customer Account Access
            </h1>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              Sign in to manage your delivery address book, track bespoke consignments, and update your personal profile.
            </p>
          </div>
          <button
            onClick={() => dispatch(openAuthModal('login'))}
            className="w-full py-3.5 rounded-2xl btn-emerald text-white text-xs font-bold uppercase tracking-wider shadow-emerald-md hover:scale-[1.02] transition-all cursor-pointer"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const hasCustomAvatar =
    currentUser?.avatar &&
    !currentUser.avatar.includes('photo-1534528741775-53994a69daeb') &&
    currentUser.avatar.trim().length > 0;

  return (
    <div className="min-h-screen pb-24 pt-6 sm:pt-10 font-sans bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">


        {/* MOBILE SEGMENTED CONTROLS (< lg screen) */}
        <div className="lg:hidden flex items-center gap-1.5 p-1.5 bg-neutral-200/70 rounded-2xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-neutral-700 hover:text-emerald-950'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-neutral-700 hover:text-emerald-950'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Addresses ({addresses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-neutral-700 hover:text-emerald-950'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>
        </div>

        {/* MAIN DESKTOP GRID LAYOUT (12 Columns: 4 Left / 8 Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ======================================================== */}
          {/* LEFT SIDEBAR: PROFILE OVERVIEW + UPDATE + DELETE ACCOUNT */}
          {/* ======================================================== */}
          <aside
            className={`lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24 ${
              activeTab !== 'profile' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* CARD 1: PROFILE SUMMARY & AVATAR EDIT */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-2xs overflow-hidden">
              <div className="h-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.2),transparent_70%)]" />
              </div>

              <div className="px-6 pb-6 pt-0 relative space-y-4">
                {/* Avatar with Camera & Delete Photo triggers */}
                <div className="flex items-end justify-between -mt-10 mb-2">
                  <div className="relative group flex-shrink-0">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[2.5px] shadow-lg overflow-hidden bg-white">
                      <div className="w-full h-full rounded-[13px] bg-emerald-950 flex items-center justify-center font-serif text-3xl font-bold text-amber-200 overflow-hidden relative">
                        {hasCustomAvatar ? (
                          <img
                            src={currentUser?.avatar}
                            alt={currentUser?.name || 'Customers'}
                            className="w-full h-full object-cover"
                          />
                        ) : currentUser?.name ? (
                          currentUser.name.charAt(0).toUpperCase()
                        ) : (
                          'P'
                        )}

                        {(uploadAvatarMutation.isPending || deleteAvatarMutation.isPending) && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-amber-300 animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Change Photo Button */}
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      disabled={uploadAvatarMutation.isPending}
                      title="Upload new profile picture"
                      aria-label="Upload profile picture"
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 hover:bg-amber-300 text-emerald-950 flex items-center justify-center shadow-md border-2 border-white transition-all hover:scale-110 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Remove Photo Button if custom avatar is active */}
                  {hasCustomAvatar && (
                    <button
                      type="button"
                      onClick={handleDeleteAvatar}
                      disabled={deleteAvatarMutation.isPending}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      title="Delete profile picture"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {/* User Identity Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl font-bold text-neutral-900 tracking-wide">
                      {currentUser?.title ? `${currentUser.title}. ` : ''}
                      {currentUser?.name || 'Valued Customers'}
                    </h2>
                    <span title="Verified Customers">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 flex-shrink-0" />
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-neutral-600 font-medium">
                    {currentUser?.email && (
                      <p className="flex items-center gap-2 text-neutral-600">
                        <Mail className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                        <span className="truncate">{currentUser.email}</span>
                      </p>
                    )}
                    {currentUser?.phone && (
                      <p className="flex items-center gap-2 text-neutral-600">
                        <Phone className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                        <span>+91 {currentUser.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

               
              </div>
            </div>

            {/* CARD 2: UPDATE PROFILE FORM */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-2xs space-y-5">
              <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900 uppercase tracking-wide">
                    Update Profile
                  </h3>
                  <p className="text-[11px] text-neutral-500">Edit your royal credentials & contact</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Title
                    </label>
                    <select
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/60 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all cursor-pointer"
                    >
                      <option value="">None</option>
                      <option value="Mr">Mr.</option>
                      <option value="Ms">Ms.</option>
                      <option value="Mrs">Mrs.</option>
                      <option value="Dr">Dr.</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="e.g. Sultan Ahmed"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/60 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    placeholder="Customers@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/60 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Mobile Number (10 Digits) *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-neutral-400 select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, phone: e.target.value.replace(/\D/g, '') })
                      }
                      placeholder="9876543210"
                      className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/60 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                    title="Sign out of account"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>

                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="flex-1 py-3 rounded-2xl btn-emerald text-white text-xs font-bold uppercase tracking-wider shadow-emerald-sm hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
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

          </aside>

          {/* ======================================================== */}
          {/* RIGHT MAIN PANEL: ADDRESSES & MY ORDERS                  */}
          {/* ======================================================== */}
          <main className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* DESKTOP TAB NAVIGATION CONTROLS */}
            <div className="hidden lg:flex items-center gap-3 border-b border-neutral-200 pb-2">
              <button
                onClick={() => setActiveTab('addresses')}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'addresses' || activeTab === 'profile'
                    ? 'bg-emerald-900 text-white shadow-emerald-sm'
                    : 'text-neutral-600 hover:text-emerald-900 hover:bg-emerald-50/70'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses ({addresses.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-emerald-900 text-white shadow-emerald-sm'
                    : 'text-neutral-600 hover:text-emerald-900 hover:bg-emerald-50/70'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Orders ({orders.length})</span>
              </button>
            </div>

            {/* ==================================================== */}
            {/* SECTION 1: PERSONAL INFORMATION & SAVED ADDRESSES    */}
            {/* ==================================================== */}
            {(activeTab === 'addresses' || activeTab === 'profile') && (
              <div className={`space-y-6 ${activeTab === 'profile' ? 'hidden lg:block' : 'block'}`}>
                {/* Header with Add Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 uppercase tracking-wide">
                        Saved Delivery Addresses
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
                        {addresses.length} Total
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Manage primary residences, corporate offices, and gifting destinations.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl btn-emerald text-white text-xs font-bold uppercase tracking-wider shadow-emerald-sm hover:scale-[1.02] active:scale-98 transition-all flex-shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {/* Primary Destination Highlight (if default exists) */}
                {defaultAddress && (
                  <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-[#0A3828] text-white p-5 rounded-3xl border border-emerald-800 shadow-emerald-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-5 h-5 text-amber-300" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400 text-emerald-950">
                            Primary Delivery Destination
                          </span>
                          <span className="text-xs text-emerald-200 font-semibold">
                            {defaultAddress.addressType || 'Home'}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white">
                          {defaultAddress.fullName} (+91 {defaultAddress.phone})
                        </h4>
                        <p className="text-xs text-emerald-100/80 line-clamp-1">
                          {defaultAddress.street}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.postalCode}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenEditModal(defaultAddress)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider text-white border border-white/20 transition-all flex-shrink-0 cursor-pointer"
                    >
                      Edit Address
                    </button>
                  </div>
                )}

                {/* Address Cards Grid */}
                {isAddressesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((n) => (
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
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl btn-emerald text-white text-xs font-bold uppercase tracking-wider shadow-emerald-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Address</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Interactive "Add Another Address" Card */}
                    <button
                      onClick={handleOpenAddModal}
                      className="h-full min-h-[220px] rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/60 hover:border-emerald-400 transition-all flex flex-col items-center justify-center p-6 text-center group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 text-emerald-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-800 group-hover:text-white transition-all shadow-2xs mb-3">
                        <Plus className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-xs uppercase tracking-wider text-emerald-950 group-hover:text-emerald-800">
                        Add Another Destination
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
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
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
                              <p className="text-[11px] text-neutral-400">{addr.country || 'India'}</p>
                            </div>
                          </div>

                          {/* Card Actions */}
                          <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                            {!isDefault ? (
                              <button
                                onClick={() => addr._id && handleSetDefault(addr._id)}
                                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                              >
                                Set as Default
                              </button>
                            ) : (
                              <span className="text-[11px] text-neutral-400 italic">Primary dispatch address</span>
                            )}

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditModal(addr)}
                                className="p-2 rounded-xl text-neutral-500 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                                title="Edit Address"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => addr._id && setDeletingAddressId(addr._id)}
                                className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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

            {/* ==================================================== */}
            {/* SECTION 2: MY ORDERS (HIGH-END LUXURY UI/UX)         */}
            {/* ==================================================== */}
            {activeTab === 'orders' && (
              <div className="space-y-6">


                {/* 2. SEARCH & STATUS FILTER CONTROLS */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-neutral-200/80 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        placeholder="Search by order number or fragrance name..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-neutral-200 bg-neutral-50/60 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                      />
                      {orderSearchQuery && (
                        <button
                          onClick={() => setOrderSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <Link
                      href="/orders"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl border border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-emerald-900 hover:bg-neutral-50 transition-all flex-shrink-0"
                    >
                      <span>Full Archive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Status Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
                    {[
                      { key: 'all', label: 'All Orders', count: orders.length },
                      {
                        key: 'pending',
                        label: 'Pending',
                        count: orders.filter((o) => o.orderStatus === 'Pending').length,
                      },
                      {
                        key: 'processing',
                        label: 'Processing',
                        count: orders.filter((o) => o.orderStatus === 'Processing').length,
                      },
                      {
                        key: 'shipped',
                        label: 'In Transit',
                        count: orders.filter((o) => o.orderStatus === 'Shipped').length,
                      },
                      {
                        key: 'delivered',
                        label: 'Delivered',
                        count: orders.filter((o) => o.orderStatus === 'Delivered').length,
                      },
                      {
                        key: 'cancelled',
                        label: 'Cancelled',
                        count: orders.filter((o) => o.orderStatus === 'Cancelled').length,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setOrderStatusFilter(tab.key as any)}
                        className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                          orderStatusFilter === tab.key
                            ? 'bg-emerald-900 text-white shadow-xs'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                            orderStatusFilter === tab.key
                              ? 'bg-emerald-800 text-amber-200'
                              : 'bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. ORDERS LIST */}
                {isOrdersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="h-44 rounded-3xl bg-neutral-100 animate-pulse" />
                    ))}
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-neutral-200/80 shadow-2xs">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg font-bold text-neutral-900 uppercase">
                        {orderSearchQuery || orderStatusFilter !== 'all'
                          ? 'No Orders Match Your Filter'
                          : 'No Fragrance Orders Dispatched Yet'}
                      </h3>
                      <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                        {orderSearchQuery || orderStatusFilter !== 'all'
                          ? 'Try clearing your search query or selecting another status tab.'
                          : 'You have not placed any orders yet. Discover our artisanal attars and pure perfume oils.'}
                      </p>
                    </div>
                    {orderSearchQuery || orderStatusFilter !== 'all' ? (
                      <button
                        onClick={() => {
                          setOrderSearchQuery('');
                          setOrderStatusFilter('all');
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    ) : (
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl btn-emerald text-white text-xs font-bold uppercase tracking-wider shadow-emerald-sm"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Discover Fragrances</span>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-white rounded-3xl border border-neutral-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-emerald-sm transition-all overflow-hidden"
                      >
                        {/* Order Card Top Bar */}
                        <div className="p-4 sm:p-5 bg-neutral-50/70 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-xs sm:text-sm text-emerald-950">
                                #{order.orderNumber}
                              </span>
                              <button
                                onClick={() => handleCopyOrderNumber(order.orderNumber)}
                                className="p-1 rounded hover:bg-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors"
                                title="Copy order number"
                              >
                                {copiedOrderId === order.orderNumber ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <span className="text-neutral-300">•</span>
                            <span className="text-xs text-neutral-500 font-medium">
                              {formatDate(order.createdAt)}
                            </span>
                            <span className="text-neutral-300">•</span>
                            <span className="text-[11px] font-bold text-neutral-700 px-2 py-0.5 rounded bg-neutral-200/70">
                              {order.paymentMethod || 'COD'}
                            </span>
                          </div>

                          <div>{getOrderStatusBadge(order.orderStatus)}</div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="p-4 sm:p-5 space-y-3">
                          <div className="divide-y divide-neutral-100">
                            {order.orderItems?.slice(0, 3).map((item, idx) => (
                              <div
                                key={idx}
                                className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden flex-shrink-0 relative">
                                    {item.image ? (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                        <Package className="w-5 h-5" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-neutral-900 truncate">
                                      {item.name}
                                    </h4>
                                    <p className="text-[11px] text-neutral-500">
                                      Size: {item.size} • Qty: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-xs font-bold text-neutral-900 font-mono">
                                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {order.orderItems && order.orderItems.length > 3 && (
                            <p className="text-[11px] text-neutral-500 italic pt-1">
                              + {order.orderItems.length - 3} more fragrance item(s) in this consignment
                            </p>
                          )}
                        </div>

                        {/* Order Card Footer */}
                        <div className="p-4 sm:p-5 bg-neutral-50/50 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="space-y-0.5 text-xs text-neutral-600">
                            {order.shippingAddress && (
                              <p className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                                <span>
                                  Delivering to:{' '}
                                  <strong className="text-neutral-900">
                                    {order.shippingAddress.fullName || 'Recipient'}
                                  </strong>{' '}
                                  ({order.shippingAddress.city}, {order.shippingAddress.postalCode})
                                </span>
                              </p>
                            )}
                            {order.trackingNumber && (
                              <p className="text-[11px] text-emerald-800 font-medium">
                                AWB Tracking: <span className="font-mono">{order.trackingNumber}</span>
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200">
                            <div className="text-left sm:text-right">
                              <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                                Order Total
                              </span>
                              <span className="font-serif text-base sm:text-lg font-bold text-emerald-950">
                                ₹{order.totalPrice.toLocaleString('en-IN')}
                              </span>
                            </div>

                            <Link
                              href={`/orders?id=${order._id}`}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl btn-emerald text-white text-xs font-bold uppercase tracking-wider shadow-emerald-xs hover:scale-[1.02] active:scale-98 transition-all"
                            >
                              <span>View Details</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ADD / EDIT DELIVERY ADDRESS                     */}
      {/* ======================================================== */}
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
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
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
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
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
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-mono"
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
                    className="w-full px-3.5 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all cursor-pointer"
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
                  className="px-5 py-2.5 rounded-2xl border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addAddressMutation.isPending || updateAddressMutation.isPending}
                  className="px-6 py-2.5 rounded-2xl btn-emerald text-white text-xs font-bold uppercase tracking-wider shadow-emerald-sm hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {editingAddressId ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: DELETE ADDRESS CONFIRMATION                     */}
      {/* ======================================================== */}
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
                Are you sure you want to remove this delivery address from your address book?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingAddressId(null)}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 cursor-pointer"
              >
                Keep Address
              </button>
              <button
                onClick={() => handleDeleteAddress(deletingAddressId)}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
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
