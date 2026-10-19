import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Star,
  CheckCheck,
  Check,
  X,
  Phone,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TopNavProps {
  setMobileOpen: (open: boolean) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ setMobileOpen }) => {
  const {
    leads,
    openLeadModal,
    notifications,
    unreadNotificationCount,
    markAllNotificationsRead,
    markNotificationRead,
    setActiveScreen,
    setActiveChannelId,
    userProfile,
  } = useApp();

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

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#0B2B20] text-white border-b border-[#082218] px-4 lg:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile hamburger + OG logo + Compact Search */}
      <div className="flex items-center gap-3.5 flex-1 max-w-xl">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand pill */}
        <div className="flex items-center gap-2 select-none">
          <span className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-[11px] flex items-center justify-center">
            OG
          </span>
          <span className="font-bold text-sm text-white tracking-tight hidden sm:inline">
            On-Ground<span className="text-emerald-400">.ai</span>
          </span>
        </div>

        {/* Compact Search Bar */}
        <div className="relative w-full max-w-xs ml-2">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search leads, calls, Pulse..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#082218] border border-[#144232] rounded-xl text-xs text-white placeholder-gray-400 focus:outline-hidden focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Search Dropdown */}
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white text-charcoal border border-ivory-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
              <div className="p-2 bg-ivory-subtle border-b border-ivory-border text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                Matching Leads ({filteredLeads.length})
              </div>
              <div className="max-h-56 overflow-y-auto divide-y divide-ivory-border/60">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => handleSelectLead(lead.id)}
                      className="p-2.5 hover:bg-ivory cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-charcoal">{lead.name}</p>
                        <p className="text-[10px] text-charcoal-muted">
                          {lead.company} · {lead.phone}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {lead.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-charcoal-muted">
                    No leads found for "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Notifications + Streak / Points + User Avatar */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative p-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white font-extrabold text-[9px] flex items-center justify-center border border-[#0B2B20]">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white text-charcoal border border-ivory-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                <div className="p-3 bg-ivory-subtle border-b border-ivory-border flex items-center justify-between">
                  <span className="text-xs font-bold text-charcoal">Activity & Alerts</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      markAllNotificationsRead();
                    }}
                    disabled={unreadNotificationCount === 0}
                    className="text-[11px] font-bold text-emerald-700 hover:underline disabled:opacity-40 disabled:no-underline"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-ivory-border/60 text-xs">
                  {notifications.map((notif) => (
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
                      className={`p-3 cursor-pointer hover:bg-ivory/60 transition-colors ${
                        !notif.read ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[11px] text-charcoal">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-charcoal-muted font-mono">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal-muted mt-0.5 leading-snug">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Streak & Points Badge (from Screenshot) */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#082218] border border-[#144232] text-xs font-bold">
          <span className="text-emerald-300">76</span>
          <span className="text-gray-500">·</span>
          <span className="text-amber-300 flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-300" />
            13
          </span>
        </div>

        {/* User Avatar (Clickable for Profile & Settings) */}
        <button
          type="button"
          onClick={() => setActiveScreen('profile')}
          className="relative p-0.5 rounded-full hover:ring-2 hover:ring-emerald-400 transition-all active:scale-95"
          title={`${userProfile.name} · Profile & Settings`}
        >
          <div className="w-7 h-7 rounded-full bg-emerald-600 border border-emerald-400 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {userProfile.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border border-[#0B2B20]" />
        </button>
      </div>
    </header>
  );
};
