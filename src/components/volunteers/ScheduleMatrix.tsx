import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { CheckCircle2, Clock, UserX } from 'lucide-react';

export const ScheduleMatrix: React.FC = () => {
  const { plans, ministries, volunteers, setSelectedPlanId, setActiveTab } = usePlanner();
  const [selectedMinistryId, setSelectedMinistryId] = useState<string>('all');

  // Sort plans chronologically
  const sortedPlans = [...plans].sort((a, b) => a.date.localeCompare(b.date));

  const filteredMinistries = selectedMinistryId === 'all' 
    ? ministries 
    : ministries.filter(m => m.id === selectedMinistryId);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Multi-Week Schedule Matrix</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bird's-eye view across all upcoming services to balance volunteer workloads and spot scheduling gaps.
          </p>
        </div>

        {/* Ministry Filter selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedMinistryId}
            onChange={(e) => setSelectedMinistryId(e.target.value)}
            className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Ministries ({ministries.length})</option>
            {ministries.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Matrix Table Bento Container */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          
          <table className="w-full text-left border-collapse">
            
            {/* Header Row: Dates & Services */}
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[220px] sticky left-0 bg-slate-50 z-20">
                  Ministry & Position
                </th>
                {sortedPlans.map(plan => (
                  <th key={plan.id} className="p-4 text-xs min-w-[200px] border-l border-gray-200">
                    <div 
                      onClick={() => {
                        setSelectedPlanId(plan.id);
                        setActiveTab('plans');
                      }}
                      className="cursor-pointer group"
                    >
                      <div className="text-[10px] font-bold uppercase text-indigo-600">
                        {new Date(`${plan.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600 text-xs truncate max-w-[180px]">
                        {plan.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {plan.serviceStartTime} • {plan.positions.filter(p => p.status === 'confirmed').length}/{plan.positions.length} Confirmed
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Matrix Body: Ministries & Roles */}
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredMinistries.map(ministry => (
                <React.Fragment key={ministry.id}>
                  
                  {/* Ministry Group Header Row */}
                  <tr className="bg-slate-50/80 font-bold border-t border-b border-gray-200">
                    <td 
                      colSpan={sortedPlans.length + 1} 
                      className="py-2.5 px-4 text-xs text-slate-900 flex items-center gap-2"
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ministry.color }} />
                      <span>{ministry.name}</span>
                    </td>
                  </tr>

                  {/* Individual Roles */}
                  {ministry.roles.map(role => (
                    <tr key={role} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Role Label */}
                      <td className="p-3.5 font-semibold text-slate-800 sticky left-0 bg-white border-r border-gray-200 z-10">
                        {role}
                      </td>

                      {/* Scheduled Volunteer Cell for each Plan */}
                      {sortedPlans.map(plan => {
                        const position = plan.positions.find(p => p.ministryId === ministry.id && p.roleName === role);

                        return (
                          <td key={plan.id} className="p-3.5 border-l border-gray-100 align-top">
                            {position ? (
                              position.volunteerId ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900 text-xs truncate max-w-[140px]">
                                      {position.volunteerName}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {position.status === 'confirmed' && (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                        <CheckCircle2 className="w-3 h-3" /> Confirmed
                                      </span>
                                    )}
                                    {position.status === 'declined' && (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                        <UserX className="w-3 h-3" /> Declined
                                      </span>
                                    )}
                                    {position.status === 'unconfirmed' && (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                        <Clock className="w-3 h-3" /> Pending
                                      </span>
                                    )}
                                    {position.status === 'auto_assigned' && (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                                        Auto
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedPlanId(plan.id);
                                    setActiveTab('plans');
                                  }}
                                  className="text-[11px] text-slate-400 hover:text-indigo-600 hover:underline flex items-center gap-1 italic"
                                >
                                  <span>+ Empty Slot</span>
                                </button>
                              )
                            ) : (
                              <span className="text-[10px] text-slate-300 italic">—</span>
                            )}
                          </td>
                        );
                      })}

                    </tr>
                  ))}

                </React.Fragment>
              ))}
            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
};
