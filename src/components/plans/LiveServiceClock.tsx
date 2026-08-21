import React, { useState, useEffect } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Clock
} from 'lucide-react';

interface LiveServiceClockProps {
  planId?: string;
}

export const LiveServiceClock: React.FC<LiveServiceClockProps> = ({ planId }) => {
  const { plans, selectedPlanId } = usePlanner();
  const activePlanId = planId || selectedPlanId || plans[0]?.id;
  const plan = plans.find(p => p.id === activePlanId) || plans[0];

  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [wallClockTime, setWallClockTime] = useState('');

  const currentItem = plan?.runSheet[currentItemIndex];
  const nextItem = plan?.runSheet[currentItemIndex + 1];

  // Update wall clock
  useEffect(() => {
    const updateWallClock = () => {
      const now = new Date();
      setWallClockTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateWallClock();
    const interval = setInterval(updateWallClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync remaining seconds when item changes
  useEffect(() => {
    if (currentItem) {
      const secs = (currentItem.durationMinutes * 60) + currentItem.durationSeconds;
      setRemainingSeconds(secs);
    }
  }, [currentItemIndex, activePlanId]);

  // Countdown timer effect
  useEffect(() => {
    let timer: any = null;
    if (isRunning && remainingSeconds > -3600) {
      timer = setInterval(() => {
        setRemainingSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, remainingSeconds]);

  if (!plan || !currentItem) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-slate-400 shadow-sm">
        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-base font-semibold text-slate-800">No service plan selected or run sheet is empty.</p>
      </div>
    );
  }

  const isOvertime = remainingSeconds < 0;
  const absRemaining = Math.abs(remainingSeconds);
  const minutes = Math.floor(absRemaining / 60);
  const seconds = absRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const totalItemSeconds = (currentItem.durationMinutes * 60) + currentItem.durationSeconds || 1;
  const progressPercent = Math.min(100, Math.max(0, ((totalItemSeconds - remainingSeconds) / totalItemSeconds) * 100));

  const handleNextItem = () => {
    if (currentItemIndex < plan.runSheet.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
    }
  };

  const handlePrevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(prev => prev - 1);
    }
  };

  const handleAdjustTime = (deltaSeconds: number) => {
    setRemainingSeconds(prev => prev + deltaSeconds);
  };

  const handleResetCurrent = () => {
    if (currentItem) {
      setRemainingSeconds((currentItem.durationMinutes * 60) + currentItem.durationSeconds);
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 text-slate-900 shadow-sm space-y-6 max-w-5xl mx-auto">
      
      {/* Top status bar Bento Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
            Live Service Stage Display
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">{plan.title} ({plan.date})</h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Wall Clock</div>
            <div className="text-xl font-mono font-black text-slate-800">{wallClockTime}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Service Item</div>
            <div className="text-sm font-bold text-indigo-600">
              {currentItemIndex + 1} of {plan.runSheet.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Big Stage Clock Bento Card */}
      <div className={`p-8 rounded-2xl border transition-all text-center space-y-4 ${
        isOvertime 
          ? 'bg-rose-50 border-rose-300 shadow-md shadow-rose-100' 
          : isRunning 
          ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
          : 'bg-slate-50 border-gray-200'
      }`}>
        
        {/* Current item header */}
        <div className="flex items-center justify-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            isRunning 
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
          }`}>
            {currentItem.type}
          </span>
          <span className={`text-sm font-medium ${isRunning ? 'text-slate-300' : 'text-slate-500'}`}>
            Presenter: {currentItem.presenter || 'Pastor / Team'}
          </span>
        </div>

        <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isRunning ? 'text-white' : 'text-slate-900'}`}>
          {currentItem.title}
        </h1>

        {currentItem.songDetails && (
          <div className={`flex items-center justify-center gap-3 text-xs font-semibold ${isRunning ? 'text-slate-300' : 'text-slate-600'}`}>
            <span className={`px-2 py-0.5 rounded-md font-mono ${isRunning ? 'bg-slate-800 text-indigo-300' : 'bg-white border border-gray-200 text-indigo-700'}`}>
              Key: {currentItem.songDetails.key}
            </span>
            <span className={`px-2 py-0.5 rounded-md ${isRunning ? 'bg-slate-800' : 'bg-white border border-gray-200'}`}>
              {currentItem.songDetails.bpm} BPM
            </span>
            <span className={`px-2 py-0.5 rounded-md ${isRunning ? 'bg-slate-800' : 'bg-white border border-gray-200'}`}>
              {currentItem.songDetails.timeSig}
            </span>
          </div>
        )}

        {/* Huge Digital Timer */}
        <div className="py-4">
          <div className={`text-6xl md:text-8xl font-black font-mono tracking-tight transition-colors ${
            isOvertime 
              ? 'text-rose-600 animate-pulse' 
              : isRunning 
              ? 'text-white' 
              : 'text-slate-900'
          }`}>
            {isOvertime ? `-${formattedTime}` : formattedTime}
          </div>
          <div className={`text-xs font-bold tracking-wider uppercase mt-2 ${
            isOvertime ? 'text-rose-600' : isRunning ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {isOvertime ? 'OVERTIME WARNING' : isRunning ? 'COUNTING DOWN' : 'PAUSED'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full rounded-full h-3 overflow-hidden ${isRunning ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <div 
            className={`h-full transition-all duration-500 ${
              isOvertime ? 'bg-rose-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Presenter cues / Notes */}
        {currentItem.notes && (
          <div className={`border p-3.5 rounded-xl max-w-xl mx-auto text-xs italic ${
            isRunning 
              ? 'bg-slate-800/80 border-slate-700 text-slate-200' 
              : 'bg-white border-gray-200 text-slate-700'
          }`}>
            "{currentItem.notes}"
          </div>
        )}

      </div>

      {/* Stage Clock Controls Bento Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 border border-gray-200 rounded-2xl">
        
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevItem}
            disabled={currentItemIndex === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 disabled:opacity-40 border border-gray-200 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev Item</span>
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors ${
              isRunning 
                ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Pause Clock' : 'Start Clock'}</span>
          </button>

          <button
            onClick={handleNextItem}
            disabled={currentItemIndex === plan.runSheet.length - 1}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 disabled:opacity-40 border border-gray-200 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-xs"
          >
            <span>Next Item</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Fine-tuning controls */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => handleAdjustTime(-60)}
            title="Subtract 1 Minute"
            className="px-3 py-2 bg-white hover:bg-slate-100 border border-gray-200 rounded-xl font-mono text-slate-700 font-bold shadow-xs transition-colors"
          >
            -1m
          </button>
          <button
            onClick={() => handleAdjustTime(60)}
            title="Add 1 Minute"
            className="px-3 py-2 bg-white hover:bg-slate-100 border border-gray-200 rounded-xl font-mono text-slate-700 font-bold shadow-xs transition-colors"
          >
            +1m
          </button>
          <button
            onClick={() => handleAdjustTime(120)}
            title="Add 2 Minutes"
            className="px-3 py-2 bg-white hover:bg-slate-100 border border-gray-200 rounded-xl font-mono text-slate-700 font-bold shadow-xs transition-colors"
          >
            +2m
          </button>
          <button
            onClick={handleResetCurrent}
            title="Reset Item Timer"
            className="p-2 bg-white hover:bg-slate-100 border border-gray-200 rounded-xl text-slate-600 hover:text-slate-900 ml-2 shadow-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Up Next Preview */}
      {nextItem && (
        <div className="p-4 bg-slate-50 border border-gray-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-bold text-slate-400">Up Next:</span>
            <span className="text-sm font-bold text-slate-900">{nextItem.title}</span>
            <span className="text-xs text-slate-500">({nextItem.presenter})</span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">
            {nextItem.durationMinutes}:{nextItem.durationSeconds.toString().padStart(2, '0')}
          </span>
        </div>
      )}

    </div>
  );
};
