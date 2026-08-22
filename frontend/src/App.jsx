import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import PlaceholderPage from './pages/PlaceholderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeeDirectoryPage from './pages/EmployeeDirectoryPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import MyProfilePage from './pages/MyProfilePage';
import { Loader2, Sparkles } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isRegisterView, setIsRegisterView] = useState(false);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedEmployeeId(null);
  };

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

  // Determine active view content
  const renderContent = () => {
    if (activeTab === 'directory') {
      if (selectedEmployeeId) {
        return (
          <EmployeeDetailPage 
            employeeId={selectedEmployeeId} 
            onBack={() => setSelectedEmployeeId(null)} 
          />
        );
      }
      return (
        <EmployeeDirectoryPage 
          onSelectEmployee={(id) => setSelectedEmployeeId(id)} 
        />
      );
    }

    if (activeTab === 'profile') {
      return <MyProfilePage />;
    }

    return <PlaceholderPage activeTab={activeTab} />;
  };

  // Render Protected Application Layout when authenticated
  return (
    <MainLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
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
