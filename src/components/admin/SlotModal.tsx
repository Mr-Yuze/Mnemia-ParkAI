import React, { useState, useEffect } from 'react';
import type { ParkingSlot, SlotType } from '../../types';
import { useBooking } from '../../context/BookingContext';
import { X, Check } from 'lucide-react';

interface SlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  slotToEdit?: ParkingSlot | null;
  defaultLocationId?: string;
}

export const SlotModal: React.FC<SlotModalProps> = ({
  isOpen,
  onClose,
  slotToEdit,
  defaultLocationId,
}) => {
  const { locations, saveSlot } = useBooking();
  const [locationId, setLocationId] = useState(defaultLocationId || locations[0]?.locationId || '');
  const [slotNumber, setSlotNumber] = useState('');
  const [slotType, setSlotType] = useState<SlotType>('Standard');
  const [floor, setFloor] = useState('Ground Floor');
  const [operationalStatus, setOperationalStatus] = useState<ParkingSlot['operationalStatus']>('available');

  useEffect(() => {
    if (slotToEdit) {
      setLocationId(slotToEdit.locationId);
      setSlotNumber(slotToEdit.slotNumber);
      setSlotType(slotToEdit.slotType);
      setFloor(slotToEdit.floor);
      setOperationalStatus(slotToEdit.operationalStatus);
    } else {
      setLocationId(defaultLocationId || locations[0]?.locationId || '');
      setSlotNumber(`A-${Math.floor(10 + Math.random() * 89)}`);
      setSlotType('Standard');
      setFloor('Ground Floor');
      setOperationalStatus('available');
    }
  }, [slotToEdit, defaultLocationId, locations]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slotId = slotToEdit?.slotId || `slot-${locationId}-${Date.now().toString().slice(-4)}`;

    const slotPayload: ParkingSlot = {
      slotId,
      locationId,
      slotNumber,
      slotType,
      floor,
      operationalStatus,
      createdAt: slotToEdit?.createdAt || new Date().toISOString(),
    };

    await saveSlot(slotPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="font-display font-bold text-base">
            {slotToEdit ? 'Edit Parking Slot' : 'Create New Parking Slot'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Target Parking Location</label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
            >
              {locations.map((l) => (
                <option key={l.locationId} value={l.locationId}>
                  {l.name} ({l.city})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Slot Bay Code</label>
              <input
                type="text"
                required
                value={slotNumber}
                onChange={(e) => setSlotNumber(e.target.value)}
                placeholder="e.g. A-08"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 uppercase font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Bay Type</label>
              <select
                value={slotType}
                onChange={(e) => setSlotType(e.target.value as SlotType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Standard">Standard Car</option>
                <option value="EV">EV Charging Bay</option>
                <option value="Handicapped">Handicapped / Accessible</option>
                <option value="VIP">VIP Executive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Floor / Level</label>
              <input
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="e.g. Ground Floor"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Status</label>
              <select
                value={operationalStatus}
                onChange={(e) => setOperationalStatus(e.target.value as ParkingSlot['operationalStatus'])}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
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
              <span>{slotToEdit ? 'Save Changes' : 'Create Slot'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
