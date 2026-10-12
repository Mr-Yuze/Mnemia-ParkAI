import React from 'react';
import type { ParkingSlot, SlotStatus } from '../../types';
import { Zap, Accessibility, Star, Car, Ban, AlertCircle } from 'lucide-react';

interface SlotGridProps {
  slots: ParkingSlot[];
  selectedSlotId?: string;
  slotStatusMap?: Record<string, SlotStatus>;
  onSelectSlot: (slot: ParkingSlot) => void;
  disabled?: boolean;
}

export const SlotGrid: React.FC<SlotGridProps> = ({
  slots,
  selectedSlotId,
  slotStatusMap = {},
  onSelectSlot,
  disabled = false,
}) => {
  const getEffectiveStatus = (slot: ParkingSlot): SlotStatus => {
    if (slot.operationalStatus === 'maintenance') return 'maintenance';
    if (slotStatusMap[slot.slotId]) return slotStatusMap[slot.slotId];
    return slot.operationalStatus;
  };

  const getSlotTypeIcon = (type: ParkingSlot['slotType']) => {
    switch (type) {
      case 'EV':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'Handicapped':
        return <Accessibility className="w-3.5 h-3.5 text-blue-500" />;
      case 'VIP':
        return <Star className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <Car className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  if (slots.length === 0) {
    return (
      <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <Car className="w-10 h-10 mx-auto text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-600">No parking slots configured for this location yet.</p>
      </div>
    );
  }

  // Group by floor
  const floors = Array.from(new Set(slots.map((s) => s.floor || 'Ground Level')));

  return (
    <div className="space-y-6">
      {floors.map((floor) => {
        const floorSlots = slots.filter((s) => (s.floor || 'Ground Level') === floor);

        return (
          <div key={floor} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                {floor}
              </h4>
              <span className="text-xs text-slate-400">
                {floorSlots.length} bays
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {floorSlots.map((slot) => {
                const status = getEffectiveStatus(slot);
                const isSelected = selectedSlotId === slot.slotId;
                const isAvailable = status === 'available';

                let cardBg = 'bg-white border-slate-200 hover:border-brand-400 hover:shadow-md cursor-pointer';
                let statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                let statusText = 'Available';

                if (isSelected) {
                  cardBg = 'bg-brand-50/90 border-brand-600 ring-2 ring-brand-500 shadow-md cursor-pointer';
                  statusBadge = 'bg-brand-600 text-white border-brand-700';
                  statusText = 'Selected';
                } else if (status === 'occupied') {
                  cardBg = 'bg-rose-50/60 border-rose-200 cursor-not-allowed opacity-80';
                  statusBadge = 'bg-rose-100 text-rose-800 border-rose-300';
                  statusText = 'Occupied';
                } else if (status === 'reserved') {
                  cardBg = 'bg-amber-50/60 border-amber-200 cursor-not-allowed opacity-85';
                  statusBadge = 'bg-amber-100 text-amber-800 border-amber-300';
                  statusText = 'Reserved';
                } else if (status === 'maintenance') {
                  cardBg = 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-60';
                  statusBadge = 'bg-slate-200 text-slate-700 border-slate-300';
                  statusText = 'Offline';
                }

                return (
                  <button
                    key={slot.slotId}
                    type="button"
                    disabled={!isAvailable && !isSelected || disabled}
                    onClick={() => isAvailable && onSelectSlot(slot)}
                    className={`relative p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[110px] group ${cardBg}`}
                  >
                    {/* Parking Bay Painted Line Effect */}
                    <div className="flex items-center justify-between w-full">
                      <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                        {slot.slotNumber}
                      </span>
                      <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded-md" title={`Bay type: ${slot.slotType}`}>
                        {getSlotTypeIcon(slot.slotType)}
                        <span className="text-[10px] font-semibold text-slate-600">
                          {slot.slotType}
                        </span>
                      </div>
                    </div>

                    {/* Middle Visual Lane */}
                    <div className="my-2 border-b border-dashed border-slate-200 w-full"></div>

                    {/* Footer Status */}
                    <div className="flex items-center justify-between w-full mt-auto">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${statusBadge}`}>
                        {statusText}
                      </span>
                      {status === 'occupied' && (
                        <span title="Currently occupied by vehicle">
                          <Ban className="w-3.5 h-3.5 text-rose-400" />
                        </span>
                      )}
                      {status === 'maintenance' && (
                        <span title="Bay currently under maintenance">
                          <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
