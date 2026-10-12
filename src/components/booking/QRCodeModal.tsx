import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { Booking } from '../../types';
import { X, Printer, ShieldCheck, Car, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

interface QRCodeModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ booking, isOpen, onClose }) => {
  const { verifyEntry, verifyExit } = useBooking();

  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSimulateScan = async () => {
    if (booking.bookingStatus === 'upcoming') {
      await verifyEntry(booking.bookingId);
    } else if (booking.bookingStatus === 'active') {
      await verifyExit(booking.bookingId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Pass Header */}
        <div className="p-6 bg-gradient-to-r from-navy-900 via-slate-800 to-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base">Digital Parking Pass</h3>
              <p className="text-[11px] text-slate-300">Mnemia ParkAI Fast-Tag System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Body */}
        <div className="p-6 text-center space-y-5">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
            Status: {booking.bookingStatus}
          </div>

          {/* QR Code Container */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
            <QRCodeSVG
              value={booking.qrCodeData || booking.bookingId}
              size={180}
              level="H"
              includeMargin={true}
              className="mx-auto rounded-lg"
            />
            <p className="mt-2 text-xs font-mono font-bold tracking-widest text-slate-700">
              {booking.bookingId}
            </p>
          </div>

          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Scan this QR code at the automated barrier or present it to the parking supervisor at the entry gate.
          </p>

          {/* Slot & Vehicle Details Grid */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Reserved Slot</span>
              <span className="font-bold text-base text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                {booking.slotNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1">
                <Car className="w-3.5 h-3.5" /> Vehicle Number
              </span>
              <span className="font-mono font-semibold text-slate-900">{booking.vehicleNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Location
              </span>
              <span className="font-medium text-slate-900 truncate max-w-[180px]">{booking.locationName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Arrival Window
              </span>
              <span className="text-slate-900 font-medium">
                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          {/* Quick Simulate Button for Presentation Review */}
          {(booking.bookingStatus === 'upcoming' || booking.bookingStatus === 'active') && (
            <button
              onClick={handleSimulateScan}
              className="py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
              title="Quickly test barrier entry/exit without switching to Admin Scanner"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Simulate {booking.bookingStatus === 'upcoming' ? 'Check-in' : 'Check-out'}</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5 ml-auto border border-slate-300"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
