import React, { useState } from 'react';
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Play,
  Pause,
  X,
  CheckCircle2,
  Volume2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCalling } from '../context/CallingContext';

interface RecentCallItem {
  id: string;
  name: string;
  timeStr: string;
  type: 'incoming' | 'outbound' | 'missed';
  phone: string;
  durationSeconds?: number;
  sentiment?: 'Positive' | 'Neutral' | 'Hesitant';
  transcript?: string;
  sopScore?: number;
}

export const RecentCalls: React.FC = () => {
  const { callRecords, leads } = useApp();
  const { startCall } = useCalling();
  const [selectedCall, setSelectedCall] = useState<RecentCallItem | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Exact data modeled from Screenshot 4
  const recentCallsList: RecentCallItem[] = [
    {
      id: 'rc-1',
      name: 'Mukunda R.',
      timeStr: '10:42 AM · 4m 12s',
      type: 'incoming',
      phone: '+91 98450 12345',
      durationSeconds: 252,
      sentiment: 'Positive',
      transcript:
        'Mukunda: "Please send the formal quote for the Ortho GRID King size. If the Bajaj No-Cost EMI works, I will confirm today." Arvind: "Absolutely Mukunda, generating the quotation with the 10-year warranty certificate right away."',
      sopScore: 94,
    },
    {
      id: 'rc-2',
      name: 'Kavitha R.',
      timeStr: 'Yesterday · 2m 05s',
      type: 'outbound',
      phone: '+91 98110 33445',
      durationSeconds: 125,
      sentiment: 'Positive',
      transcript:
        'Kavitha: "I got the mattress delivery notification. The technician arrived on time and helped set up the frame." Arvind: "Wonderful to hear Kavitha! Glad you are enjoying the SmartGRID experience."',
      sopScore: 98,
    },
    {
      id: 'rc-3',
      name: 'Unknown',
      timeStr: 'Yesterday · ---',
      type: 'missed',
      phone: '+91 98765 00000',
      sentiment: 'Neutral',
      transcript: 'No audio captured. Inbound ringing disconnected after 4 rings.',
      sopScore: 70,
    },
    {
      id: 'rc-4',
      name: 'Ritu S.',
      timeStr: 'Today 11:20 AM · ---',
      type: 'missed',
      phone: '+91 98220 77889',
      sentiment: 'Neutral',
      transcript: 'Voicemail detected: "Hi Arvind, calling regarding the pillow exchange bundle. Please call back."',
      sopScore: 75,
    },
    {
      id: 'rc-5',
      name: 'Faizan A.',
      timeStr: 'Today 10:05 AM · ---',
      type: 'missed',
      phone: '+91 98330 99881',
      sentiment: 'Neutral',
      transcript: 'Missed callback. Relayed into priority queue.',
      sopScore: 72,
    },
    {
      id: 'rc-6',
      name: 'Kavitha R.',
      timeStr: 'Yesterday 4:40 PM · ---',
      type: 'missed',
      phone: '+91 98110 33445',
      sentiment: 'Neutral',
      transcript: 'Inbound attempt during team briefing.',
      sopScore: 74,
    },
    {
      id: 'rc-7',
      name: 'Divya P.',
      timeStr: 'Yesterday 2:15 PM · ---',
      type: 'missed',
      phone: '+91 98440 55667',
      sentiment: 'Neutral',
      transcript: 'Missed inquiry regarding mattress firmness level.',
      sopScore: 71,
    },
    {
      id: 'rc-8',
      name: 'Faizan A.',
      timeStr: 'Mon · 6m 40s',
      type: 'outbound',
      phone: '+91 98330 99881',
      durationSeconds: 400,
      sentiment: 'Positive',
      transcript:
        'Faizan: "The Ortho Pro Luxe solved my lower back pain completely. Thank you for walking through the grid dimensions." Arvind: "That is our promise Faizan, rest easy with the 10-year warranty."',
      sopScore: 96,
    },
  ];

  const handleCallCustomer = (call: RecentCallItem) => {
    startCall(
      {
        id: call.id,
        name: call.name,
        company: 'The Sleep Company Customer',
        phone: call.phone,
      },
      'voice-ai'
    );
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      {/* 1. Purple Planner Header Bar */}
      <div className="rounded-xl bg-[#2e1065] text-white px-5 py-3.5 flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[10px] text-purple-200 uppercase tracking-wider block font-semibold">
            Today's calling plan
          </span>
          <h1 className="text-base font-bold text-white tracking-tight leading-tight">Planner</h1>
        </div>

        <div className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 text-purple-100 border border-white/15">
          Fri, 9 Oct
        </div>
      </div>

      {/* 2. White Card Container */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Subheader */}
        <div className="p-4 border-b border-stone-100">
          <h2 className="text-xs font-bold text-charcoal">Recent calls</h2>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Tap a call to review it against SOP
          </p>
        </div>

        {/* Clean Single Rows List */}
        <div className="divide-y divide-stone-100 text-xs">
          {recentCallsList.map((call) => {
            let iconBg = 'bg-emerald-100 text-emerald-700';
            let IconComponent = PhoneIncoming;

            if (call.type === 'outbound') {
              iconBg = 'bg-blue-100 text-blue-700';
              IconComponent = PhoneOutgoing;
            } else if (call.type === 'missed') {
              iconBg = 'bg-red-100 text-red-600';
              IconComponent = PhoneMissed;
            }

            return (
              <div
                key={call.id}
                onClick={() => setSelectedCall(call)}
                className="p-3.5 hover:bg-stone-50/80 cursor-pointer flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full ${iconBg} flex items-center justify-center shrink-0 shadow-2xs`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-charcoal group-hover:text-purple-700 transition-colors">
                      {call.name}
                    </h3>
                    <p className="text-[11px] text-stone-400 mt-0.5 font-mono">
                      {call.timeStr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-stone-400 group-hover:text-stone-600">
                    SOP {call.sopScore}% →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SOP Review Modal */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-stone-200 max-w-lg w-full p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-charcoal">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>SOP Call Review · {selectedCall.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCall(null)}
                className="p-1 rounded text-stone-400 hover:text-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-charcoal">{selectedCall.name}</span>
                  <p className="text-[11px] text-stone-500 font-mono">{selectedCall.phone} · {selectedCall.timeStr}</p>
                </div>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {selectedCall.sentiment || 'Positive'}
                </span>
              </div>

              {/* SOP Adherence Breakdown */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="font-bold text-[11px] uppercase tracking-wider text-charcoal block">
                  SOP Script Benchmark
                </span>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-600">Greeting Script within 10s:</span>
                  <span className="font-bold text-emerald-700">100% (Pass)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-600">Ortho GRID Warranty Disclosure:</span>
                  <span className="font-bold text-emerald-700">96% (Pass)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-600">Closing & Next Action Confirmed:</span>
                  <span className="font-bold text-emerald-700">92% (Pass)</span>
                </div>
              </div>

              {/* Transcript */}
              {selectedCall.transcript && (
                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/80 text-charcoal space-y-1">
                  <span className="font-bold text-[10px] uppercase text-purple-900 block">
                    Audio Transcript Excerpt
                  </span>
                  <p className="text-[11px] text-stone-700 leading-relaxed italic">
                    "{selectedCall.transcript}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleCallCustomer(selectedCall);
                  setSelectedCall(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedCall(null)}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-charcoal text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
