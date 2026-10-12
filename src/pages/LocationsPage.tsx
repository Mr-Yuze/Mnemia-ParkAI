import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { LocationCard } from '../components/parking/LocationCard';
import { SlotGrid } from '../components/parking/SlotGrid';
import { SlotLegend } from '../components/parking/SlotLegend';
import type { ParkingSlot } from '../types';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Zap,
  Filter,
  Car,
  Compass,
  ArrowRight,
  Eye,
  X,
} from 'lucide-react';

export const LocationsPage: React.FC = () => {
  const { locations, slots } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [evOnly, setEvOnly] = useState(false);
  const [inspectLocationId, setInspectLocationId] = useState<string | null>(null);
  const navigate = useNavigate();

  const cities = ['all', ...Array.from(new Set(locations.map((l) => l.city)))];

  const filteredLocations = locations.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || loc.city === selectedCity;
    const locSlots = slots.filter((s) => s.locationId === loc.locationId);
    const hasEv = locSlots.some((s) => s.slotType === 'EV');
    const matchesEv = !evOnly || hasEv;

    return matchesSearch && matchesCity && matchesEv;
  });

  const totalSlotsCount = slots.length;
  const availableSlotsCount = slots.filter((s) => s.operationalStatus === 'available').length;

  const handleSelectSlot = (slot: ParkingSlot) => {
    navigate(`/book?locationId=${slot.locationId}&slotId=${slot.slotId}`);
  };

  const inspectedLocation = locations.find((l) => l.locationId === inspectLocationId);
  const inspectedSlots = inspectedLocation
    ? slots.filter((s) => s.locationId === inspectedLocation.locationId)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 mb-2">
            <Compass className="w-3.5 h-3.5 text-brand-600" />
            <span>Smart Urban Parking Grid</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Parking Facilities & Locations
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-xl">
            Locate multi-level smart parking complexes with automated bay guidance, fast EV chargers, and live occupancy status.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-center px-3 border-r border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Facilities</span>
            <span className="font-display font-extrabold text-xl text-slate-900">{locations.length}</span>
          </div>
          <div className="text-center px-3 border-r border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Bays</span>
            <span className="font-display font-extrabold text-xl text-slate-900">{totalSlotsCount}</span>
          </div>
          <div className="text-center px-3">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block tracking-wider">Free Now</span>
            <span className="font-display font-extrabold text-xl text-emerald-600">{availableSlotsCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by facility name, landmark, or street..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === 'all' ? 'All Cities & Zones' : city}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-xs cursor-pointer hover:bg-slate-50 transition-colors select-none font-medium text-slate-700">
            <input
              type="checkbox"
              checked={evOnly}
              onChange={(e) => setEvOnly(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>EV Fast Chargers Only</span>
          </label>
        </div>
      </div>

      {/* Location Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((loc) => (
          <div key={loc.locationId} className="flex flex-col">
            <LocationCard location={loc} slots={slots} />
            <button
              onClick={() => setInspectLocationId(inspectLocationId === loc.locationId ? null : loc.locationId)}
              className="mt-2 py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>{inspectLocationId === loc.locationId ? 'Hide Bay Grid' : 'Live Bay Map Preview'}</span>
            </button>
          </div>
        ))}

        {filteredLocations.length === 0 && (
          <div className="col-span-3 py-16 text-center bg-white rounded-3xl border border-slate-200">
            <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-display font-bold text-base text-slate-800">No Facilities Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or removing active filters.
            </p>
          </div>
        )}
      </div>

      {/* Live Bay Floor Inspector Drawer/Modal */}
      {inspectedLocation && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-brand-500 shadow-xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
                Live Sensor Map Inspector
              </span>
              <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-0.5">
                {inspectedLocation.name}
              </h3>
              <p className="text-xs text-slate-500">{inspectedLocation.address}</p>
            </div>
            <button
              onClick={() => setInspectLocationId(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <SlotLegend />

          <p className="text-xs text-slate-500">
            Click any free bay below to reserve it for your upcoming journey:
          </p>

          <SlotGrid
            slots={inspectedSlots}
            onSelectSlot={handleSelectSlot}
          />
        </div>
      )}
    </div>
  );
};
