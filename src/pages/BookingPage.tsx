import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import type { ParkingSlot, SlotStatus, PaymentMethod } from '../types';
import { SlotGrid } from '../components/parking/SlotGrid';
import { SlotLegend } from '../components/parking/SlotLegend';
import { PaymentModal } from '../components/booking/PaymentModal';
import { StorageService } from '../services/storageService';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  Zap,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { locations, slots, bookings, calculateFee, createBooking } = useBooking();

  const preselectedLocId = searchParams.get('locationId') || locations[0]?.locationId || '';
  const preselectedSlotId = searchParams.get('slotId') || '';

  const [selectedLocationId, setSelectedLocationId] = useState(preselectedLocId);
  const [selectedSlotId, setSelectedSlotId] = useState(preselectedSlotId);

  // Default start time: rounded to next 30 min
  const getDefaultStartTime = () => {
    const d = new Date();
    d.setMinutes(Math.ceil(d.getMinutes() / 30) * 30);
    d.setSeconds(0);
    d.setMilliseconds(0);
    // Format to datetime-local input YYYY-MM-DDTHH:mm
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const [startDateTime, setStartDateTime] = useState(getDefaultStartTime());
  const [durationHours, setDurationHours] = useState(2);

  // Vehicle info
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState(
    user?.vehicles?.[0]?.vehicleNumber || 'KA-01-AB-1234'
  );
  const [vehicleType, setVehicleType] = useState<'Car' | 'Bike' | 'EV' | 'SUV'>(
    user?.vehicles?.[0]?.vehicleType || 'Car'
  );

  // Payment modal state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // Update if params change
  useEffect(() => {
    if (preselectedLocId) setSelectedLocationId(preselectedLocId);
    if (preselectedSlotId) setSelectedSlotId(preselectedSlotId);
  }, [preselectedLocId, preselectedSlotId]);

  const activeLocation = locations.find((l) => l.locationId === selectedLocationId) || locations[0];
  const locationSlots = slots.filter((s) => s.locationId === activeLocation?.locationId);

  // Compute calculated end time
  const calculatedEndTime = useMemo(() => {
    const start = new Date(startDateTime);
    const end = new Date(start.getTime() + durationHours * 3600000);
    return end.toISOString();
  }, [startDateTime, durationHours]);

  const calculatedStartTimeIso = useMemo(() => {
    return new Date(startDateTime).toISOString();
  }, [startDateTime]);

  // Compute real-time slot statuses for the selected time range to prevent overlap collision
  const slotStatusMap = useMemo(() => {
    const map: Record<string, SlotStatus> = {};

    locationSlots.forEach((slot) => {
      if (slot.operationalStatus === 'maintenance') {
        map[slot.slotId] = 'maintenance';
        return;
      }

      // Check active park sessions currently in bay
      const currentlyActive = bookings.find(
        (b) => b.slotId === slot.slotId && b.bookingStatus === 'active'
      );
      if (currentlyActive) {
        map[slot.slotId] = 'occupied';
        return;
      }

      // Check reservations overlapping requested window
      const hasCollision = bookings.some(
        (b) =>
          b.slotId === slot.slotId &&
          (b.bookingStatus === 'upcoming' || b.bookingStatus === 'active') &&
          StorageService.isTimeOverlapping(
            b.startTime,
            b.endTime,
            calculatedStartTimeIso,
            calculatedEndTime
          )
      );

      map[slot.slotId] = hasCollision ? 'reserved' : 'available';
    });

    return map;
  }, [locationSlots, bookings, calculatedStartTimeIso, calculatedEndTime]);

  const selectedSlot = locationSlots.find((s) => s.slotId === selectedSlotId);

  // Fee computation
  const feeCalculation = useMemo(() => {
    if (!activeLocation) return { baseFee: 0, surcharge: 0, tax: 0, totalFee: 0 };
    const slotType = selectedSlot?.slotType || 'Standard';
    return calculateFee(activeLocation, slotType, durationHours);
  }, [activeLocation, selectedSlot, durationHours, calculateFee]);

  const handleSlotSelect = (slot: ParkingSlot) => {
    setSelectedSlotId(slot.slotId);
    if (slot.slotType === 'EV') {
      setVehicleType('EV');
    }
  };

  const handleInitiatePayment = () => {
    if (!isAuthenticated) {
      toast.error('Please log in or select a demo role to complete your booking.');
      navigate('/login');
      return;
    }

    if (!selectedSlot) {
      toast.error('Please select an available parking bay first.');
      return;
    }

    if (!selectedVehicleNumber.trim()) {
      toast.error('Please enter a vehicle registration number.');
      return;
    }

    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = async (paymentMethod: PaymentMethod, txnRef: string) => {
    setIsPaymentOpen(false);

    if (!activeLocation || !selectedSlot) return;

    const qrData = JSON.stringify({
      bookingId: 'PENDING',
      slot: selectedSlot.slotNumber,
      vehicle: selectedVehicleNumber.trim().toUpperCase(),
      facility: activeLocation.name,
      validFrom: calculatedStartTimeIso,
      validUntil: calculatedEndTime,
    });

    const res = await createBooking({
      userId: user?.uid || 'guest-usr',
      userName: user?.name || 'Rahul Sharma',
      userEmail: user?.email || 'user@parkai.com',
      userPhone: user?.phone || '+91 98765 43210',
      locationId: activeLocation.locationId,
      locationName: activeLocation.name,
      slotId: selectedSlot.slotId,
      slotNumber: selectedSlot.slotNumber,
      vehicleNumber: selectedVehicleNumber.trim().toUpperCase(),
      vehicleType,
      startTime: calculatedStartTimeIso,
      endTime: calculatedEndTime,
      durationHours,
      bookingStatus: 'upcoming',
      totalAmount: feeCalculation.totalFee,
      paymentStatus: 'paid',
      paymentMethod,
      qrCodeData: qrData,
    });

    if (res.success && res.booking) {
      setConfirmedBookingId(res.booking.bookingId);
      setIsBookingSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      toast.success(`Booking Confirmed! Pass #${res.booking.bookingId} issued.`);
    } else {
      toast.error(res.error || 'Failed to complete reservation.');
    }
  };

  if (isBookingSuccess && confirmedBookingId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-200 animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Booking Confirmed & Bay Reserved
          </span>
          <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight mt-3">
            Slot {selectedSlot?.slotNumber} is Ready for You!
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            Your booking reference is <strong className="font-mono text-slate-900">{confirmedBookingId}</strong>.
            A digital QR fast-pass has been generated for vehicle entry.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-left text-xs space-y-3">
          <div className="flex justify-between pb-2 border-b border-slate-100">
            <span className="text-slate-500">Location:</span>
            <span className="font-semibold text-slate-800">{activeLocation?.name}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-100">
            <span className="text-slate-500">Vehicle:</span>
            <span className="font-mono font-semibold text-slate-800">{selectedVehicleNumber} ({vehicleType})</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-100">
            <span className="text-slate-500">Duration:</span>
            <span className="font-semibold text-slate-800">{durationHours} Hours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Paid:</span>
            <span className="font-bold text-brand-600 text-sm">₹{feeCalculation.totalFee}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => navigate('/my-bookings')}
            className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>View QR Pass in My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsBookingSuccess(false);
              setSelectedSlotId('');
            }}
            className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all"
          >
            Book Another Slot
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Real-Time Reservation Engine</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Reserve Smart Parking Bay
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Select date, duration, vehicle credentials, and choose your preferred parking bay.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Slot Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Step 1: Location & Schedule Selector Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-extrabold flex items-center justify-center">1</span>
              <span>Facility & Reservation Window</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Location Select */}
              <div className="sm:col-span-3">
                <label className="block text-slate-700 font-semibold mb-1">Target Parking Facility</label>
                <select
                  value={selectedLocationId}
                  onChange={(e) => {
                    setSelectedLocationId(e.target.value);
                    setSelectedSlotId('');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500"
                >
                  {locations.map((loc) => (
                    <option key={loc.locationId} value={loc.locationId}>
                      {loc.name} — {loc.city} (₹{loc.hourlyRate}/hr)
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date & Time */}
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Arrival Time</span>
                </label>
                <input
                  type="datetime-local"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Duration in Hours */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Duration</span>
                </label>
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-brand-500"
                >
                  <option value={1}>1 Hour</option>
                  <option value={2}>2 Hours</option>
                  <option value={3}>3 Hours</option>
                  <option value={4}>4 Hours</option>
                  <option value={6}>6 Hours</option>
                  <option value={8}>8 Hours</option>
                  <option value={12}>12 Hours (Half Day)</option>
                  <option value={24}>24 Hours (Full Day)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Vehicle Information */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-extrabold flex items-center justify-center">2</span>
              <span>Vehicle Credentials</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-slate-400" />
                  <span>Registration Number (Plate)</span>
                </label>
                <input
                  type="text"
                  required
                  value={selectedVehicleNumber}
                  onChange={(e) => setSelectedVehicleNumber(e.target.value)}
                  placeholder="e.g. KA-01-AB-1234"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 uppercase font-mono font-bold text-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Vehicle Classification</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as 'Car' | 'Bike' | 'EV' | 'SUV')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Car">Sedan / Hatchback (Car)</option>
                  <option value="EV">Electric Vehicle (EV Charging)</option>
                  <option value="SUV">SUV / Large Vehicle</option>
                  <option value="Bike">Two-Wheeler / Bike</option>
                </select>
              </div>
            </div>

            {/* User Saved Vehicle Chips */}
            {user?.vehicles && user.vehicles.length > 0 && (
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400">Quick saved:</span>
                {user.vehicles.map((v) => (
                  <button
                    key={v.vehicleNumber}
                    type="button"
                    onClick={() => {
                      setSelectedVehicleNumber(v.vehicleNumber);
                      setVehicleType(v.vehicleType);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors ${
                      selectedVehicleNumber.toUpperCase() === v.vehicleNumber.toUpperCase()
                        ? 'bg-brand-50 text-brand-700 border-brand-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {v.vehicleNumber} ({v.vehicleType})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 3: Interactive Bay Grid Selection */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-extrabold flex items-center justify-center">3</span>
                <span>Select Parking Bay for Selected Period</span>
              </h3>
              <span className="text-xs text-brand-600 font-semibold bg-brand-50 px-2.5 py-1 rounded-full">
                {activeLocation?.name}
              </span>
            </div>

            <SlotLegend />

            <div className="pt-2">
              <SlotGrid
                slots={locationSlots}
                selectedSlotId={selectedSlotId}
                slotStatusMap={slotStatusMap}
                onSelectSlot={handleSlotSelect}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Summary & Checkout Card (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5">
            <h3 className="font-display font-bold text-lg text-slate-900 pb-3 border-b border-slate-100">
              Reservation Summary
            </h3>

            {/* Chosen Slot Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Target Bay</span>
                {selectedSlot ? (
                  <span className="px-3 py-1 rounded-xl text-sm font-display font-extrabold bg-brand-600 text-white shadow-xs">
                    Slot {selectedSlot.slotNumber}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    Please Pick a Bay
                  </span>
                )}
              </div>

              {selectedSlot && (
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Bay Type & Floor</span>
                  <span className="font-medium text-slate-800">
                    {selectedSlot.slotType} • {selectedSlot.floor}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Vehicle</span>
                <span className="font-mono font-bold text-slate-800">
                  {selectedVehicleNumber || 'Pending'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Arrival</span>
                <span className="font-medium text-slate-800">
                  {new Date(startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Duration</span>
                <span className="font-medium text-slate-800">{durationHours} Hours</span>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Base Parking (₹{activeLocation?.hourlyRate} × {durationHours}h)</span>
                <span>₹{feeCalculation.baseFee}</span>
              </div>

              {feeCalculation.surcharge > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>EV Charge Surcharge</span>
                  <span>+₹{feeCalculation.surcharge}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>GST Tax & Municipal Cess (5%)</span>
                <span>₹{feeCalculation.tax}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-slate-900 font-bold">
                <span className="text-sm">Total Fee</span>
                <span className="text-2xl font-display text-brand-600">
                  ₹{feeCalculation.totalFee}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              disabled={!selectedSlot}
              onClick={handleInitiatePayment}
              className="w-full py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg shadow-brand-600/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm & Pay ₹{feeCalculation.totalFee}</span>
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-normal">
              Digital receipt and scannable barrier QR code will be generated immediately upon confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Checkout Modal */}
      {selectedSlot && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          amount={feeCalculation.totalFee}
          breakdown={feeCalculation}
          slotNumber={selectedSlot.slotNumber}
          locationName={activeLocation.name}
          durationHours={durationHours}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
