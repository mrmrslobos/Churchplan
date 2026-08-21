import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { ServiceType, PlanStatus } from '../../types';
import { X } from 'lucide-react';

interface NewPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewPlanModal: React.FC<NewPlanModalProps> = ({ isOpen, onClose }) => {
  const { addPlan, sermonSeries, plans } = usePlanner();

  const [title, setTitle] = useState('Sunday Contemporary Service');
  const [serviceType, setServiceType] = useState<ServiceType>('Sunday Contemporary 11:15 AM');
  const [date, setDate] = useState(() => {
    // Next Sunday default
    const d = new Date();
    d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7));
    return d.toISOString().split('T')[0];
  });
  const [serviceStartTime, setServiceStartTime] = useState('11:15');
  const [callTime, setCallTime] = useState('09:45');
  const [rehearsalTime, setRehearsalTime] = useState('10:00');
  const [sermonTitle, setSermonTitle] = useState('Rooted in Grace');
  const [preacher, setPreacher] = useState('Pastor Thomas Vance');
  const [scripturePassage, setScripturePassage] = useState('Colossians 2:6-10');
  const [seriesId, setSeriesId] = useState(sermonSeries[0]?.id || '');
  const [status, setStatus] = useState<PlanStatus>('draft');
  const [copyFromPlanId, setCopyFromPlanId] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenSeries = sermonSeries.find(s => s.id === seriesId);
    
    let baseRunSheet = undefined;
    let basePositions = undefined;

    if (copyFromPlanId) {
      const sourcePlan = plans.find(p => p.id === copyFromPlanId);
      if (sourcePlan) {
        baseRunSheet = sourcePlan.runSheet.map(item => ({ ...item, id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` }));
        basePositions = sourcePlan.positions.map(pos => ({ 
          ...pos, 
          id: `pos-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          status: 'unconfirmed' as const,
          reminderSentAt: undefined 
        }));
      }
    }

    addPlan({
      title,
      serviceType,
      date,
      serviceStartTime,
      callTime,
      rehearsalTime,
      sermonTitle,
      preacher,
      scripturePassage,
      seriesId,
      seriesName: chosenSeries?.title,
      status,
      runSheet: baseRunSheet,
      positions: basePositions
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create New Service Plan</h2>
            <p className="text-xs text-slate-500 mt-0.5">Schedule a Sunday service, assign order of worship, and setup volunteer roster.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Service Name / Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
              >
                <option value="Sunday Contemporary 11:15 AM">Sunday Contemporary 11:15 AM</option>
                <option value="Sunday Traditional 9:00 AM">Sunday Traditional 9:00 AM</option>
                <option value="Youth Encounter Friday 7:00 PM">Youth Encounter Friday 7:00 PM</option>
                <option value="Wednesday Midweek & Prayer 7:00 PM">Wednesday Midweek & Prayer 7:00 PM</option>
                <option value="Special Worship Night">Special Worship Night</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Service Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Service Start Time</label>
              <input
                type="text"
                value={serviceStartTime}
                onChange={(e) => setServiceStartTime(e.target.value)}
                placeholder="11:15"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Team Call Time</label>
              <input
                type="text"
                value={callTime}
                onChange={(e) => setCallTime(e.target.value)}
                placeholder="09:45"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Band Rehearsal</label>
              <input
                type="text"
                value={rehearsalTime}
                onChange={(e) => setRehearsalTime(e.target.value)}
                placeholder="10:00"
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Sermon & Teaching Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sermon Title</label>
                <input
                  type="text"
                  value={sermonTitle}
                  onChange={(e) => setSermonTitle(e.target.value)}
                  placeholder="e.g. Walking in the Light"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preacher / Speaker</label>
                <input
                  type="text"
                  value={preacher}
                  onChange={(e) => setPreacher(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Scripture Passage</label>
                <input
                  type="text"
                  value={scripturePassage}
                  onChange={(e) => setScripturePassage(e.target.value)}
                  placeholder="e.g. Ephesians 2:1-10"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sermon Series</label>
                <select
                  value={seriesId}
                  onChange={(e) => setSeriesId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- None / Standalone Message --</option>
                  {sermonSeries.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Copy Template / Flow from Previous Plan</label>
            <select
              value={copyFromPlanId}
              onChange={(e) => setCopyFromPlanId(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
            >
              <option value="">Start with clean standard template</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  Copy structure from: {p.title} ({p.date})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">Clones order of service items and volunteer positions automatically.</p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-medium">Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PlanStatus)}
                className="px-2.5 py-1 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-700 font-bold"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
              >
                Create Service Plan
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
