
import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ContextScreen } from './components/ContextScreen';
import { ChatScreen } from './components/ChatScreen';
import { AuthScreen } from './components/AuthScreen';
import { RoutineGenerator } from './components/RoutineGenerator';
import { LandingScreen } from './components/LandingScreen';
import { UserProfile, AppState, ClassLevel, GroupType } from './types';
import { initAuth, saveUserProfileToDB } from './services/firebase';
import { Loader2, MessageCircle, CalendarClock, GraduationCap, Menu, PanelLeftClose, ChevronLeft } from 'lucide-react';

type TabType = 'tutor' | 'routine';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.AUTH);
  const [activeTab, setActiveTab] = useState<TabType>('tutor');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  
  const [user, setUser] = useState<UserProfile>({
    id: '',
    email: '',
    name: '',
    classLevel: ClassLevel.CLASS_6, // Default
    group: GroupType.NONE,
  });

  // Initialize Auth Check
  useEffect(() => {
    const unsubscribe = initAuth(
      (savedUser) => {
        setUser(savedUser);
        setAppState(AppState.CONTEXT);
        setIsLoading(false);
      },
      () => {
        setAppState(AppState.LANDING); // Default to LANDING instead of AUTH
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Auto-close sidebar on mobile on load
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const handleAuthSuccess = (loggedInUser: UserProfile, isNewUser: boolean) => {
      setUser(loggedInUser);
      if (isNewUser) {
          setAppState(AppState.WELCOME);
      } else {
          setAppState(AppState.CONTEXT);
      }
  };

  const goToContext = () => {
    let updatedUser = { ...user };
    if ([ClassLevel.CLASS_6, ClassLevel.CLASS_7, ClassLevel.CLASS_8].includes(user.classLevel)) {
      updatedUser.group = GroupType.NONE;
    } else if (updatedUser.group === GroupType.NONE) {
        updatedUser.group = GroupType.SCIENCE; 
    }
    
    setUser(updatedUser);
    saveUserProfileToDB(updatedUser);
    setAppState(AppState.CONTEXT);
  };

  const startChat = () => {
    if (user.subject) {
      setAppState(AppState.CHAT);
      if (window.innerWidth < 768) setIsSidebarOpen(false); // Auto close on chat start (mobile)
    }
  };

  const resetToContext = () => {
    setAppState(AppState.CONTEXT);
  };

  const resetToWelcome = () => {
    setAppState(AppState.WELCOME);
  };

  // Navigation Helpers for Landing/Auth
  const handleLandingLogin = () => {
      setAuthView('login');
      setAppState(AppState.AUTH);
  };

  const handleLandingSignup = () => {
      setAuthView('signup');
      setAppState(AppState.AUTH);
  };

  const handleBackToLanding = () => {
      setAppState(AppState.LANDING);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-lg font-medium animate-pulse">লোড হচ্ছে...</p>
      </div>
    );
  }

  const isMainApp = appState === AppState.CONTEXT || appState === AppState.CHAT;

  // Sidebar Item Component
  const SidebarItem = ({ id, label, icon: Icon }: { id: TabType, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group mb-2 ${
        activeTab === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
          : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
      }`}
    >
      <div className={`p-2 rounded-lg transition-colors flex-shrink-0 ${activeTab === id ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-white'}`}>
        <Icon className="w-5 h-5" />
      </div>
      {isSidebarOpen && <span className="font-bold text-sm animate-fade-in whitespace-nowrap">{label}</span>}
    </button>
  );

  return (
    <div className="font-sans text-gray-900 h-[100dvh] w-screen flex overflow-hidden bg-gray-900 relative">
       {/* Background Elements - More Vibrant now */}
       <div className="fixed inset-0 pointer-events-none z-0">
          {/* Using CSS Gradient matching body for seamless look */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#667eea] to-[#764ba2]" />
          {/* Subtle noise or texture could go here */}
          <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-purple-500/30 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-indigo-500/30 blur-[120px] rounded-full pointer-events-none" />
       </div>

      {/* PUBLIC SCREENS (Landing, Auth, Welcome) */}
      {(!isMainApp) && (
        <div className="flex-1 relative z-10 overflow-y-auto flex flex-col h-full">
          {appState === AppState.LANDING && <LandingScreen onLogin={handleLandingLogin} onSignup={handleLandingSignup} />}
          {appState === AppState.AUTH && <AuthScreen onAuthSuccess={handleAuthSuccess} onBack={handleBackToLanding} initialView={authView} />}
          {appState === AppState.WELCOME && <WelcomeScreen user={user} setUser={setUser} onNext={goToContext} />}
        </div>
      )}

      {/* MAIN APP LAYOUT */}
      {isMainApp && (
        <div className="flex-1 flex h-full relative z-10 overflow-hidden">
          
          {/* SIDEBAR */}
          <aside 
            className={`
              ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'} 
              bg-white/90 backdrop-blur-2xl border-r border-white/50 flex flex-col py-4 z-50 shadow-2xl transition-all duration-300 ease-in-out
              absolute md:relative h-full
            `}
          >
            {/* Branding */}
            <div className={`px-4 mb-6 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} overflow-hidden`}>
                <div className={`flex items-center gap-3 ${!isSidebarOpen && 'hidden md:flex'}`}>
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg shrink-0">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    {isSidebarOpen && (
                      <div className="animate-fade-in min-w-0">
                        <h1 className="font-bold text-xl text-indigo-950 leading-none truncate">Shikkhok</h1>
                        <span className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase">AI Tutor</span>
                      </div>
                    )}
                </div>
                
                {/* Mobile Close Button */}
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="md:hidden p-1.5 bg-gray-100 rounded-lg text-gray-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 overflow-y-auto overflow-x-hidden">
               <SidebarItem id="tutor" label="AI টিউটর" icon={MessageCircle} />
               <SidebarItem id="routine" label="আমার রুটিন" icon={CalendarClock} />
            </nav>

            {/* User Mini Profile (Bottom of Sidebar) */}
            <div className="p-3 mt-auto border-t border-gray-100 overflow-hidden">
                <div className={`flex items-center gap-3 p-2 rounded-xl bg-indigo-50/50 border border-indigo-100 ${!isSidebarOpen && 'justify-center'}`}>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold shadow-inner flex-shrink-0">
                        {user.name.charAt(0)}
                    </div>
                    {isSidebarOpen && (
                      <div className="overflow-hidden min-w-0 animate-fade-in">
                          <p className="font-bold text-sm text-gray-800 truncate">{user.name}</p>
                          <p className="text-[10px] text-gray-500 truncate uppercase tracking-wide">{user.classLevel}</p>
                      </div>
                    )}
                </div>
            </div>
          </aside>

          {/* CONTENT AREA */}
          <main className="flex-1 flex flex-col h-full relative overflow-hidden transition-all duration-300">
            
            {/* Header Bar (Includes Toggle) */}
            <div className="w-full h-16 flex items-center justify-between px-4 md:px-6 z-40 shrink-0">
               <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-md transition-all shadow-sm border border-white/20"
                  >
                    {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                  
                  {/* Breadcrumb / Title could go here */}
                  {!isSidebarOpen && (
                    <div className="flex items-center gap-2 text-white font-bold animate-fade-in">
                       <GraduationCap className="w-5 h-5" />
                       <span>Shikkhok AI</span>
                    </div>
                  )}
               </div>
            </div>

            {/* Scrollable Content Wrapper */}
            <div className="flex-1 overflow-y-auto scroll-smooth relative w-full">
               {activeTab === 'tutor' ? (
                 <>
                    {appState === AppState.CONTEXT && (
                      <ContextScreen 
                        user={user} 
                        setUser={setUser} 
                        onStart={startChat} 
                        onBack={resetToWelcome}
                      />
                    )}
                    {appState === AppState.CHAT && (
                      <ChatScreen user={user} onExit={resetToContext} />
                    )}
                 </>
               ) : (
                 <div className="h-full overflow-y-auto">
                   <RoutineGenerator user={user} />
                 </div>
               )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
