import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import PlaceholderPage from './pages/PlaceholderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Loader2, Sparkles } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRegisterView, setIsRegisterView] = useState(false);

  // Show loading indicator during initial auth check
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 font-sans text-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/30 animate-pulse">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
          <span>Authenticating Dayflow session...</span>
        </div>
      </div>
    );
  }

  // Render Login or Register view if unauthenticated
  if (!isAuthenticated) {
    return isRegisterView ? (
      <RegisterPage onSwitchToLogin={() => setIsRegisterView(false)} />
    ) : (
      <LoginPage onSwitchToRegister={() => setIsRegisterView(true)} />
    );
  }

  // Render Protected Application Layout when authenticated
  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <PlaceholderPage activeTab={activeTab} />
    </MainLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
