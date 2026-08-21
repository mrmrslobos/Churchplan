import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { 
  CheckCircle2, 
  Clock, 
  UserX, 
  Calendar, 
  Trash2, 
  Smartphone,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MobileVolunteerPortal: React.FC = () => {
  const { 
    volunteers, 
    currentVolunteerUser, 
    setCurrentVolunteerUserId, 
    plans, 
    updatePositionStatus, 
    addBlockoutDate, 
    removeBlockoutDate
  } = usePlanner();

  const [activePortalTab, setActivePortalTab] = useState<'schedule' | 'music' | 'blockouts'>('schedule');
  const [showBlockoutModal, setShowBlockoutModal] = useState(false);
  const [boStart, setBoStart] = useState('');
  const [boEnd, setBoEnd] = useState('');
  const [boReason, setBoReason] = useState('');

  // Find all service positions where current volunteer is scheduled
  const myAssignedPositions: { plan: typeof plans[0]; pos: typeof plans[0]['positions'][0] }[] = [];

  plans.forEach(plan => {
    plan.positions.forEach(pos => {
      if (pos.volunteerId === currentVolunteerUser.id) {
        myAssignedPositions.push({ plan, pos });
      }
    });
  });

  // Sort upcoming
  myAssignedPositions.sort((a, b) => a.plan.date.localeCompare(b.plan.date));

  const handleConfirmServing = (planId: string, positionId: string) => {
    updatePositionStatus(planId, positionId, 'confirmed');
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {}
  };

  const handleDeclineServing = (planId: string, positionId: string) => {
    const reason = prompt('Please provide a brief reason for declining (e.g. traveling, sick):');
    if (reason !== null) {
      updatePositionStatus(planId, positionId, 'declined', reason || 'Personal conflict');
    }
  };

  const handleSaveBlockout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boStart || !boEnd) return;
    addBlockoutDate(currentVolunteerUser.id, {
      startDate: boStart,
      endDate: boEnd,
      reason: boReason || 'Unavailable'
    });
    setBoStart('');
    setBoEnd('');
    setBoReason('');
    setShowBlockoutModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner & User Switcher Bento Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            <span className="text-xs uppercase tracking-wider font-bold text-indigo-600">Mobile Volunteer Portal</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">My Serving Dashboard</h1>
          <p className="text-xs text-slate-500">Manage your scheduled Sunday services, confirm availability, and access rehearsal chord charts.</p>
        </div>

        {/* Volunteer Identity Switcher */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-gray-200 shadow-xs">
          <img
            src={currentVolunteerUser.avatar}
            alt={currentVolunteerUser.name}
            className="w-9 h-9 rounded-full object-cover border border-gray-300 shrink-0"
          />
          <div className="text-xs">
            <span className="text-[10px] text-slate-500 block font-bold">Viewing As:</span>
            <select
              value={currentVolunteerUser.id}
              onChange={(e) => setCurrentVolunteerUserId(e.target.value)}
              className="bg-transparent text-slate-900 font-bold text-xs focus:outline-none cursor-pointer"
            >
              {volunteers.map(v => (
                <option key={v.id} value={v.id} className="text-slate-900">
                  {v.name} ({v.roles[0]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Mobile Screen Bento Preview Frame */}
      <div className="max-w-md mx-auto bg-white border border-gray-300 rounded-3xl overflow-hidden shadow-xl text-slate-900 flex flex-col min-h-[640px]">
        
        {/* Mobile App Header */}
        <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentVolunteerUser.avatar}
              alt={currentVolunteerUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-400 shadow-xs"
            />
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">{currentVolunteerUser.name}</h2>
              <span className="text-[11px] text-indigo-300 font-medium">{currentVolunteerUser.roles.join(' • ')}</span>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase">
            Active
          </span>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex items-center justify-around bg-slate-50 border-b border-gray-200 px-2 py-1.5 text-xs font-bold">
          <button
            onClick={() => setActivePortalTab('schedule')}
            className={`flex-1 py-2 rounded-xl text-center transition-colors ${
              activePortalTab === 'schedule'
                ? 'bg-white text-indigo-700 shadow-xs border border-gray-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Schedule ({myAssignedPositions.length})
          </button>
          <button
            onClick={() => setActivePortalTab('music')}
            className={`flex-1 py-2 rounded-xl text-center transition-colors ${
              activePortalTab === 'music'
                ? 'bg-white text-indigo-700 shadow-xs border border-gray-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Song Charts
          </button>
          <button
            onClick={() => setActivePortalTab('blockouts')}
            className={`flex-1 py-2 rounded-xl text-center transition-colors ${
              activePortalTab === 'blockouts'
                ? 'bg-white text-indigo-700 shadow-xs border border-gray-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Blockouts ({currentVolunteerUser.blockoutDates.length})
          </button>
        </div>

        {/* Content View Area */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-slate-50">
          
          {/* TAB 1: MY SCHEDULE */}
          {activePortalTab === 'schedule' && (
            <div className="space-y-3">
              {myAssignedPositions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">You have no upcoming serving dates assigned.</p>
                  <p className="text-[11px] text-slate-400">Enjoy your Sunday in worship with your family!</p>
                </div>
              ) : (
                myAssignedPositions.map(({ plan, pos }) => {
                  const dateObj = new Date(`${plan.date}T00:00:00`);
                  const dateFormatted = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                  return (
                    <div
                      key={pos.id}
                      className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 shadow-xs"
                    >
                      {/* Date & Service info */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">{dateFormatted}</span>
                          <h3 className="text-sm font-bold text-slate-900">{plan.title}</h3>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Role: <strong className="text-slate-800">{pos.roleName}</strong>
                          </div>
                        </div>

                        {/* Status badge */}
                        {pos.status === 'confirmed' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                            <CheckCircle2 className="w-3 h-3" /> Confirmed
                          </span>
                        )}
                        {pos.status === 'declined' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 uppercase">
                            <UserX className="w-3 h-3" /> Declined
                          </span>
                        )}
                        {pos.status === 'unconfirmed' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 uppercase">
                            <Clock className="w-3 h-3" /> RSVP Needed
                          </span>
                        )}
                      </div>

                      {/* Timings */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-gray-100 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Call Time</span>
                          <span className="font-bold text-slate-800">{pos.callTime || plan.callTime}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Rehearsal</span>
                          <span className="font-bold text-slate-800">{plan.rehearsalTime}</span>
                        </div>
                      </div>

                      {/* RSVP Buttons */}
                      {pos.status !== 'confirmed' ? (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => handleConfirmServing(plan.id, pos.id)}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
                          >
                            <Check className="w-4 h-4" />
                            <span>Confirm</span>
                          </button>
                          <button
                            onClick={() => handleDeclineServing(plan.id, pos.id)}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-rose-600 rounded-xl text-xs font-bold border border-gray-200 transition-all"
                          >
                            <X className="w-4 h-4" />
                            <span>Decline</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-emerald-700 font-bold text-[11px]">✓ You're ready to serve!</span>
                          <button
                            onClick={() => handleDeclineServing(plan.id, pos.id)}
                            className="text-[11px] text-slate-400 hover:text-rose-600 hover:underline"
                          >
                            Need to cancel?
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: SONG CHARTS & REHEARSAL FILES */}
          {activePortalTab === 'music' && (
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Upcoming Worship Songs</span>
              {plans[0]?.runSheet.filter(item => item.type === 'song').map((song) => (
                <div key={song.id} className="bg-white border border-gray-200 p-4 rounded-2xl space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{song.title}</span>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-mono font-bold text-[10px] rounded-md border border-indigo-200">
                      Key: {song.songDetails?.key || 'G'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{song.songDetails?.bpm} BPM • {song.songDetails?.timeSig}</span>
                    <span>Lead: {song.presenter}</span>
                  </div>

                  {song.notes && (
                    <div className="text-[11px] text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-gray-100">
                      "{song.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: BLOCKOUT DATES */}
          {activePortalTab === 'blockouts' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">My Unavailability Dates</span>
                <button
                  onClick={() => setShowBlockoutModal(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-bold"
                >
                  + Add Blockout
                </button>
              </div>

              {showBlockoutModal && (
                <form onSubmit={handleSaveBlockout} className="bg-white border border-gray-200 p-4 rounded-2xl space-y-2.5 shadow-sm animate-in fade-in">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={boStart}
                        onChange={(e) => setBoStart(e.target.value)}
                        required
                        className="w-full px-2.5 py-1.5 bg-slate-50 rounded-xl border border-gray-200 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">End Date</label>
                      <input
                        type="date"
                        value={boEnd}
                        onChange={(e) => setBoEnd(e.target.value)}
                        required
                        className="w-full px-2.5 py-1.5 bg-slate-50 rounded-xl border border-gray-200 text-xs text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Reason</label>
                    <input
                      type="text"
                      placeholder="e.g. Traveling / Vacation"
                      value={boReason}
                      onChange={(e) => setBoReason(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 rounded-xl border border-gray-200 text-xs text-slate-900"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowBlockoutModal(false)}
                      className="px-3 py-1 text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}

              {currentVolunteerUser.blockoutDates.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No blockout dates set. You are available for scheduling.
                </div>
              ) : (
                currentVolunteerUser.blockoutDates.map(bo => (
                  <div key={bo.id} className="bg-white border border-gray-200 p-3.5 rounded-2xl flex items-center justify-between text-xs shadow-xs">
                    <div>
                      <div className="font-bold text-amber-700">{bo.startDate} to {bo.endDate}</div>
                      <div className="text-[11px] text-slate-500">{bo.reason}</div>
                    </div>
                    <button
                      onClick={() => removeBlockoutDate(currentVolunteerUser.id, bo.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
