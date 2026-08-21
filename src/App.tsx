/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import { Header } from './components/Header';
import { ToastContainer } from './components/common/Toast';
import { PlansList } from './components/plans/PlansList';
import { PlanDetail } from './components/plans/PlanDetail';
import { NewPlanModal } from './components/plans/NewPlanModal';
import { VolunteersList } from './components/volunteers/VolunteersList';
import { ScheduleMatrix } from './components/volunteers/ScheduleMatrix';
import { SermonsList } from './components/sermons/SermonsList';
import { AttendanceDashboard } from './components/attendance/AttendanceDashboard';
import { RemindersCenter } from './components/reminders/RemindersCenter';
import { QuickSendModal } from './components/reminders/QuickSendModal';
import { MobileVolunteerPortal } from './components/mobile/MobileVolunteerPortal';
import { LiveServiceClock } from './components/plans/LiveServiceClock';

const MainContent: React.FC = () => {
  const { activeTab, selectedPlanId, setSelectedPlanId } = usePlanner();

  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [quickSendPlanId, setQuickSendPlanId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header conforming to contract */}
      <Header onOpenNewPlanModal={() => setIsNewPlanModalOpen(true)} />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Plans View */}
        {activeTab === 'plans' && (
          selectedPlanId ? (
            <PlanDetail
              planId={selectedPlanId}
              onBack={() => setSelectedPlanId(null)}
              onOpenSendRemindersModal={() => setQuickSendPlanId(selectedPlanId)}
            />
          ) : (
            <PlansList
              onSelectPlan={(id) => setSelectedPlanId(id)}
              onOpenNewPlanModal={() => setIsNewPlanModalOpen(true)}
            />
          )
        )}

        {/* Tab 2: Volunteers / People */}
        {activeTab === 'volunteers' && <VolunteersList />}

        {/* Tab 3: Multi-Week Schedule Matrix */}
        {activeTab === 'matrix' && <ScheduleMatrix />}

        {/* Tab 4: Sermons & Series */}
        {activeTab === 'sermons' && <SermonsList />}

        {/* Tab 5: Attendance & Growth Dashboard */}
        {activeTab === 'attendance' && <AttendanceDashboard />}

        {/* Tab 6: Email & SMS Reminders */}
        {activeTab === 'reminders' && (
          <RemindersCenter initialPlanId={selectedPlanId || undefined} />
        )}

        {/* Tab 7: Mobile Volunteer Self-Service Portal */}
        {activeTab === 'portal' && <MobileVolunteerPortal />}

        {/* Tab 8: Live Stage Service Clock */}
        {activeTab === 'live_clock' && (
          <LiveServiceClock planId={selectedPlanId || undefined} />
        )}

      </main>

      {/* Modals */}
      <NewPlanModal
        isOpen={isNewPlanModalOpen}
        onClose={() => setIsNewPlanModalOpen(false)}
      />

      {quickSendPlanId && (
        <QuickSendModal
          isOpen={Boolean(quickSendPlanId)}
          onClose={() => setQuickSendPlanId(null)}
          planId={quickSendPlanId}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <PlannerProvider>
      <MainContent />
    </PlannerProvider>
  );
}
