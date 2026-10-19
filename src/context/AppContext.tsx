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

interface AppContextType {
  activeScreen: ScreenId;
  setActiveScreen: (screen: ScreenId) => void;
  activeChannelId: string;
  setActiveChannelId: (channelId: string) => void;
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
  const [activeChannelId, setActiveChannelId] = useState<string>('chan-urgent-leads');
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
      senderName: 'Alex Chen',
      senderRole: 'Senior Account Executive',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
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
      const aiReply = {
        id: `ai-msg-${Date.now()}`,
        senderName: 'AvaniBot',
        senderRole: 'Autonomous Voice Intelligence',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        isAi: true,
        isCurrentUser: false,
        timestamp: 'Just now',
        content: `Understood, Alex. I have logged "${content.trim()}" into our real-time CRM stream and updated the deal intelligence matrix.`,
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
          if (actionId === 'approve-discount') {
            resolution = '✅ Approved 15% discount for 24-month contract. Order form generated.';
          } else if (actionId === 'counter-discount') {
            resolution = '🔄 Counter-offer of 10% discount + $1,500 onboarding credit sent.';
          } else if (actionId === 'call-marcus') {
            resolution = '📞 Outbound callback to Marcus Vance queued on priority line.';
          } else if (actionId === 'send-link') {
            resolution = '📅 Priority VIP calendar link dispatched via SMS.';
          }

          const actionRecordMsg = {
            id: `msg-act-${Date.now()}`,
            senderName: 'AvaniBot',
            senderRole: 'Workflow Automation',
            senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
            isAi: true,
            isCurrentUser: false,
            timestamp: 'Just now',
            content: `⚡ Action Completed by Alex Chen: ${resolution}`,
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
