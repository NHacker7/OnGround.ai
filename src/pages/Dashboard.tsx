import React from 'react';
import {
  PhoneCall,
  PhoneForwarded,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Phone,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { useCalling } from '../context/CallingContext';

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
  const { kpis, tasks, leads, openLeadModal, toggleTaskComplete, setActiveScreen, userProfile } =
    useApp();
  const { startCall } = useCalling();

  const firstName = userProfile?.name ? userProfile.name.trim().split(' ')[0] : 'Arvind';

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-150">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-charcoal tracking-tight">
              Good morning, {firstName}
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Shift Active
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            You are pacing <span className="font-semibold text-emerald-700">14% ahead</span> of daily outbound target.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveScreen('calls')}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Calls Queue ({leads.length})</span>
        </button>
      </div>

      {/* 2. Compact 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Calls Completed */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Calls Completed
          </span>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-charcoal">{kpis.callsCompleted}</span>
              <span className="text-xs text-stone-400">/ {kpis.callsTarget} target</span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((kpis.callsCompleted / kpis.callsTarget) * 100))}%`,
                }}
              />
            </div>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">
            {kpis.callsTarget - kpis.callsCompleted} Remaining
          </span>
        </div>

        {/* Connect Rate */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Connect Rate
          </span>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-charcoal">{kpis.connectionRate}%</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                +4.2%
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Qualified: {kpis.qualifiedRate}%</p>
          </div>
          <span className="text-[10px] text-stone-400">Target: 65%</span>
        </div>

        {/* Earnings */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Today's Earnings
          </span>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-charcoal">₹{kpis.earningsToday}</span>
            <p className="text-[11px] text-stone-500 mt-1">MTD: ₹{kpis.monthlyCommission.toLocaleString()}</p>
          </div>
          <span className="text-[10px] text-stone-400">On Track</span>
        </div>

        {/* Avg Duration */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Avg Duration
          </span>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-charcoal">4m 34s</span>
            <p className="text-[11px] text-stone-500 mt-1">Target: 3-5m</p>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">Sub-200ms latency</span>
        </div>
      </div>

      {/* 3. Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Chart & Waiting Leads */}
        <div className="lg:col-span-2 space-y-4">
          {/* 7-Day Trend Chart */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xs font-bold text-charcoal">7-Day Call Volume & Conversion</h2>
                <p className="text-[10px] text-stone-400">Outbound dials vs Connected calls</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-stone-500">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700" /> Dials
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /> Connected
                </span>
              </div>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={CHART_DATA_7_DAYS}
                  margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                  <XAxis dataKey="day" stroke="#a8a29e" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a8a29e" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c1917',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                      border: 'none',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="calls"
                    stroke="#047857"
                    strokeWidth={2}
                    fill="#047857"
                    fillOpacity={0.12}
                  />
                  <Area
                    type="monotone"
                    dataKey="connected"
                    stroke="#10b981"
                    strokeWidth={1.5}
                    fill="#10b981"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Waiting Leads Queue */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-charcoal">Waiting Leads Queue</span>
              <button
                type="button"
                onClick={() => setActiveScreen('calls')}
                className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
              >
                <span>View all ({leads.length})</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {leads.slice(0, 3).map((lead) => (
                <div
                  key={lead.id}
                  className="py-2.5 flex items-center justify-between gap-3 group"
                >
                  <div
                    onClick={() => openLeadModal(lead.id)}
                    className="flex items-center gap-3 cursor-pointer min-w-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {lead.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-charcoal group-hover:text-emerald-700 truncate">
                          {lead.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-600">
                          {lead.slaTimeLeft || '2h left'}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 truncate">
                        {lead.interestedProduct || lead.company}
                      </p>
                    </div>
                  </div>

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
                    className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1 shrink-0 shadow-2xs"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Today's Action Tasks */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-charcoal">Today's Action Tasks</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                {pendingTasks.length} pending
              </span>
            </div>
            <p className="text-[10px] text-stone-400 mb-3">
              Tap task to open lead dossier directly
            </p>

            <div className="space-y-2 text-xs">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                    task.completed
                      ? 'bg-stone-50 border-stone-100 opacity-60'
                      : 'bg-white border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskComplete(task.id)}
                    className="mt-0.5 w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                  />
                  <div
                    onClick={() => openLeadModal(task.leadId)}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <p
                      className={`font-semibold text-xs leading-snug truncate ${
                        task.completed ? 'line-through text-stone-400' : 'text-charcoal hover:text-emerald-700'
                      }`}
                    >
                      {task.title}
                    </p>
                    <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">
                      {task.dueDate} · {task.leadName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 mt-4 text-[10px] text-stone-400 text-center font-medium">
            {completedTasksCount} of {tasks.length} tasks completed today
          </div>
        </div>
      </div>
    </div>
  );
};
