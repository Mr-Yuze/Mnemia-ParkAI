import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Car,
  Zap,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const AdminAnalyticsPage: React.FC = () => {
  const { stats, locations, bookings, slots } = useBooking();
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');

  // Daily revenue data
  const revenueTrendData = [
    { day: 'Mon', revenue: 1420, bookings: 28, occupancyRate: 68 },
    { day: 'Tue', revenue: 1850, bookings: 36, occupancyRate: 75 },
    { day: 'Wed', revenue: 1690, bookings: 33, occupancyRate: 72 },
    { day: 'Thu', revenue: 2100, bookings: 42, occupancyRate: 84 },
    { day: 'Fri', revenue: 2750, bookings: 55, occupancyRate: 92 },
    { day: 'Sat', revenue: 3200, bookings: 64, occupancyRate: 96 },
    { day: 'Sun', revenue: 2890, bookings: 58, occupancyRate: 89 },
  ];

  // Peak Hours distribution
  const peakHoursData = [
    { period: '00-04h', volume: 6 },
    { period: '04-08h', volume: 18 },
    { period: '08-12h', volume: 74 },
    { period: '12-16h', volume: 88 },
    { period: '16-20h', volume: 95 },
    { period: '20-24h', volume: 42 },
  ];

  // Vehicle category distribution
  const vehicleStats = [
    { type: 'Car (Sedan/Hatch)', count: bookings.filter((b) => b.vehicleType === 'Car').length || 14, color: '#059669' },
    { type: 'Electric Vehicle (EV)', count: bookings.filter((b) => b.vehicleType === 'EV').length || 8, color: '#f59e0b' },
    { type: 'SUV / Large Vehicle', count: bookings.filter((b) => b.vehicleType === 'SUV').length || 6, color: '#3b82f6' },
    { type: 'Two-Wheeler / Bike', count: bookings.filter((b) => b.vehicleType === 'Bike').length || 4, color: '#8b5cf6' },
  ];

  const handleExportAnalyticsReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Day,Revenue (INR),Total Bookings,Average Occupancy Rate (%)\n' +
      revenueTrendData.map((d) => `${d.day},${d.revenue},${d.bookings},${d.occupancyRate}%`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Mnemia_ParkAI_Revenue_Analytics_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-brand-600" />
            <span>AI Predictive & Usage Analytics</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Parking Analytics & Revenue
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Historical demand curves, revenue efficiency, vehicle breakdowns, and operational utilization reports.
          </p>
        </div>

        <button
          onClick={handleExportAnalyticsReport}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Weekly Revenue</span>
          <span className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 block">
            ₹15,900
          </span>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs previous week
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Average Turnaround</span>
          <span className="font-display font-extrabold text-2xl sm:text-3xl text-brand-600 block">
            3.4 Hours
          </span>
          <span className="text-xs text-slate-500">Peak dwell time at malls</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Peak Occupancy</span>
          <span className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 block">
            96%
          </span>
          <span className="text-xs text-amber-600 font-semibold">Saturday 18:00 - 20:00</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">EV Adoption Ratio</span>
          <span className="font-display font-extrabold text-2xl sm:text-3xl text-amber-600 block">
            28.5%
          </span>
          <span className="text-xs text-slate-500">Charging bay utilization</span>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Revenue Trends Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Revenue & Daily Reservation Volume
              </h3>
              <p className="text-xs text-slate-400">Total tariff earnings across all municipal parking bays</p>
            </div>

            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setTimeframe('day')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${timeframe === 'day' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
              >
                Day
              </button>
              <button
                onClick={() => setTimeframe('week')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${timeframe === 'week' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeframe('month')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${timeframe === 'month' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
              >
                Month
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} name="Tariff Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Demand Periods (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-display font-bold text-base text-slate-900">
            Peak Demand Hours
          </h3>
          <p className="text-xs text-slate-400">Peak vehicle arrival distribution</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={peakHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={10} tickLine={false} />
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
                  dataKey="volume"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPeak)"
                  name="Vehicle Volume"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Vehicle Type Classification Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <h3 className="font-display font-bold text-lg text-slate-900">
          Vehicle Classification Insights
        </h3>
        <p className="text-xs text-slate-400">Demand distribution across different vehicle categories</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicleStats.map((item) => (
            <div
              key={item.type}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-700 block">{item.type}</span>
                <span className="font-display font-extrabold text-2xl text-slate-900 mt-1 block">
                  {item.count}
                </span>
                <span className="text-[10px] text-slate-400">Recorded Sessions</span>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: item.color }}
              >
                <Car className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
