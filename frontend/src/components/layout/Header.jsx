import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, 
  Search, 
  Bell, 
  Shield, 
  User, 
  Sparkles, 
  ChevronDown,
  LogOut
} from 'lucide-react';

export default function Header({ isSidebarCollapsed, onToggleSidebar }) {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getInitials = () => {
    if (!user) return 'DF';
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.username ? user.username.slice(0, 2).toUpperCase() : 'DF';
  };

  const displayName = () => {
    if (!user) return 'User';
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.username;
  };

  const isAdmin = user?.role === 'ADMIN' || user?.is_admin_hr;

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
            placeholder="Quick search & actions..."
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-12 py-1.5 text-xs text-slate-300 placeholder-slate-500 focus:outline-none cursor-pointer hover:border-slate-700 transition-colors"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right side: Authenticated User Badge & Menu */}
      <div className="flex items-center space-x-3">
        {/* Role Badge Indicator */}
        <div className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 ${
          isAdmin
            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
            : 'bg-brand-500/10 border-brand-500/30 text-brand-400'
        }`}>
          {isAdmin ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
          <span>{isAdmin ? 'Admin / HR' : 'Employee'}</span>
        </div>

        {/* Notifications Icon */}
        <button 
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative border-l border-slate-800 pl-3">
          <button
            onClick={() => setShowProfileMenu(prev => !prev)}
            className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-slate-800/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center font-bold text-xs text-brand-400">
              {getInitials()}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">
                {displayName()}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">
                {user?.department || (isAdmin ? 'HR Administration' : 'Team Member')}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-800/80">
                <p className="text-xs font-bold text-white">{displayName()}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                {user?.employee_id && (
                  <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    ID: {user.employee_id}
                  </span>
                )}
              </div>

              <div className="pt-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center space-x-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
