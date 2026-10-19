import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Smile,
  Send,
  Pin,
  Edit3,
  Check,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PulseChannel: React.FC = () => {
  const {
    activeChannelId,
    pulseChannels,
    setActiveScreen,
    sendChannelMessage,
    handlePinnedAction,
    openLeadModal,
    userProfile,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [pinnedAnswer, setPinnedAnswer] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channel =
    pulseChannels.find((c) => c.id === activeChannelId) ||
    pulseChannels.find((c) => c.name === 'callcentre-team') ||
    pulseChannels[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [channel?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendChannelMessage(channel.id, inputMessage);
    setInputMessage('');
  };

  const handlePinnedCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinnedAnswer.trim()) return;
    handlePinnedAction(channel.id, `custom:${pinnedAnswer.trim()}`);
    setPinnedAnswer('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[820px] bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden animate-in fade-in duration-150">
      {/* 1. Deep Purple Channel Header */}
      <div className="px-5 py-3 bg-[#3b0764] text-white flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveScreen('pulse')}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all flex items-center justify-center text-xs font-bold"
            title="Back to Pulse Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 font-bold text-sm text-white">
            <span className="text-purple-300">#</span>
            <h1>{channel.name}</h1>
          </div>
        </div>
      </div>

      {/* 2. Pinned "Needs your input" Card */}
      {channel.pinnedAction && (
        <div className="p-4 bg-amber-50/70 border-b border-amber-200/80 space-y-2.5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
              <span>Needs your input</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-200/70 text-amber-900 text-[9px] font-bold">
                <Pin className="w-2.5 h-2.5" />
                pinned
              </span>
            </div>

            {channel.pinnedAction.leadId && (
              <button
                type="button"
                onClick={() => openLeadModal(channel.pinnedAction!.leadId!)}
                className="text-[10px] font-bold text-purple-700 hover:underline flex items-center gap-0.5"
              >
                <span>View File</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold text-charcoal">
              {channel.pinnedAction.title}
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {channel.pinnedAction.description}
            </p>
          </div>

          {channel.pinnedAction.resolved ? (
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 text-[11px] font-bold flex items-center gap-1.5">
              <span>✓</span>
              <span>{channel.pinnedAction.resolutionText}</span>
            </div>
          ) : (
            <div className="space-y-2 pt-0.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handlePinnedAction(channel.id, channel.pinnedAction!.primaryButton.actionId)
                  }
                  className="px-3 py-1 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold shadow-2xs active:scale-95 transition-all"
                >
                  {channel.pinnedAction.primaryButton.label}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handlePinnedAction(channel.id, channel.pinnedAction!.secondaryButton.actionId)
                  }
                  className="px-3 py-1 rounded-md bg-white border border-stone-300 hover:bg-stone-100 text-charcoal text-[11px] font-bold shadow-2xs active:scale-95 transition-all"
                >
                  {channel.pinnedAction.secondaryButton.label}
                </button>
              </div>

              {/* Single line "Or type your answer" */}
              <form onSubmit={handlePinnedCustomSubmit} className="flex items-center gap-2 pt-0.5">
                <input
                  type="text"
                  value={pinnedAnswer}
                  onChange={(e) => setPinnedAnswer(e.target.value)}
                  placeholder="Or type your answer"
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white border border-stone-300 text-charcoal placeholder-stone-400 focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                />
                <button
                  type="submit"
                  disabled={!pinnedAnswer.trim()}
                  className="px-3 py-1.5 rounded-lg bg-[#b88628] hover:bg-[#9a6e1e] disabled:opacity-40 text-white text-xs font-bold transition-all shadow-2xs"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Date Divider */}
      <div className="flex items-center justify-center my-3 shrink-0">
        <span className="text-[11px] text-stone-400 font-medium">
          Today · Call Centre Team
        </span>
      </div>

      {/* 3. Messages Feed */}
      <div className="flex-1 overflow-y-auto px-5 py-2 space-y-3.5">
        {/* Message 1: Sunita Rao - Stakeholders */}
        <div className="flex items-start gap-2.5 max-w-xl">
          <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-200">
            SR
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="font-bold text-charcoal">Sunita Rao</span>
              <span className="text-stone-400">2:05pm</span>
            </div>
            <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-charcoal">
              👥 <strong>STAKEHOLDERS:</strong> @You (Arvind R.), whole call centre shift
            </div>
          </div>
        </div>

        {/* Message 2: Sunita Rao - Issue Definition */}
        <div className="flex items-start gap-2.5 max-w-xl">
          <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-200">
            SR
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="font-bold text-charcoal">Sunita Rao</span>
              <span className="text-stone-400">2:05pm</span>
            </div>
            <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-charcoal">
              📄 <strong>ISSUE DEFINITION:</strong> Greeting-in-first-10s QA score is at 71% this week, below our 85% target
            </div>
          </div>
        </div>

        {/* Message 3: Sunita Rao - Suggested Resolution */}
        <div className="flex items-start gap-2.5 max-w-xl">
          <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-200">
            SR
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="font-bold text-charcoal">Sunita Rao</span>
              <span className="text-stone-400">2:05pm</span>
            </div>
            <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-charcoal">
              💡 <strong>SUGGESTED RESOLUTION:</strong> Let's push that up 💪 — open every call with the greeting script. I'll check back Friday
            </div>
          </div>
        </div>

        {/* Message 4: Arvind R. (You) - Right aligned green bubble */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] text-stone-400 mr-1">You 2:10pm</span>
          <div className="px-3.5 py-2 rounded-2xl rounded-tr-xs bg-emerald-600 text-white text-xs font-medium max-w-md shadow-xs">
            On it! Will make sure I open every call with the greeting script 🙌
          </div>
        </div>

        {/* Message 5: Sunita Rao - Reply */}
        <div className="flex items-start gap-2.5 max-w-xl">
          <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-200">
            SR
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="font-bold text-charcoal">Sunita Rao</span>
              <span className="text-stone-400">2:14pm</span>
            </div>
            <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-charcoal">
              Great attitude Arvind ⭐
            </div>
          </div>
        </div>

        {/* Dynamic extra messages */}
        {channel.messages
          .filter((m) => !m.content.includes('STAKEHOLDERS:') && !m.content.includes('On it!') && !m.content.includes('Great attitude Arvind'))
          .map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isCurrentUser ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-stone-400 mx-1">
                {msg.isCurrentUser ? 'You' : msg.senderName} {msg.timestamp}
              </span>
              <div
                className={`p-2.5 rounded-xl text-xs max-w-md ${
                  msg.isCurrentUser
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-50 border border-stone-200 text-charcoal'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Bottom Message Composer */}
      <div className="p-3 bg-white border-t border-stone-200 shrink-0">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message #${channel.name}...`}
            className="w-full py-2.5 pl-4 pr-16 bg-stone-50 border border-stone-200 rounded-xl text-xs text-charcoal placeholder-stone-400 focus:outline-hidden focus:bg-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
          />
          <div className="absolute right-2.5 flex items-center gap-1.5">
            <button
              type="button"
              className="p-1 rounded-md text-amber-500 hover:text-amber-600"
              title="Add Emoji"
            >
              <Smile className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white transition-all shadow-2xs"
              title="Send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
