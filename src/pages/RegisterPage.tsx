import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import { Car, Lock, Mail, User, Phone, Shield, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, addVehicle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<'Car' | 'Bike' | 'EV' | 'SUV'>('Car');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setIsSubmitting(true);
    const success = await register(name, email, password, phone, role);
    setIsSubmitting(false);

    if (success) {
      if (vehicleNumber.trim()) {
        await addVehicle({
          vehicleNumber: vehicleNumber.trim().toUpperCase(),
          vehicleType,
          nickname: 'Primary Vehicle',
        });
      }
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-500/30">
            <Car className="w-6 h-6" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
            Create your Account
          </h2>
          <p className="text-xs text-slate-500">
            Join Mnemia ParkAI smart parking urban network
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@mail.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                  placeholder="+91 9876543210"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Account Role Selector */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Account Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2 px-3 rounded-xl border font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  role === 'user'
                    ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-500'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Vehicle Owner</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 rounded-xl border font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  role === 'admin'
                    ? 'border-navy-900 bg-navy-900 text-white'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Administrator</span>
              </button>
            </div>
          </div>

          {/* Initial Vehicle Optional Input */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Primary Vehicle (Optional):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="e.g. KA-01-AB-1234"
                className="px-3 py-2 rounded-xl border border-slate-200 uppercase font-mono font-medium"
              />
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as 'Car' | 'Bike' | 'EV' | 'SUV')}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Car">Sedan / Hatchback</option>
                <option value="EV">Electric Vehicle (EV)</option>
                <option value="SUV">SUV / MUV</option>
                <option value="Bike">Motorcycle / 2-Wheeler</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Log in to account
          </Link>
        </div>
      </div>
    </div>
  );
};
