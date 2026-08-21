import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { X, Send, Mail, Smartphone, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
}

export const QuickSendModal: React.FC<QuickSendModalProps> = ({ isOpen, onClose, planId }) => {
  const { plans, reminderTemplates, sendReminders } = usePlanner();
  const plan = plans.find(p => p.id === planId);

  const [channel, setChannel] = useState<'email' | 'sms' | 'both'>('both');
  const [templateId, setTemplateId] = useState(reminderTemplates[0]?.id || 'tmpl-3days');
  const [sendToOnlyPending, setSendToOnlyPending] = useState(true);

  if (!isOpen || !plan) return null;

  const eligiblePositions = plan.positions.filter(p => {
    if (!p.volunteerId) return false;
    if (sendToOnlyPending) return p.status !== 'confirmed';
    return true;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const positionIds = eligiblePositions.map(p => p.id);
    sendReminders(plan.id, templateId, channel, positionIds);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-900 space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Send Volunteer Reminders</h3>
            <p className="text-xs text-slate-500">{plan.title} ({plan.date})</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSend} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Notification Channel</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChannel('email')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  channel === 'email' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-gray-200 hover:bg-slate-100'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('sms')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  channel === 'sms' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-gray-200 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>SMS</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('both')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  channel === 'both' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-gray-200 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Both</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Message Template</label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white"
            >
              {reminderTemplates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-bold">Recipient Target:</span>
              <span className="text-indigo-600 font-black">{eligiblePositions.length} volunteer(s)</span>
            </div>

            <label className="flex items-center gap-2 text-slate-600 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={sendToOnlyPending}
                onChange={(e) => setSendToOnlyPending(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600"
              />
              <span>Send only to pending / unconfirmed volunteers</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={eligiblePositions.length === 0}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-xl shadow-xs transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send {eligiblePositions.length} Reminders</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
