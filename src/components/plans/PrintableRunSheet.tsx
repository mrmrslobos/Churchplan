import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { Printer, ArrowLeft } from 'lucide-react';

interface PrintableRunSheetProps {
  planId: string;
  onBack?: () => void;
}

export const PrintableRunSheet: React.FC<PrintableRunSheetProps> = ({ planId, onBack }) => {
  const { plans, ministries } = usePlanner();
  const plan = plans.find(p => p.id === planId);

  if (!plan) return <div className="text-slate-400 p-8 text-center">Plan not found</div>;

  const handlePrint = () => {
    window.print();
  };

  const calculateStartTime = (index: number): string => {
    const [startHourStr, startMinStr] = plan.serviceStartTime.split(':');
    let totalSecs = (parseInt(startHourStr, 10) * 3600) + (parseInt(startMinStr, 10) * 60);

    for (let i = 0; i < index; i++) {
      totalSecs += (plan.runSheet[i].durationMinutes * 60) + plan.runSheet[i].durationSeconds;
    }

    const hours = Math.floor(totalSecs / 3600) % 24;
    const mins = Math.floor((totalSecs % 3600) / 60);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${mins.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Top screen control bar (hidden in print) */}
      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm print:hidden">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Order of Service</span>
          </button>
        )}
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors ml-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print Run Sheet / Save PDF</span>
        </button>
      </div>

      {/* Printable Paper Document Sheet */}
      <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0 space-y-6">
        
        {/* Church & Service Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-indigo-700">Grace Community Church • Service Run Sheet</div>
            <h1 className="text-2xl font-black text-slate-900 mt-0.5">{plan.title}</h1>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 mt-1">
              <span>📅 {plan.date}</span>
              <span>⏰ Service: {plan.serviceStartTime}</span>
              <span>🎧 Team Call: {plan.callTime}</span>
              <span>🎸 Rehearsal: {plan.rehearsalTime}</span>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-bold text-slate-800">Sermon: {plan.sermonTitle}</div>
            <div className="text-slate-600">{plan.preacher} ({plan.scripturePassage})</div>
            {plan.seriesName && (
              <div className="text-[11px] font-medium text-indigo-600">Series: {plan.seriesName}</div>
            )}
          </div>
        </div>

        {/* Order of Service Table */}
        <div>
          <h2 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 mb-2">Order of Service / Run Sheet</h2>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100 text-slate-700">
                <th className="py-2 px-2 font-bold w-16">Time</th>
                <th className="py-2 px-2 font-bold">Element / Song Title</th>
                <th className="py-2 px-2 font-bold w-24">Key / BPM</th>
                <th className="py-2 px-2 font-bold">Leader / Presenter</th>
                <th className="py-2 px-2 font-bold w-16 text-right">Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {plan.runSheet.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-2 px-2 font-mono font-semibold text-slate-600">
                    {calculateStartTime(idx)}
                  </td>
                  <td className="py-2 px-2">
                    <div className="font-bold text-slate-900">{item.title}</div>
                    {item.notes && <div className="text-[11px] text-slate-500 italic">{item.notes}</div>}
                  </td>
                  <td className="py-2 px-2 font-mono text-[11px] text-slate-700">
                    {item.songDetails ? `${item.songDetails.key} • ${item.songDetails.bpm}bpm` : '—'}
                  </td>
                  <td className="py-2 px-2 text-slate-800 font-medium">
                    {item.presenter || '—'}
                  </td>
                  <td className="py-2 px-2 font-mono text-right font-semibold text-slate-700">
                    {item.durationMinutes}:{item.durationSeconds.toString().padStart(2, '0')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Volunteer Roster Summary */}
        <div className="border-t border-slate-200 pt-4">
          <h2 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 mb-2">Serving Team Roster</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {ministries.map(ministry => {
              const posInMin = plan.positions.filter(p => p.ministryId === ministry.id);
              if (posInMin.length === 0) return null;

              return (
                <div key={ministry.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 text-[11px] border-b border-slate-200 pb-0.5">
                    {ministry.name}
                  </div>
                  {posInMin.map(pos => (
                    <div key={pos.id} className="flex justify-between text-[11px]">
                      <span className="text-slate-600">{pos.roleName}:</span>
                      <span className="font-semibold text-slate-900">{pos.volunteerName || 'Unassigned'}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tech & Production Notes */}
        {plan.notes && (
          <div className="border-t border-slate-200 pt-3 text-xs">
            <span className="font-bold text-slate-800">Special Notes: </span>
            <span className="text-slate-600">{plan.notes}</span>
          </div>
        )}

      </div>
    </div>
  );
};
