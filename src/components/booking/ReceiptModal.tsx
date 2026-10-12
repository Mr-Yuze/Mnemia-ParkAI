import React from 'react';
import type { Booking } from '../../types';
import { X, Printer, CheckCircle2, Car, Receipt, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base">Official Parking Tax Receipt</h3>
              <p className="text-[11px] text-slate-400">Mnemia Smart Parking Municipal Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Body */}
        <div id="printable-receipt" className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Top Info */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-200">
            <div>
              <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight">
                Mnemia <span className="text-brand-600">ParkAI</span>
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">GSTIN: 29AABCU9603R1ZM</p>
              <p className="text-[11px] text-slate-500">Facility: {booking.locationName}</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Payment: {booking.paymentStatus.toUpperCase()}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">Invoice #{booking.bookingId}</p>
              <p className="text-[11px] text-slate-400">{new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Customer & Vehicle Info */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer</span>
              <p className="font-semibold text-slate-900 text-xs mt-0.5">{booking.userName}</p>
              <p className="text-slate-500 text-[11px]">{booking.userEmail}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vehicle</span>
              <p className="font-mono font-semibold text-slate-900 text-xs mt-0.5">{booking.vehicleNumber}</p>
              <p className="text-slate-500 text-[11px]">{booking.vehicleType} • Slot {booking.slotNumber}</p>
            </div>
          </div>

          {/* Session Timing */}
          <div className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex justify-between">
              <span className="text-slate-500">Reserved Period:</span>
              <span className="font-medium text-slate-900">
                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to{' '}
                {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({booking.durationHours} hrs)
              </span>
            </div>
            {booking.entryTime && (
              <div className="flex justify-between">
                <span className="text-slate-500">Recorded Entry:</span>
                <span className="text-emerald-700 font-medium">
                  {new Date(booking.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
            {booking.exitTime && (
              <div className="flex justify-between">
                <span className="text-slate-500">Recorded Exit:</span>
                <span className="text-slate-700 font-medium">
                  {new Date(booking.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>

          {/* Charges Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Duration</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                <tr>
                  <td className="p-3 font-medium text-slate-900">
                    Smart Parking Slot ({booking.slotNumber})
                  </td>
                  <td className="p-3 text-center">{booking.durationHours} Hours</td>
                  <td className="p-3 text-right font-medium">₹{Math.round(booking.totalAmount * 0.95)}</td>
                </tr>
                <tr>
                  <td className="p-3 text-slate-600" colSpan={2}>
                    GST & Municipal Urban Cess (5%)
                  </td>
                  <td className="p-3 text-right font-medium">
                    ₹{Math.round(booking.totalAmount * 0.05)}
                  </td>
                </tr>
                <tr className="bg-brand-50/50 font-bold text-slate-900">
                  <td className="p-3 text-brand-900" colSpan={2}>
                    Total Amount Paid
                  </td>
                  <td className="p-3 text-right text-brand-700 font-display text-sm">
                    ₹{booking.totalAmount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Method Details */}
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Payment Mode: <strong>{booking.paymentMethod || 'UPI Digital'}</strong></span>
            <span>Ref: <strong className="font-mono">{booking.paymentId || 'TXN-DIRECT'}</strong></span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={() => window.print()}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
