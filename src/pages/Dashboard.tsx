import React from 'react';
import {
  PhoneCall,
  PhoneForwarded,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Phone,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { useCalling } from '../context/CallingContext';
import { Badge } from '../components/common/Badge';

const CHART_DATA_7_DAYS = [
  { day: 'Mon', calls: 42, connected: 31, qualified: 9 },
  { day: 'Tue', calls: 48, connected: 36, qualified: 12 },
  { day: 'Wed', calls: 52, connected: 38, qualified: 14 },
  { day: 'Thu', calls: 45, connected: 33, qualified: 11 },
  { day: 'Fri', calls: 55, connected: 41, qualified: 15 },
  { day: 'Sat', calls: 24, connected: 17, qualified: 5 },
  { day: 'Sun', calls: 18, connected: 12, qualified: 4 },
];

export const Dashboard: React.FC = () => {
  const { kpis, tasks, leads, openLeadModal, toggleTaskComplete, setActiveScreen } = useApp();
  const { startCall } = useCalling();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-charcoal tracking-tight">
              Good morning, Alex 👋
            </h1>
            <Badge variant="sage" size="sm">
              Shift Active
            </Badge>
          </div>
          <p className="text-sm text-charcoal-muted mt-1">
            You are pacing <span className="font-semibold text-emerald-800">14% ahead</span> of
            your weekly outbound conversion benchmark.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveScreen('calls')}
            className="px-4 py-2.5 rounded-xl bg-sage hover:bg-sage-hover text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Open Calls Queue</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Calls Made vs Target */}
        <div className="p-5 rounded-2xl bg-white border border-ivory-border shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
              Calls Completed
            </span>
            <span className="p-2 rounded-xl bg-sage-light text-sage-text">
              <PhoneCall className="w-4 h-4" />
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-charcoal">{kpis.callsCompleted}</span>
              <span className="text-sm text-charcoal-muted">/ {kpis.callsTarget} target</span>
            </div>
            <div className="w-full bg-[#ede9dd] h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-sage h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((kpis.callsCompleted / kpis.callsTarget) * 100))}%`,
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-charcoal-muted">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 76% of Daily Quota
            </span>
            <span>12 Remaining</span>
          </div>
        </div>

        {/* Card 2: Connection & Qualified Rate */}
        <div className="p-5 rounded-2xl bg-white border border-ivory-border shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
              Connect & Qualified
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <PhoneForwarded className="w-4 h-4" />
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-charcoal">{kpis.connectionRate}%</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                +4.2%
              </span>
            </div>
            <p className="text-xs text-charcoal-muted mt-2">
              Qualified Rate:{' '}
              <span className="font-bold text-charcoal">{kpis.qualifiedRate}%</span> (Above 22%
              target)
            </p>
          </div>
          <span className="text-xs text-charcoal-muted">Verified across 38 completed calls</span>
        </div>

        {/* Card 3: Earnings & Commission Today */}
        <div className="p-5 rounded-2xl bg-white border border-ivory-border shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
              Today's Commission
            </span>
            <span className="p-2 rounded-xl bg-gold-light text-gold-text">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-charcoal">
                {formatCurrency(kpis.earningsToday)}
              </span>
              <span className="text-xs font-bold text-gold-text bg-gold-light px-2 py-0.5 rounded-full border border-gold-border">
                On Track
              </span>
            </div>
            <p className="text-xs text-charcoal-muted mt-2">
              MTD Accrued:{' '}
              <span className="font-bold text-charcoal">
                {formatCurrency(kpis.monthlyCommission)}
              </span>
            </p>
          </div>
          <span className="text-xs text-charcoal-muted">+$75 per qualified discovery call</span>
        </div>

        {/* Card 4: Average Duration */}
        <div className="p-5 rounded-2xl bg-white border border-ivory-border shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
              Avg Call Duration
            </span>
            <span className="p-2 rounded-xl bg-ivory-subtle text-charcoal">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-charcoal">4m 34s</span>
              <span className="text-xs text-charcoal-muted">Optimal Range</span>
            </div>
            <p className="text-xs text-charcoal-muted mt-2">
              Target pitch duration: 3-5 minutes
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Sub-200ms audio latency
          </span>
        </div>
      </div>

      {/* Main Content Grid: 7-Day Chart & Priority Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 7-Day Volume & Trend Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-charcoal">
                  7-Day Call Volume & Conversion
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Outbound dials vs Connected vs Qualified leads
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-charcoal">
                  <span className="w-3 h-3 rounded-md bg-sage" /> Total Calls
                </span>
                <span className="flex items-center gap-1.5 text-charcoal">
                  <span className="w-3 h-3 rounded-md bg-emerald-400" /> Connected
                </span>
                <span className="flex items-center gap-1.5 text-charcoal">
                  <span className="w-3 h-3 rounded-md bg-gold" /> Qualified
                </span>
              </div>
            </div>

            <div className="h-68 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={CHART_DATA_7_DAYS}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2d6046" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2d6046" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorConn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ece1" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#8c9c93"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#8c9c93" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f261d',
                      borderRadius: '12px',
                      color: '#faf8f3',
                      border: 'none',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="calls"
                    stroke="#2d6046"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorCalls)"
                  />
                  <Area
                    type="monotone"
                    dataKey="connected"
                    stroke="#34d399"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorConn)"
                  />
                  <Area
                    type="monotone"
                    dataKey="qualified"
                    stroke="#b88628"
                    strokeWidth={2}
                    fillOpacity={0}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Follow-Ups Section */}
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-charcoal">Pending Follow-Ups</h3>
                <p className="text-xs text-charcoal-muted">
                  High-intent prospects with scheduled callbacks
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveScreen('calls')}
                className="text-xs font-bold text-sage hover:underline flex items-center gap-1"
              >
                <span>View all leads</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {leads.slice(0, 3).map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 rounded-2xl border border-ivory-border bg-ivory-subtle/50 hover:bg-ivory transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => openLeadModal(lead.id)}
                  >
                    <img
                      src={lead.avatar}
                      alt={lead.name}
                      className="w-10 h-10 rounded-xl object-cover border border-sage-light"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-charcoal group-hover:text-sage">
                          {lead.name}
                        </span>
                        <Badge
                          variant={lead.priority === 'Urgent' ? 'urgent' : 'sage'}
                          size="sm"
                        >
                          {lead.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-charcoal-muted">
                        {lead.company} • Value:{' '}
                        <span className="font-semibold text-charcoal">
                          {formatCurrency(lead.potentialValue)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-[11px] text-charcoal-muted mr-2 font-mono">
                      Due: {lead.nextActionDeadline}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        startCall({
                          id: lead.id,
                          name: lead.name,
                          company: lead.company,
                          phone: lead.phone,
                        })
                      }
                      className="px-3 py-1.5 rounded-xl bg-sage hover:bg-sage-hover text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5 fill-white" />
                      <span>Call Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: High-Priority Tasks (Clicking opens Lead Details Modal!) */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-charcoal">Today's Action Tasks</h3>
                <p className="text-xs text-charcoal-muted">
                  {completedTasksCount} of {tasks.length} tasks completed
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gold-light text-gold-text border border-gold-border">
                {pendingTasks.length} Pending
              </span>
            </div>

            <p className="text-[11px] text-charcoal-muted italic mb-3">
              💡 Tip: Click any task to inspect full lead dossier & buying signals
            </p>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    task.completed
                      ? 'bg-ivory-subtle/50 border-ivory-border opacity-60'
                      : 'bg-white border-ivory-border hover:border-sage-border hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskComplete(task.id)}
                      className="mt-1 w-4 h-4 rounded text-sage focus:ring-sage border-ivory-border cursor-pointer accent-sage"
                    />

                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => openLeadModal(task.leadId)}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs font-bold leading-tight truncate ${
                            task.completed ? 'line-through text-charcoal-muted' : 'text-charcoal hover:text-sage'
                          }`}
                        >
                          {task.title}
                        </span>
                        <Badge
                          variant={task.priority === 'Urgent' ? 'urgent' : 'gold'}
                          size="sm"
                        >
                          {task.priority}
                        </Badge>
                      </div>

                      <p className="text-[11px] text-charcoal-muted mt-1">
                        {task.leadName} • {task.company}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-ivory-border/50 text-[10px] text-charcoal-muted">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-sage" />
                          {task.dueDate}
                        </span>
                        <span className="font-semibold text-sage flex items-center gap-0.5">
                          Open Dossier →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-charcoal flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                Live Agent Activity
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-ivory-subtle border border-ivory-border">
                <p className="font-semibold text-charcoal">
                  Amara Okafor (NexaHealth) BAA approved
                </p>
                <p className="text-[11px] text-charcoal-muted mt-0.5">
                  12m call completed • $75,000 deal qualified
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-ivory-subtle border border-ivory-border">
                <p className="font-semibold text-charcoal">
                  AvaniBot auto-logged Marcus Vance call notes
                </p>
                <p className="text-[11px] text-charcoal-muted mt-0.5">
                  Synced 3 action items to CRM
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-ivory-subtle border border-ivory-border">
                <p className="font-semibold text-charcoal">
                  Elena Rostova reviewed pilot conversion order
                </p>
                <p className="text-[11px] text-charcoal-muted mt-0.5">
                  30 seats booked for CloudMatrix
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
