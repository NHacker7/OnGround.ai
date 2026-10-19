import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CallingProvider } from './context/CallingContext';
import { Shell } from './components/layout/Shell';

import { Dashboard } from './pages/Dashboard';
import { CallsToMake } from './pages/CallsToMake';
import { IncomingCalls } from './pages/IncomingCalls';
import { RecentCalls } from './pages/RecentCalls';
import { CalendarView } from './pages/CalendarView';
import { PulseHome } from './pages/PulseHome';
import { PulseChannel } from './pages/PulseChannel';
import { ProfileSettings } from './pages/ProfileSettings';
import { PracticeCall } from './pages/PracticeCall';

const ScreenRouter: React.FC = () => {
  const { activeScreen } = useApp();

  switch (activeScreen) {
    case 'dashboard':
    case 'plan':
      return <Dashboard />;
    case 'calls':
      return <CallsToMake />;
    case 'incoming':
      return <IncomingCalls />;
    case 'recent':
      return <RecentCalls />;
    case 'practice':
      return <PracticeCall />;
    case 'calendar':
      return <CalendarView />;
    case 'pulse':
      return <PulseHome />;
    case 'pulse-channel':
      return <PulseChannel />;
    case 'profile':
      return <ProfileSettings />;
    default:
      return <Dashboard />;
  }
};

const AppContent: React.FC = () => {
  const { addCallRecord } = useApp();

  return (
    <CallingProvider onCallCompleted={addCallRecord}>
      <Shell>
        <ScreenRouter />
      </Shell>
    </CallingProvider>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
