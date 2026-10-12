import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { Link } from 'react-router-dom';
import { QRCodeModal } from '../components/booking/QRCodeModal';
import { ReceiptModal } from '../components/booking/ReceiptModal';
import type { Booking } from '../types';
import {
  Car,
  CalendarCheck,
  QrCode,
  Receipt,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plus,
  Compass,
  AlertCircle,
  Zap,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userBookings, locations, slots } = useBooking();

  const [qrBooking, setQrBooking] = useState<Booking | null>(null);
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);

  const activeBooking = userBookings.find((b) => b.bookingStatus === 'active');
  const nextUpcomingBooking = userBookings.find((b) => b.bookingStatus === 'upcoming');
  const pastBookings = userBookings.filter(
    (b) => b.bookingStatus === 'completed' || b.bookingStatus === 'cancelled'
  );

  const totalSlotsCount = slots.length;
  const freeSlotsCount = slots.filter((s) => s.operationalStatus === 'available').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Welcome Bar */}
      <div className="bg-gradient-to-r from-navy-900 via-slate-800 to-navy-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
            Driver & Vehicle Portal
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Welcome back, {user?.name || 'Driver'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Real-time status of your parked vehicles, smart passes, and parking credit across all municipal hubs.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            to="/book"
            className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Slot</span>
          </Link>
          <Link
            to="/locations"
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-brand-400" />
            <span>Locations</span>
          </Link>
        </div>
      </div>

      {/* Real-time Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Active Parked Vehicle Status */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Parking Session
              </span>
              {activeBooking ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Vehicle Parked
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-400">None Active</span>
              )}
            </div>

            {activeBooking ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-extrabold text-2xl text-slate-900">
                    Slot {activeBooking.slotNumber}
                  </span>
                  <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-100 rounded-md">
                    {activeBooking.vehicleNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{activeBooking.locationName}</p>
                <p className="text-[11px] text-slate-400">
                  Logged in at:{' '}
                  <strong>
                    {new Date(activeBooking.entryTime || activeBooking.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </strong>
                </p>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-500">
                <Car className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                No vehicles currently inside parking facilities.
              </div>
            )}
          </div>

          {activeBooking && (
            <button
              onClick={() => setQrBooking(activeBooking)}
              className="mt-4 w-full py-2.5 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 text-xs font-semibold flex items-center justify-center gap-1.5 border border-brand-200 transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>Show Exit Gate QR</span>
            </button>
          )}
        </div>

        {/* Card 2: Upcoming Reservation */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Next Upcoming Arrival
              </span>
              {nextUpcomingBooking ? (
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Confirmed Pass
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-400">No Reservations</span>
              )}
            </div>

            {nextUpcomingBooking ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-extrabold text-2xl text-slate-900">
                    Slot {nextUpcomingBooking.slotNumber}
                  </span>
                  <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-100 rounded-md">
                    {nextUpcomingBooking.vehicleNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{nextUpcomingBooking.locationName}</p>
                <p className="text-[11px] text-slate-400">
                  Reserved for:{' '}
                  <strong>
                    {new Date(nextUpcomingBooking.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </strong>{' '}
                  ({nextUpcomingBooking.durationHours} hrs)
                </p>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-500">
                <CalendarCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                No upcoming parking sessions scheduled.
              </div>
            )}
          </div>

          {nextUpcomingBooking ? (
            <button
              onClick={() => setQrBooking(nextUpcomingBooking)}
              className="mt-4 w-full py-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>Show Entry Gate QR</span>
            </button>
          ) : (
            <Link
              to="/book"
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold text-center transition-colors block"
            >
              Book a Slot →
            </Link>
          )}
        </div>

        {/* Card 3: Live Grid Telemetry Overview */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              City Network Health
            </span>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Available Bays Now:</span>
                <span className="font-display font-extrabold text-base text-emerald-600">
                  {freeSlotsCount} / {totalSlotsCount}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand-500 h-2 rounded-full"
                  style={{ width: `${(freeSlotsCount / (totalSlotsCount || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Total Locations:</span>
                <span className="font-semibold text-slate-800">{locations.length} Facilities</span>
              </div>
              <div className="flex justify-between">
                <span>My Lifetime Bookings:</span>
                <span className="font-semibold text-slate-800">{userBookings.length} Trips</span>
              </div>
            </div>
          </div>

          <Link
            to="/locations"
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold text-center transition-colors block"
          >
            Explore Live Map & Rates →
          </Link>
        </div>
      </div>

      {/* Recent History Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Recent Parking Sessions
            </h3>
            <p className="text-xs text-slate-400">View recent activity and digital receipts</p>
          </div>
          <Link
            to="/my-bookings"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-2">Booking ID</th>
                <th className="py-3 px-2">Facility & Bay</th>
                <th className="py-3 px-2">Vehicle</th>
                <th className="py-3 px-2">Timing</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userBookings.slice(0, 5).map((b) => (
                <tr key={b.bookingId} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-2 font-mono font-bold text-slate-900">{b.bookingId}</td>
                  <td className="py-3.5 px-2">
                    <span className="font-semibold text-slate-800">{b.locationName}</span>
                    <span className="block text-[10px] text-slate-400">Bay {b.slotNumber}</span>
                  </td>
                  <td className="py-3.5 px-2 font-mono font-medium text-slate-700">{b.vehicleNumber}</td>
                  <td className="py-3.5 px-2 text-slate-500">
                    {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({b.durationHours}h)
                  </td>
                  <td className="py-3.5 px-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        b.bookingStatus === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.bookingStatus === 'upcoming'
                          ? 'bg-amber-100 text-amber-800'
                          : b.bookingStatus === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right space-x-1">
                    <button
                      onClick={() => setQrBooking(b)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50"
                      title="View QR Fast-Pass"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setReceiptBooking(b)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      title="View Official Receipt"
                    >
                      <Receipt className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {userBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No parking sessions recorded yet. Book a slot to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Modal */}
      <QRCodeModal
        booking={qrBooking}
        isOpen={Boolean(qrBooking)}
        onClose={() => setQrBooking(null)}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        booking={receiptBooking}
        isOpen={Boolean(receiptBooking)}
        onClose={() => setReceiptBooking(null)}
      />
    </div>
  );
};
