import React from 'react';
import {
  Sparkles,
  Bot,
  MessageSquare,
  Hash,
  ChevronRight,
  Award,
  Zap,
  TrendingUp,
  ShieldCheck,
  Cpu,
  ThumbsUp,
  ArrowRight,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';

export const PulseHome: React.FC = () => {
  const { pulseChannels, setActiveChannelId, setActiveScreen } = useApp();

  const handleOpenChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    setActiveScreen('pulse-channel');
  };

  const roleAgents = [
    {
      name: 'Sales Coaching Agent',
      icon: TrendingUp,
      status: 'Live & Listening',
      role: 'Pitch Guidance & Objection Scripting',
      accuracy: '98.4%',
      desc: 'Listens to outbound pitch cadence and surfaces real-time objection rebuttals.',
    },
    {
      name: 'Objection Handler',
      icon: ShieldCheck,
      status: 'Active',
      role: 'Competitor Defense (Talkdesk/Five9)',
      accuracy: '96.2%',
      desc: 'Instant tactical talk tracks when prospects cite legacy PBX contracts or downtime fears.',
    },
    {
      name: 'Follow-Up Drafter',
      icon: Zap,
      status: 'Ready',
      role: 'Email Recap & Mutual Action Plans',
      accuracy: '99.1%',
      desc: 'Generates executive email recaps and deliverables within 10 seconds of call hangup.',
    },
    {
      name: 'Executive Deal Strategist',
      icon: Award,
      status: 'Active in #deal-desk',
      role: 'Discounting & Margin Optimizer',
      accuracy: '94.8%',
      desc: 'Calculates contract margin yield and approves multi-year pricing tiers in real-time.',
    },
  ];

  const taskAgents = [
    {
      name: 'Autonomous Transcriber & Audio Redactor',
      speed: 'Sub-200ms',
      desc: 'Transcribes customer audio and silences PCI-DSS cardholder data on the fly.',
    },
    {
      name: 'Real-Time Buying Signal Detector',
      speed: 'Instant Alert',
      desc: 'Flags intent spikes from pricing calculator visits and whitepaper downloads.',
    },
    {
      name: 'Salesforce & HubSpot CRM Sync Agent',
      speed: 'Continuous',
      desc: 'Auto-categorizes call dispositions, recording links, and rep follow-up tasks.',
    },
  ];

  const kudos = [
    {
      id: 'k-1',
      recipient: 'Priya Sharma',
      giver: 'Marcus (VP Sales)',
      content: 'Closed the Vertex Dynamics proof-of-concept benchmark in 48 hours! 🚀',
      time: '1 hour ago',
    },
    {
      id: 'k-2',
      recipient: 'Alex Chen',
      giver: 'Elena (Deal Desk)',
      content: 'Phenomenal objection handling on the FinPulse security call today. ⭐',
      time: '3 hours ago',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome & AvaniBot Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-forest text-ivory border border-forest-border shadow-soft relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-sage/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sage to-forest-light border border-emerald-400/30 text-white shadow-md">
              <Bot className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">AvaniBot Intelligence</h1>
                <Badge variant="forest" size="sm">
                  Autonomous AI Agent
                </Badge>
                <span className="text-[10px] font-semibold text-emerald-300 bg-forest-surface px-2 py-0.5 rounded-full border border-forest-border">
                  Simulated AI
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed">
                AvaniBot continuously analyzes live agent speech, extracts customer buying signals,
                and routes high-stakes escalations to your team communication channels.
              </p>

              <div className="flex items-center gap-4 mt-3 text-xs text-gray-300">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  38 Calls Transcribed Today
                </span>
                <span className="flex items-center gap-1.5 text-gold-light">
                  <Sparkles className="w-3.5 h-3.5" /> 4 Urgent Escalations Handled
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOpenChannel('chan-urgent-leads')}
            className="px-5 py-3 rounded-2xl bg-sage hover:bg-sage-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 active:scale-95 shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open Urgent Channel</span>
          </button>
        </div>
      </div>

      {/* Grid: Communication Channels & Role Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Communication Channels & Role Agents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Communication Channels */}
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-ivory-border">
              <div>
                <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
                  <Hash className="w-4 h-4 text-sage" />
                  Pulse Team Channels
                </h2>
                <p className="text-xs text-charcoal-muted">
                  Interactive team communication and AI deal collaboration
                </p>
              </div>
              <span className="text-xs text-charcoal-muted italic">Click to enter chat</span>
            </div>

            <div className="space-y-3">
              {pulseChannels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => handleOpenChannel(channel.id)}
                  className="p-4 rounded-2xl border border-ivory-border bg-ivory-subtle/50 hover:bg-ivory transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-forest-surface text-emerald-200 border border-forest-border flex items-center justify-center font-bold text-sm shrink-0">
                      #
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-charcoal group-hover:text-sage transition-colors">
                          {channel.name}
                        </span>
                        {channel.unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gold text-forest-dark">
                            {channel.unreadCount} unread
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-charcoal-muted truncate mt-0.5">
                        {channel.lastMessage}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-mono text-charcoal-muted">
                      {channel.lastMessageTime}
                    </span>
                    <ChevronRight className="w-4 h-4 text-charcoal-muted group-hover:text-sage transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Autonomous Role Agents */}
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-ivory-border">
              <div>
                <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-sage" />
                  Autonomous Role Agents
                </h2>
                <p className="text-xs text-charcoal-muted">
                  Simulated specialized AI workers co-piloting customer engagements
                </p>
              </div>
              <Badge variant="sage" size="sm">
                4 Deployed
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roleAgents.map((agent) => {
                const Icon = agent.icon;
                return (
                  <div
                    key={agent.name}
                    className="p-4 rounded-2xl border border-ivory-border bg-ivory-subtle/50 hover:bg-white hover:border-sage-border transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-sage-light text-sage-text">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {agent.accuracy} benchmark
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-charcoal">{agent.name}</h3>
                      <p className="text-[11px] font-semibold text-sage">{agent.role}</p>
                    </div>

                    <p className="text-[11px] text-charcoal-muted leading-relaxed">{agent.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Task Agents & Team Kudos */}
        <div className="space-y-6">
          {/* Task Agents */}
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft">
            <h3 className="text-base font-bold text-charcoal mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              Task Execution Agents
            </h3>
            <p className="text-xs text-charcoal-muted mb-4">Background automation workers</p>

            <div className="space-y-3">
              {taskAgents.map((ta, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-ivory-subtle border border-ivory-border text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-charcoal">{ta.name}</span>
                    <span className="text-[10px] font-mono text-sage font-bold bg-white px-2 py-0.5 rounded-md border border-ivory-border">
                      {ta.speed}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-muted leading-relaxed">{ta.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Kudos & Wins Feed */}
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-charcoal flex items-center gap-2">
                <Award className="w-4 h-4 text-gold" />
                Team Kudos & Wins
              </h3>
              <ThumbsUp className="w-4 h-4 text-sage" />
            </div>

            <div className="space-y-3">
              {kudos.map((k) => (
                <div
                  key={k.id}
                  className="p-3.5 rounded-2xl bg-gold-light/40 border border-gold-border/60 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-charcoal">
                      To: <span className="text-forest">{k.recipient}</span>
                    </span>
                    <span className="text-charcoal-muted font-mono">{k.time}</span>
                  </div>
                  <p className="text-charcoal leading-relaxed">{k.content}</p>
                  <p className="text-[10px] text-charcoal-muted font-medium">From: {k.giver}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
