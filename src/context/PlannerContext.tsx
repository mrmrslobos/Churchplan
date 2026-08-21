import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ServicePlan, 
  Volunteer, 
  Ministry, 
  Sermon, 
  SermonSeries, 
  ReminderTemplate, 
  ReminderRecipientLog, 
  ActiveTab, 
  RunSheetItem, 
  PlanPosition, 
  VolunteerStatus, 
  ServiceAttendance,
  BlockoutDate
} from '../types';
import { 
  INITIAL_MINISTRIES, 
  INITIAL_VOLUNTEERS, 
  INITIAL_SERVICE_PLANS, 
  INITIAL_SERMONS, 
  INITIAL_SERMON_SERIES, 
  INITIAL_REMINDER_TEMPLATES, 
  INITIAL_REMINDER_LOGS 
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface PlannerContextType {
  plans: ServicePlan[];
  selectedPlanId: string | null;
  selectedPlan: ServicePlan | undefined;
  volunteers: Volunteer[];
  ministries: Ministry[];
  sermons: Sermon[];
  sermonSeries: SermonSeries[];
  reminderTemplates: ReminderTemplate[];
  reminderLogs: ReminderRecipientLog[];
  activeTab: ActiveTab;
  currentVolunteerUser: Volunteer;
  toasts: ToastMessage[];
  
  // Navigation & View
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedPlanId: (id: string | null) => void;
  setCurrentVolunteerUserId: (id: string) => void;
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  
  // Plans Operations
  addPlan: (plan: Partial<ServicePlan>) => string;
  updatePlan: (id: string, updates: Partial<ServicePlan>) => void;
  deletePlan: (id: string) => void;
  duplicatePlan: (id: string) => string;
  
  // Run Sheet
  addRunSheetItem: (planId: string, item: Omit<RunSheetItem, 'id'>) => void;
  updateRunSheetItem: (planId: string, itemId: string, updates: Partial<RunSheetItem>) => void;
  deleteRunSheetItem: (planId: string, itemId: string) => void;
  reorderRunSheet: (planId: string, fromIndex: number, toIndex: number) => void;
  
  // Volunteer Positions & Rostering
  assignVolunteerToPosition: (
    planId: string, 
    ministryId: string, 
    roleName: string, 
    volunteerId: string, 
    callTime?: string
  ) => { success: boolean; conflictWarning?: string };
  addEmptyPosition: (planId: string, ministryId: string, roleName: string, callTime?: string) => void;
  removePosition: (planId: string, positionId: string) => void;
  updatePositionStatus: (planId: string, positionId: string, status: VolunteerStatus, declineReason?: string) => void;
  autoScheduleRoster: (planId: string) => { assignedCount: number; conflicts: string[] };
  
  // Volunteers
  addVolunteer: (volunteer: Omit<Volunteer, 'id' | 'totalServicesServed' | 'joinedDate'>) => void;
  updateVolunteer: (id: string, updates: Partial<Volunteer>) => void;
  deleteVolunteer: (id: string) => void;
  addBlockoutDate: (volunteerId: string, blockout: Omit<BlockoutDate, 'id'>) => void;
  removeBlockoutDate: (volunteerId: string, blockoutId: string) => void;
  
  // Sermons & Attendance
  addSermon: (sermon: Omit<Sermon, 'id'>) => void;
  updateSermon: (id: string, updates: Partial<Sermon>) => void;
  recordAttendance: (planId: string, attendance: ServiceAttendance) => void;
  
  // Reminders & Communication
  sendReminders: (
    planId: string, 
    templateId: string, 
    channel: 'email' | 'sms' | 'both', 
    positionIds?: string[]
  ) => number;
  respondToReminder: (logId: string, response: 'confirmed' | 'declined', reason?: string) => void;
  updateReminderTemplate: (id: string, updates: Partial<ReminderTemplate>) => void;
  
  // System
  resetToDefaultData: () => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PLANS: 'sanctuary_church_plans_v1',
  VOLUNTEERS: 'sanctuary_church_volunteers_v1',
  SERMONS: 'sanctuary_church_sermons_v1',
  SERIES: 'sanctuary_church_series_v1',
  TEMPLATES: 'sanctuary_church_templates_v1',
  LOGS: 'sanctuary_church_logs_v1',
  CURRENT_USER: 'sanctuary_church_current_user_v1',
};

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<ServicePlan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_PLANS;
  });

  const [volunteers, setVolunteers] = useState<Volunteer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VOLUNTEERS);
    return saved ? JSON.parse(saved) : INITIAL_VOLUNTEERS;
  });

  const [ministries] = useState<Ministry[]>(INITIAL_MINISTRIES);

  const [sermons, setSermons] = useState<Sermon[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERMONS);
    return saved ? JSON.parse(saved) : INITIAL_SERMONS;
  });

  const [sermonSeries] = useState<SermonSeries[]>(INITIAL_SERMON_SERIES);

  const [reminderTemplates, setReminderTemplates] = useState<ReminderTemplate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    return saved ? JSON.parse(saved) : INITIAL_REMINDER_TEMPLATES;
  });

  const [reminderLogs, setReminderLogs] = useState<ReminderRecipientLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : INITIAL_REMINDER_LOGS;
  });

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>('plan-2026-08-23-contemporary');
  const [activeTab, setActiveTab] = useState<ActiveTab>('plans');
  const [currentVolunteerUserId, setCurrentVolunteerUserId] = useState<string>('vol-1');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(volunteers));
  }, [volunteers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERMONS, JSON.stringify(sermons));
  }, [sermons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(reminderTemplates));
  }, [reminderTemplates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(reminderLogs));
  }, [reminderLogs]);

  const selectedPlan = plans.find(p => p.id === selectedPlanId);
  const currentVolunteerUser = volunteers.find(v => v.id === currentVolunteerUserId) || volunteers[0];

  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Plan Management
  const addPlan = (planData: Partial<ServicePlan>): string => {
    const newId = `plan-${Date.now()}`;
    const newPlan: ServicePlan = {
      id: newId,
      title: planData.title || 'Sunday Morning Worship',
      serviceType: planData.serviceType || 'Sunday Contemporary 11:15 AM',
      date: planData.date || new Date().toISOString().split('T')[0],
      serviceStartTime: planData.serviceStartTime || '11:15',
      callTime: planData.callTime || '09:45',
      rehearsalTime: planData.rehearsalTime || '10:00',
      status: planData.status || 'draft',
      sermonTitle: planData.sermonTitle || 'Weekly Message',
      preacher: planData.preacher || 'Pastor Thomas Vance',
      scripturePassage: planData.scripturePassage || 'Psalm 23',
      themeColor: planData.themeColor || '#4f46e5',
      runSheet: planData.runSheet || [
        {
          id: `item-${Date.now()}-1`,
          type: 'welcome',
          title: 'Welcome & Opening Prayer',
          durationMinutes: 3,
          durationSeconds: 0,
          presenter: 'Worship Leader'
        },
        {
          id: `item-${Date.now()}-2`,
          type: 'song',
          title: 'Opening Worship Song',
          durationMinutes: 5,
          durationSeconds: 0,
          presenter: 'Worship Team',
          songDetails: { key: 'G', bpm: 72, timeSig: '4/4', author: 'Praise & Worship' }
        },
        {
          id: `item-${Date.now()}-3`,
          type: 'sermon',
          title: 'Sermon Message',
          durationMinutes: 35,
          durationSeconds: 0,
          presenter: planData.preacher || 'Pastor Thomas Vance'
        }
      ],
      positions: planData.positions || [
        {
          id: `pos-${Date.now()}-1`,
          ministryId: 'worship',
          roleName: 'Worship Leader',
          status: 'unconfirmed',
          callTime: planData.callTime || '09:45'
        },
        {
          id: `pos-${Date.now()}-2`,
          ministryId: 'production',
          roleName: 'FOH Audio Engineer',
          status: 'unconfirmed',
          callTime: '09:30'
        },
        {
          id: `pos-${Date.now()}-3`,
          ministryId: 'ushers',
          roleName: 'Lead Usher',
          status: 'unconfirmed',
          callTime: '10:30'
        }
      ]
    };

    setPlans(prev => [newPlan, ...prev]);
    setSelectedPlanId(newId);
    showToast('New Service Plan Created', `${newPlan.title} on ${newPlan.date}`, 'success');
    return newId;
  };

  const updatePlan = (id: string, updates: Partial<ServicePlan>) => {
    setPlans(prev => prev.map(plan => plan.id === id ? { ...plan, ...updates } : plan));
    showToast('Plan Updated', 'Changes saved successfully', 'success');
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(plan => plan.id !== id));
    if (selectedPlanId === id) {
      const remaining = plans.filter(p => p.id !== id);
      setSelectedPlanId(remaining.length > 0 ? remaining[0].id : null);
    }
    showToast('Service Plan Deleted', undefined, 'info');
  };

  const duplicatePlan = (id: string): string => {
    const target = plans.find(p => p.id === id);
    if (!target) return '';
    const newId = `plan-${Date.now()}`;
    const cloned: ServicePlan = {
      ...target,
      id: newId,
      title: `${target.title} (Copy)`,
      status: 'draft',
      runSheet: target.runSheet.map(item => ({ ...item, id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` })),
      positions: target.positions.map(pos => ({ 
        ...pos, 
        id: `pos-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        status: 'unconfirmed',
        reminderSentAt: undefined 
      })),
      attendance: undefined
    };
    setPlans(prev => [cloned, ...prev]);
    setSelectedPlanId(newId);
    showToast('Plan Duplicated', cloned.title, 'success');
    return newId;
  };

  // Run Sheet Operations
  const addRunSheetItem = (planId: string, item: Omit<RunSheetItem, 'id'>) => {
    const newItem: RunSheetItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      return { ...p, runSheet: [...p.runSheet, newItem] };
    }));
    showToast('Order of Service Item Added', newItem.title, 'success');
  };

  const updateRunSheetItem = (planId: string, itemId: string, updates: Partial<RunSheetItem>) => {
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      return {
        ...p,
        runSheet: p.runSheet.map(item => item.id === itemId ? { ...item, ...updates } : item)
      };
    }));
  };

  const deleteRunSheetItem = (planId: string, itemId: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      return {
        ...p,
        runSheet: p.runSheet.filter(item => item.id !== itemId)
      };
    }));
    showToast('Item Removed', undefined, 'info');
  };

  const reorderRunSheet = (planId: string, fromIndex: number, toIndex: number) => {
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      const list = [...p.runSheet];
      const [removed] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, removed);
      return { ...p, runSheet: list };
    }));
  };

  // Volunteer Rostering & Position Assignments
  const assignVolunteerToPosition = (
    planId: string, 
    ministryId: string, 
    roleName: string, 
    volunteerId: string, 
    callTime?: string
  ): { success: boolean; conflictWarning?: string } => {
    const plan = plans.find(p => p.id === planId);
    const volunteer = volunteers.find(v => v.id === volunteerId);

    if (!plan || !volunteer) return { success: false };

    // Conflict checks:
    // 1. Blockout date check
    const planDate = plan.date;
    const isBlocked = volunteer.blockoutDates.some(bo => {
      return planDate >= bo.startDate && planDate <= bo.endDate;
    });

    let conflictWarning: string | undefined = undefined;
    if (isBlocked) {
      const blockout = volunteer.blockoutDates.find(bo => planDate >= bo.startDate && planDate <= bo.endDate);
      conflictWarning = `⚠️ ${volunteer.name} has a blockout date for ${planDate} (${blockout?.reason || 'Unavailable'}). Assigned with alert.`;
    }

    // 2. Check if already serving elsewhere on this exact date and time
    const alreadyServingInSamePlan = plan.positions.some(pos => pos.volunteerId === volunteerId);
    if (alreadyServingInSamePlan) {
      conflictWarning = `Notice: ${volunteer.name} is already assigned to another role in this service.`;
    }

    const defaultCall = callTime || plan.callTime;

    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      
      // Look for an open slot in this role
      const existingSlotIndex = p.positions.findIndex(pos => pos.ministryId === ministryId && pos.roleName === roleName && !pos.volunteerId);
      
      if (existingSlotIndex >= 0) {
        const updatedPositions = [...p.positions];
        updatedPositions[existingSlotIndex] = {
          ...updatedPositions[existingSlotIndex],
          volunteerId: volunteer.id,
          volunteerName: volunteer.name,
          volunteerAvatar: volunteer.avatar,
          status: 'unconfirmed',
          callTime: defaultCall
        };
        return { ...p, positions: updatedPositions };
      } else {
        // Create new position slot
        const newPos: PlanPosition = {
          id: `pos-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          ministryId,
          roleName,
          volunteerId: volunteer.id,
          volunteerName: volunteer.name,
          volunteerAvatar: volunteer.avatar,
          status: 'unconfirmed',
          callTime: defaultCall
        };
        return { ...p, positions: [...p.positions, newPos] };
      }
    }));

    if (conflictWarning) {
      showToast('Position Assigned (Warning)', conflictWarning, 'warning');
    } else {
      showToast('Volunteer Scheduled', `${volunteer.name} assigned to ${roleName}`, 'success');
    }

    return { success: true, conflictWarning };
  };

  const addEmptyPosition = (planId: string, ministryId: string, roleName: string, callTime?: string) => {
    const plan = plans.find(p => p.id === planId);
    const newPos: PlanPosition = {
      id: `pos-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ministryId,
      roleName,
      status: 'unconfirmed',
      callTime: callTime || plan?.callTime || '09:45'
    };

    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      return { ...p, positions: [...p.positions, newPos] };
    }));
    showToast('Open Position Added', roleName, 'info');
  };

  const removePosition = (planId: string, positionId: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      return { ...p, positions: p.positions.filter(pos => pos.id !== positionId) };
    }));
    showToast('Position Removed', undefined, 'info');
  };

  const updatePositionStatus = (planId: string, positionId: string, status: VolunteerStatus, declineReason?: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      return {
        ...p,
        positions: p.positions.map(pos => {
          if (pos.id !== positionId) return pos;
          return { ...pos, status, declineReason };
        })
      };
    }));

    showToast(
      status === 'confirmed' ? 'Volunteer Confirmed' : status === 'declined' ? 'Volunteer Declined' : 'Status Updated',
      status === 'declined' ? `Reason: ${declineReason || 'Not specified'}` : undefined,
      status === 'confirmed' ? 'success' : status === 'declined' ? 'error' : 'info'
    );
  };

  const autoScheduleRoster = (planId: string): { assignedCount: number; conflicts: string[] } => {
    const targetPlan = plans.find(p => p.id === planId);
    if (!targetPlan) return { assignedCount: 0, conflicts: [] };

    let assigned = 0;
    const conflicts: string[] = [];

    // Find all unassigned positions
    const updatedPositions = targetPlan.positions.map(pos => {
      if (pos.volunteerId) return pos;

      // Find best available volunteer for this ministry & role
      const eligibleVolunteers = volunteers.filter(v => {
        const inMinistry = v.ministries.includes(pos.ministryId);
        const hasRole = v.roles.includes(pos.roleName);
        const isActive = v.status === 'active';
        const isNotBlocked = !v.blockoutDates.some(bo => targetPlan.date >= bo.startDate && targetPlan.date <= bo.endDate);
        const isNotAlreadyScheduled = !targetPlan.positions.some(other => other.volunteerId === v.id);
        return inMinistry && hasRole && isActive && isNotBlocked && isNotAlreadyScheduled;
      });

      if (eligibleVolunteers.length > 0) {
        // Pick least recently served or first
        const chosen = eligibleVolunteers[Math.floor(Math.random() * eligibleVolunteers.length)];
        assigned++;
        return {
          ...pos,
          volunteerId: chosen.id,
          volunteerName: chosen.name,
          volunteerAvatar: chosen.avatar,
          status: 'auto_assigned' as VolunteerStatus
        };
      } else {
        conflicts.push(`No available volunteer found for ${pos.roleName}`);
        return pos;
      }
    });

    setPlans(prev => prev.map(p => p.id === planId ? { ...p, positions: updatedPositions } : p));
    showToast(
      'Auto-Schedule Complete', 
      `Filled ${assigned} positions. ${conflicts.length > 0 ? `${conflicts.length} open.` : 'All slots filled!'}`, 
      'success'
    );

    return { assignedCount: assigned, conflicts };
  };

  // Volunteer CRUD
  const addVolunteer = (volData: Omit<Volunteer, 'id' | 'totalServicesServed' | 'joinedDate'>) => {
    const newVol: Volunteer = {
      ...volData,
      id: `vol-${Date.now()}`,
      totalServicesServed: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: volData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`
    };
    setVolunteers(prev => [...prev, newVol]);
    showToast('Volunteer Profile Added', newVol.name, 'success');
  };

  const updateVolunteer = (id: string, updates: Partial<Volunteer>) => {
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    showToast('Volunteer Profile Updated', undefined, 'success');
  };

  const deleteVolunteer = (id: string) => {
    setVolunteers(prev => prev.filter(v => v.id !== id));
    showToast('Volunteer Removed', undefined, 'info');
  };

  const addBlockoutDate = (volunteerId: string, blockout: Omit<BlockoutDate, 'id'>) => {
    const newBlockout: BlockoutDate = {
      ...blockout,
      id: `bo-${Date.now()}`
    };
    setVolunteers(prev => prev.map(v => {
      if (v.id !== volunteerId) return v;
      return { ...v, blockoutDates: [...v.blockoutDates, newBlockout] };
    }));
    showToast('Blockout Date Saved', `${blockout.startDate} to ${blockout.endDate}`, 'success');
  };

  const removeBlockoutDate = (volunteerId: string, blockoutId: string) => {
    setVolunteers(prev => prev.map(v => {
      if (v.id !== volunteerId) return v;
      return { ...v, blockoutDates: v.blockoutDates.filter(b => b.id !== blockoutId) };
    }));
    showToast('Blockout Date Removed', undefined, 'info');
  };

  // Sermons & Attendance
  const addSermon = (sermonData: Omit<Sermon, 'id'>) => {
    const newSermon: Sermon = {
      ...sermonData,
      id: `sermon-${Date.now()}`
    };
    setSermons(prev => [newSermon, ...prev]);
    showToast('Sermon Added', newSermon.title, 'success');
  };

  const updateSermon = (id: string, updates: Partial<Sermon>) => {
    setSermons(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast('Sermon Updated', undefined, 'success');
  };

  const recordAttendance = (planId: string, attendance: ServiceAttendance) => {
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      return {
        ...p,
        attendance: {
          ...attendance,
          recordedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        }
      };
    }));
    showToast('Attendance Headcount Recorded', `Total: ${(attendance.adults || 0) + (attendance.kids || 0) + (attendance.youth || 0) + (attendance.volunteers || 0)} in-person`, 'success');
  };

  // Reminders & Communications
  const sendReminders = (
    planId: string, 
    templateId: string, 
    channel: 'email' | 'sms' | 'both', 
    positionIds?: string[]
  ): number => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return 0;

    const targets = plan.positions.filter(pos => {
      if (!pos.volunteerId) return false;
      if (positionIds && positionIds.length > 0) {
        return positionIds.includes(pos.id);
      }
      return true;
    });

    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const newLogs: ReminderRecipientLog[] = [];

    targets.forEach(pos => {
      const vol = volunteers.find(v => v.id === pos.volunteerId);
      const ministry = ministries.find(m => m.id === pos.ministryId);
      if (!vol) return;

      newLogs.push({
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        recipientName: vol.name,
        recipientEmail: vol.email,
        recipientPhone: vol.phone,
        role: pos.roleName,
        ministry: ministry?.name || 'Ministry Team',
        serviceDate: plan.date,
        serviceName: plan.title,
        callTime: pos.callTime || plan.callTime,
        channel,
        status: 'delivered',
        sentAt: nowStr,
        planId: plan.id,
        positionId: pos.id
      });
    });

    setReminderLogs(prev => [...newLogs, ...prev]);

    // Mark reminder sent in plan positions
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      return {
        ...p,
        positions: p.positions.map(pos => {
          if (targets.some(t => t.id === pos.id)) {
            return { ...pos, reminderSentAt: nowStr };
          }
          return pos;
        })
      };
    }));

    showToast(
      'Reminders Dispatched', 
      `Sent ${targets.length} notifications via ${channel === 'both' ? 'Email & SMS' : channel.toUpperCase()}`, 
      'success'
    );

    return targets.length;
  };

  const respondToReminder = (logId: string, response: 'confirmed' | 'declined', reason?: string) => {
    const log = reminderLogs.find(l => l.id === logId);
    if (!log) return;

    const responseTime = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const status: 'responded_confirmed' | 'responded_declined' = response === 'confirmed' ? 'responded_confirmed' : 'responded_declined';

    setReminderLogs(prev => prev.map(l => {
      if (l.id !== logId) return l;
      return { ...l, status, responseAt: responseTime };
    }));

    // Update the actual position in the plan
    updatePositionStatus(log.planId, log.positionId, response, reason);
  };

  const updateReminderTemplate = (id: string, updates: Partial<ReminderTemplate>) => {
    setReminderTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast('Template Updated', undefined, 'success');
  };

  const resetToDefaultData = () => {
    setPlans(INITIAL_SERVICE_PLANS);
    setVolunteers(INITIAL_VOLUNTEERS);
    setSermons(INITIAL_SERMONS);
    setReminderTemplates(INITIAL_REMINDER_TEMPLATES);
    setReminderLogs(INITIAL_REMINDER_LOGS);
    setSelectedPlanId(INITIAL_SERVICE_PLANS[0].id);
    localStorage.clear();
    showToast('Sample Data Restored', 'All schedules and records reset to pristine church planner sample data', 'info');
  };

  return (
    <PlannerContext.Provider
      value={{
        plans,
        selectedPlanId,
        selectedPlan,
        volunteers,
        ministries,
        sermons,
        sermonSeries,
        reminderTemplates,
        reminderLogs,
        activeTab,
        currentVolunteerUser,
        toasts,
        setActiveTab,
        setSelectedPlanId,
        setCurrentVolunteerUserId,
        showToast,
        removeToast,
        addPlan,
        updatePlan,
        deletePlan,
        duplicatePlan,
        addRunSheetItem,
        updateRunSheetItem,
        deleteRunSheetItem,
        reorderRunSheet,
        assignVolunteerToPosition,
        addEmptyPosition,
        removePosition,
        updatePositionStatus,
        autoScheduleRoster,
        addVolunteer,
        updateVolunteer,
        deleteVolunteer,
        addBlockoutDate,
        removeBlockoutDate,
        addSermon,
        updateSermon,
        recordAttendance,
        sendReminders,
        respondToReminder,
        updateReminderTemplate,
        resetToDefaultData
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
