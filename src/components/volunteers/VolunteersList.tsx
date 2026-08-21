import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { Volunteer } from '../../types';
import { VolunteerModal } from './VolunteerModal';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

export const VolunteersList: React.FC = () => {
  const { volunteers, ministries, deleteVolunteer } = usePlanner();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMinistryFilter, setSelectedMinistryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);

  const filteredVolunteers = volunteers.filter(vol => {
    const matchesSearch = 
      vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.roles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMinistry = selectedMinistryFilter === 'all' || vol.ministries.includes(selectedMinistryFilter);

    return matchesSearch && matchesMinistry;
  });

  const handleOpenEdit = (vol: Volunteer) => {
    setEditingVolunteer(vol);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingVolunteer(null);
    setIsModalOpen(true);
  };

  const activeCount = volunteers.filter(v => v.status === 'active').length;
  const onLeaveCount = volunteers.filter(v => v.status === 'on_leave').length;
  const totalBlockouts = volunteers.reduce((acc, v) => acc + v.blockoutDates.length, 0);

  return (
    <div className="space-y-6">
      
      {/* Bento Top Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Active Roster</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{activeCount}</div>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">Ready to schedule</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-xs">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ministry Teams</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{ministries.length}</div>
            <p className="text-xs text-indigo-600 font-medium mt-0.5">Worship, Tech, Kids & more</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Blockout Dates</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalBlockouts}</div>
            <p className="text-xs text-amber-600 font-medium mt-0.5">{onLeaveCount} member(s) on leave</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-xs">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Header & Primary Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Volunteers & People</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage team members, serving frequencies, skills, and blockout calendars.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Volunteer</span>
        </button>
      </div>

      {/* Filter and Ministry Pills */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3 p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search volunteers by name, email, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Showing {filteredVolunteers.length} volunteers
          </div>
        </div>

        {/* Ministry Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedMinistryFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors shadow-xs ${
              selectedMinistryFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            All Ministries ({volunteers.length})
          </button>
          {ministries.map(m => {
            const count = volunteers.filter(v => v.ministries.includes(m.id)).length;
            const isSelected = selectedMinistryFilter === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMinistryFilter(m.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors shadow-xs ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {m.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Volunteers Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVolunteers.map(vol => {
          const hasBlockouts = vol.blockoutDates.length > 0;
          const assignedMinistries = ministries.filter(m => vol.ministries.includes(m.id));

          return (
            <div
              key={vol.id}
              className="bg-white border border-gray-200 hover:border-indigo-300 rounded-2xl p-5 shadow-sm space-y-4 text-slate-900 flex flex-col justify-between transition-all hover:shadow-md"
            >
              <div className="space-y-3">
                
                {/* User card header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={vol.avatar}
                      alt={vol.name}
                      className="w-11 h-11 rounded-full object-cover border border-gray-200 shadow-xs shrink-0"
                    />
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 leading-snug">{vol.name}</h2>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[160px]">{vol.email}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    vol.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {vol.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Ministry & Roles badges */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap gap-1">
                    {assignedMinistries.map(m => (
                      <span
                        key={m.id}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                        style={{ backgroundColor: `${m.color}15`, color: m.color }}
                      >
                        {m.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {vol.roles.map(role => (
                      <span key={role} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] rounded-md font-medium">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Serving frequency & stats */}
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 text-[11px] space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Frequency:</span>
                    <span className="font-bold text-slate-800 capitalize">{vol.preferredFrequency.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Services Served:</span>
                    <span className="font-bold text-indigo-600">{vol.totalServicesServed} times</span>
                  </div>
                  {hasBlockouts && (
                    <div className="flex items-center gap-1 text-amber-600 font-semibold pt-0.5">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{vol.blockoutDates.length} blockout period(s) set</span>
                    </div>
                  )}
                </div>

                {vol.notes && (
                  <p className="text-[11px] text-slate-500 italic line-clamp-2">
                    "{vol.notes}"
                  </p>
                )}

              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{vol.phone || 'No phone'}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(vol)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg text-xs transition-colors"
                    title="Edit Profile"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${vol.name} from volunteer database?`)) {
                        deleteVolunteer(vol.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg text-xs transition-colors"
                    title="Delete Volunteer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <VolunteerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        volunteerToEdit={editingVolunteer}
      />

    </div>
  );
};
