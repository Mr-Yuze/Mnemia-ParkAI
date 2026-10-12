import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import type { Booking, BookingStatus } from '../types';
import { QRCodeModal } from '../components/booking/QRCodeModal';
import { ReceiptModal } from '../components/booking/ReceiptModal';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  QrCode,
  Receipt,
  Car,
  Clock,
  MapPin,
  XCircle,
  AlertCircle,
  ArrowRight,
  Search,
  CheckCircle2,
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const { userBookings, cancelBooking } = useBooking();

  const [activeTab, setActiveTab] = useState<BookingStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBookingForQr, setSelectedBookingForQr] = useState<Booking | null>(null);
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState<Booking | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  const filteredBookings = userBookings.filter((b) => {
    const matchesTab = activeTab === 'all' || b.bookingStatus === activeTab;
    const matchesSearch =
      b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCancelClick = async (booking: Booking) => {
    if (window.confirm(`Are you sure you want to cancel booking #${booking.bookingId} for slot ${booking.slotNumber}? A full refund of ₹${booking.totalAmount} will be issued.`)) {
      setCancellingBookingId(booking.bookingId);
      await cancelBooking(booking.bookingId, 'Cancelled by user request');
      setCancellingBookingId(null);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Upcoming
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Parked / Active
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-300">
            <CheckCircle2 className="w-3 h-3 text-slate-500" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-500" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 mb-2">
            <CalendarCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>Vehicle Parking Sessions</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            My Bookings & QR Passes
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Access your gate-pass QR codes, track parked vehicles, view tax receipts, and manage sessions.
          </p>
        </div>

        <Link
          to="/book"
          className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>Book Another Slot</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex gap-1.5 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({userBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming ({userBookings.filter((b) => b.bookingStatus === 'upcoming').length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'active'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Parked ({userBookings.filter((b) => b.bookingStatus === 'active').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'completed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({userBookings.filter((b) => b.bookingStatus === 'completed').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search booking ID or plate..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Bookings List Cards */}
      <div className="space-y-4">
        {filteredBookings.map((b) => (
          <div
            key={b.bookingId}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            {/* Left Info */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {b.bookingId}
                </span>
                {getStatusBadge(b.bookingStatus)}
                <span className="text-xs text-slate-400">
                  Booked on {new Date(b.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {b.locationName}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 mt-1">
                  <span className="flex items-center gap-1 font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                    Slot {b.slotNumber}
                  </span>
                  <span className="flex items-center gap-1 font-mono font-medium text-slate-800">
                    <Car className="w-3.5 h-3.5 text-slate-400" />
                    {b.vehicleNumber} ({b.vehicleType})
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to{' '}
                    {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({b.durationHours} hrs)
                  </span>
                </div>
              </div>

              {b.entryTime && (
                <p className="text-[11px] text-emerald-700 bg-emerald-50/70 px-2.5 py-1 rounded-lg w-fit">
                  Vehicle logged into bay at{' '}
                  <strong>{new Date(b.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                </p>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex flex-wrap items-center gap-2.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <div className="text-right pr-4 hidden sm:block">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Paid Amount</span>
                <span className="font-display font-extrabold text-base text-slate-900">₹{b.totalAmount}</span>
              </div>

              {/* QR Code Pass Button */}
              <button
                type="button"
                onClick={() => setSelectedBookingForQr(b)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <QrCode className="w-4 h-4 text-brand-600" />
                <span>QR Fast-Pass</span>
              </button>

              {/* Receipt Button */}
              <button
                type="button"
                onClick={() => setSelectedBookingForReceipt(b)}
                className="py-2.5 px-3.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Receipt className="w-4 h-4 text-slate-500" />
                <span>Invoice Receipt</span>
              </button>

              {/* Cancel Button (only for upcoming) */}
              {b.bookingStatus === 'upcoming' && (
                <button
                  type="button"
                  disabled={cancellingBookingId === b.bookingId}
                  onClick={() => handleCancelClick(b)}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Booking</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredBookings.length === 0 && (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <Car className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-display font-bold text-base text-slate-800">No Bookings Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't made any bookings matching this filter. Reserve a slot at any of our smart city facilities.
            </p>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-xs hover:bg-brand-700 transition-colors mt-2"
            >
              <span>Book a Slot Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* QR Modal */}
      <QRCodeModal
        booking={selectedBookingForQr}
        isOpen={Boolean(selectedBookingForQr)}
        onClose={() => setSelectedBookingForQr(null)}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        booking={selectedBookingForReceipt}
        isOpen={Boolean(selectedBookingForReceipt)}
        onClose={() => setSelectedBookingForReceipt(null)}
      />
    </div>
  );
};
