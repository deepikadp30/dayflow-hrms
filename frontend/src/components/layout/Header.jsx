import React from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Shield, 
  User, 
  Sparkles, 
  ChevronDown 
} from 'lucide-react';

export default function Header({ 
  currentRole, 
  onRoleChange, 
  isSidebarCollapsed, 
  onToggleSidebar 
}) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between transition-all">
      {/* Left side: Menu toggle & Brand */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">Dayflow</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                HRMS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Search placeholder */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            readOnly
            placeholder="Quick search & actions... (Ctrl + K preview)"
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-12 py-1.5 text-xs text-slate-300 placeholder-slate-500 focus:outline-none cursor-pointer hover:border-slate-700 transition-colors"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right side: Role Switcher & User Avatar */}
      <div className="flex items-center space-x-3">
        {/* Role Switcher Toggle */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onRoleChange('employee')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
              currentRole === 'employee'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Employee</span>
          </button>
          
          <button
            onClick={() => onRoleChange('admin')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
              currentRole === 'admin'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin / HR</span>
          </button>
        </div>

        {/* Notification Bell Icon */}
        <button 
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-medium text-xs text-slate-200">
            {currentRole === 'admin' ? 'SJ' : 'AM'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">
              {currentRole === 'admin' ? 'Sarah Jenkins' : 'Alex Morgan'}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              {currentRole === 'admin' ? 'HR Director' : 'Senior Developer'}
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
