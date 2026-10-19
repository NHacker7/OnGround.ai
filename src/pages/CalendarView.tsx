import React, { useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Phone,
  Plus,
  Sparkles,
  Building,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCalling } from '../context/CallingContext';
import { Badge } from '../components/common/Badge';

export const CalendarView: React.FC = () => {
  const { calendarEvents, openLeadModal, addCalendarEvent, leads } = useApp();
  const { startCall } = useCalling();

  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 19)); // October 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-10-19');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Event Form State
  const [newEventLeadId, setNewEventLeadId] = useState<string>(leads[0]?.id || '');
  const [newEventTime, setNewEventTime] = useState<string>('2:30 PM');
  const [newEventType, setNewEventType] = useState<any>('Follow-Up Call');
  const [newEventAgenda, setNewEventAgenda] = useState<string>('');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date(2026, 9, 19);
    setCurrentDate(today);
    setSelectedDateStr('2026-10-19');
  };

  const selectedDayEvents = calendarEvents.filter((e) => e.date === selectedDateStr);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find((l) => l.id === newEventLeadId) || leads[0];
    if (lead) {
      addCalendarEvent({
        leadId: lead.id,
        leadName: lead.name,
        company: lead.company,
        phone: lead.phone,
        date: selectedDateStr,
        time: newEventTime,
        type: newEventType,
        potentialValue: lead.potentialValue,
        status: 'Upcoming',
        agenda: newEventAgenda || 'Follow-up briefing and product deep-dive.',
      });
      setIsAddModalOpen(false);
      setNewEventAgenda('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-charcoal tracking-tight">Calendar</h1>
            <Badge variant="sage" size="sm">
              {calendarEvents.length} Scheduled Follow-Ups
            </Badge>
          </div>
          <p className="text-sm text-charcoal-muted mt-1">
            Manage prospect appointments, demo meetings, and scheduled callbacks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-sage hover:bg-sage-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Call</span>
        </button>
      </div>

      {/* Main Grid: Calendar View + Day Details Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Calendar */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-ivory-border shadow-soft flex flex-col justify-between">
          {/* Calendar Month Navigation Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-ivory-border">
            <h2 className="text-lg font-bold text-charcoal">
              {monthNames[month]} {year}
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToday}
                className="px-3 py-1.5 rounded-xl bg-ivory-subtle border border-ivory-border text-xs font-bold text-charcoal hover:bg-ivory transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl bg-ivory-subtle border border-ivory-border text-charcoal hover:bg-ivory transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl bg-ivory-subtle border border-ivory-border text-charcoal hover:bg-ivory transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold uppercase tracking-wider text-charcoal-muted">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-2 flex-1">
            {/* Empty slots for start padding */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-18 p-1.5 rounded-xl opacity-30" />
            ))}

            {/* Days in current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = selectedDateStr === dateStr;
              const isToday = dateStr === '2026-10-19';

              const dayEvents = calendarEvents.filter((e) => e.date === dateStr);

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`min-h-20 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-sage-light/60 border-sage shadow-xs'
                      : isToday
                      ? 'bg-ivory-subtle border-gold/70'
                      : 'bg-white border-ivory-border hover:border-sage-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isSelected
                          ? 'bg-sage text-white'
                          : isToday
                          ? 'bg-gold text-white font-extrabold'
                          : 'text-charcoal'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {dayEvents.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-sage" />
                    )}
                  </div>

                  {/* Tiny Event Pills */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="text-[10px] font-semibold truncate px-1.5 py-0.5 rounded-md bg-forest-surface text-emerald-200 border border-forest-border"
                      >
                        {ev.time} {ev.leadName.split(' ')[0]}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-charcoal-muted font-bold block text-center">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Selected Day Schedule Details */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-ivory-border">
              <div>
                <h3 className="text-base font-bold text-charcoal">Selected Day Schedule</h3>
                <p className="text-xs text-charcoal-muted font-mono">{selectedDateStr}</p>
              </div>
              <Badge variant="sage" size="sm">
                {selectedDayEvents.length} Events
              </Badge>
            </div>

            {selectedDayEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl border border-ivory-border bg-ivory-subtle/50 hover:bg-ivory transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-sage font-mono flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {ev.time}
                      </span>
                      <Badge variant="gold" size="sm">
                        {ev.type}
                      </Badge>
                    </div>

                    <div>
                      <h4
                        className="text-sm font-bold text-charcoal cursor-pointer hover:text-sage transition-colors"
                        onClick={() => openLeadModal(ev.leadId)}
                      >
                        {ev.leadName}
                      </h4>
                      <p className="text-xs text-charcoal-muted">
                        {ev.company} • {ev.phone}
                      </p>
                    </div>

                    <p className="text-xs text-charcoal-muted leading-relaxed bg-white p-2.5 rounded-xl border border-ivory-border">
                      {ev.agenda}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => openLeadModal(ev.leadId)}
                        className="text-xs font-bold text-sage hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Lead Dossier</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          startCall({
                            id: ev.leadId,
                            name: ev.leadName,
                            company: ev.company,
                            phone: ev.phone,
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-sage hover:bg-sage-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                      >
                        <Phone className="w-3 h-3 fill-white" />
                        <span>Start Call</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-charcoal-muted text-xs space-y-2">
                <CalendarDays className="w-8 h-8 mx-auto text-charcoal-muted/40" />
                <p>No appointments booked for this date.</p>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-2 text-xs font-bold text-sage hover:underline"
                >
                  + Add scheduled callback
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Call Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-dark/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-ivory-border p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-charcoal mb-4">Schedule Call or Demo</h3>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-charcoal mb-1">Select Lead</label>
                <select
                  value={newEventLeadId}
                  onChange={(e) => setNewEventLeadId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-ivory-subtle border border-ivory-border font-semibold text-charcoal focus:outline-none focus:border-sage"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.company})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    placeholder="e.g. 2:30 PM"
                    className="w-full p-2.5 rounded-xl bg-ivory-subtle border border-ivory-border font-semibold text-charcoal focus:outline-none focus:border-sage"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Call Type</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-ivory-subtle border border-ivory-border font-semibold text-charcoal focus:outline-none focus:border-sage"
                  >
                    <option value="Follow-Up Call">Follow-Up Call</option>
                    <option value="Platform Demo">Platform Demo</option>
                    <option value="Contract Review">Contract Review</option>
                    <option value="Technical Deep-Dive">Technical Deep-Dive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Agenda & Focus</label>
                <textarea
                  value={newEventAgenda}
                  onChange={(e) => setNewEventAgenda(e.target.value)}
                  placeholder="Goals for call..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-ivory-subtle border border-ivory-border text-charcoal focus:outline-none focus:border-sage"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-ivory-border text-charcoal font-semibold hover:bg-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sage hover:bg-sage-hover text-white font-bold shadow-sm"
                >
                  Confirm Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
