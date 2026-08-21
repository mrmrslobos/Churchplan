import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { RunSheetEditor } from './RunSheetEditor';
import { VolunteerRosterEditor } from './VolunteerRosterEditor';
import { LiveServiceClock } from './LiveServiceClock';
import { PrintableRunSheet } from './PrintableRunSheet';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  ListOrdered, 
  Users, 
  Printer, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  Share2, 
  ArrowLeft,
  Send,
  Sparkles,
  Edit2
} from 'lucide-react';
import { PlanStatus } from '../../types';

interface PlanDetailProps {
  planId: string;
  onBack: () => void;
  onOpenSendRemindersModal: () => void;
}

export const PlanDetail: React.FC<PlanDetailProps> = ({ 
  planId, 
  onBack, 
  onOpenSendRemindersModal 
}) => {
  const { plans, updatePlan, deletePlan, duplicatePlan } = usePlanner();
  const plan = plans.find(p => p.id === planId);

  const [activeSubTab, setActiveSubTab] = useState<'runsheet' | 'roster' | 'live_clock' | 'print'>('runsheet');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(plan?.notes || '');

  if (!plan) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <p className="font-semibold text-slate-800">Plan not found</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">
          Back to Plans List
        </button>
      </div>
    );
  }

  const handleSaveNotes = () => {
    updatePlan(plan.id, { notes: notesText });
    setIsEditingNotes(false);
  };

  const confirmedPositions = plan.positions.filter(p => p.status === 'confirmed').length;
  const totalPositions = plan.positions.length;

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Plans</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Status badge & selector */}
          <select
            value={plan.status}
            onChange={(e) => updatePlan(plan.id, { status: e.target.value as PlanStatus })}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${
              plan.status === 'published' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={() => duplicatePlan(plan.id)}
            title="Duplicate Plan"
            className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-xl text-xs font-medium border border-gray-200 shadow-xs transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this service plan?')) {
                deletePlan(plan.id);
                onBack();
              }
            }}
            title="Delete Plan"
            className="p-2 text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 rounded-xl text-xs font-medium border border-gray-200 shadow-xs transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Plan Header Bento Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-slate-900 relative overflow-hidden">
        <div className="space-y-4">
          
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {plan.serviceType}
                </span>
                {plan.seriesName && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                    Series: {plan.seriesName}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{plan.title}</h1>
            </div>

            {/* Schedule times block Bento pill */}
            <div className="flex items-center gap-3 bg-slate-50 border border-gray-200 p-3 rounded-2xl text-xs shadow-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Service</span>
                <span className="font-bold text-slate-900 text-sm">{plan.serviceStartTime}</span>
              </div>
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Call Time</span>
                <span className="font-semibold text-slate-700">{plan.callTime}</span>
              </div>
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Rehearsal</span>
                <span className="font-semibold text-slate-700">{plan.rehearsalTime}</span>
              </div>
            </div>
          </div>

          {/* Sermon info banner Bento row */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-slate-50 rounded-xl border border-gray-200 text-xs">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Sermon: {plan.sermonTitle}</span>
                <span className="text-slate-500 ml-2">by {plan.preacher} ({plan.scripturePassage})</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSendRemindersModal}
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Reminders</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Bento Navigation Tabs Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('runsheet')}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeSubTab === 'runsheet'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>Order of Service ({plan.runSheet.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roster')}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeSubTab === 'roster'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Volunteer Roster ({confirmedPositions}/{totalPositions})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('live_clock')}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeSubTab === 'live_clock'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Stage Clock</span>
        </button>

        <button
          onClick={() => setActiveSubTab('print')}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeSubTab === 'print'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Print / PDF</span>
        </button>
      </div>

      {/* Sub-view Content */}
      <div className="pt-1">
        {activeSubTab === 'runsheet' && <RunSheetEditor planId={plan.id} />}
        {activeSubTab === 'roster' && (
          <VolunteerRosterEditor 
            planId={plan.id} 
            onOpenSendRemindersModal={onOpenSendRemindersModal} 
          />
        )}
        {activeSubTab === 'live_clock' && <LiveServiceClock planId={plan.id} />}
        {activeSubTab === 'print' && <PrintableRunSheet planId={plan.id} onBack={() => setActiveSubTab('runsheet')} />}
      </div>

    </div>
  );
};
