import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { Volunteer, BlockoutDate } from '../../types';
import { X, Calendar, Trash2 } from 'lucide-react';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteerToEdit?: Volunteer | null;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({
  isOpen,
  onClose,
  volunteerToEdit
}) => {
  const { ministries, addVolunteer, updateVolunteer, addBlockoutDate, removeBlockoutDate } = usePlanner();

  const [name, setName] = useState(volunteerToEdit?.name || '');
  const [email, setEmail] = useState(volunteerToEdit?.email || '');
  const [phone, setPhone] = useState(volunteerToEdit?.phone || '');
  const [avatar, setAvatar] = useState(volunteerToEdit?.avatar || '');
  const [selectedMinistries, setSelectedMinistries] = useState<string[]>(volunteerToEdit?.ministries || ['worship']);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(volunteerToEdit?.roles || []);
  const [status, setStatus] = useState<'active' | 'inactive' | 'on_leave'>(volunteerToEdit?.status || 'active');
  const [preferredFrequency, setPreferredFrequency] = useState<'every_week' | 'every_2_weeks' | 'once_a_month' | 'occasional'>(
    volunteerToEdit?.preferredFrequency || 'every_2_weeks'
  );
  const [notes, setNotes] = useState(volunteerToEdit?.notes || '');

  // Blockout form
  const [showBlockoutForm, setShowBlockoutForm] = useState(false);
  const [blockoutStart, setBlockoutStart] = useState('');
  const [blockoutEnd, setBlockoutEnd] = useState('');
  const [blockoutReason, setBlockoutReason] = useState('');

  if (!isOpen) return null;

  const toggleMinistry = (ministryId: string) => {
    if (selectedMinistries.includes(ministryId)) {
      setSelectedMinistries(selectedMinistries.filter(id => id !== ministryId));
    } else {
      setSelectedMinistries([...selectedMinistries, ministryId]);
    }
  };

  const handleRoleInput = (roleName: string) => {
    if (selectedRoles.includes(roleName)) {
      setSelectedRoles(selectedRoles.filter(r => r !== roleName));
    } else {
      setSelectedRoles([...selectedRoles, roleName]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const volData = {
      name,
      email,
      phone,
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      ministries: selectedMinistries,
      roles: selectedRoles.length > 0 ? selectedRoles : ['Team Member'],
      status,
      preferredFrequency,
      blockoutDates: volunteerToEdit?.blockoutDates || [],
      notes
    };

    if (volunteerToEdit) {
      updateVolunteer(volunteerToEdit.id, volData);
    } else {
      addVolunteer(volData);
    }

    onClose();
  };

  const handleAddBlockout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerToEdit || !blockoutStart || !blockoutEnd) return;

    addBlockoutDate(volunteerToEdit.id, {
      startDate: blockoutStart,
      endDate: blockoutEnd,
      reason: blockoutReason || 'Unavailable'
    });

    setBlockoutStart('');
    setBlockoutEnd('');
    setBlockoutReason('');
    setShowBlockoutForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {volunteerToEdit ? `Edit Profile: ${volunteerToEdit.name}` : 'Add New Volunteer'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage team ministries, skilled positions, and availability blackout dates.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Serving Frequency</label>
              <select
                value={preferredFrequency}
                onChange={(e) => setPreferredFrequency(e.target.value as any)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="every_week">Every Week</option>
                <option value="every_2_weeks">Every 2 Weeks (Bi-weekly)</option>
                <option value="once_a_month">Once a Month</option>
                <option value="occasional">Occasional / Sub</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="active">Active (Available)</option>
                <option value="on_leave">On Sabbatical / Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Ministries & Roles selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Assigned Ministries</label>
            <div className="flex flex-wrap gap-2">
              {ministries.map(m => {
                const isSelected = selectedMinistries.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMinistry(m.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs'
                        : 'bg-white text-slate-600 border-gray-200 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Qualified Roles */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Qualified Roles & Skills</label>
            <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl max-h-36 overflow-y-auto space-y-2">
              {ministries
                .filter(m => selectedMinistries.includes(m.id))
                .map(m => (
                  <div key={m.id} className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">{m.name}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.roles.map(role => {
                        const isChecked = selectedRoles.includes(role);
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => handleRoleInput(role)}
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border transition-colors ${
                              isChecked
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-white text-slate-700 border-gray-200 hover:bg-slate-100'
                            }`}
                          >
                            {role}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Blockout Dates Section (if editing existing volunteer) */}
          {volunteerToEdit && (
            <div className="p-4 bg-slate-50 border border-gray-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-900">Blockout Dates / Blackout Periods</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBlockoutForm(!showBlockoutForm)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-bold"
                >
                  {showBlockoutForm ? 'Cancel' : '+ Add Blockout Date'}
                </button>
              </div>

              {showBlockoutForm && (
                <div className="p-3.5 bg-white border border-gray-200 rounded-xl space-y-2.5 shadow-xs animate-in fade-in">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={blockoutStart}
                        onChange={(e) => setBlockoutStart(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">End Date</label>
                      <input
                        type="date"
                        value={blockoutEnd}
                        onChange={(e) => setBlockoutEnd(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Reason</label>
                    <input
                      type="text"
                      placeholder="e.g. Out of town vacation"
                      value={blockoutReason}
                      onChange={(e) => setBlockoutReason(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddBlockout}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    Save Blockout
                  </button>
                </div>
              )}

              {/* Existing blockout list */}
              {volunteerToEdit.blockoutDates.length === 0 ? (
                <div className="text-[11px] text-slate-400 italic">No blockout dates on record. Available all Sundays.</div>
              ) : (
                <div className="space-y-1.5">
                  {volunteerToEdit.blockoutDates.map(bo => (
                    <div key={bo.id} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-200 text-xs shadow-xs">
                      <div>
                        <span className="font-bold text-amber-700">{bo.startDate} to {bo.endDate}</span>
                        <span className="text-slate-500 ml-2">({bo.reason})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBlockoutDate(volunteerToEdit.id, bo.id)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Leader Notes / Instruments</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Lead acoustic guitarist, prefers Key of G/D, background check cleared..."
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
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              {volunteerToEdit ? 'Save Changes' : 'Add Volunteer'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
