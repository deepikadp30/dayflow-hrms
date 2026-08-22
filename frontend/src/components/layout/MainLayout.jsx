import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function MainLayout({ 
  currentRole, 
  onRoleChange, 
  activeTab, 
  onTabChange, 
  children 
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header 
        currentRole={currentRole}
        onRoleChange={onRoleChange}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />

      <div className="flex flex-1 relative">
        {/* Left Sidebar */}
        <Sidebar 
          activeTab={activeTab}
          onTabChange={onTabChange}
          currentRole={currentRole}
          isCollapsed={isSidebarCollapsed}
        />

        {/* Main Content Area */}
        <main 
          className={`flex-1 transition-all duration-300 p-6 ${
            isSidebarCollapsed ? 'ml-16' : 'ml-64'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
