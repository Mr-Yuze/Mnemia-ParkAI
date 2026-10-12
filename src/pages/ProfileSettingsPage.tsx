import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import {
  User,
  Car,
  Mail,
  Phone,
  Shield,
  Plus,
  Trash2,
  RefreshCw,
  LogOut,
  Check,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfileSettingsPage: React.FC = () => {
  const { user, updateProfile, addVehicle, removeVehicle, logout } = useAuth();
  const { resetAllData } = useBooking();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // New vehicle modal state
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehiclePlate, setNewVehiclePlate] = useState('');
  const [newVehicleType, setNewVehicleType] = useState<'Car' | 'Bike' | 'EV' | 'SUV'>('Car');
  const [newVehicleNickname, setNewVehicleNickname] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    await updateProfile({ name, phone });
    setIsUpdating(false);
  };

  const handleAddVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehiclePlate.trim()) return;

    await addVehicle({
      vehicleNumber: newVehiclePlate.trim().toUpperCase(),
      vehicleType: newVehicleType,
      nickname: newVehicleNickname.trim() || undefined,
    });

    setNewVehiclePlate('');
    setNewVehicleNickname('');
    setShowAddVehicle(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
          Account Profile & Vehicles
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Manage your personal driver details, vehicles for automated barrier check-ins, and demo settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Column: Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-accent-600 text-white font-extrabold font-display text-2xl flex items-center justify-center mx-auto shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">{user?.name}</h3>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-brand-600" />
              Role: {user?.role}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Account Status:</span>
              <span className="font-semibold text-emerald-600">Verified Driver</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Member Since:</span>
              <span className="text-slate-800">
                {user ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
              </span>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Right Column: Edit Profile & Registered Vehicles (2 cols) */}
        <div className="md:col-span-2 space-y-8">
          {/* Edit Profile Form */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">
              Personal Information
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Email is locked to your authenticated security identity.
                </span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Profile</span>
                </button>
              </div>
            </form>
          </div>

          {/* Registered Vehicles Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Registered Vehicles
                </h3>
                <p className="text-xs text-slate-500">
                  Used for fast 1-click slot booking and barrier license plate verification
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddVehicle(!showAddVehicle)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Vehicle</span>
              </button>
            </div>

            {/* Add Vehicle Inline Modal / Form */}
            {showAddVehicle && (
              <form
                onSubmit={handleAddVehicleSubmit}
                className="bg-brand-50/60 p-4 rounded-2xl border border-brand-200 space-y-3 text-xs animate-in fade-in duration-200"
              >
                <span className="font-semibold text-slate-800 block">Register New Vehicle Plate</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Plate Number</label>
                    <input
                      type="text"
                      required
                      value={newVehiclePlate}
                      onChange={(e) => setNewVehiclePlate(e.target.value)}
                      placeholder="e.g. DL-01-CA-4004"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 uppercase font-mono font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">Vehicle Type</label>
                    <select
                      value={newVehicleType}
                      onChange={(e) => setNewVehicleType(e.target.value as 'Car' | 'Bike' | 'EV' | 'SUV')}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Car">Car (Sedan/Hatchback)</option>
                      <option value="EV">Electric Vehicle (EV)</option>
                      <option value="SUV">SUV / Large Vehicle</option>
                      <option value="Bike">Bike / Two-Wheeler</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">Nickname (Optional)</label>
                    <input
                      type="text"
                      value={newVehicleNickname}
                      onChange={(e) => setNewVehicleNickname(e.target.value)}
                      placeholder="e.g. Family Car"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddVehicle(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-brand-600 text-white font-semibold shadow-xs"
                  >
                    Save Vehicle
                  </button>
                </div>
              </form>
            )}

            {/* Vehicle List */}
            <div className="space-y-2.5">
              {user?.vehicles && user.vehicles.length > 0 ? (
                user.vehicles.map((v) => (
                  <div
                    key={v.vehicleNumber}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs">
                        <Car className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {v.vehicleNumber}
                        </span>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                          <span>{v.vehicleType}</span>
                          {v.nickname && <span>• {v.nickname}</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeVehicle(v.vehicleNumber)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Remove vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  No vehicles saved yet. Add your vehicle for rapid booking.
                </div>
              )}
            </div>
          </div>

          {/* Demo Maintenance / Reset Hub */}
          <div className="bg-amber-50/60 rounded-3xl p-6 border border-amber-200 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-semibold font-display text-sm">
              <RefreshCw className="w-4 h-4 text-amber-700" />
              <span>College Review Reset Panel</span>
            </div>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              Need a fresh presentation demo? You can reset all local storage records (slots, bookings, payments, telemetry) back to pristine college seed data at any time.
            </p>
            <button
              type="button"
              onClick={resetAllData}
              className="py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Database to Seed State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
