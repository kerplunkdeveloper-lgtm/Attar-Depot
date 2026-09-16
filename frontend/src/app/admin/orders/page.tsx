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

export default function AdminOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [trackingModal, setTrackingModal] = useState<{ id: string; status: string; trackingNumber: string } | null>(null);
  const [feedback, setFeedback] = useState('');

  const { data, isLoading } = useAdminOrders(selectedStatus);
  const orders = data?.orders || [];
  const updateStatusMutation = useUpdateOrderStatus();

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
      setFeedback(`Order status transitioned to ${newStatus}.`);
      setTimeout(() => setFeedback(''), 3000);
    } catch (e) {
      setFeedback('Failed to update status.');
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
      setFeedback('Courier airway tracking number attached.');
      setTimeout(() => setFeedback(''), 3000);
    } catch (e) {
      setFeedback('Error attaching tracking number.');
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E332B] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] text-neutral-400 font-medium">
              {orders.length} Order Recorded
            </span>
          </div>
          <h1 className="font-poppins text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Consignment Orders
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Review customer orders, transition fulfillment lifecycle, attach courier airway tracking, and monitor payments.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1 bg-[#0A1210] p-1 rounded-2xl border border-[#1E332B] text-xs shadow-md self-start sm:self-auto">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedStatus === st
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-[#0E1F1A] border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-medium">{feedback}</span>
          </div>
          <button onClick={() => setFeedback('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by order number, patron name, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-[#0A1210] border border-[#1E332B] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-white placeholder-neutral-500 font-poppins shadow-inner"
        />
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0F1916] to-[#0A1210] border border-[#1E332B] overflow-hidden shadow-2xl shadow-black/60 relative">
        <div className="md:hidden px-4 py-1.5 text-[10px] text-emerald-400 bg-[#0A1512] flex items-center justify-between border-b border-[#1E332B]">
          <span>Scroll horizontally for full consignment lifecycle</span>
          <span className="font-mono text-[11px]">&rarr;</span>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead className="bg-[#09110F] text-neutral-400 uppercase tracking-wider font-semibold border-b border-[#1E332B]">
              <tr>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Patron</th>
                <th className="p-4">Consignment Items</th>
                <th className="p-4">Valuation</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status & Dispatch</th>
                <th className="p-4 text-right">Tracking Airway</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162520] text-neutral-300">
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
                    No orders matching "{selectedStatus}".
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#12211C]/80 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-white block text-sm">
                        <span className="text-emerald-400">#</span>{ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {formatDate(ord.createdAt)}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-white">
                        {ord.shippingAddress?.fullName || 'Guest'}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                      </p>
                      <p className="text-[10px] text-neutral-500 font-mono">
                        {ord.shippingAddress?.phone}
                      </p>
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="space-y-1">
                        {ord.orderItems?.map((item, i) => (
                          <p key={i} className="truncate text-[11px] text-neutral-300 font-medium">
                            • {item.name} ({item.size}) × {item.quantity}
                          </p>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 font-poppins font-bold text-emerald-400 text-sm">
                      {formatPrice(ord.totalPrice)}
                    </td>

                    <td className="p-4">
                      <span className="text-neutral-300 font-medium block">{ord.paymentMethod}</span>
                      <span
                        className={`text-[10px] font-bold ${
                          ord.paymentStatus === 'Completed' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="bg-[#0A1210] border border-[#1E332B] rounded-xl px-3 py-1.5 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-inner font-semibold"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      {ord.trackingNumber ? (
                        <span className="font-mono text-xs text-emerald-400 font-bold bg-[#0A1210] px-2.5 py-1 rounded-lg border border-emerald-500/30">
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
                          className="text-[11px] font-semibold text-neutral-400 hover:text-emerald-300 hover:underline"
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
          <div className="bg-[#0A1210] border border-[#1E332B] rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
              Attach Airway Courier Tracking
            </h3>
            <form onSubmit={handleSaveTracking} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold font-poppins">
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
                  className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3.5 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTrackingModal(null)}
                  className="px-3 py-1.5 text-neutral-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateStatusMutation.isPending}
                  className="btn-emerald px-4 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[11px] text-white"
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
