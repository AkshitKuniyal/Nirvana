import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { AudioPlayerModal } from './components/common/AudioPlayerModal';
import { OnboardingModal } from './components/common/OnboardingModal';
import { SettingsPrivacyModal } from './components/common/SettingsPrivacyModal';

// Views
import { LandingView } from './components/landing/LandingView';
import { AuthView } from './components/auth/AuthView';
import { HomeView } from './components/home/HomeView';
import { CompanionView } from './components/companion/CompanionView';
import { JournalView } from './components/journal/JournalView';
import { WellnessView } from './components/wellness/WellnessView';
import { GitaView } from './components/gita/GitaView';
import { InsightsView } from './components/insights/InsightsView';
import { MemoryView } from './components/memory/MemoryView';

export interface NirvanaUser {
  name: string;
  email: string;
  isGuest?: boolean;
}

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<NirvanaUser | null>(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [spiritualEnabled, setSpiritualEnabled] = useState(true);

  // Check saved session on mount
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem('nirvana_user');
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        setCurrentUser(parsed);
      }
      const hasVisited = localStorage.getItem('nirvana_has_visited');
      if (hasVisited) {
        setCurrentView('home');
      }
    } catch (e) {
      console.log('Session load error:', e);
    }
  }, []);

  const handleEnterFromLanding = () => {
    const hasOnboarded = localStorage.getItem('nirvana_onboarded');
    if (!hasOnboarded) {
      setIsOnboardingOpen(true);
    } else {
      setCurrentView('home');
    }
  };

  const handleGoToAuth = () => {
    setCurrentView('auth');
  };

  const handleAuthSuccess = (user: NirvanaUser) => {
    setCurrentUser(user);
    const hasOnboarded = localStorage.getItem('nirvana_onboarded');
    if (!hasOnboarded) {
      setIsOnboardingOpen(true);
    } else {
      setCurrentView('home');
    }
  };

  const handleCompleteOnboarding = (prefs: any) => {
    localStorage.setItem('nirvana_has_visited', 'true');
    localStorage.setItem('nirvana_onboarded', 'true');
    if (prefs.spiritual_guidance_enabled !== undefined) {
      setSpiritualEnabled(prefs.spiritual_guidance_enabled);
    }
    setIsOnboardingOpen(false);
    setCurrentView('home');
  };

  const handleSignOut = () => {
    localStorage.removeItem('nirvana_user');
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleDataPurged = () => {
    localStorage.clear();
    setCurrentUser(null);
    setIsSettingsOpen(false);
    setCurrentView('landing');
  };

  const isPublicPage = currentView === 'landing' || currentView === 'auth';

  return (
    <ThemeProvider>
      <div
        className={`flex flex-col selection:bg-indigo-100 selection:text-indigo-900 ${currentView === 'companion' ? 'h-screen overflow-hidden' : 'min-h-screen'}`}
        style={{ background: "var(--bg-base)", color: "var(--text-primary)", transition: "background 0.4s ease, color 0.4s ease" }}
      >
      
      {/* Floating Pill Navbar (shown on all sanctuary views) */}
      {!isPublicPage && (
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          openAudioModal={() => setIsAudioModalOpen(true)}
          openSettings={() => setIsSettingsOpen(true)}
          isAudioPlaying={isAudioPlaying}
          currentUser={currentUser}
          onSignOut={handleSignOut}
        />
      )}

      {/* Main Viewport Container */}
      <main className={currentView === 'companion' ? 'flex-1 w-full overflow-hidden' : 'flex-1 w-full pb-16'}>
        {currentView === 'landing' && (
          <LandingView 
            onEnter={handleEnterFromLanding}
            onGoToAuth={handleGoToAuth}
          />
        )}
        {currentView === 'auth' && (
          <AuthView
            onSuccess={handleAuthSuccess}
            onBackToLanding={() => setCurrentView('landing')}
          />
        )}
        {currentView === 'home' && (
          <HomeView
            onNavigate={(view) => setCurrentView(view)}
            openAudioModal={() => setIsAudioModalOpen(true)}
            userName={currentUser?.name}
          />
        )}
        {currentView === 'companion' && (
          <CompanionView
            onNavigate={(view) => setCurrentView(view)}
            openAudioModal={() => setIsAudioModalOpen(true)}
          />
        )}
        {currentView === 'journal' && <JournalView />}
        {currentView === 'wellness' && <WellnessView />}
        {currentView === 'gita' && <GitaView />}
        {currentView === 'insights' && <InsightsView />}
        {currentView === 'memory' && <MemoryView />}
      </main>

      {/* Ambient Audio Controller Modal */}
      <AudioPlayerModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        isAudioPlaying={isAudioPlaying}
        setIsAudioPlaying={setIsAudioPlaying}
      />

      {/* Settings & Privacy Modal */}
      <SettingsPrivacyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        spiritualEnabled={spiritualEnabled}
        setSpiritualEnabled={setSpiritualEnabled}
        onDataPurged={handleDataPurged}
        currentUser={currentUser}
      />

      {/* First-Time Gentle Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleCompleteOnboarding}
      />

      </div>
    </ThemeProvider>
  );
};

export default App;
