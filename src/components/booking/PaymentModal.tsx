import React, { useState } from 'react';
import type { PaymentMethod } from '../../types';
import {
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  X,
  AlertTriangle,
  Lock,
  Smartphone,
  Info,
  DollarSign,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  breakdown: {
    baseFee: number;
    surcharge: number;
    tax: number;
    totalFee: number;
  };
  slotNumber: string;
  locationName: string;
  durationHours: number;
  onSuccess: (paymentMethod: PaymentMethod, txnRef: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  breakdown,
  slotNumber,
  locationName,
  durationHours,
  onSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (simulateFailure) {
        toast.error('Payment failed: Bank simulator rejected transaction (Simulated Test). Please try again or toggle success.');
        return;
      }

      const txnRef = `PAY-GATEWAY-${Date.now().toString().slice(-8)}`;
      toast.success('Payment authorized & completed successfully!');
      onSuccess(selectedMethod, txnRef);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-navy-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base">Mnemia Digital Checkout</h3>
              <p className="text-[11px] text-slate-300">256-Bit Encrypted Payment Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* College Review Demo Mode Notice */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-start gap-2.5 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Demo Payment Sandbox Active:</strong> This simulates instant UPI & Razorpay gateway operations for your college presentation. No real debit occurs.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Order Summary Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Facility:</span>
              <span className="font-semibold text-slate-800">{locationName}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Selected Slot:</span>
              <span className="font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                Slot {slotNumber}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Parking Duration:</span>
              <span className="font-semibold text-slate-800">{durationHours} Hours</span>
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Parking Fee</span>
                <span>₹{breakdown.baseFee}</span>
              </div>
              {breakdown.surcharge > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>EV Charger / Special Surcharge</span>
                  <span>+₹{breakdown.surcharge}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>GST & Platform Charges (5%)</span>
                <span>₹{breakdown.tax}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Total Amount to Pay</span>
                <span className="text-lg font-display text-brand-600">₹{amount}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedMethod('UPI')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedMethod === 'UPI'
                    ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500 text-brand-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Smartphone className="w-5 h-5 text-brand-600" />
                <span className="text-xs">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('Card')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedMethod === 'Card'
                    ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500 text-brand-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span className="text-xs">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('NetBanking')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedMethod === 'NetBanking'
                    ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500 text-brand-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Building className="w-5 h-5 text-slate-600" />
                <span className="text-xs">Net Banking</span>
              </button>
            </div>
          </div>

          {/* Method Details */}
          {selectedMethod === 'UPI' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">UPI Instant Pay</span>
                <span className="text-[10px] bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full font-medium">
                  Zero Processing Fee
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <QrCode className="w-12 h-12 text-slate-800" />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-slate-500 block">Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full mt-1 text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'Card' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div>
                <label className="text-[11px] text-slate-500 block">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full mt-1 text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block">Expiry</label>
                  <input
                    type="text"
                    defaultValue="12/28"
                    className="w-full mt-1 text-xs px-3 py-2 bg-white rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block">CVV</label>
                  <input
                    type="password"
                    defaultValue="•••"
                    className="w-full mt-1 text-xs px-3 py-2 bg-white rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'NetBanking' && (
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-600">
              <p className="font-medium text-slate-800 mb-1">Supported Popular Banks:</p>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <span className="p-1.5 bg-white rounded border border-slate-200 text-center">HDFC Bank</span>
                <span className="p-1.5 bg-white rounded border border-slate-200 text-center">State Bank of India</span>
                <span className="p-1.5 bg-white rounded border border-slate-200 text-center">ICICI Bank</span>
                <span className="p-1.5 bg-white rounded border border-slate-200 text-center">Axis Bank</span>
              </div>
            </div>
          )}

          {/* Test Sandbox Edge Case Toggle */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              <span>Simulate Gateway Failure (Test QA Error Handling)</span>
            </label>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handlePay}
            className="flex-1 py-3 px-6 rounded-xl font-display font-semibold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Connecting Gateway...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Pay ₹{amount} & Complete Booking</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
