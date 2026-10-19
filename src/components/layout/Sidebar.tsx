import React from 'react';
import {
  LayoutDashboard,
  PhoneCall,
  PhoneIncoming,
  History,
  CalendarDays,
  Sparkles,
  Radio,
  Sliders,
  LogOut,
  ChevronRight,
  Headphones,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenId } from '../../types';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeScreen, setActiveScreen, incomingCalls, pulseChannels } = useApp();

  const totalUnreadIncoming = incomingCalls.filter((c) => c.status === 'pending').length;
  const totalUnreadPulse = pulseChannels.reduce((sum, c) => sum + c.unreadCount, 0);

  const navItems: { id: ScreenId; label: string; icon: any; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calls', label: 'Calls to Make', icon: PhoneCall, badge: 8 },
    { id: 'incoming', label: 'Incoming', icon: PhoneIncoming, badge: totalUnreadIncoming > 0 ? totalUnreadIncoming : undefined },
    { id: 'recent', label: 'Recent Calls', icon: History },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'pulse', label: 'Pulse Intelligence', icon: Sparkles, badge: totalUnreadPulse > 0 ? `${totalUnreadPulse} new` : 'AI' },
  ];

  const handleNavClick = (screen: ScreenId) => {
    setActiveScreen(screen);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-forest-dark/70 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-forest text-ivory flex flex-col justify-between border-r border-forest-border transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div>
          <div className="h-18 px-6 flex items-center gap-3 border-b border-forest-border/80">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sage to-forest-light flex items-center justify-center shadow-md border border-emerald-500/30">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  On-Ground<span className="text-gold-light">.ai</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-md bg-forest-border text-emerald-300">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">Enterprise Telephony Hub</p>
            </div>
          </div>

          {/* Telephony Carrier Status Bar */}
          <div className="mx-4 my-3 px-3.5 py-2 rounded-xl bg-forest-surface border border-forest-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-200 font-medium text-[11px]">SIP Voice Engine</span>
            </div>
            <span className="text-[10px] font-mono text-gray-400">99.99%</span>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id || (item.id === 'pulse' && activeScreen === 'pulse-channel');

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    isActive
                      ? 'bg-sage text-white shadow-sm font-bold'
                      : 'text-gray-300 hover:bg-forest-hover hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-emerald-300/80 group-hover:text-white'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : typeof item.badge === 'string' && item.badge.includes('new')
                          ? 'bg-gold text-forest-dark font-extrabold'
                          : 'bg-forest-border text-emerald-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer User Profile & System Info */}
        <div className="p-4 border-t border-forest-border/80 bg-forest-surface/40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
                alt="Alex Chen"
                className="w-10 h-10 rounded-xl object-cover border border-forest-border"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-forest rounded-full" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">Alex Chen</h4>
              <p className="text-[11px] text-gray-400 truncate">Senior Account Executive</p>
            </div>

            <button
              type="button"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-forest-hover transition-colors"
              title="Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
