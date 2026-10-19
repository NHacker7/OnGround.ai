import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Phone,
  HelpCircle,
  Sparkles,
  Calendar,
  CheckCircle2,
  CheckCheck,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCalling } from '../../context/CallingContext';
import { Badge } from '../common/Badge';

interface TopNavProps {
  setMobileOpen: (open: boolean) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ setMobileOpen }) => {
  const {
    leads,
    openLeadModal,
    tasks,
    notifications,
    unreadNotificationCount,
    markAllNotificationsRead,
    markNotificationRead,
    setActiveScreen,
    setActiveChannelId,
  } = useApp();
  const { startCall } = useCalling();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const filteredLeads = searchQuery.trim()
    ? leads.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.phone.includes(searchQuery)
      )
    : [];

  const handleSelectLead = (leadId: string) => {
    openLeadModal(leadId);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleQuickDial = () => {
    if (leads.length > 0) {
      // Pick top urgent lead to dial
      const topLead = leads.find((l) => l.priority === 'Urgent') || leads[0];
      startCall({
        id: topLead.id,
        name: topLead.name,
        company: topLead.company,
        phone: topLead.phone,
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 h-18 bg-ivory/80 backdrop-blur-md border-b border-ivory-border px-4 lg:px-8 flex items-center justify-between">
      {/* Left side: Hamburger + Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-charcoal hover:bg-ivory-subtle lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="text"
              placeholder="Search leads, phone numbers, companies..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-ivory-border rounded-2xl text-xs font-medium text-charcoal placeholder-charcoal-muted/70 focus:outline-none focus:border-sage shadow-2xs"
            />
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-ivory-border rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
              <div className="p-2 border-b border-ivory-border bg-ivory-subtle text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">
                Matching Leads ({filteredLeads.length})
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => handleSelectLead(lead.id)}
                      className="p-3 hover:bg-ivory cursor-pointer flex items-center justify-between border-b border-ivory-border/50 last:border-none"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={lead.avatar}
                          alt={lead.name}
                          className="w-8 h-8 rounded-xl object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-charcoal">{lead.name}</p>
                          <p className="text-[11px] text-charcoal-muted">
                            {lead.company} • {lead.phone}
                          </p>
                        </div>
                      </div>
                      <Badge variant="sage" size="sm">
                        {lead.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-charcoal-muted">
                    No leads found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Quick Call Action + Date + Notifications */}
      <div className="flex items-center gap-3">
        {/* Quick Call Action */}
        <button
          type="button"
          onClick={handleQuickDial}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sage hover:bg-sage-hover text-white text-xs font-bold shadow-sm transition-all active:scale-95"
        >
          <Phone className="w-3.5 h-3.5 fill-white" />
          <span>Priority Dial</span>
        </button>

        {/* Date Display */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-ivory-border text-xs font-semibold text-charcoal shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-sage" />
          <span>Monday, Oct 19, 2026</span>
        </div>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative p-2.5 rounded-xl bg-white border border-ivory-border text-charcoal hover:bg-ivory transition-colors shadow-2xs group"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-charcoal group-hover:text-forest transition-colors" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-forest-dark font-extrabold text-[10px] flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-75">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Invisible Backdrop to close on outside click */}
          {notificationsOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setNotificationsOpen(false)}
            />
          )}

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-84 sm:w-92 bg-white border border-ivory-border rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
              {/* Dropdown Header */}
              <div className="p-3.5 bg-ivory-subtle border-b border-ivory-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-charcoal">Activity & Alerts</span>
                  {unreadNotificationCount > 0 ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gold-light text-gold-text border border-gold-border">
                      {unreadNotificationCount} new
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-charcoal-muted">All read</span>
                  )}
                </div>

                {/* Mark All Read Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    markAllNotificationsRead();
                  }}
                  disabled={unreadNotificationCount === 0}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    unreadNotificationCount > 0
                      ? 'text-sage hover:text-white hover:bg-sage active:scale-95 cursor-pointer shadow-2xs'
                      : 'text-charcoal-muted/50 cursor-not-allowed opacity-60'
                  }`}
                  title="Mark all notifications as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              </div>

              {/* Notification Items List */}
              <div className="divide-y divide-ivory-border text-xs max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.leadId) {
                          openLeadModal(notif.leadId);
                        } else if (notif.actionScreen === 'pulse-channel') {
                          if (notif.actionChannelId) {
                            setActiveChannelId(notif.actionChannelId);
                          }
                          setActiveScreen('pulse-channel');
                        } else if (notif.actionScreen) {
                          setActiveScreen(notif.actionScreen);
                        }
                        setNotificationsOpen(false);
                      }}
                      className={`p-3.5 transition-colors cursor-pointer group relative ${
                        !notif.read
                          ? 'bg-white hover:bg-ivory/70'
                          : 'bg-ivory-subtle/30 hover:bg-ivory-subtle text-charcoal-muted'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-[11px] mb-0.5">
                          {!notif.read ? (
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                notif.priority === 'urgent'
                                  ? 'bg-red-500 animate-pulse'
                                  : notif.priority === 'gold'
                                  ? 'bg-gold animate-pulse'
                                  : 'bg-sage'
                              }`}
                            />
                          ) : (
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          )}
                          <span
                            className={
                              !notif.read
                                ? notif.priority === 'urgent'
                                  ? 'text-red-600'
                                  : notif.priority === 'gold'
                                  ? 'text-gold-text'
                                  : 'text-sage'
                                : 'text-charcoal-muted'
                            }
                          >
                            {notif.title}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-charcoal-muted shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>

                      <p
                        className={`text-xs mt-0.5 leading-snug ${
                          !notif.read ? 'font-semibold text-charcoal' : 'text-charcoal-muted'
                        }`}
                      >
                        {notif.message}
                      </p>

                      {notif.value && (
                        <span className="inline-block mt-1.5 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Deal Value: {notif.value}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-charcoal-muted">
                    No notifications at this time.
                  </div>
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="p-2.5 bg-ivory-subtle border-t border-ivory-border text-center text-[10px] text-charcoal-muted font-medium">
                {unreadNotificationCount === 0
                  ? '✓ All alerts marked as read'
                  : `${unreadNotificationCount} unread alert${unreadNotificationCount === 1 ? '' : 's'}`}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
