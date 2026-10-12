import React from 'react';
import { Zap, Accessibility, Star, CheckCircle, Car } from 'lucide-react';

export const SlotLegend: React.FC = () => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-xs text-slate-600">
        {/* Status Indicators */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-slate-900 text-xs">Status:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 border border-emerald-600"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-rose-500 border border-rose-600"></span>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-400 border border-amber-500"></span>
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-300 border border-slate-400"></span>
            <span>Maintenance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-brand-600 ring-2 ring-brand-400 ring-offset-1"></span>
            <span className="font-medium text-brand-700">Selected</span>
          </div>
        </div>

        {/* Slot Types */}
        <div className="flex items-center gap-4 flex-wrap border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <span className="font-semibold text-slate-900 text-xs">Bay Types:</span>
          <div className="flex items-center gap-1 text-slate-700">
            <Car className="w-3.5 h-3.5 text-slate-500" />
            <span>Standard</span>
          </div>
          <div className="flex items-center gap-1 text-slate-700">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>EV Fast Charge</span>
          </div>
          <div className="flex items-center gap-1 text-slate-700">
            <Accessibility className="w-3.5 h-3.5 text-blue-500" />
            <span>Priority/Accessible</span>
          </div>
          <div className="flex items-center gap-1 text-slate-700">
            <Star className="w-3.5 h-3.5 text-purple-500" />
            <span>VIP Executive</span>
          </div>
        </div>
      </div>
    </div>
  );
};
