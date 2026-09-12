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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-widest">
              Fulfillment Command
            </span>
            <span className="text-[11px] text-neutral-400 font-medium">
              {orders.length} Consignments Recorded
            </span>
          </div>
          <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Consignment Orders & Dispatch
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Review customer orders, transition fulfillment lifecycle, attach courier airway tracking, and monitor payments.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-2xl border border-emerald-200 text-xs shadow-2xs self-start sm:self-auto">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedStatus === st
                  ? 'bg-emerald-800 text-white font-bold shadow-2xs'
                  : 'text-neutral-600 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{feedback}</span>
          </div>
          <button onClick={() => setFeedback('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by order number, patron name, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-neutral-800 font-poppins shadow-2xs"
        />
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-white border border-emerald-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4FAF6] text-neutral-600 uppercase tracking-wider font-semibold border-b border-emerald-100">
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
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400">
                    Retrieving orders database...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-500">
                    No orders matching "{selectedStatus}".
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-neutral-900 block text-sm">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {formatDate(ord.createdAt)}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-neutral-900">
                        {ord.shippingAddress?.fullName || 'Guest'}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-mono">
                        {ord.shippingAddress?.phone}
                      </p>
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="space-y-1">
                        {ord.orderItems?.map((item, i) => (
                          <p key={i} className="truncate text-[11px] text-neutral-700 font-medium">
                            • {item.name} ({item.size}) × {item.quantity}
                          </p>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 font-poppins font-bold text-emerald-800 text-sm">
                      {formatPrice(ord.totalPrice)}
                    </td>

                    <td className="p-4">
                      <span className="text-neutral-800 font-medium block">{ord.paymentMethod}</span>
                      <span
                        className={`text-[10px] font-bold ${
                          ord.paymentStatus === 'Completed' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-neutral-800 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-2xs font-semibold"
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
                        <span className="font-mono text-emerald-800 font-bold text-xs bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg inline-block">
                          #{ord.trackingNumber}
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
                          className="text-xs text-emerald-700 hover:text-emerald-950 font-bold bg-white hover:bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl transition-all shadow-2xs"
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
        <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-xs p-4 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white border border-emerald-100 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-poppins text-sm font-bold uppercase tracking-wider text-neutral-900">
              Attach Airway Courier Tracking
            </h3>
            <form onSubmit={handleSaveTracking} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 mb-1 font-semibold font-poppins">
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
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-800 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTrackingModal(null)}
                  className="px-3 py-1.5 text-neutral-500 hover:text-neutral-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl font-bold uppercase text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-2xs"
                >
                  Save Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
