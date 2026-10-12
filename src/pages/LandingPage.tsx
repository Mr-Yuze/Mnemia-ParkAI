import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { LocationCard } from '../components/parking/LocationCard';
import {
  Car,
  Zap,
  ShieldCheck,
  QrCode,
  Smartphone,
  ArrowRight,
  Clock,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Users,
  Compass,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, loginAsDemoUser, loginAsDemoAdmin } = useAuth();
  const { locations, slots, stats } = useBooking();

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-brand-50/50 via-white to-slate-50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-200/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-accent-200/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-100/80 text-brand-800 border border-brand-300/70 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Next-Gen Smart Urban Mobility</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.15]">
                Intelligent Parking <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-accent-600">
                  Zero Search Time.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Mnemia ParkAI eliminates city parking frustration with real-time bay availability, pre-booked reservations, EV charging slots, instant QR gate check-ins, and cashless digital payments.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/book"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg shadow-brand-600/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Reserve a Slot Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/locations"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-300/80 shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4 text-slate-500" />
                  <span>Browse Facilities</span>
                </Link>
              </div>

              {/* College Evaluation Quick Shortcuts */}
              {!user && (
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-slate-500">
                  <span>Fast Presentation Login:</span>
                  <button
                    onClick={loginAsDemoUser}
                    className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold hover:bg-emerald-100 transition-colors border border-emerald-200"
                  >
                    Demo User
                  </button>
                  <button
                    onClick={loginAsDemoAdmin}
                    className="px-3 py-1 rounded-lg bg-navy-900 text-white font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Demo Admin
                  </button>
                </div>
              )}
            </div>

            {/* Right Visual Dashboard Teaser */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Glassmorphic Preview Card */}
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-200/90 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-900">Live Parking Telemetry</h4>
                        <p className="text-[11px] text-slate-400">Urban Facility Grid • Bangalore</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Real-Time Active
                    </span>
                  </div>

                  {/* Real-time stats mini cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Available Bays</span>
                      <span className="text-2xl font-display font-extrabold text-emerald-600 mt-1 block">
                        {stats.availableSlots}
                      </span>
                      <span className="text-[10px] text-slate-500">of {stats.totalSlots} total bays</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Occupancy Rate</span>
                      <span className="text-2xl font-display font-extrabold text-slate-900 mt-1 block">
                        {stats.totalSlots > 0 ? Math.round(((stats.occupiedSlots + stats.reservedSlots) / stats.totalSlots) * 100) : 0}%
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium">Optimized flow</span>
                    </div>
                  </div>

                  {/* Active Sensor Bay Visual Mini Sample */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">Bay Floor Status (Tower P1)</span>
                      <span className="text-[11px] text-slate-400">Ground Level</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-center">
                        <span className="text-xs font-bold text-emerald-800">A-01</span>
                        <span className="text-[9px] block text-emerald-600 font-medium">Free</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-center">
                        <span className="text-xs font-bold text-rose-800">A-02</span>
                        <span className="text-[9px] block text-rose-600 font-medium">Busy</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-center">
                        <span className="text-xs font-bold text-amber-800">A-03</span>
                        <span className="text-[9px] block text-amber-600 font-medium">Booked</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-center">
                        <span className="text-xs font-bold text-emerald-800">A-04</span>
                        <span className="text-[9px] block text-emerald-600 font-medium">Free</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/book"
                    className="block w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center transition-colors"
                  >
                    Quick Slot Allocation →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights & Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Intelligent Core Features
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Why Cities and Drivers Choose Mnemia ParkAI
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Engineered to streamline parking operations, eliminate physical queues, and optimize revenue with smart algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-brand-300 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-900">Zero Conflict Booking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time slot reservation system that prevents double-booking using time-interval collision verification.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-brand-300 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-900">EV Fast Charging Bays</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dedicated electric vehicle slots with fast charging power and automated duration-based surcharge calculations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-brand-300 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-900">Fast-Tag QR Entry/Exit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Scannable QR pass on your smartphone. The automated barrier logs entry/exit timestamps instantly without paperwork.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-brand-300 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-900">Contactless Payments</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Frictionless UPI, credit/debit card, and digital receipts with transparent fee breakdowns and zero surprise fees.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Workflow */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">4-Step Seamless Flow</span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
            How Mnemia ParkAI Works
          </h2>
          <p className="text-slate-400 text-sm">
            From discovering available bays to exiting the gate in under 30 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3 relative">
            <span className="font-display font-extrabold text-4xl text-brand-500/30">01</span>
            <h4 className="font-display font-bold text-base text-white">Select Facility & Bay</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browse smart facilities, view live free slots, and select your exact preferred bay and parking time window.
            </p>
          </div>

          <div className="space-y-3 relative">
            <span className="font-display font-extrabold text-4xl text-brand-500/30">02</span>
            <h4 className="font-display font-bold text-base text-white">Digital Payment</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent upfront calculation with instant UPI or card checkout and automated receipt generation.
            </p>
          </div>

          <div className="space-y-3 relative">
            <span className="font-display font-extrabold text-4xl text-brand-500/30">03</span>
            <h4 className="font-display font-bold text-base text-white">Scan at Gate Barrier</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Arrive at the gate and scan your digital QR code. The barrier opens automatically and updates your status.
            </p>
          </div>

          <div className="space-y-3 relative">
            <span className="font-display font-extrabold text-4xl text-brand-500/30">04</span>
            <h4 className="font-display font-bold text-base text-white">Frictionless Exit</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              When leaving, scan out. The bay is automatically released for the next driver in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Locations Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Live Locations
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
              Popular Smart Parking Facilities
            </h2>
          </div>
          <Link
            to="/locations"
            className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View all {locations.length} facilities</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.slice(0, 3).map((loc) => (
            <LocationCard key={loc.locationId} location={loc} slots={slots} />
          ))}
        </div>
      </section>
    </div>
  );
};
