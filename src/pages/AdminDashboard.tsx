import React from 'react';
import { useBooking } from '../context/BookingContext';
import { EntryExitScanner } from '../components/admin/EntryExitScanner';
import { Link } from 'react-router-dom';
import {
  Car,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowDownToLine,
  ArrowUpFromLine,
  LayoutGrid,
  BarChart3,
  Calendar,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { stats, locations, slots, bookings, refreshData } = useBooking();

  // Hourly traffic simulation based on bookings
  const hourlyData = [
    { hour: '06:00', vehicles: 4, revenue: 160 },
    { hour: '08:00', vehicles: 12, revenue: 480 },
    { hour: '10:00', vehicles: 22, revenue: 920 },
    { hour: '12:00', vehicles: 28, revenue: 1140 },
    { hour: '14:00', vehicles: 25, revenue: 1020 },
    { hour: '16:00', vehicles: 31, revenue: 1350 },
    { hour: '18:00', vehicles: 34, revenue: 1480 },
    { hour: '20:00', vehicles: 20, revenue: 840 },
    { hour: '22:00', vehicles: 8, revenue: 320 },
  ];

  // Revenue by location
  const locationRevenueData = locations.map((loc) => {
    const locBookings = bookings.filter((b) => b.locationId === loc.locationId);
    const rev = locBookings.reduce((sum, b) => sum + (b.paymentStatus === 'paid' ? b.totalAmount : 0), 0);
    return {
      name: loc.name.split(' ')[0] + ' ' + (loc.name.split(' ')[1] || ''),
      revenue: rev || 150,
      bookings: locBookings.length,
    };
  });

  // Slot breakdown by type
  const typeCount = {
    Standard: slots.filter((s) => s.slotType === 'Standard').length,
    EV: slots.filter((s) => s.slotType === 'EV').length,
    Handicapped: slots.filter((s) => s.slotType === 'Handicapped').length,
    VIP: slots.filter((s) => s.slotType === 'VIP').length,
  };

  const pieData = [
    { name: 'Standard', value: typeCount.Standard, color: '#059669' },
    { name: 'EV Charging', value: typeCount.EV, color: '#f59e0b' },
    { name: 'Accessible', value: typeCount.Handicapped, color: '#3b82f6' },
    { name: 'VIP Executive', value: typeCount.VIP, color: '#8b5cf6' },
  ];

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-navy-900 text-brand-400 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            <span>Operational Command Center</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time urban parking telemetry, gate operations, slot management, and fiscal revenue monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshData()}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Refresh database telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/admin/slots"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-brand-400" />
            <span>Manage Slots</span>
          </Link>
          <Link
            to="/admin/bookings"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>All Bookings</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Bays</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4" />
            </div>
          </div>
          <span className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 block">
            {stats.totalSlots}
          </span>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">{stats.availableSlots} free</span>
            <span>• {stats.occupiedSlots} occupied</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Parked</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <span className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-600 block">
            {stats.activeBookings}
          </span>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Inside facility bays right now</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Today's Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 block">
            ₹{stats.todayRevenue || 430}
          </span>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Digital payments collected</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Today's Barrier Flow</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ArrowDownToLine className="w-4 h-4" />
            </div>
          </div>
          <span className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 block">
            {stats.vehiclesEnteredToday || bookings.filter((b) => b.entryTime).length} In
          </span>
          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <span>{stats.vehiclesExitedToday || bookings.filter((b) => b.exitTime).length} Exited</span>
            <span>• Fast-Tag QR</span>
          </div>
        </div>
      </div>

      {/* Real-time Gate Barrier Verification Terminal */}
      <EntryExitScanner />

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Hourly Demand Traffic Curve (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Peak Parking Traffic Trends (24h)
              </h3>
              <p className="text-xs text-slate-400">Hourly vehicle influx across all municipal parking complexes</p>
            </div>
            <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
              Live Flow
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="vehicles"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVehicles)"
                  name="Vehicles Parked"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Slot Type Distribution Pie Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-display font-bold text-base text-slate-900">
            Bay Infrastructure Distribution
          </h3>
          <p className="text-xs text-slate-400">Breakdown of parking inventory</p>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600 truncate">{item.name}:</span>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings Activity Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Live Activity & Vehicle Registry
            </h3>
            <p className="text-xs text-slate-400">Incoming reservations and check-in statuses</p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            View Complete Registry →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-2">Ref ID</th>
                <th className="py-3 px-2">Driver</th>
                <th className="py-3 px-2">Facility & Slot</th>
                <th className="py-3 px-2">Vehicle</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentBookings.map((b) => (
                <tr key={b.bookingId} className="hover:bg-slate-50/70">
                  <td className="py-3 px-2 font-mono font-bold text-slate-900">{b.bookingId}</td>
                  <td className="py-3 px-2">
                    <span className="font-semibold text-slate-800">{b.userName}</span>
                    <span className="block text-[10px] text-slate-400">{b.userEmail}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-slate-700">{b.locationName}</span>
                    <span className="block text-[10px] font-bold text-brand-600">Slot {b.slotNumber}</span>
                  </td>
                  <td className="py-3 px-2 font-mono font-semibold text-slate-800">{b.vehicleNumber}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        b.bookingStatus === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.bookingStatus === 'upcoming'
                          ? 'bg-amber-100 text-amber-800'
                          : b.bookingStatus === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-display font-bold text-slate-900">
                    ₹{b.totalAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
