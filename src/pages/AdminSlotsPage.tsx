import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import type { ParkingSlot, ParkingLocation } from '../types';
import { SlotModal } from '../components/admin/SlotModal';
import { LocationModal } from '../components/admin/LocationModal';
import {
  LayoutGrid,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Car,
  Zap,
  Accessibility,
  Star,
  CheckCircle2,
  Ban,
  AlertCircle,
  Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminSlotsPage: React.FC = () => {
  const { locations, slots, deleteSlot, deleteLocation, updateSlotStatus } = useBooking();

  const [selectedLocId, setSelectedLocId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Slot modal state
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [slotToEdit, setSlotToEdit] = useState<ParkingSlot | null>(null);

  // Location modal state
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [locToEdit, setLocToEdit] = useState<ParkingLocation | null>(null);

  const filteredSlots = slots.filter((s) => {
    const matchLoc = selectedLocId === 'all' || s.locationId === selectedLocId;
    const matchType = selectedType === 'all' || s.slotType === selectedType;
    return matchLoc && matchType;
  });

  const handleDeleteSlot = async (slotId: string, slotNum: string) => {
    if (window.confirm(`Are you sure you want to remove slot ${slotNum}?`)) {
      await deleteSlot(slotId);
    }
  };

  const handleDeleteLocation = async (locId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete parking facility "${name}"?`)) {
      await deleteLocation(locId);
    }
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 mb-2">
            <LayoutGrid className="w-3.5 h-3.5 text-brand-600" />
            <span>Facility & Bay Configuration</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Slot & Facility Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Add, edit, decommission bays, configure EV charging tariffs, and manage parking locations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setLocToEdit(null);
              setIsLocModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Building2 className="w-4 h-4 text-slate-500" />
            <span>Add Facility</span>
          </button>
          <button
            onClick={() => {
              setSlotToEdit(null);
              setIsSlotModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-brand-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Bay</span>
          </button>
        </div>
      </div>

      {/* Facilities Overview Cards */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg text-slate-900">
          Managed Facilities ({locations.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {locations.map((loc) => {
            const locSlots = slots.filter((s) => s.locationId === loc.locationId);
            const freeSlots = locSlots.filter((s) => s.operationalStatus === 'available').length;

            return (
              <div
                key={loc.locationId}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display font-bold text-base text-slate-900">{loc.name}</h4>
                    <span className="font-bold text-xs text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200 shrink-0">
                      ₹{loc.hourlyRate}/h
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{loc.address}, {loc.city}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                  <span className="text-slate-500">
                    Bays: <strong>{freeSlots} Free</strong> of {locSlots.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setLocToEdit(loc);
                        setIsLocModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      title="Edit facility settings"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLocation(loc.locationId, loc.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete facility"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slots Table Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Parking Bay Inventory ({filteredSlots.length})
            </h3>
            <p className="text-xs text-slate-400">Control individual bay states, types, and operational locks</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-xs">
            {/* Filter by facility */}
            <select
              value={selectedLocId}
              onChange={(e) => setSelectedLocId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="all">All Facilities</option>
              {locations.map((loc) => (
                <option key={loc.locationId} value={loc.locationId}>
                  {loc.name}
                </option>
              ))}
            </select>

            {/* Filter by type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="all">All Bay Types</option>
              <option value="Standard">Standard</option>
              <option value="EV">EV Charging</option>
              <option value="Handicapped">Handicapped</option>
              <option value="VIP">VIP Executive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Slot Code</th>
                <th className="py-3 px-3">Facility</th>
                <th className="py-3 px-3">Bay Type</th>
                <th className="py-3 px-3">Floor / Level</th>
                <th className="py-3 px-3">Operational Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSlots.map((slot) => {
                const loc = locations.find((l) => l.locationId === slot.locationId);

                return (
                  <tr key={slot.slotId} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-3">
                      <span className="font-display font-extrabold text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {slot.slotNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-800">
                      {loc?.name || slot.locationId}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                        {getSlotTypeIcon(slot.slotType)}
                        <span>{slot.slotType}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">{slot.floor}</td>
                    <td className="py-3.5 px-3">
                      <select
                        value={slot.operationalStatus}
                        onChange={(e) =>
                          updateSlotStatus(
                            slot.slotId,
                            e.target.value as ParkingSlot['operationalStatus']
                          )
                        }
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                          slot.operationalStatus === 'available'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : slot.operationalStatus === 'occupied'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-1">
                      <button
                        onClick={() => {
                          setSlotToEdit(slot);
                          setIsSlotModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                        title="Edit slot details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlot(slot.slotId, slot.slotNumber)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <SlotModal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        slotToEdit={slotToEdit}
      />

      <LocationModal
        isOpen={isLocModalOpen}
        onClose={() => setIsLocModalOpen(false)}
        locationToEdit={locToEdit}
      />
    </div>
  );
};
