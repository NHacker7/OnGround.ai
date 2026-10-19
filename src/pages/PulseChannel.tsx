import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Hash,
  Users,
  Send,
  Paperclip,
  Smile,
  Sparkles,
  Bot,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';

export const PulseChannel: React.FC = () => {
  const {
    activeChannelId,
    pulseChannels,
    setActiveScreen,
    sendChannelMessage,
    handlePinnedAction,
    openLeadModal,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channel =
    pulseChannels.find((c) => c.id === activeChannelId) || pulseChannels[0];

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

  const handleQuickSuggestion = (text: string) => {
    sendChannelMessage(channel.id, text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-h-[820px] bg-white rounded-3xl border border-ivory-border shadow-soft overflow-hidden animate-in fade-in duration-300">
      {/* Channel Top Header */}
      <div className="px-6 py-4 bg-ivory-subtle border-b border-ivory-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveScreen('pulse')}
            className="p-2 rounded-xl bg-white border border-ivory-border text-charcoal hover:bg-ivory transition-colors flex items-center gap-1.5 text-xs font-bold shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Pulse Hub</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-sage" />
              <h1 className="text-base font-bold text-charcoal tracking-tight">
                {channel.name}
              </h1>
              <Badge variant="sage" size="sm">
                {channel.category}
              </Badge>
            </div>
            <p className="text-xs text-charcoal-muted mt-0.5">{channel.topic}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-muted">
          <Users className="w-4 h-4 text-sage" />
          <span>{channel.membersCount} active agents</span>
        </div>
      </div>

      {/* Pinned "Needs your input" Action Card */}
      {channel.pinnedAction && (
        <div className="p-4 bg-gold-light/60 border-b border-gold-border/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-gold text-white shrink-0 mt-0.5 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-gold-text">
                  Needs Your Decision
                </span>
                <span className="text-xs text-charcoal-muted">•</span>
                <button
                  type="button"
                  onClick={() => openLeadModal(channel.pinnedAction!.leadId)}
                  className="text-xs font-bold text-charcoal hover:text-sage flex items-center gap-1 underline decoration-dashed"
                >
                  <span>{channel.pinnedAction.leadName}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <h4 className="text-xs font-bold text-charcoal mt-0.5">
                {channel.pinnedAction.title}
              </h4>
              <p className="text-[11px] text-charcoal-muted leading-relaxed mt-0.5">
                {channel.pinnedAction.description}
              </p>
            </div>
          </div>

          {/* Functional Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            {channel.pinnedAction.resolved ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{channel.pinnedAction.resolutionText}</span>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() =>
                    handlePinnedAction(channel.id, channel.pinnedAction!.secondaryButton.actionId)
                  }
                  className="px-3 py-2 rounded-xl bg-white border border-gold-border text-xs font-bold text-charcoal hover:bg-gold-light transition-colors shadow-2xs active:scale-95"
                >
                  {channel.pinnedAction.secondaryButton.label}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePinnedAction(channel.id, channel.pinnedAction!.primaryButton.actionId)
                  }
                  className="px-4 py-2 rounded-xl bg-forest hover:bg-forest-hover text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                >
                  {channel.pinnedAction.primaryButton.label}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-ivory/30">
        <div className="text-center my-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted px-3 py-1 rounded-full bg-white border border-ivory-border shadow-2xs">
            Today, October 19, 2026
          </span>
        </div>

        {channel.messages.map((msg) => {
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.isCurrentUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <img
                src={msg.senderAvatar}
                alt={msg.senderName}
                className="w-8 h-8 rounded-xl object-cover shrink-0 border border-ivory-border shadow-2xs"
              />

              <div
                className={`flex flex-col max-w-lg ${
                  msg.isCurrentUser ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-xs font-bold text-charcoal">{msg.senderName}</span>
                  {msg.isAi && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sage-light text-sage-text border border-sage-border">
                      AI Agent
                    </span>
                  )}
                  {msg.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-gold-light text-gold-text border border-gold-border">
                      {msg.badge}
                    </span>
                  )}
                  <span className="text-[10px] text-charcoal-muted font-mono">{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    msg.isCurrentUser
                      ? 'bg-forest text-white rounded-tr-none'
                      : msg.isAi
                      ? 'bg-white border border-sage-border/80 text-charcoal rounded-tl-none'
                      : 'bg-white border border-ivory-border text-charcoal rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-6 py-2 bg-ivory-subtle border-t border-ivory-border flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted shrink-0">
          Quick Prompts:
        </span>
        <button
          type="button"
          onClick={() => handleQuickSuggestion('AvaniBot, summarize key objections from today')}
          className="px-2.5 py-1 rounded-lg bg-white border border-ivory-border text-charcoal hover:text-sage text-[11px] font-semibold whitespace-nowrap shadow-2xs"
        >
          Summarize Objections
        </button>
        <button
          type="button"
          onClick={() => handleQuickSuggestion('What is the current talk-track against Talkdesk pricing?')}
          className="px-2.5 py-1 rounded-lg bg-white border border-ivory-border text-charcoal hover:text-sage text-[11px] font-semibold whitespace-nowrap shadow-2xs"
        >
          Talkdesk Rebuttal
        </button>
        <button
          type="button"
          onClick={() => handleQuickSuggestion('Confirming Marcus Vance call moved to 2:30 PM')}
          className="px-2.5 py-1 rounded-lg bg-white border border-ivory-border text-charcoal hover:text-sage text-[11px] font-semibold whitespace-nowrap shadow-2xs"
        >
          Confirm Marcus Time
        </button>
      </div>

      {/* Message Input Field */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t border-ivory-border flex items-center gap-3"
      >
        <button
          type="button"
          className="p-2 text-charcoal-muted hover:text-charcoal hover:bg-ivory rounded-xl transition-colors"
          title="Attach file"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Message #${channel.name} or prompt AvaniBot...`}
          className="flex-1 py-2 px-3 bg-ivory-subtle border border-ivory-border rounded-xl text-xs font-medium text-charcoal placeholder-charcoal-muted/70 focus:outline-none focus:border-sage"
        />

        <button
          type="button"
          className="p-2 text-charcoal-muted hover:text-charcoal hover:bg-ivory rounded-xl transition-colors"
          title="Emoji"
        >
          <Smile className="w-4 h-4" />
        </button>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-sage hover:bg-sage-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
