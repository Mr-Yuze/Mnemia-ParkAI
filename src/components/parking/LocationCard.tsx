import React from 'react';
import { Link } from 'react-router-dom';
import type { ParkingLocation, ParkingSlot } from '../../types';
import { MapPin, Clock, Zap, ShieldCheck, ArrowRight, Car } from 'lucide-react';

interface LocationCardProps {
  location: ParkingLocation;
  slots: ParkingSlot[];
}

export const LocationCard: React.FC<LocationCardProps> = ({ location, slots }) => {
  const locSlots = slots.filter((s) => s.locationId === location.locationId);
  const availableSlots = locSlots.filter((s) => s.operationalStatus === 'available').length;
  const evSlots = locSlots.filter((s) => s.slotType === 'EV').length;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col group">
      {/* Image Header with Live Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={location.imageUrl}
          alt={location.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

        {/* Live Free Slots Indicator */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{availableSlots} Available</span>
          <span className="text-slate-400 font-normal">/ {location.totalSlots}</span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 bg-brand-600 text-white px-3 py-1.5 rounded-2xl text-xs font-bold shadow-lg flex items-center gap-1">
          <span>₹{location.hourlyRate}</span>
          <span className="text-[10px] font-normal opacity-90">/ hour</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">
                {location.name}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{location.address}, {location.city}</span>
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {location.description}
          </p>

          {/* Quick Perks */}
          <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
              <Clock className="w-3 h-3 text-slate-500" />
              {location.openingHours}
            </span>
            {evSlots > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-medium border border-amber-200/60">
                <Zap className="w-3 h-3 text-amber-500" />
                {evSlots} EV Fast Bays
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium border border-emerald-200/60">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              24/7 Monitored
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 mt-4 border-t border-slate-100 flex items-center gap-3">
          <Link
            to={`/book?locationId=${location.locationId}`}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-xs hover:shadow-md transition-all text-center flex items-center justify-center gap-1.5"
          >
            <span>Book Slot</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to={`/locations#${location.locationId}`}
            className="py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            Bay Map
          </Link>
        </div>
      </div>
    </div>
  );
};
