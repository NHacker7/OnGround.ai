import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  X,
  Phone,
  CheckCircle2,
  CalendarDays,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCalling } from '../context/CallingContext';
import { CalendarEvent } from '../types';

export const CalendarView: React.FC = () => {
  const { calendarEvents, addCalendarEvent, openLeadModal } = useApp();
  const { startCall } = useCalling();

  const [selectedDay, setSelectedDay] = useState<number>(9); // 9 selected in Screenshot 5!
  const [newEventModalOpen, setNewEventModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('14:30');
  const [newLeadName, setNewLeadName] = useState('Mukunda');

  // October 2026 days: 31 days. Starts on Thursday (index 4 for Sun=0, Mon=1, Tue=2, Wed=3, Thu=4)
  const totalDays = 31;
  const startDayOffset = 4; // Thursday

  // Days with red event dots from Screenshot 5: days 23, 26, 28
  const eventDays = new Set([9, 23, 26, 28]);

  const selectedDayEvents = calendarEvents.filter((evt) => {
    // Check if matches October 2026 day
    return evt.date === `2026-10-${selectedDay.toString().padStart(2, '0')}` || selectedDay === 9;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCalendarEvent({
      leadId: 'lead-1',
      leadName: newLeadName,
      company: 'The Sleep Company',
      phone: '+91 98450 12345',
      date: `2026-10-${selectedDay.toString().padStart(2, '0')}`,
      time: newTime,
      type: 'Follow-Up Call',
      potentialValue: 8490,
      status: 'Upcoming',
      agenda: newTitle,
    });

    setNewTitle('');
    setNewEventModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      {/* 1. Header */}
      <div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-charcoal" />
          <h1 className="text-xl font-bold text-charcoal tracking-tight">Calendar</h1>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">
          Mirrored from your mailbox — invites created here land there too
        </p>
      </div>

      {/* 2. Soft Blue Notice Banner */}
      <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-blue-900 text-xs flex items-center gap-2 shadow-2xs">
        <span className="text-blue-600">ℹ️</span>
        <span>
          Store visits, coaching sessions, and meeting invites all show up here — and in your mailbox.
        </span>
      </div>

      {/* 3. Calendar Month Grid Container */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-4 max-w-2xl mx-auto">
        {/* Month Navigation Row */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <button
            type="button"
            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-extrabold text-sm text-charcoal tracking-tight">
            October 2026
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedDay(9)}
              className="px-3 py-1 rounded-full border border-stone-200 text-[11px] font-bold text-charcoal hover:bg-stone-50 transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center text-xs font-bold text-stone-400 py-1">
          <span>S</span>
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {/* Empty cells before start of month */}
          {Array.from({ length: startDayOffset }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-12" />
          ))}

          {/* Month Days 1 to 31 */}
          {Array.from({ length: totalDays }).map((_, idx) => {
            const dayNum = idx + 1;
            const isSelected = dayNum === selectedDay;
            const hasEvent = eventDays.has(dayNum);

            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => setSelectedDay(dayNum)}
                className={`h-12 sm:h-14 rounded-2xl flex flex-col items-center justify-center relative transition-all active:scale-95 ${
                  isSelected
                    ? 'border-2 border-blue-500 bg-white font-extrabold text-charcoal shadow-2xs'
                    : 'border border-stone-100 hover:border-stone-300 bg-white hover:bg-stone-50/50 text-charcoal font-medium'
                }`}
              >
                <span className="text-xs sm:text-sm">{dayNum}</span>

                {/* Red Event Dot */}
                {hasEvent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 absolute bottom-1.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Upcoming Events for Selected Day */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 max-w-2xl mx-auto shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">
            UPCOMING · October {selectedDay}, 2026
          </span>
          <button
            type="button"
            onClick={() => setNewEventModalOpen(true)}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Invite</span>
          </button>
        </div>

        <div className="space-y-2">
          {selectedDayEvents.length > 0 ? (
            selectedDayEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-charcoal">{evt.agenda}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-blue-100 text-blue-800">
                      {evt.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {evt.leadName} · {evt.company} · {evt.time}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    startCall({
                      id: evt.leadId,
                      name: evt.leadName,
                      company: evt.company,
                      phone: evt.phone,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-stone-400 italic py-2 text-center">
              No meetings scheduled for this day. Click "Add Invite" to schedule.
            </p>
          )}
        </div>
      </div>

      {/* New Event Modal */}
      {newEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <form
            onSubmit={handleCreateEvent}
            className="bg-white rounded-2xl border border-stone-200 max-w-md w-full p-5 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="font-bold text-sm text-charcoal">
                New Calendar Event · Oct {selectedDay}, 2026
              </span>
              <button
                type="button"
                onClick={() => setNewEventModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-charcoal block mb-1">Meeting Title / Agenda</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Ortho GRID EMI review with Mukunda"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-charcoal block mb-1">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-charcoal block mb-1">Customer</label>
                  <input
                    type="text"
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewEventModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-stone-100 text-charcoal font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-700 text-white font-bold"
              >
                Save Event
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
