'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useAdmin';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { toast } from '@/lib/toast';

export default function AdminOrdersPage() {
  const isLight = true;

  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [trackingModal, setTrackingModal] = useState<{ id: string; status: string; trackingNumber: string } | null>(null);

  const { data, isLoading } = useAdminOrders(selectedStatus);
  const orders = data?.orders || [];
  const updateStatusMutation = useUpdateOrderStatus();

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
      toast.success(`Order status updated to ${newStatus}.`, {
        title: 'Fulfillment Updated',
      });
    } catch (e) {
      toast.error('Failed to update order status.', {
        title: 'Update Failed',
      });
    }
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModal) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: trackingModal.id,
        status: trackingModal.status,
        trackingNumber: trackingModal.trackingNumber,
      });
      setTrackingModal(null);
      toast.success('Courier airway tracking number attached successfully.', {
        title: 'Tracking Attached',
      });
    } catch (e) {
      toast.error('Error attaching tracking number.', {
        title: 'Error',
      });
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      ord.orderNumber.toLowerCase().includes(q) ||
      (ord.shippingAddress?.fullName || '').toLowerCase().includes(q) ||
      (ord.shippingAddress?.phone || '').includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Executive Header */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 backdrop-blur-xl shadow-lg transition-all ${
          isLight
            ? 'bg-gradient-to-r from-[#EBF7F2] via-[#E4F4EC] to-[#DCF1E6] border-[#B2DFD0] text-[#022D24] shadow-emerald-950/5'
            : 'bg-gradient-to-r from-[#0C1714] via-[#091310] to-[#08100D] border-[#1C332B] text-white shadow-black/60'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isLight ? 'text-emerald-800' : 'text-emerald-400'
              }`}
            >
              Dispatch & Logistics Console
            </span>
            <span className="text-neutral-400">&bull;</span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                isLight
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {orders.length} Consignments Recorded
            </span>
          </div>
          <h1
            className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight ${
              isLight ? 'text-[#022D24]' : 'text-white'
            }`}
          >
            Consignment Orders
          </h1>
          <p className={`text-xs mt-1 max-w-xl ${isLight ? 'text-emerald-900/70' : 'text-neutral-400'}`}>
            Review customer orders, transition fulfillment lifecycle, attach courier airway tracking, and monitor payments.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div
          className={`flex flex-wrap gap-1 p-1 rounded-2xl border text-xs shadow-md self-start lg:self-auto ${
            isLight ? 'bg-white/90 border-emerald-300/80' : 'bg-[#0A1210] border-[#1E332B]'
          }`}
        >
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                selectedStatus === st
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold shadow-md'
                  : isLight
                  ? 'text-emerald-900/70 hover:text-emerald-950 hover:bg-emerald-100/50'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Search */}
      <div className="max-w-md relative">
        <Search
          className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
            isLight ? 'text-slate-400' : 'text-neutral-500'
          }`}
        />
        <input
          type="text"
          placeholder="Filter by order number, patron name, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-9 pr-9 py-2.5 text-xs rounded-xl focus:outline-none focus:ring-2 transition-all font-poppins shadow-xs ${
            isLight
              ? 'bg-white border border-emerald-300/80 text-emerald-950 placeholder-emerald-800/40 focus:ring-emerald-500/20 focus:border-emerald-600'
              : 'bg-[#0A1210] border border-[#1E332B] text-white placeholder-neutral-500 focus:ring-emerald-500/20 focus:border-emerald-400'
          }`}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${
              isLight ? 'text-emerald-700 hover:text-emerald-950' : 'text-neutral-500 hover:text-white'
            }`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Consignments Container (Responsive Table Card) */}
      <div
        className={`rounded-3xl border overflow-hidden backdrop-blur-xl transition-all shadow-xl ${
          isLight
            ? 'bg-white/95 border-[#BCE3D7] shadow-emerald-950/5'
            : 'bg-gradient-to-b from-[#0F1916] to-[#0A1210] border-[#1E332B] shadow-black/70'
        }`}
      >
        {/* Mobile View: Cards Layout */}
        <div className="md:hidden p-3.5 space-y-3">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Retrieving consignments database...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              No orders matching &quot;{selectedStatus}&quot;.
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <div
                key={`m-ord-${ord._id}`}
                className={`p-4 rounded-2xl border transition-all ${
                  isLight ? 'bg-white/80 border-emerald-200/80 shadow-xs' : 'bg-[#091512] border-[#1E332B]'
                } space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-xs">
                      <span className="text-emerald-500">#</span>{ord.orderNumber}
                    </span>
                    <span className="text-[10px] text-neutral-400 block">{formatDate(ord.createdAt)}</span>
                  </div>
                  <select
                    value={ord.orderStatus}
                    onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                    className={`rounded-xl px-2.5 py-1 text-xs font-bold border transition-colors cursor-pointer ${
                      isLight
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-[#0A1210] border-[#1E332B] text-emerald-300'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-bold">{ord.shippingAddress?.fullName || 'Guest'}</p>
                  <p className="text-[11px] text-neutral-400">
                    {ord.shippingAddress?.city}, {ord.shippingAddress?.state} • {ord.shippingAddress?.phone}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    {ord.orderItems?.length || 0} item(s) • {ord.paymentMethod} ({ord.paymentStatus})
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-emerald-500/10 text-xs">
                  <p className={`font-poppins font-bold text-sm ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                    {formatPrice(ord.totalPrice)}
                  </p>
                  {ord.trackingNumber ? (
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      {ord.trackingNumber}
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        setTrackingModal({
                          id: ord._id,
                          status: ord.orderStatus,
                          trackingNumber: '',
                        })
                      }
                      className="text-[11px] font-bold text-emerald-600 hover:underline"
                    >
                      + Add Tracking
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Wide Data Table */}
        <div className="hidden md:block overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead
              className={`uppercase tracking-wider font-semibold border-b ${
                isLight ? 'bg-[#F4FAF6] text-emerald-950 border-[#BCE3D7]' : 'bg-[#09110F] text-neutral-400 border-[#1E332B]'
              }`}
            >
              <tr>
                <th className="p-4 pl-6">Order Ref</th>
                <th className="p-4">Patron</th>
                <th className="p-4">Consignment Items</th>
                <th className="p-4">Valuation</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status & Dispatch</th>
                <th className="p-4 pr-6 text-right">Tracking Airway</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isLight ? 'divide-[#E8F5EF] text-slate-700' : 'divide-[#162520] text-neutral-300'
              }`}
            >
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span>Retrieving orders database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-500">
                    No orders matching &quot;{selectedStatus}&quot;.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr
                    key={ord._id}
                    className={`transition-colors ${isLight ? 'hover:bg-emerald-50/40' : 'hover:bg-[#12211C]/80'}`}
                  >
                    <td className="p-4 pl-6">
                      <span className={`font-mono font-bold block text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        <span className="text-emerald-500">#</span>{ord.orderNumber}
                      </span>
                      <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
                        {formatDate(ord.createdAt)}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {ord.shippingAddress?.fullName || 'Guest'}
                      </p>
                      <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                        {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                      </p>
                      <p className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
                        {ord.shippingAddress?.phone}
                      </p>
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="space-y-1">
                        {ord.orderItems?.map((item: any, i: number) => (
                          <p
                            key={i}
                            className={`truncate text-[11px] font-medium ${
                              isLight ? 'text-slate-700' : 'text-neutral-300'
                            }`}
                          >
                            • {item.name} ({item.size}) × {item.quantity}
                          </p>
                        ))}
                      </div>
                    </td>

                    <td className={`p-4 font-poppins font-bold text-sm ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                      {formatPrice(ord.totalPrice)}
                    </td>

                    <td className="p-4">
                      <span className={`font-medium block ${isLight ? 'text-slate-800' : 'text-neutral-300'}`}>
                        {ord.paymentMethod}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          ord.paymentStatus === 'Completed' ? 'text-emerald-600' : 'text-amber-500'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold cursor-pointer border shadow-xs transition-colors ${
                          isLight
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 focus:bg-white'
                            : 'bg-[#0A1210] border-[#1E332B] text-emerald-300 focus:border-emerald-500'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      {ord.trackingNumber ? (
                        <span
                          className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg border ${
                            isLight
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-[#0A1210] text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {ord.trackingNumber}
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            setTrackingModal({
                              id: ord._id,
                              status: ord.orderStatus,
                              trackingNumber: '',
                            })
                          }
                          className={`text-[11px] font-bold hover:underline ${
                            isLight ? 'text-emerald-700' : 'text-emerald-400'
                          }`}
                        >
                          + Add Tracking
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking Modal */}
      {trackingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs p-4 flex items-center justify-center animate-in fade-in duration-200">
          <div
            className={`border rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl ${
              isLight ? 'bg-white border-emerald-300' : 'bg-[#0A1210] border-[#1E332B]'
            }`}
          >
            <h3
              className={`font-serif text-sm font-bold uppercase tracking-wider ${
                isLight ? 'text-emerald-950' : 'text-white'
              }`}
            >
              Attach Airway Courier Tracking
            </h3>
            <form onSubmit={handleSaveTracking} className="space-y-3 text-xs">
              <div>
                <label
                  className={`block mb-1 font-semibold font-poppins ${
                    isLight ? 'text-emerald-950' : 'text-neutral-300'
                  }`}
                >
                  Airway Tracking Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BLUEDART-98421482"
                  value={trackingModal.trackingNumber}
                  onChange={(e) =>
                    setTrackingModal({ ...trackingModal, trackingNumber: e.target.value })
                  }
                  className={`w-full rounded-xl px-3.5 py-2 font-mono text-xs focus:outline-none focus:ring-2 ${
                    isLight
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-950 focus:bg-white focus:ring-emerald-500/20'
                      : 'bg-[#070D0B] border border-[#1E332B] text-white focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTrackingModal(null)}
                  className={`px-3 py-1.5 font-medium ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-neutral-400 hover:text-white'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateStatusMutation.isPending}
                  className="px-4 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[11px] text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-md shadow-emerald-950/30"
                >
                  {updateStatusMutation.isPending ? 'Saving...' : 'Attach Number'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
