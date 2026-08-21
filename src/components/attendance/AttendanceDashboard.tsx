import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { HISTORICAL_ATTENDANCE } from '../../data/initialData';
import { HeadcountKiosk } from './HeadcountKiosk';
import { 
  BarChart3, 
  Users, 
  Smile, 
  Tv, 
  UserPlus, 
  DollarSign, 
  Plus, 
  TrendingUp
} from 'lucide-react';

export const AttendanceDashboard: React.FC = () => {
  const { plans } = usePlanner();
  const [isKioskOpen, setIsKioskOpen] = useState(false);

  // Latest record calculations
  const totalInPersonLatest = 215 + 58 + 34 + 35; // 342
  const kidsLatest = 58;
  const youthLatest = 34;
  const onlineLatest = 112;
  const firstTimersLatest = 14;
  const givingLatest = 8450;

  // Max attendance in history for chart scaling
  const maxAttendance = Math.max(...HISTORICAL_ATTENDANCE.map(h => h.total));

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance & Growth Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track Sunday service headcounts, kids check-in numbers, online viewership, and visitor trends.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsKioskOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Record Sunday Headcount</span>
          </button>
        </div>
      </div>

      {/* Bento KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold text-slate-700">In-Person</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalInPersonLatest}</div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-0.5 font-bold">
            <TrendingUp className="w-3 h-3" /> +5.4% vs last mo
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold text-slate-700">Kids Ministry</span>
            <Smile className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{kidsLatest}</div>
          <div className="text-[11px] text-slate-500">Nursery to 5th grade</div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold text-slate-700">Youth Room</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{youthLatest}</div>
          <div className="text-[11px] text-slate-500">6th to 12th grade</div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold text-slate-700">Online Stream</span>
            <Tv className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{onlineLatest}</div>
          <div className="text-[11px] text-slate-500">Live peak viewers</div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold text-slate-700">First-Timers</span>
            <UserPlus className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{firstTimersLatest}</div>
          <div className="text-[11px] text-amber-600 font-bold">Lounge guests</div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold text-slate-700">Sunday Tithes</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">${(givingLatest).toLocaleString()}</div>
          <div className="text-[11px] text-slate-500">General fund</div>
        </div>

      </div>

      {/* Historical Trend Bento Card */}
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">8-Week Total Attendance Growth</h2>
            <p className="text-xs text-slate-500">Comparing Sunday Traditional (9am), Contemporary (11:15am), Kids & Online</p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-indigo-600" />
              <span className="text-slate-600 font-medium">Contemporary</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
              <span className="text-slate-600 font-medium">Traditional</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-amber-500" />
              <span className="text-slate-600 font-medium">Kids</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-sky-500" />
              <span className="text-slate-600 font-medium">Online</span>
            </div>
          </div>
        </div>

        {/* CSS Multi-bar Stacked Bento Chart */}
        <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-gray-100">
          {HISTORICAL_ATTENDANCE.map((week) => {
            const heightPercent = (week.total / maxAttendance) * 100;
            const contPercent = (week.contemporary / week.total) * 100;
            const tradPercent = (week.traditional / week.total) * 100;
            const kidsPercent = (week.kids / week.total) * 100;
            const onlinePercent = (week.online / week.total) * 100;

            const dateLabel = new Date(`${week.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return (
              <div key={week.date} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                {/* Value tooltip hover */}
                <div className="text-[10px] font-mono font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">
                  {week.total}
                </div>

                {/* Stacked bar */}
                <div 
                  className="w-full max-w-[44px] rounded-t-lg overflow-hidden flex flex-col-reverse shadow-xs transition-all duration-300 group-hover:opacity-90"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div style={{ height: `${contPercent}%` }} className="bg-indigo-600" title={`Contemporary: ${week.contemporary}`} />
                  <div style={{ height: `${tradPercent}%` }} className="bg-emerald-500" title={`Traditional: ${week.traditional}`} />
                  <div style={{ height: `${kidsPercent}%` }} className="bg-amber-500" title={`Kids: ${week.kids}`} />
                  <div style={{ height: `${onlinePercent}%` }} className="bg-sky-500" title={`Online: ${week.online}`} />
                </div>

                {/* Date label */}
                <span className="text-[10px] text-slate-500 font-semibold whitespace-nowrap mt-1">
                  {dateLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attendance Records Bento Ledger */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm space-y-0">
        <div className="p-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Service Attendance Ledger</h2>
          <span className="text-xs text-slate-500 font-medium">Official Headcount Logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50/60 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Service Plan</th>
                <th className="py-3 px-4 text-center">Sanctuary</th>
                <th className="py-3 px-4 text-center">Kids Wing</th>
                <th className="py-3 px-4 text-center">Youth</th>
                <th className="py-3 px-4 text-center">Volunteers</th>
                <th className="py-3 px-4 text-center">Online</th>
                <th className="py-3 px-4 text-center">First-Timers</th>
                <th className="py-3 px-4 text-right">In-Person Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-700">
              {plans.map(plan => {
                const att = plan.attendance;
                if (!att) return null;
                const inPersonTotal = (att.adults || 0) + (att.kids || 0) + (att.youth || 0) + (att.volunteers || 0);

                return (
                  <tr key={plan.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{plan.date}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{plan.title}</div>
                      <div className="text-[11px] text-slate-500">{plan.serviceStartTime} • {att.weather || 'Clear'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-medium">{att.adults || 0}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-amber-600 font-bold">{att.kids || 0}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-purple-600 font-bold">{att.youth || 0}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-medium">{att.volunteers || 0}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-sky-600 font-bold">{att.online || 0}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-emerald-600 font-bold">{att.firstTimers || 0}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 text-sm">
                      {inPersonTotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <HeadcountKiosk
        isOpen={isKioskOpen}
        onClose={() => setIsKioskOpen(false)}
      />

    </div>
  );
};
