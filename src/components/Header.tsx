import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { 
  CalendarDays, 
  Users, 
  Layers, 
  BookOpen, 
  BarChart3, 
  Send, 
  Smartphone, 
  Clock, 
  Plus, 
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  onOpenNewPlanModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewPlanModal }) => {
  const { activeTab, setActiveTab, resetToDefaultData, plans, selectedPlanId, setSelectedPlanId } = usePlanner();
  const [showPlanSwitcher, setShowPlanSwitcher] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'plans', label: 'Plans', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'volunteers', label: 'People', icon: <Users className="w-4 h-4" /> },
    { id: 'matrix', label: 'Matrix', icon: <Layers className="w-4 h-4" /> },
    { id: 'sermons', label: 'Sermons', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'reminders', label: 'Reminders', icon: <Send className="w-4 h-4" /> },
  ];

  const secondaryNavItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'portal', label: 'Mobile Portal', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'live_clock', label: 'Stage Clock', icon: <Clock className="w-4 h-4" /> },
  ];

  const currentPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 text-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Title (Single line) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
            <span className="text-base">C</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            ChurchPlanner
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Secondary Tools dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`flex items-center gap-1 px-3 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'portal' || activeTab === 'live_clock'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Tools</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showMoreMenu && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowMoreMenu(false)}
              >
                {secondaryNavItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowMoreMenu(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-left font-medium transition-colors ${
                      activeTab === item.id
                        ? 'text-indigo-700 bg-indigo-50 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
                <div className="my-1 border-t border-gray-100" />
                <button
                  onClick={() => {
                    resetToDefaultData();
                    setShowMoreMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-left text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Reset Sample Data</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Primary Actions & Live Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
            <span className="text-[10px] text-slate-400">All services saved</span>
          </div>

          <button
            onClick={onOpenNewPlanModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Plan</span>
          </button>
        </div>

      </div>
    </header>
  );
};
