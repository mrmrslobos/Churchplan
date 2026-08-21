import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { PlanPosition, VolunteerStatus } from '../../types';
import { 
  UserCheck, 
  UserX, 
  Clock, 
  Plus, 
  Sparkles, 
  Send, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  X,
  Mail
} from 'lucide-react';

interface VolunteerRosterEditorProps {
  planId: string;
  onOpenSendRemindersModal?: () => void;
}

export const VolunteerRosterEditor: React.FC<VolunteerRosterEditorProps> = ({ 
  planId,
  onOpenSendRemindersModal 
}) => {
  const { 
    plans, 
    ministries, 
    volunteers, 
    assignVolunteerToPosition, 
    addEmptyPosition, 
    removePosition, 
    updatePositionStatus, 
    autoScheduleRoster,
    sendReminders
  } = usePlanner();

  const plan = plans.find(p => p.id === planId);

  const [selectedMinistryForNewPos, setSelectedMinistryForNewPos] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newPosCallTime, setNewPosCallTime] = useState('');
  
  const [assigningPositionId, setAssigningPositionId] = useState<string | null>(null);
  const [declineModalPos, setDeclineModalPos] = useState<PlanPosition | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  if (!plan) return <div className="text-slate-500 p-8 text-center">Plan not found</div>;

  const totalPositions = plan.positions.length;
  const confirmedCount = plan.positions.filter(p => p.status === 'confirmed').length;
  const unassignedCount = plan.positions.filter(p => !p.volunteerId).length;
  const declinedCount = plan.positions.filter(p => p.status === 'declined').length;
  const pendingCount = plan.positions.filter(p => p.volunteerId && p.status !== 'confirmed' && p.status !== 'declined').length;

  const handleOpenAssignModal = (posId: string) => {
    setAssigningPositionId(posId);
  };

  const handleSelectVolunteerForSlot = (pos: PlanPosition, volId: string) => {
    assignVolunteerToPosition(planId, pos.ministryId, pos.roleName, volId, pos.callTime);
    setAssigningPositionId(null);
  };

  const handleAddPositionSubmit = (ministryId: string) => {
    if (!newRoleName.trim()) return;
    addEmptyPosition(planId, ministryId, newRoleName.trim(), newPosCallTime || plan.callTime);
    setSelectedMinistryForNewPos(null);
    setNewRoleName('');
    setNewPosCallTime('');
  };

  const handleDeclineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (declineModalPos) {
      updatePositionStatus(planId, declineModalPos.id, 'declined', declineReason || 'Schedule conflict');
      setDeclineModalPos(null);
      setDeclineReason('');
    }
  };

  const handleQuickSendSingleReminder = (pos: PlanPosition) => {
    sendReminders(planId, 'tmpl-3days', 'email', [pos.id]);
  };

  return (
    <div className="space-y-5">
      
      {/* Roster stats & top action bar Bento Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{confirmedCount} Confirmed</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-700 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingCount} Pending</span>
          </div>

          {declinedCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-rose-700 font-bold">
              <UserX className="w-3.5 h-3.5" />
              <span>{declinedCount} Declined</span>
            </div>
          )}

          {unassignedCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-slate-700 font-medium">
              <span>{unassignedCount} Open Slots</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unassignedCount > 0 && (
            <button
              onClick={() => autoScheduleRoster(planId)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Auto-Fill Roster</span>
            </button>
          )}

          <button
            onClick={onOpenSendRemindersModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Reminders</span>
          </button>
        </div>
      </div>

      {/* Ministry Teams Bento Sections */}
      <div className="space-y-4">
        {ministries.map((ministry) => {
          const positionsInMinistry = plan.positions.filter(p => p.ministryId === ministry.id);

          return (
            <div 
              key={ministry.id} 
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Ministry Header */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-3 h-3 rounded-full shadow-xs" 
                    style={{ backgroundColor: ministry.color }} 
                  />
                  <h3 className="text-sm font-bold text-slate-900">{ministry.name}</h3>
                  <span className="text-xs text-slate-500 font-normal">
                    ({positionsInMinistry.filter(p => p.status === 'confirmed').length}/{positionsInMinistry.length} confirmed)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedMinistryForNewPos(ministry.id);
                      setNewRoleName(ministry.roles[0] || '');
                      setNewPosCallTime(plan.callTime);
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-gray-200 px-2.5 py-1 rounded-lg transition-colors shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Role</span>
                  </button>
                </div>
              </div>

              {/* Quick Add Role Form inline */}
              {selectedMinistryForNewPos === ministry.id && (
                <div className="p-3.5 bg-slate-50/80 border-b border-gray-200 flex flex-wrap items-center gap-2 animate-in fade-in">
                  <div className="flex-1 min-w-[200px]">
                    <select
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    >
                      {ministry.roles.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-28">
                    <input
                      type="text"
                      placeholder="Call: 09:45"
                      value={newPosCallTime}
                      onChange={(e) => setNewPosCallTime(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={() => handleAddPositionSubmit(ministry.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                  >
                    Add Slot
                  </button>
                  <button
                    onClick={() => setSelectedMinistryForNewPos(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Positions List */}
              <div className="divide-y divide-gray-100">
                {positionsInMinistry.length === 0 ? (
                  <div className="p-5 text-center text-xs text-slate-400">
                    No positions scheduled for {ministry.name}. Click "Add Role" above to assign volunteers.
                  </div>
                ) : (
                  positionsInMinistry.map((pos) => {
                    const volunteer = volunteers.find(v => v.id === pos.volunteerId);
                    const isBlocked = volunteer?.blockoutDates.some(bo => plan.date >= bo.startDate && plan.date <= bo.endDate);

                    return (
                      <div 
                        key={pos.id} 
                        className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                      >
                        {/* Role & Call Time */}
                        <div className="min-w-[160px] space-y-0.5">
                          <div className="text-xs font-bold text-slate-800">{pos.roleName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Call: {pos.callTime || plan.callTime}</span>
                          </div>
                        </div>

                        {/* Assigned Volunteer or Open Slot */}
                        <div className="flex-1 min-w-[220px]">
                          {volunteer ? (
                            <div className="flex items-center gap-3">
                              <img
                                src={volunteer.avatar}
                                alt={volunteer.name}
                                className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0 shadow-xs"
                              />
                              <div className="space-y-0.5">
                                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{volunteer.name}</span>
                                  {isBlocked && (
                                    <span title="Volunteer has a blockout date!" className="inline-flex items-center text-amber-600">
                                      <AlertTriangle className="w-3.5 h-3.5" />
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                                  {volunteer.email}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenAssignModal(pos.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-gray-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 rounded-xl text-xs font-semibold transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Assign Volunteer</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0 flex items-center gap-2">
                          {pos.volunteerId ? (
                            <>
                              {pos.status === 'confirmed' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                                  <UserCheck className="w-3 h-3" /> Confirmed
                                </span>
                              )}
                              {pos.status === 'declined' && (
                                <span 
                                  title={pos.declineReason || 'Declined'}
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase cursor-help"
                                >
                                  <UserX className="w-3 h-3" /> Declined
                                </span>
                              )}
                              {pos.status === 'unconfirmed' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                                  <Clock className="w-3 h-3" /> Pending
                                </span>
                              )}
                              {pos.status === 'auto_assigned' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                                  <Sparkles className="w-3 h-3" /> Auto-Assigned
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium italic">
                              Unassigned
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          {pos.volunteerId && (
                            <>
                              <button
                                onClick={() => handleQuickSendSingleReminder(pos)}
                                title="Send Email/SMS Reminder"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </button>
                              
                              {pos.status !== 'confirmed' && (
                                <button
                                  onClick={() => updatePositionStatus(planId, pos.id, 'confirmed')}
                                  title="Mark Confirmed"
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {pos.status !== 'declined' && (
                                <button
                                  onClick={() => setDeclineModalPos(pos)}
                                  title="Mark Declined"
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => handleOpenAssignModal(pos.id)}
                                title="Change Volunteer"
                                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                Change
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => removePosition(planId, pos.id)}
                            title="Remove Slot"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Volunteer Assignment Bento Modal */}
      {assigningPositionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col text-slate-900">
            
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Select Volunteer</h3>
                <p className="text-xs text-slate-500">Available team members with matching skills & frequency</p>
              </div>
              <button 
                onClick={() => setAssigningPositionId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {(() => {
                const targetPos = plan.positions.find(p => p.id === assigningPositionId);
                if (!targetPos) return null;

                const sortedVolunteers = [...volunteers].sort((a, b) => {
                  const aRoleMatch = a.roles.includes(targetPos.roleName) ? 1 : 0;
                  const bRoleMatch = b.roles.includes(targetPos.roleName) ? 1 : 0;
                  return bRoleMatch - aRoleMatch;
                });

                return sortedVolunteers.map(vol => {
                  const isBlocked = vol.blockoutDates.some(bo => plan.date >= bo.startDate && plan.date <= bo.endDate);
                  const isAlreadyServing = plan.positions.some(p => p.volunteerId === vol.id);
                  const hasExactRole = vol.roles.includes(targetPos.roleName);

                  return (
                    <button
                      key={vol.id}
                      onClick={() => handleSelectVolunteerForSlot(targetPos, vol.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isAlreadyServing 
                          ? 'bg-slate-50 border-gray-200 opacity-60 hover:opacity-100' 
                          : isBlocked 
                          ? 'bg-amber-50/60 border-amber-200 hover:bg-amber-100/50' 
                          : 'bg-white border-gray-200 hover:border-indigo-400 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={vol.avatar}
                          alt={vol.name}
                          className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-xs"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <span>{vol.name}</span>
                            {hasExactRole && (
                              <span className="px-2 py-0.2 bg-indigo-50 text-indigo-700 text-[10px] rounded-full font-bold border border-indigo-100">
                                Primary Role
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Served {vol.totalServicesServed} services • Prefers {vol.preferredFrequency.replace(/_/g, ' ')}
                          </div>
                          {isBlocked && (
                            <div className="text-[10px] text-amber-600 font-medium flex items-center gap-1 mt-0.5">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Blockout date on {plan.date}</span>
                            </div>
                          )}
                          {isAlreadyServing && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Already serving in this service
                            </div>
                          )}
                        </div>
                      </div>

                      <span className="text-xs font-bold text-indigo-600 shrink-0">
                        Assign →
                      </span>
                    </button>
                  );
                });
              })()}
            </div>

          </div>
        </div>
      )}

      {/* Decline Reason Bento Modal */}
      {declineModalPos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-5 shadow-2xl text-slate-900 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Record Decline</h3>
            <p className="text-xs text-slate-500">
              Recording decline for <span className="text-slate-800 font-bold">{declineModalPos.volunteerName}</span> ({declineModalPos.roleName})
            </p>

            <form onSubmit={handleDeclineSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason (Optional)</label>
                <input
                  type="text"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="e.g. Traveling out of town, Ill, Family event..."
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeclineModalPos(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
                >
                  Save Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
