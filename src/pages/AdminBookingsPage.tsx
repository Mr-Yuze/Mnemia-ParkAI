import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import type { Booking, BookingStatus } from '../types';
import { QRCodeModal } from '../components/booking/QRCodeModal';
import { ReceiptModal } from '../components/booking/ReceiptModal';
import {
  Calendar,
  Search,
  Filter,
  Download,
  ArrowDownToLine,
  ArrowUpFromLine,
  QrCode,
  Receipt,
  Car,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const { bookings, locations, verifyEntry, verifyExit } = useBooking();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const [qrBooking, setQrBooking] = useState<Booking | null>(null);
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.bookingStatus === statusFilter;
    const matchesLoc = locationFilter === 'all' || b.locationId === locationFilter;

    return matchesSearch && matchesStatus && matchesLoc;
  });

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = [
      'Booking ID',
      'User Name',
      'Email',
      'Facility',
      'Slot',
      'Vehicle Number',
      'Vehicle Type',
      'Start Time',
      'End Time',
      'Duration (Hours)',
      'Status',
      'Total Fee',
      'Payment Status',
      'Payment Method',
      'Entry Time',
      'Exit Time',
    ];

    const rows = filteredBookings.map((b) => [
      b.bookingId,
      `"${b.userName}"`,
      b.userEmail,
      `"${b.locationName}"`,
      b.slotNumber,
      b.vehicleNumber,
      b.vehicleType,
      b.startTime,
      b.endTime,
      b.durationHours,
      b.bookingStatus,
      b.totalAmount,
      b.paymentStatus,
      b.paymentMethod || 'UPI',
      b.entryTime || '',
      b.exitTime || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mnemia_ParkAI_Bookings_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 mb-2">
            <Calendar className="w-3.5 h-3.5 text-brand-600" />
            <span>Operational Booking Ledger</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Booking & Vehicle Log
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Audit parking reservations, perform gate entry/exit actions, and export verified records.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search booking ID, license plate, driver name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active (Parked)</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
          >
            <option value="all">All Facilities</option>
            {locations.map((l) => (
              <option key={l.locationId} value={l.locationId}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
          <span>Showing <strong>{filteredBookings.length}</strong> records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Booking ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Facility / Bay</th>
                <th className="py-3 px-3">Vehicle</th>
                <th className="py-3 px-3">Time Range</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Gate Barrier</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b.bookingId} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">{b.bookingId}</td>
                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-slate-800">{b.userName}</span>
                    <span className="block text-[10px] text-slate-400">{b.userEmail}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-slate-800 font-medium">{b.locationName}</span>
                    <span className="block text-[10px] font-bold text-brand-600">Slot {b.slotNumber}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-mono font-bold text-slate-800">{b.vehicleNumber}</span>
                    <span className="block text-[10px] text-slate-400">{b.vehicleType}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-500">
                    <span>
                      {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="block text-[10px] text-slate-400">{b.durationHours} hours</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                  <td className="py-3.5 px-3">
                    {/* Gate Barrier Action Buttons */}
                    {b.bookingStatus === 'upcoming' && (
                      <button
                        onClick={() => verifyEntry(b.bookingId)}
                        className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[10px] flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <ArrowDownToLine className="w-3 h-3" />
                        <span>Log Entry</span>
                      </button>
                    )}
                    {b.bookingStatus === 'active' && (
                      <button
                        onClick={() => verifyExit(b.bookingId)}
                        className="py-1 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <ArrowUpFromLine className="w-3 h-3" />
                        <span>Log Exit</span>
                      </button>
                    )}
                    {b.bookingStatus === 'completed' && (
                      <span className="text-[10px] text-slate-400">Exited</span>
                    )}
                    {b.bookingStatus === 'cancelled' && (
                      <span className="text-[10px] text-rose-400">Cancelled</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right space-x-1">
                    <button
                      onClick={() => setQrBooking(b)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50"
                      title="Inspect QR pass"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setReceiptBooking(b)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      title="View tax receipt"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR & Receipt Modals */}
      <QRCodeModal
        booking={qrBooking}
        isOpen={Boolean(qrBooking)}
        onClose={() => setQrBooking(null)}
      />

      <ReceiptModal
        booking={receiptBooking}
        isOpen={Boolean(receiptBooking)}
        onClose={() => setReceiptBooking(null)}
      />
    </div>
  );
};
