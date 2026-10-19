export type ScreenId =
  | 'dashboard'
  | 'calls'
  | 'incoming'
  | 'recent'
  | 'calendar'
  | 'pulse'
  | 'pulse-channel'
  | 'profile';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  title: string;
  department: string;
  dateOfBirth: string; // YYYY-MM-DD
  avatar: string;
  bio?: string;
  timeZone?: string;
  directExtension?: string;
}

export interface BuyingSignal {
  id: string;
  title: string;
  timestamp: string;
  category: 'Pricing' | 'Whitepaper' | 'Team Growth' | 'Security';
  strength: 'High' | 'Medium' | 'Critical';
  description: string;
}

export interface ContactTouchpoint {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note';
  date: string;
  summary: string;
  agent: string;
  duration?: string;
  outcome?: string;
}

export interface RecommendedAction {
  id: string;
  action: string;
  rationale: string;
  ctaText: string;
  type: 'call' | 'email' | 'meeting';
}

export interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  avatar: string;
  location: string;
  industry: string;
  annualRevenue: string;
  companySize: string;
  icpScore: number; // 0-100
  intentScore: number; // 0-100
  potentialValue: number; // in USD
  interests: string[];
  lastContact: string;
  nextActionDeadline: string;
  status: 'New' | 'In Progress' | 'Scheduled' | 'Contacted' | 'Closed-Won' | 'Follow-Up';
  priority: 'High' | 'Medium' | 'Low' | 'Urgent';
  buyingSignals: BuyingSignal[];
  contactHistory: ContactTouchpoint[];
  recommendedActions: RecommendedAction[];
  notes: string;
}

export interface CallRecord {
  id: string;
  leadId: string;
  leadName: string;
  company: string;
  phone: string;
  direction: 'outbound' | 'inbound' | 'missed';
  timestamp: string;
  duration: number; // in seconds
  outcome: 'Connected & Qualified' | 'Follow-up Scheduled' | 'Voicemail' | 'Gatekeeper' | 'Closed-Won' | 'No Answer';
  notes: string;
  hasRecording: boolean;
  audioUrl?: string;
  sentiment: 'Positive' | 'Neutral' | 'Hesitant' | 'Negative';
  transcriptSnippet: string;
}

export interface IncomingCall {
  id: string;
  callerName: string;
  company: string;
  phone: string;
  timestamp: string;
  leadId?: string;
  potentialValue: number;
  reason: 'Missed Call' | 'Voicemail Left' | 'Inbound Callback Request';
  voicemailDuration?: string;
  voicemailTranscript?: string;
  status: 'pending' | 'resolved';
  priority: 'Urgent' | 'High' | 'Standard';
}

export interface CalendarEvent {
  id: string;
  leadId: string;
  leadName: string;
  company: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: 'Follow-Up Call' | 'Platform Demo' | 'Contract Review' | 'Technical Deep-Dive';
  potentialValue: number;
  status: 'Upcoming' | 'Completed' | 'Rescheduled';
  agenda: string;
}

export interface ChannelMessage {
  id: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  isAi: boolean;
  isCurrentUser: boolean;
  timestamp: string;
  content: string;
  badge?: string;
}

export interface PinnedChannelAction {
  id: string;
  title: string;
  description: string;
  leadName: string;
  leadId: string;
  primaryButton: { label: string; actionId: string };
  secondaryButton: { label: string; actionId: string };
  resolved?: boolean;
  resolutionText?: string;
}

export interface PulseChannelData {
  id: string;
  name: string;
  topic: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  category: 'Urgent' | 'Deals' | 'Coaching' | 'Product';
  membersCount: number;
  pinnedAction?: PinnedChannelAction;
  messages: ChannelMessage[];
}

export interface DashboardTask {
  id: string;
  title: string;
  leadId: string;
  leadName: string;
  company: string;
  phone: string;
  dueDate: string;
  priority: 'High' | 'Urgent' | 'Medium';
  completed: boolean;
  type: 'call' | 'follow-up' | 'contract';
}

export interface KPIStats {
  callsCompleted: number;
  callsTarget: number;
  connectionRate: number; // percentage
  qualifiedRate: number; // percentage
  earningsToday: number;
  monthlyCommission: number;
  averageDurationSeconds: number;
}
