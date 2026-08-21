import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { ReminderTemplate, ReminderRecipientLog } from '../../types';
import { 
  Send, 
  Mail, 
  CheckCircle2, 
  UserX, 
  Eye, 
  Sparkles, 
  Edit3, 
  Smartphone,
  Inbox
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RemindersCenterProps {
  initialPlanId?: string;
}

export const RemindersCenter: React.FC<RemindersCenterProps> = ({ initialPlanId }) => {
  const { 
    plans, 
    selectedPlanId, 
    volunteers, 
    reminderTemplates, 
    reminderLogs, 
    sendReminders, 
    respondToReminder,
    updateReminderTemplate 
  } = usePlanner();

  const [activePlanId, setActivePlanId] = useState(initialPlanId || selectedPlanId || plans[0]?.id);
  const [selectedTemplateId, setSelectedTemplateId] = useState(reminderTemplates[0]?.id || 'tmpl-3days');
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'sms' | 'both'>('both');
  const [activeTab, setActiveTab] = useState<'dispatcher' | 'logs' | 'templates'>('dispatcher');
  
  // Selected positions for dispatch
  const plan = plans.find(p => p.id === activePlanId) || plans[0];
  const [selectedPosIds, setSelectedPosIds] = useState<string[]>([]);

  // Editing template
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [tempSubject, setTempSubject] = useState('');
  const [tempBody, setTempBody] = useState('');

  // Sample volunteer for preview
  const samplePos = plan?.positions.find(p => p.volunteerId) || plan?.positions[0];
  const sampleVol = volunteers.find(v => v.id === samplePos?.volunteerId) || volunteers[0];
  const selectedTemplate = reminderTemplates.find(t => t.id === selectedTemplateId) || reminderTemplates[0];

  // Merge tag preview generator
  const getInterpolatedContent = (templateBody: string) => {
    if (!plan || !sampleVol) return templateBody;
    return templateBody
      .replace(/{{volunteer_name}}/g, sampleVol.name)
      .replace(/{{service_name}}/g, plan.title)
      .replace(/{{service_date}}/g, plan.date)
      .replace(/{{role}}/g, samplePos?.roleName || 'Volunteer Position')
      .replace(/{{ministry_name}}/g, 'Ministry Team')
      .replace(/{{call_time}}/g, samplePos?.callTime || plan.callTime)
      .replace(/{{rehearsal_time}}/g, plan.rehearsalTime)
      .replace(/{{quick_link}}/g, 'https://sanctuary.app/portal')
      .replace(/{{confirm_button}}/g, '[ ✅ Confirm Availability ]')
      .replace(/{{decline_button}}/g, '[ ❌ Decline / Request Sub ]')
      .replace(/{{claim_button}}/g, '[ 🚀 Accept Open Position ]');
  };

  const getInterpolatedSubject = (subj: string) => {
    if (!plan) return subj;
    return subj
      .replace(/{{service_name}}/g, plan.title)
      .replace(/{{service_date}}/g, plan.date)
      .replace(/{{role}}/g, samplePos?.roleName || 'Serving');
  };

  const toggleSelectPos = (posId: string) => {
    if (selectedPosIds.includes(posId)) {
      setSelectedPosIds(selectedPosIds.filter(id => id !== posId));
    } else {
      setSelectedPosIds([...selectedPosIds, posId]);
    }
  };

  const selectAllUnconfirmed = () => {
    if (!plan) return;
    const unconfirmed = plan.positions.filter(p => p.volunteerId && p.status !== 'confirmed').map(p => p.id);
    setSelectedPosIds(unconfirmed);
  };

  const selectAll = () => {
    if (!plan) return;
    const all = plan.positions.filter(p => p.volunteerId).map(p => p.id);
    setSelectedPosIds(all);
  };

  const handleDispatch = () => {
    if (!plan) return;
    const idsToSend = selectedPosIds.length > 0 ? selectedPosIds : undefined;
    sendReminders(plan.id, selectedTemplateId, selectedChannel, idsToSend);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}
    setActiveTab('logs');
  };

  const handleSimulateResponse = (logId: string, response: 'confirmed' | 'declined') => {
    respondToReminder(logId, response, response === 'declined' ? 'Simulated decline: Out of town' : undefined);
    if (response === 'confirmed') {
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handleStartEditTemplate = (tmpl: ReminderTemplate) => {
    setEditingTemplateId(tmpl.id);
    setTempSubject(tmpl.subject);
    setTempBody(tmpl.body);
  };

  const handleSaveTemplate = (tmplId: string) => {
    updateReminderTemplate(tmplId, { subject: tempSubject, body: tempBody });
    setEditingTemplateId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Automated Reminders & Communications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dispatch automated email and SMS notifications with one-tap RSVP confirmations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-gray-200 rounded-xl">
          <button
            onClick={() => setActiveTab('dispatcher')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'dispatcher' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Dispatch Reminders
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'logs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Delivery Logs ({reminderLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'templates' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Templates
          </button>
        </div>
      </div>

      {/* DISPATCHER TAB */}
      {activeTab === 'dispatcher' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Setup & Recipients (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Service & Template selection Bento Card */}
            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Select Service & Channel</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Service</label>
                  <select
                    value={activePlanId}
                    onChange={(e) => setActivePlanId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>{p.title} ({p.date})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Channel</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedChannel('email')}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        selectedChannel === 'email'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-gray-200 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedChannel('sms')}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        selectedChannel === 'sms'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-gray-200 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>SMS</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedChannel('both')}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        selectedChannel === 'both'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-gray-200 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Both</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reminder Template</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white"
                >
                  {reminderTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.channel.toUpperCase()})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Volunteers Bento Card */}
            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. Scheduled Volunteers</h2>
                  <p className="text-xs text-slate-500">Select which scheduled team members will receive this notification</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAllUnconfirmed}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-bold hover:underline"
                  >
                    Select Pending Only
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                  >
                    Select All
                  </button>
                </div>
              </div>

              {/* Roster list with checkboxes */}
              <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1 space-y-1">
                {plan?.positions.filter(p => p.volunteerId).map(pos => {
                  const vol = volunteers.find(v => v.id === pos.volunteerId);
                  const isChecked = selectedPosIds.length === 0 || selectedPosIds.includes(pos.id);

                  return (
                    <div 
                      key={pos.id} 
                      onClick={() => toggleSelectPos(pos.id)}
                      className="py-2.5 px-3 rounded-xl flex items-center justify-between gap-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{vol?.name || pos.volunteerName}</span>
                            <span className="text-slate-500 font-normal">({pos.roleName})</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {vol?.email} • Call: {pos.callTime || plan.callTime}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {pos.status === 'confirmed' && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Confirmed
                          </span>
                        )}
                        {pos.status === 'unconfirmed' && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Pending
                          </span>
                        )}
                        {pos.reminderSentAt && (
                          <span className="text-[10px] text-slate-400">
                            Sent {pos.reminderSentAt}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Send CTA */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Ready to send to {selectedPosIds.length === 0 ? plan?.positions.filter(p => p.volunteerId).length : selectedPosIds.length} volunteer(s)
                </span>

                <button
                  onClick={handleDispatch}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Reminders Now</span>
                </button>
              </div>

            </div>

          </div>

          {/* Right: Live Interactive Message Preview Bento Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>Live Recipient Preview ({sampleVol.name})</span>
              </span>
            </div>

            {/* Rendered Email/SMS Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 text-slate-900">
              
              {/* Fake Email client header */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-gray-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span className="font-bold">To:</span>
                  <span className="font-bold text-slate-900">{sampleVol.name} &lt;{sampleVol.email}&gt;</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span className="font-bold">From:</span>
                  <span className="text-slate-700">Sanctuary Planning &lt;planner@gracechurch.org&gt;</span>
                </div>
                <div className="flex justify-between text-slate-500 pt-1.5 border-t border-gray-200">
                  <span className="font-bold">Subject:</span>
                  <span className="font-bold text-indigo-600 truncate max-w-[240px]">
                    {getInterpolatedSubject(selectedTemplate.subject)}
                  </span>
                </div>
              </div>

              {/* Message Body preview */}
              <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                {getInterpolatedContent(selectedTemplate.body)}
              </div>

              <p className="text-[11px] text-slate-400 italic text-center">
                * Dynamic merge tags ({'{{volunteer_name}}, {{role}}, {{call_time}}'}) are automatically filled for each recipient.
              </p>

            </div>
          </div>

        </div>
      )}

      {/* LOGS & LIVE SIMULATOR TAB */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm space-y-0">
          <div className="p-5 bg-slate-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Reminder Delivery Log & Simulator</h2>
              <p className="text-xs text-slate-500">Track sent invites and simulate volunteer responses</p>
            </div>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Real-time webhook sync active</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50/60 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Role & Ministry</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Sent At</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Volunteer RSVP Simulation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-slate-700">
                {reminderLogs.map(log => {
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{log.recipientName}</div>
                        <div className="text-[11px] text-slate-500">{log.recipientEmail}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{log.role}</div>
                        <div className="text-[11px] text-slate-500">{log.ministry}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-900 font-semibold">{log.serviceDate}</div>
                        <div className="text-[11px] text-slate-500">{log.serviceName}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="uppercase text-[10px] font-bold text-indigo-700 px-2 py-0.5 bg-indigo-50 rounded-full border border-indigo-200">
                          {log.channel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {log.sentAt}
                      </td>
                      <td className="py-3.5 px-4">
                        {log.status === 'responded_confirmed' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Confirmed
                          </span>
                        )}
                        {log.status === 'responded_declined' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                            <UserX className="w-3 h-3" /> Declined
                          </span>
                        )}
                        {log.status === 'opened' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                            <Eye className="w-3 h-3" /> Opened
                          </span>
                        )}
                        {log.status === 'delivered' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                            Delivered
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {log.status !== 'responded_confirmed' && log.status !== 'responded_declined' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSimulateResponse(log.id, 'confirmed')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors"
                            >
                              ✓ Accept
                            </button>
                            <button
                              onClick={() => handleSimulateResponse(log.id, 'declined')}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors"
                            >
                              ✕ Decline
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-medium">
                            Responded at {log.responseAt || 'Recently'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TEMPLATES TAB */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {reminderTemplates.map(tmpl => {
              const isEditing = editingTemplateId === tmpl.id;

              return (
                <div key={tmpl.id} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm text-slate-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        {tmpl.channel}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{tmpl.name}</h3>
                    </div>

                    {!isEditing ? (
                      <button
                        onClick={() => handleStartEditTemplate(tmpl)}
                        className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-gray-200 font-bold transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Template</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingTemplateId(null)}
                          className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveTemplate(tmpl.id)}
                          className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-xl shadow-xs"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Subject Line</label>
                        <input
                          type="text"
                          value={tempSubject}
                          onChange={(e) => setTempSubject(e.target.value)}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Message Body (Supports Markdown & Merge Tags)</label>
                        <textarea
                          value={tempBody}
                          onChange={(e) => setTempBody(e.target.value)}
                          rows={6}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div className="text-slate-500">
                        <strong className="text-slate-700">Subject:</strong> {tmpl.subject}
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200 font-mono text-slate-700 whitespace-pre-wrap">
                        {tmpl.body}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
