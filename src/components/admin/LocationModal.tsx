import React, { useState, useEffect } from 'react';
import type { ParkingLocation } from '../../types';
import { useBooking } from '../../context/BookingContext';
import { X, Check } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationToEdit?: ParkingLocation | null;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  locationToEdit,
}) => {
  const { saveLocation } = useBooking();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [openingHours, setOpeningHours] = useState('24 Hours');
  const [hourlyRate, setHourlyRate] = useState(40);
  const [evSurcharge, setEvSurcharge] = useState(20);
  const [totalSlots, setTotalSlots] = useState(15);

  useEffect(() => {
    if (locationToEdit) {
      setName(locationToEdit.name);
      setAddress(locationToEdit.address);
      setCity(locationToEdit.city);
      setDescription(locationToEdit.description);
      setImageUrl(locationToEdit.imageUrl);
      setOpeningHours(locationToEdit.openingHours);
      setHourlyRate(locationToEdit.hourlyRate);
      setEvSurcharge(locationToEdit.pricingRules?.evSurcharge || 20);
      setTotalSlots(locationToEdit.totalSlots);
    } else {
      setName('');
      setAddress('');
      setCity('Bangalore');
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80');
      setOpeningHours('24 Hours (7 Days)');
      setHourlyRate(40);
      setEvSurcharge(20);
      setTotalSlots(16);
    }
  }, [locationToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const locationId = locationToEdit?.locationId || `loc-${Date.now().toString().slice(-4)}`;

    const payload: ParkingLocation = {
      locationId,
      name,
      address,
      city,
      description,
      imageUrl,
      openingHours,
      hourlyRate: Number(hourlyRate),
      pricingRules: {
        hourlyRate: Number(hourlyRate),
        evSurcharge: Number(evSurcharge),
        peakHourMultiplier: 1.2,
      },
      totalSlots: Number(totalSlots),
      createdAt: locationToEdit?.createdAt || new Date().toISOString(),
    };

    await saveLocation(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="font-display font-bold text-base">
            {locationToEdit ? 'Edit Parking Facility' : 'Add Smart Parking Facility'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Facility Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mnemia Central Plaza Parking"
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Address / Street</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 45 Outer Ring Road"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">City / Region</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bangalore"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Facility features, guidance system, access instructions..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Base Rate (₹/hr)</label>
              <input
                type="number"
                required
                min={5}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-brand-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">EV Surcharge (₹/hr)</label>
              <input
                type="number"
                min={0}
                value={evSurcharge}
                onChange={(e) => setEvSurcharge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-amber-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Total Bays</label>
              <input
                type="number"
                required
                min={1}
                value={totalSlots}
                onChange={(e) => setTotalSlots(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Operating Hours</label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="e.g. 24 Hours / 06:00 - 23:00"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 truncate"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{locationToEdit ? 'Save Changes' : 'Create Facility'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
