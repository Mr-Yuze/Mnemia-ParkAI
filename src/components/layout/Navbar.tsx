import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { isFirebaseConfigured } from '../../firebase/config';
import {
  Car,
  Shield,
  Bell,
  LogOut,
  User,
  Menu,
  X,
  Compass,
  CalendarCheck,
  LayoutDashboard,
  Database,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout, loginAsDemoUser, loginAsDemoAdmin } = useAuth();
  const { notifications, unreadNotifsCount, markNotificationAsRead, resetAllData } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-accent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <Car className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  Mnemia <span className="text-brand-600">ParkAI</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/70">
                  Smart City
                </span>
              </div>
              <p className="text-[10px] tracking-wide text-slate-500 uppercase font-medium hidden sm:block">
                Intelligent Parking Platform
              </p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Overview
            </Link>
            <Link
              to="/locations"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/locations')
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Compass className="w-4 h-4" />
              Locations
            </Link>
            <Link
              to="/book"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/book')
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Sparkles className="w-4 h-4 text-brand-600" />
              Book Slot
            </Link>

            {user && (
              <>
                <Link
                  to="/my-bookings"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/my-bookings')
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4" />
                  My Bookings
                </Link>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/dashboard')
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  User Dashboard
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-slate-100 text-navy-900 hover:bg-slate-200'
                }`}
              >
                <Shield className="w-4 h-4 text-brand-400" />
                Admin Hub
              </Link>
            )}
          </nav>

          {/* Right Action Icons / User Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Database indicator badge */}
            <div
              title={
                isFirebaseConfigured
                  ? 'Connected to Google Firebase Cloud Firestore'
                  : 'Running in Local Reactive Storage Mode (Ready for College Presentation)'
              }
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                isFirebaseConfigured
                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isFirebaseConfigured ? 'Cloud Firestore' : 'Persistent Storage'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            {/* Notifications Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setNotifsOpen(!notifsOpen)}
                  aria-label="Notifications"
                  className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {notifsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-brand-600" />
                        <span className="font-semibold text-sm text-slate-900">Notifications</span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {notifications.length} updates
                      </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.notificationId}
                            onClick={() => markNotificationAsRead(n.notificationId)}
                            className={`p-3 rounded-xl transition-colors cursor-pointer ${
                              n.readStatus ? 'bg-white hover:bg-slate-50' : 'bg-brand-50/60 hover:bg-brand-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                              {!n.readStatus && (
                                <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile or Quick Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-accent-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">
                      {user.name}
                    </p>
                    <span className="text-[10px] font-medium text-brand-600 uppercase tracking-wide">
                      {user.role}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => logout()}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Fast demo login quick-triggers for review panel */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <button
                    onClick={loginAsDemoUser}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-brand-700 hover:bg-brand-100 transition-colors border border-brand-200"
                  >
                    Demo User
                  </button>
                  <button
                    onClick={loginAsDemoAdmin}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-navy-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    Demo Admin
                  </button>
                </div>

                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in fade-in duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Overview
          </Link>
          <Link
            to="/locations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Parking Locations
          </Link>
          <Link
            to="/book"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-brand-600 font-semibold hover:bg-brand-50"
          >
            Book a Slot
          </Link>

          {user && (
            <>
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                My Bookings & QR Passes
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                User Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                My Profile & Vehicles
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold bg-navy-900 text-white"
            >
              Administrator Hub
            </Link>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                resetAllData();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Demo Data
            </button>
            {user && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-600 font-medium flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Log out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
