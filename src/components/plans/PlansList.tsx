import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { ServicePlan, ServiceType, PlanStatus } from '../../types';
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Copy, 
  Trash2, 
  Printer, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Send,
  Zap,
  TrendingUp
} from 'lucide-react';

interface PlansListProps {
  onSelectPlan: (planId: string) => void;
  onOpenNewPlanModal: () => void;
}

export const PlansList: React.FC<PlansListProps> = ({ onSelectPlan, onOpenNewPlanModal }) => {
  const { plans, duplicatePlan, deletePlan, setActiveTab, setSelectedPlanId, volunteers } = usePlanner();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = 
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.sermonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.preacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.date.includes(searchQuery);

    const matchesType = selectedTypeFilter === 'all' || plan.serviceType === selectedTypeFilter;
    const matchesStatus = selectedStatusFilter === 'all' || plan.status === selectedStatusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const nextPlan = plans[0] || null;

  // Calculate high-level summary metrics
  const totalRosterPositions = nextPlan ? nextPlan.positions.length : 0;
  const confirmedPositions = nextPlan ? nextPlan.positions.filter(p => p.status === 'confirmed').length : 0;
  const pendingPositions = nextPlan ? nextPlan.positions.filter(p => p.status === 'pending').length : 0;
  const declinedPositions = nextPlan ? nextPlan.positions.filter(p => p.status === 'declined').length : 0;
  const staffedPercent = totalRosterPositions > 0 ? Math.round((confirmedPositions / totalRosterPositions) * 100) : 0;
  const openRoles = totalRosterPositions - confirmedPositions;

  // Extract key roles for the Bento hero card
  const stageManager = nextPlan?.positions.find(p => p.role.toLowerCase().includes('director') || p.role.toLowerCase().includes('stage') || p.team === 'Production')?.volunteerName || 'David Vance';
  const techLead = nextPlan?.positions.find(p => p.role.toLowerCase().includes('sound') || p.role.toLowerCase().includes('tech') || p.role.toLowerCase().includes('av'))?.volunteerName || 'Robert Miller';
  const worshipLeader = nextPlan?.positions.find(p => p.role.toLowerCase().includes('worship') || p.role.toLowerCase().includes('vocal'))?.volunteerName || 'Sarah Jenkins';

  return (
    <div className="space-y-6">
      
      {/* Bento Grid Top Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Bento 1: Featured Next Service Hero (Span 8) */}
        {nextPlan && (
          <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">
                  Next Service
                </span>
                <span className="text-slate-400 text-sm font-medium">
                  {new Date(`${nextPlan.date}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {nextPlan.serviceStartTime}
                </span>
              </div>
              
              <h1 
                onClick={() => onSelectPlan(nextPlan.id)}
                className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-2 hover:text-indigo-600 cursor-pointer transition-colors"
              >
                {nextPlan.title}
              </h1>
              
              <p className="text-slate-500 text-sm max-w-xl line-clamp-2">
                Lead Preacher: <span className="font-semibold text-slate-700">{nextPlan.preacher}</span>. Sermon: "{nextPlan.sermonTitle}". Orchestration finalized with {nextPlan.runSheet.length} order of service elements.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 mt-4 border-t border-gray-100">
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-bold mb-0.5">Stage Lead</p>
                <p className="font-semibold text-slate-800 text-sm truncate">{stageManager}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-bold mb-0.5">Tech Lead</p>
                <p className="font-semibold text-slate-800 text-sm truncate">{techLead}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-bold mb-0.5">Worship Leader</p>
                <p className="font-semibold text-slate-800 text-sm truncate">{worshipLeader}</p>
              </div>
            </div>
          </div>
        )}

        {/* Bento 2: Attendance Tracker Dark Indigo Card (Span 4) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-indigo-900 rounded-2xl p-6 text-white flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-base text-indigo-100">Attendance Tracker</h3>
            <button 
              onClick={() => setActiveTab('attendance')}
              className="text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              Analytics <TrendingUp className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight">412</span>
              <span className="text-indigo-300 text-xs font-medium">Avg. Weekly</span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-1">+8.4% growth vs previous quarter</p>
          </div>

          {/* Stylized Mini Bento Chart */}
          <div className="flex gap-1.5 items-end h-14 mt-3 pt-2 border-t border-indigo-800/60">
            <div className="flex-1 bg-indigo-700/80 rounded-t h-[60%]" title="May 11: 380"></div>
            <div className="flex-1 bg-indigo-700/80 rounded-t h-[75%]" title="May 18: 395"></div>
            <div className="flex-1 bg-indigo-700/80 rounded-t h-[70%]" title="May 25: 390"></div>
            <div className="flex-1 bg-indigo-400 rounded-t h-[95%]" title="Jun 01: 421"></div>
            <div className="flex-1 bg-indigo-500 rounded-t h-[88%]" title="Jun 08: 412"></div>
            <div className="flex-1 bg-indigo-300 rounded-t h-[100%]" title="Jun 15 (Projected): 435"></div>
          </div>
        </div>

        {/* Bento 3: Automation Engine Card (Span 4) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Automation Engine
              </h3>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">ACTIVE</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-slate-700">24h Volunteer Reminders</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">AUTO</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-xs font-medium text-slate-700">Sunday Schedule Release</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">MON 9AM</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('reminders')}
            className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            Configure Workflows
          </button>
        </div>

        {/* Bento 4: Volunteer Status Card (Span 4) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm">Volunteer Status</h3>
              <button 
                onClick={() => setActiveTab('volunteers')}
                className="text-indigo-600 hover:text-indigo-700 text-xs font-bold"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                  RM
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">Robert Miller</p>
                  <p className="text-[11px] text-slate-400 truncate">Sound Engineer</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-full uppercase">
                  Confirmed
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                  SJ
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">Sarah Jenkins</p>
                  <p className="text-[11px] text-slate-400 truncate">Worship Leader</p>
                </div>
                <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold rounded-full uppercase">
                  Pending
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                  JH
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">James Holt</p>
                  <p className="text-[11px] text-slate-400 truncate">Greeter Lead</p>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-full uppercase">
                  Declined
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
              <span>{staffedPercent}% Staffed</span>
              <span>{openRoles} Roles Open</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${staffedPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Bento 5: Quick Mobile & Communication Shortcuts (Span 4) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 flex flex-col gap-3">
          <div 
            onClick={() => setActiveTab('portal')}
            className="flex-1 bg-emerald-50 hover:bg-emerald-100/70 cursor-pointer rounded-2xl border border-emerald-100 p-4 flex items-center gap-4 transition-colors shadow-xs group"
          >
            <div className="w-11 h-11 bg-white rounded-xl shadow-xs flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-950 text-sm">Mobile Dashboard</h4>
              <p className="text-emerald-700 text-xs">Self-service volunteer RSVP & lead sheets.</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('reminders')}
            className="flex-1 bg-indigo-50 hover:bg-indigo-100/70 cursor-pointer rounded-2xl border border-indigo-100 p-4 flex items-center gap-4 transition-colors shadow-xs group"
          >
            <div className="w-11 h-11 bg-white rounded-xl shadow-xs flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-indigo-950 text-sm">Communication</h4>
              <p className="text-indigo-700 text-xs">Broadcast SMS or email to all ministry teams.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Service Plans Heading & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">All Service Plans</h2>
          <p className="text-xs text-slate-500">Upcoming worship schedules, run sheets, and team positions.</p>
        </div>

        <button
          onClick={onOpenNewPlanModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Service Plan</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search plans, sermons, preachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Service Types</option>
            <option value="Sunday Contemporary 11:15 AM">Sunday Contemporary 11:15 AM</option>
            <option value="Sunday Traditional 9:00 AM">Sunday Traditional 9:00 AM</option>
            <option value="Youth Encounter Friday 7:00 PM">Youth Encounter</option>
            <option value="Wednesday Midweek & Prayer 7:00 PM">Wednesday Midweek</option>
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Plans List Grid in Bento style */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPlans.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-slate-400 shadow-sm">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">No service plans match your filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedTypeFilter('all'); setSelectedStatusFilter('all'); }}
              className="mt-3 text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredPlans.map((plan) => {
            const confirmedCount = plan.positions.filter(p => p.status === 'confirmed').length;
            const totalPositionsCount = plan.positions.length;
            const rosterPct = totalPositionsCount > 0 ? Math.round((confirmedCount / totalPositionsCount) * 100) : 0;
            const totalRuntimeMin = plan.runSheet.reduce((acc, item) => acc + item.durationMinutes + item.durationSeconds / 60, 0);

            // Format date badge
            const dateObj = new Date(`${plan.date}T00:00:00`);
            const monthStr = dateObj.toLocaleString('en-US', { month: 'short' });
            const dayStr = dateObj.getDate();
            const dayName = dateObj.toLocaleString('en-US', { weekday: 'short' });

            return (
              <div
                key={plan.id}
                className="bg-white border border-gray-200 hover:border-indigo-300 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md text-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
              >
                
                {/* Left: Date badge + Details */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  
                  {/* Calendar Bento Pill */}
                  <div className="w-14 h-16 rounded-xl bg-slate-50 border border-gray-200 flex flex-col items-center justify-center shrink-0 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-indigo-600">{monthStr}</span>
                    <span className="text-xl font-black text-slate-900">{dayStr}</span>
                    <span className="text-[9px] text-slate-400 font-medium">{dayName}</span>
                  </div>

                  {/* Plan Content info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        plan.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {plan.status}
                      </span>
                      <span className="text-xs text-indigo-600 font-semibold">{plan.serviceType}</span>
                    </div>

                    <h2 
                      onClick={() => onSelectPlan(plan.id)}
                      className="text-base md:text-lg font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors truncate"
                    >
                      {plan.title}
                    </h2>

                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sermon: <strong className="text-slate-700">{plan.sermonTitle}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Start: {plan.serviceStartTime} • Call: {plan.callTime}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Middle: Roster Progress & Run Sheet summary */}
                <div className="w-full md:w-56 space-y-2 bg-slate-50 p-3 rounded-xl border border-gray-100 shrink-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Volunteer Roster</span>
                    <span className="font-bold text-slate-800">{confirmedCount}/{totalPositionsCount} Confirmed</span>
                  </div>
                  
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        rosterPct === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${rosterPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                    <span>{plan.runSheet.length} Order Items</span>
                    <span>~{Math.round(totalRuntimeMin)}m Runtime</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                      setActiveTab('live_clock');
                    }}
                    title="Open Live Stage Clock"
                    className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl text-xs transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => duplicatePlan(plan.id)}
                    title="Duplicate Plan"
                    className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl text-xs transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectPlan(plan.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                  >
                    <span>Open Plan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
