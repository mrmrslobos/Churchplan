export type ServiceType = 
  | 'Sunday Traditional 9:00 AM'
  | 'Sunday Contemporary 11:15 AM'
  | 'Youth Encounter Friday 7:00 PM'
  | 'Wednesday Midweek & Prayer 7:00 PM'
  | 'Special Worship Night';

export type PlanStatus = 'draft' | 'published' | 'completed';

export type RunSheetItemType = 
  | 'song'
  | 'sermon'
  | 'welcome'
  | 'prayer'
  | 'announcements'
  | 'offering'
  | 'communion'
  | 'video'
  | 'scripture'
  | 'benediction'
  | 'other';

export interface SongDetails {
  key: string;
  bpm: number;
  timeSig: string;
  author: string;
  ccli?: string;
  chordChartUrl?: string;
  audioPreviewUrl?: string;
}

export interface RunSheetItem {
  id: string;
  type: RunSheetItemType;
  title: string;
  durationMinutes: number;
  durationSeconds: number;
  presenter: string;
  notes?: string;
  songDetails?: SongDetails;
  files?: { name: string; type: string; size: string }[];
}

export type VolunteerStatus = 'confirmed' | 'declined' | 'unconfirmed' | 'auto_assigned';

export interface PlanPosition {
  id: string;
  ministryId: string;
  roleName: string;
  volunteerId?: string;
  volunteerName?: string;
  volunteerAvatar?: string;
  status: VolunteerStatus;
  callTime?: string;
  notes?: string;
  reminderSentAt?: string;
  declineReason?: string;
}

export interface ServiceAttendance {
  adults: number;
  kids: number;
  youth: number;
  volunteers: number;
  online: number;
  firstTimers: number;
  givingSnapshot?: number;
  notes?: string;
  weather?: string;
  recordedAt?: string;
  recordedBy?: string;
}

export interface ServicePlan {
  id: string;
  title: string;
  serviceType: ServiceType;
  date: string; // YYYY-MM-DD
  serviceStartTime: string; // HH:MM
  callTime: string; // HH:MM
  rehearsalTime: string; // HH:MM
  status: PlanStatus;
  sermonTitle: string;
  preacher: string;
  scripturePassage: string;
  seriesId?: string;
  seriesName?: string;
  themeColor?: string;
  runSheet: RunSheetItem[];
  positions: PlanPosition[];
  attendance?: ServiceAttendance;
  notes?: string;
}

export interface BlockoutDate {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  ministries: string[]; // Ministry IDs
  roles: string[];
  status: 'active' | 'inactive' | 'on_leave';
  preferredFrequency: 'every_week' | 'every_2_weeks' | 'once_a_month' | 'occasional';
  blockoutDates: BlockoutDate[];
  totalServicesServed: number;
  joinedDate: string;
  notes?: string;
}

export interface Ministry {
  id: string;
  name: string;
  iconName: string;
  color: string;
  roles: string[];
  teamLeader: string;
  description: string;
}

export interface Sermon {
  id: string;
  title: string;
  seriesId: string;
  seriesTitle: string;
  seriesGraphicUrl?: string;
  speaker: string;
  speakerRole: string;
  date: string;
  servicePlanId?: string;
  scripture: string;
  summary: string;
  keyPoints: string[];
  attendanceRecord?: number;
  audioDuration?: string;
  videoUrl?: string;
  slidesUrl?: string;
  tags: string[];
}

export interface SermonSeries {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  totalMessages: number;
  themeColor: string;
}

export interface ReminderRecipientLog {
  id: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  role: string;
  ministry: string;
  serviceDate: string;
  serviceName: string;
  callTime: string;
  channel: 'email' | 'sms' | 'both';
  status: 'delivered' | 'opened' | 'responded_confirmed' | 'responded_declined' | 'pending';
  sentAt: string;
  responseAt?: string;
  planId: string;
  positionId: string;
}

export interface ReminderTemplate {
  id: string;
  name: string;
  channel: 'email' | 'sms';
  subject: string;
  body: string;
  triggerTiming: '7_days_before' | '3_days_before' | '24_hours_before' | 'day_of_service' | 'manual';
  isActive: boolean;
}

export type ActiveTab = 
  | 'plans'
  | 'volunteers'
  | 'matrix'
  | 'sermons'
  | 'attendance'
  | 'reminders'
  | 'portal'
  | 'live_clock';
