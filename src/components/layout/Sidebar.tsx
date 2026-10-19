import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  PhoneCall,
  PhoneIncoming,
  History,
  CalendarDays,
  Sparkles,
  Headphones,
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenId } from '../../types';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeScreen, setActiveScreen, incomingCalls, pulseChannels, userProfile } = useApp();

  const totalUnreadIncoming = incomingCalls.filter((c) => c.status === 'pending').length;
  const totalUnreadPulse = pulseChannels.reduce((sum, c) => sum + c.unreadCount, 0);

  const navItems: { id: ScreenId; label: string; icon: any; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'plan', label: 'Plan', icon: CalendarCheck },
    { id: 'calls', label: 'Calls to make', icon: PhoneCall, badge: 5 },
    { id: 'incoming', label: 'Incoming', icon: PhoneIncoming, badge: totalUnreadIncoming > 0 ? totalUnreadIncoming : undefined },
    { id: 'recent', label: 'Recent', icon: History },
    { id: 'practice', label: 'Practise a call', icon: Headphones },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'pulse', label: 'Pulse', icon: Sparkles, badge: totalUnreadPulse > 0 ? `${totalUnreadPulse} new` : undefined },
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-56 bg-[#082218] text-white flex flex-col justify-between border-r border-[#0d3326] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo / Brand Header */}
          <div className="h-14 px-5 flex items-center gap-2.5 border-b border-[#0d3326]">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-extrabold text-xs">
              OG
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white">
                On-Ground<span className="text-emerald-400">.ai</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isPulse = item.id === 'pulse';
              const isActive =
                activeScreen === item.id ||
                (isPulse && activeScreen === 'pulse-channel');

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? isPulse
                        ? 'bg-purple-800 text-white font-bold shadow-xs'
                        : 'bg-[#144b36] text-white font-bold shadow-xs'
                      : 'text-gray-300 hover:bg-[#0f3829] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                        isActive
                          ? isPulse
                            ? 'text-purple-200'
                            : 'text-emerald-300'
                          : 'text-gray-400 group-hover:text-gray-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : isPulse
                          ? 'bg-purple-400/20 text-purple-200'
                          : 'bg-emerald-500/20 text-emerald-300'
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

        {/* Footer: User Profile link */}
        <div className="p-3 border-t border-[#0d3326]">
          <button
            type="button"
            onClick={() => handleNavClick('profile')}
            className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all text-left ${
              activeScreen === 'profile'
                ? 'bg-[#144b36] text-white'
                : 'hover:bg-[#0f3829] text-gray-300'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-700 border border-emerald-500/40 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {userProfile.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{userProfile.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{userProfile.title}</p>
            </div>
            <Settings className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </aside>
    </>
  );
};
