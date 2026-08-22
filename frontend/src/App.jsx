import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import PlaceholderPage from './pages/PlaceholderPage';
import { NAVIGATION_ITEMS } from './constants/navigation';

export default function App() {
  const [currentRole, setCurrentRole] = useState('admin'); // 'employee' | 'admin'
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    // If switching to employee role and current active tab is admin-only, reset to dashboard
    const currentNavItem = NAVIGATION_ITEMS.find(item => item.id === activeTab);
    if (currentNavItem && !currentNavItem.roles.includes('all') && !currentNavItem.roles.includes(newRole)) {
      setActiveTab('dashboard');
    }
  };

  return (
    <MainLayout
      currentRole={currentRole}
      onRoleChange={handleRoleChange}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <PlaceholderPage 
        activeTab={activeTab} 
        currentRole={currentRole} 
      />
    </MainLayout>
  );
}
