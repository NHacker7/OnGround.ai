import React, { createContext, useContext, useState } from 'react';
import {
  ScreenId,
  Lead,
  CallRecord,
  IncomingCall,
  CalendarEvent,
  PulseChannelData,
  DashboardTask,
  KPIStats,
  UserProfile,
  AppNotification,
} from '../types';
import {
  INITIAL_LEADS,
  INITIAL_CALL_RECORDS,
  INITIAL_INCOMING_CALLS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_TASKS,
  INITIAL_PULSE_CHANNELS,
  INITIAL_KPIS,
} from '../data/initialData';

const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Arvind R.',
  email: 'arvind.r@thesleepcompany.in',
  phone: '+91 98450 67890',
  title: 'Call Centre Specialist',
  department: 'Customer Experience & Inside Sales',
  dateOfBirth: '1995-08-22',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  bio: 'Specializing in sleep wellness consultation, quotation delivery, and objection handling for The Sleep Company.',
  timeZone: 'Asia/Kolkata (IST)',
  directExtension: 'Ext. 104',
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Urgent Quote Request',
    category: 'Buying Signal',
    message: 'Mukunda requested Ortho GRID ₹8,490 quote with No-Cost EMI (2h left)',
    timestamp: '15 minutes ago',
    read: false,
    priority: 'urgent',
    leadId: 'lead-1',
    actionScreen: 'calls',
    value: '₹8,490',
  },
  {
    id: 'notif-2',
    title: 'Needs Your Input',
    category: 'Pulse AI',
    message: 'Confirm 4:30 PM callback with Priya Iyer in #callcentre-team',
    timestamp: '25 minutes ago',
    read: false,
    priority: 'urgent',
    actionScreen: 'pulse-channel',
    actionChannelId: 'chan-callcentre-team',
    leadId: 'lead-2',
  },
  {
    id: 'notif-3',
    title: 'Scheduled Callback',
    category: 'Meeting',
    message: 'Billing review callback with Priya Iyer at 4:30 PM',
    timestamp: 'Today, 4:30 PM',
    read: false,
    priority: 'sage',
    leadId: 'lead-2',
    actionScreen: 'calendar',
    value: '₹14,999',
  },
  {
    id: 'notif-4',
    title: 'High-Intent Buying Signal',
    category: 'Buying Signal',
    message: 'Mukunda downloaded Ortho GRID 10-year warranty specifications',
    timestamp: 'Today, 10:24 AM',
    read: false,
    priority: 'sage',
    leadId: 'lead-1',
    value: '₹8,490',
  },
];

interface AppContextType {
  activeScreen: ScreenId;
  setActiveScreen: (screen: ScreenId) => void;
  activeChannelId: string;
  setActiveChannelId: (channelId: string) => void;
  userProfile: UserProfile;
  updateUserProfile: (newProfile: UserProfile) => void;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  leads: Lead[];
  callRecords: CallRecord[];
  incomingCalls: IncomingCall[];
  calendarEvents: CalendarEvent[];
  tasks: DashboardTask[];
  kpis: KPIStats;
  pulseChannels: PulseChannelData[];
  selectedLeadId: string | null;
  isLeadModalOpen: boolean;
  selectedLead: Lead | null;
  openLeadModal: (leadId: string) => void;
  closeLeadModal: () => void;
  nextLead: () => void;
  prevLead: () => void;
  updateLeadStatus: (leadId: string, status: Lead['status']) => void;
  addCallRecord: (record: Partial<CallRecord>) => void;
  resolveIncomingCall: (incomingId: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  sendChannelMessage: (channelId: string, content: string) => void;
  handlePinnedAction: (channelId: string, actionId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [activeChannelId, setActiveChannelId] = useState<string>('chan-callcentre-team');
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('onground_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Alex Chen') {
          return DEFAULT_USER_PROFILE;
        }
        return { ...DEFAULT_USER_PROFILE, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load profile from localStorage', e);
    }
    return DEFAULT_USER_PROFILE;
  });

  const updateUserProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    try {
      localStorage.setItem('onground_user_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.warn('Failed to persist profile to localStorage', e);
    }
  };

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('onground_notifications');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load notifications from localStorage', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markAllNotificationsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem('onground_notifications', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save notifications to localStorage', e);
      }
      return updated;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      try {
        localStorage.setItem('onground_notifications', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save notifications to localStorage', e);
      }
      return updated;
    });
  };

  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [callRecords, setCallRecords] = useState<CallRecord[]>(INITIAL_CALL_RECORDS);
  const [incomingCalls, setIncomingCalls] = useState<IncomingCall[]>(INITIAL_INCOMING_CALLS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [tasks, setTasks] = useState<DashboardTask[]>(INITIAL_TASKS);
  const [kpis, setKpis] = useState<KPIStats>(INITIAL_KPIS);
  const [pulseChannels, setPulseChannels] = useState<PulseChannelData[]>(INITIAL_PULSE_CHANNELS);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null;

  const openLeadModal = (leadId: string) => {
    setSelectedLeadId(leadId);
    setIsLeadModalOpen(true);
  };

  const closeLeadModal = () => {
    setIsLeadModalOpen(false);
  };

  const nextLead = () => {
    if (!selectedLeadId) return;
    const currentIndex = leads.findIndex((l) => l.id === selectedLeadId);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % leads.length;
      setSelectedLeadId(leads[nextIndex].id);
    }
  };

  const prevLead = () => {
    if (!selectedLeadId) return;
    const currentIndex = leads.findIndex((l) => l.id === selectedLeadId);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + leads.length) % leads.length;
      setSelectedLeadId(leads[prevIndex].id);
    }
  };

  const updateLeadStatus = (leadId: string, status: Lead['status']) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead))
    );
  };

  const addCallRecord = (record: Partial<CallRecord>) => {
    const newRecord: CallRecord = {
      id: `call-${Date.now()}`,
      leadId: record.leadId || '',
      leadName: record.leadName || 'Unknown Lead',
      company: record.company || 'Direct Dial',
      phone: record.phone || '',
      direction: record.direction || 'outbound',
      timestamp: 'Just now',
      duration: record.duration || 60,
      outcome: (record.outcome as any) || 'Connected & Qualified',
      notes: record.notes || '',
      hasRecording: true,
      sentiment: (record.sentiment as any) || 'Positive',
      transcriptSnippet: record.transcriptSnippet || 'Call recorded and indexed by On-Ground.ai engine.',
    };

    setCallRecords((prev) => [newRecord, ...prev]);

    // Update KPI stats
    setKpis((prev) => ({
      ...prev,
      callsCompleted: prev.callsCompleted + 1,
      earningsToday: prev.earningsToday + (newRecord.outcome.includes('Qualified') ? 75 : 25),
    }));

    // Update lead status if matched
    if (record.leadId) {
      updateLeadStatus(record.leadId, 'Contacted');
    }
  };

  const resolveIncomingCall = (incomingId: string) => {
    setIncomingCalls((prev) =>
      prev.map((c) => (c.id === incomingId ? { ...c, status: 'resolved' } : c))
    );
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvt: CalendarEvent = {
      ...event,
      id: `evt-${Date.now()}`,
    };
    setCalendarEvents((prev) => [...prev, newEvt]);
  };

  const sendChannelMessage = (channelId: string, content: string) => {
    if (!content.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      senderName: userProfile.name,
      senderRole: userProfile.title,
      senderAvatar: userProfile.avatar,
      isAi: false,
      isCurrentUser: true,
      timestamp: 'Just now',
      content: content.trim(),
    };

    setPulseChannels((prev) =>
      prev.map((chan) => {
        if (chan.id === channelId) {
          return {
            ...chan,
            lastMessage: content.trim(),
            lastMessageTime: 'Just now',
            messages: [...chan.messages, userMsg],
          };
        }
        return chan;
      })
    );

    // AI AvaniBot simulated response after 1.2 seconds
    setTimeout(() => {
      const firstName = userProfile.name.trim().split(' ')[0] || 'Alex';
      const aiReply = {
        id: `ai-msg-${Date.now()}`,
        senderName: 'AvaniBot',
        senderRole: 'Autonomous Voice Intelligence',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        isAi: true,
        isCurrentUser: false,
        timestamp: 'Just now',
        content: `Understood, ${firstName}. I have logged "${content.trim()}" into our real-time CRM stream and updated the deal intelligence matrix.`,
        badge: 'AI Response',
      };

      setPulseChannels((prev) =>
        prev.map((chan) => {
          if (chan.id === channelId) {
            return {
              ...chan,
              lastMessage: aiReply.content,
              lastMessageTime: 'Just now',
              messages: [...chan.messages, aiReply],
            };
          }
          return chan;
        })
      );
    }, 1200);
  };

  const handlePinnedAction = (channelId: string, actionId: string) => {
    setPulseChannels((prev) =>
      prev.map((chan) => {
        if (chan.id === channelId && chan.pinnedAction) {
          let resolution = 'Action executed successfully.';
          if (actionId === 'confirm-callback') {
            resolution = '✅ 4:30 PM callback confirmed with Priya Iyer. Billing courtesy credit linked.';
          } else if (actionId === 'reschedule-callback') {
            resolution = '⏱️ Callback marked for reschedule. Follow-up slot sent to Priya.';
          } else if (actionId === 'approve-discount') {
            resolution = '✅ Approved 15% discount for 24-month contract. Order form generated.';
          } else if (actionId === 'counter-discount') {
            resolution = '🔄 Counter-offer of 10% discount + $1,500 onboarding credit sent.';
          } else if (actionId === 'call-marcus') {
            resolution = '📞 Outbound callback to Marcus Vance queued on priority line.';
          } else if (actionId === 'send-link') {
            resolution = '📅 Priority VIP calendar link dispatched via SMS.';
          } else if (actionId === 'call-mukunda') {
            resolution = '📞 Dialing Mukunda for Ortho GRID quotation review.';
          } else if (actionId.startsWith('custom:')) {
            resolution = `💬 Response sent: "${actionId.replace('custom:', '')}"`;
          }

          const actionRecordMsg = {
            id: `msg-act-${Date.now()}`,
            senderName: 'AvaniBot',
            senderRole: 'Workflow Automation',
            senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
            isAi: true,
            isCurrentUser: false,
            timestamp: 'Just now',
            content: `⚡ Action Completed by ${userProfile.name}: ${resolution}`,
            badge: 'Deal Executed',
          };

          return {
            ...chan,
            pinnedAction: {
              ...chan.pinnedAction,
              resolved: true,
              resolutionText: resolution,
            },
            messages: [...chan.messages, actionRecordMsg],
          };
        }
        return chan;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        activeChannelId,
        setActiveChannelId,
        userProfile,
        updateUserProfile,
        notifications,
        unreadNotificationCount,
        markAllNotificationsRead,
        markNotificationRead,
        leads,
        callRecords,
        incomingCalls,
        calendarEvents,
        tasks,
        kpis,
        pulseChannels,
        selectedLeadId,
        isLeadModalOpen,
        selectedLead,
        openLeadModal,
        closeLeadModal,
        nextLead,
        prevLead,
        updateLeadStatus,
        addCallRecord,
        resolveIncomingCall,
        toggleTaskComplete,
        addCalendarEvent,
        sendChannelMessage,
        handlePinnedAction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
