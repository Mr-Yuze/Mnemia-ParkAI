import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Sparkles, RefreshCw, Heart } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

export const Footer: React.FC = () => {
  const { resetAllData } = useBooking();
  const { loginAsDemoUser, loginAsDemoAdmin } = useAuth();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white shadow-sm">
                <Car className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Mnemia <span className="text-brand-400">ParkAI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Next-generation intelligent smart parking management platform. AI-guided slot allocation, live occupancy tracking, digital contactless payments, and high-speed QR check-in barriers.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-950 text-brand-300 border border-brand-800">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
                Active System v1.0.0
              </span>
            </div>
          </div>

          {/* User Portals */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 font-display">User Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/locations" className="hover:text-brand-400 transition-colors">
                  Browse Parking Locations
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-brand-400 transition-colors">
                  Reserve a Parking Bay
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-brand-400 transition-colors">
                  My Bookings & QR Passes
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-400 transition-colors">
                  User Vehicle Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-brand-400 transition-colors">
                  Profile & Registered Vehicles
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Operations */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 font-display">Management & Demo</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/admin" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-brand-400" />
                  Admin Overview Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/slots" className="hover:text-brand-400 transition-colors">
                  Slot & Bay Management
                </Link>
              </li>
              <li>
                <Link to="/admin/bookings" className="hover:text-brand-400 transition-colors">
                  Vehicle Entry & Exit Verification
                </Link>
              </li>
              <li>
                <Link to="/admin/analytics" className="hover:text-brand-400 transition-colors">
                  Occupancy & Revenue Analytics
                </Link>
              </li>
              <li className="pt-2">
                <button
                  onClick={resetAllData}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Demo Seed Database
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Review Shortcuts */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-3">
            <h4 className="text-white font-semibold text-xs font-display flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-400" /> Quick Role Presets
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Switch roles instantly for college presentation review and grading:
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={loginAsDemoUser}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors text-left flex items-center justify-between"
              >
                <span>Vehicle Owner (User)</span>
                <span className="text-[10px] text-brand-400 font-mono">user@parkai.com</span>
              </button>
              <button
                onClick={loginAsDemoAdmin}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-medium bg-brand-700/80 hover:bg-brand-600 text-white transition-colors text-left flex items-center justify-between"
              >
                <span>System Administrator</span>
                <span className="text-[10px] text-brand-200 font-mono">admin@parkai.com</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Mnemia ParkAI. Final Year College Project Submission.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> React 19 • Vite • Firestore
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
