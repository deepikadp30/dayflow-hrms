import React from 'react';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';
import { Shield, UserCheck, ChevronRight } from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange, isCollapsed }) {
  const { user } = useAuth();

  const userRole = user?.role || 'EMPLOYEE';
  const isAdmin = userRole === 'ADMIN' || user?.is_admin_hr;

  // Filter navigation items based on actual authenticated backend role
  const filteredNavItems = NAVIGATION_ITEMS.filter(item => 
    item.roles.includes('all') || item.roles.includes(userRole)
  );

  return (
    <aside 
      className={`fixed left-0 top-16 bottom-0 z-20 bg-slate-900/90 border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation list */}
      <div className="py-4 px-2 space-y-1 overflow-y-auto flex-1">
        <div className={`px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider ${isCollapsed ? 'sr-only' : 'block'}`}>
          Navigation ({isAdmin ? 'Admin View' : 'Employee View'})
        </div>

        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-xl transition-all group relative ${
                isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5 space-x-3'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600/20 to-indigo-600/20 text-brand-400 font-medium border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-brand-500 rounded-r-full shadow-lg shadow-brand-500/50"></div>
              )}

              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
              }`} />

              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1 text-left">
                  <span className="text-xs truncate">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-400" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer Role Badge */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className={`flex items-center rounded-xl p-2 bg-slate-900 border border-slate-800 ${
          isCollapsed ? 'justify-center' : 'space-x-3'
        }`}>
          <div className={`p-1.5 rounded-lg ${
            isAdmin ? 'bg-indigo-500/20 text-indigo-400' : 'bg-brand-500/20 text-brand-400'
          }`}>
            {isAdmin ? <Shield className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          </div>
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-slate-200 truncate">
                {isAdmin ? 'Administrator' : 'Employee Access'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                Connected to DRF API
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
