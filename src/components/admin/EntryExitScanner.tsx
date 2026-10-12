import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import {
  QrCode,
  ShieldCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  Car,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const EntryExitScanner: React.FC = () => {
  const { bookings, verifyEntry, verifyExit } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'entry' | 'exit'>('entry');
  const [isProcessing, setIsProcessing] = useState(false);
  const [barrierStatus, setBarrierStatus] = useState<'idle' | 'opened' | 'denied'>('idle');
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  const upcomingBookings = bookings.filter((b) => b.bookingStatus === 'upcoming');
  const activeBookings = bookings.filter((b) => b.bookingStatus === 'active');

  const handleAction = async (ref: string, mode: 'entry' | 'exit') => {
    if (!ref.trim()) return;
    setIsProcessing(true);
    setBarrierStatus('idle');

    setTimeout(async () => {
      let result;
      if (mode === 'entry') {
        result = await verifyEntry(ref);
      } else {
        result = await verifyExit(ref);
      }

      setIsProcessing(false);
      setLastActionMessage(result.message);

      if (result.success) {
        setBarrierStatus('opened');
        setSearchTerm('');
        setTimeout(() => setBarrierStatus('idle'), 4000);
      } else {
        setBarrierStatus('denied');
      }
    }, 600);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-navy-900 text-brand-400 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Smart Barrier & QR Verification Terminal
            </h3>
            <p className="text-xs text-slate-500">
              Automatic License Plate Recognition (ANPR) & Fast-Tag Entry/Exit Gate
            </p>
          </div>
        </div>

        {/* Gate Barrier Graphic Visual */}
        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-2xl border border-slate-200 text-xs">
          <span className="text-slate-500 font-medium">Gate Barrier:</span>
          {barrierStatus === 'opened' ? (
            <span className="font-bold text-emerald-600 flex items-center gap-1 animate-bounce">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              BARRIER OPENED (Proceed)
            </span>
          ) : barrierStatus === 'denied' ? (
            <span className="font-bold text-rose-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              ACCESS DENIED
            </span>
          ) : (
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              LOCKED (Ready to Scan)
            </span>
          )}
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => {
            setActiveTab('entry');
            setBarrierStatus('idle');
            setLastActionMessage(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'entry'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowDownToLine className="w-4 h-4 text-emerald-600" />
          <span>Vehicle Entry Gate ({upcomingBookings.length} Expected)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('exit');
            setBarrierStatus('idle');
            setLastActionMessage(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'exit'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowUpFromLine className="w-4 h-4 text-blue-600" />
          <span>Vehicle Exit Gate ({activeBookings.length} Currently Parked)</span>
        </button>
      </div>

      {/* Input Verification Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAction(searchTerm, activeTab);
            }}
            placeholder={
              activeTab === 'entry'
                ? 'Scan barcode / Enter Booking ID (e.g. MNM-BK-1001) or Plate Number'
                : 'Enter Plate Number or Booking ID for checkout exit'
            }
            className="w-full pl-4 pr-10 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
          />
          <QrCode className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
        </div>

        <button
          onClick={() => handleAction(searchTerm, activeTab)}
          disabled={!searchTerm.trim() || isProcessing}
          className={`px-6 py-3 rounded-2xl font-semibold text-xs text-white shadow-md transition-all flex items-center justify-center gap-2 shrink-0 ${
            activeTab === 'entry'
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } disabled:opacity-50`}
        >
          {isProcessing ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Verifying Gate...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>{activeTab === 'entry' ? 'Verify & Allow Entry' : 'Verify & Open Exit Gate'}</span>
            </>
          )}
        </button>
      </div>

      {/* Last Action Notification Banner */}
      {lastActionMessage && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 ${
            barrierStatus === 'opened'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          {barrierStatus === 'opened' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{lastActionMessage}</span>
        </div>
      )}

      {/* Quick Click Simulation for Review Demo */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Quick Demo Triggers for College Evaluator:
          </span>
          <span className="text-[11px] text-slate-400">Click any card to auto-simulate gate scan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {(activeTab === 'entry' ? upcomingBookings : activeBookings).slice(0, 3).map((b) => (
            <div
              key={b.bookingId}
              onClick={() => handleAction(b.bookingId, activeTab)}
              className="p-3 rounded-2xl border border-slate-200 hover:border-brand-500 bg-slate-50/70 hover:bg-brand-50/50 cursor-pointer transition-all flex items-center justify-between text-xs group"
            >
              <div>
                <p className="font-mono font-bold text-slate-900 group-hover:text-brand-700">
                  {b.vehicleNumber}
                </p>
                <p className="text-[10px] text-slate-500">
                  {b.bookingId} • Slot {b.slotNumber}
                </p>
              </div>
              <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-200 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                {activeTab === 'entry' ? 'Enter Gate' : 'Exit Gate'}
              </span>
            </div>
          ))}

          {(activeTab === 'entry' ? upcomingBookings : activeBookings).length === 0 && (
            <p className="text-xs text-slate-400 py-2 col-span-3 text-center">
              No vehicles currently queued for {activeTab}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
