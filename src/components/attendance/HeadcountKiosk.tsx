import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { Plus, Minus, Save, X } from 'lucide-react';

interface HeadcountKioskProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeadcountKiosk: React.FC<HeadcountKioskProps> = ({ isOpen, onClose }) => {
  const { plans, recordAttendance, selectedPlanId } = usePlanner();
  const [targetPlanId, setTargetPlanId] = useState(selectedPlanId || plans[0]?.id);

  const plan = plans.find(p => p.id === targetPlanId) || plans[0];

  const [adults, setAdults] = useState(plan?.attendance?.adults || 215);
  const [kids, setKids] = useState(plan?.attendance?.kids || 58);
  const [youth, setYouth] = useState(plan?.attendance?.youth || 34);
  const [volunteersOnDuty, setVolunteersOnDuty] = useState(plan?.attendance?.volunteers || 35);
  const [online, setOnline] = useState(plan?.attendance?.online || 112);
  const [firstTimers, setFirstTimers] = useState(plan?.attendance?.firstTimers || 14);
  const [weather, setWeather] = useState(plan?.attendance?.weather || 'Sunny, 74°F');
  const [givingSnapshot, setGivingSnapshot] = useState(plan?.attendance?.givingSnapshot || 8450);
  const [notes, setNotes] = useState(plan?.attendance?.notes || '');

  if (!isOpen) return null;

  const totalInPerson = adults + kids + youth + volunteersOnDuty;
  const grandTotal = totalInPerson + online;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    recordAttendance(plan.id, {
      adults: Number(adults),
      kids: Number(kids),
      youth: Number(youth),
      volunteers: Number(volunteersOnDuty),
      online: Number(online),
      firstTimers: Number(firstTimers),
      givingSnapshot: Number(givingSnapshot),
      weather,
      notes
    });

    onClose();
  };

  const CounterSection = ({ 
    label, 
    value, 
    onChange, 
    step = 1 
  }: { 
    label: string; 
    value: number; 
    onChange: (val: number) => void;
    step?: number;
  }) => (
    <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl flex items-center justify-between gap-4">
      <div>
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</div>
        <div className="text-2xl font-black text-indigo-600 font-mono mt-0.5">{value}</div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - (step > 1 ? 5 : 1)))}
          className="w-9 h-9 rounded-lg bg-white border border-gray-200 hover:bg-slate-100 active:scale-95 text-slate-700 flex items-center justify-center font-bold text-base transition-transform shadow-xs"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onChange(value + (step > 1 ? 5 : 1))}
          className="w-9 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white flex items-center justify-center font-bold text-base transition-transform shadow-xs"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-900">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Usher & Door Check-In Mode</span>
            <h2 className="text-lg font-bold text-slate-900">Live Attendance Headcounter</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-5">
          
          {/* Target Service Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Service Plan</label>
            <select
              value={targetPlanId}
              onChange={(e) => setTargetPlanId(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
            >
              {plans.map(p => (
                <option key={p.id} value={p.id}>{p.title} ({p.date} at {p.serviceStartTime})</option>
              ))}
            </select>
          </div>

          {/* Grand Total Summary Banner Bento Pill */}
          <div className="p-5 bg-indigo-900 text-white rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <div className="text-xs text-indigo-200 font-bold uppercase tracking-wider">Total In-Person Attendance</div>
              <div className="text-3xl font-black text-white font-mono mt-0.5">{totalInPerson}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-indigo-200">Grand Total (+ Online)</div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{grandTotal}</div>
            </div>
          </div>

          {/* Counters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CounterSection label="Adults (Main Sanctuary)" value={adults} onChange={setAdults} step={5} />
            <CounterSection label="Kingdom Kids Wing" value={kids} onChange={setKids} />
            <CounterSection label="Youth Room" value={youth} onChange={setYouth} />
            <CounterSection label="Volunteers on Duty" value={volunteersOnDuty} onChange={setVolunteersOnDuty} />
            <CounterSection label="Online Livestream Viewers" value={online} onChange={setOnline} step={5} />
            <CounterSection label="First-Time Welcome Guests" value={firstTimers} onChange={setFirstTimers} />
          </div>

          {/* Additional details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Weather Conditions</label>
              <input
                type="text"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                placeholder="e.g. Sunny, 72°F or Rainy"
                className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sunday Offering / Tithes ($)</label>
              <input
                type="number"
                value={givingSnapshot}
                onChange={(e) => setGivingSnapshot(Number(e.target.value))}
                placeholder="8450"
                className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Headcounter Usher Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Extra chairs set out on east aisle, high visitor count in kids preschool..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Headcount Record</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
