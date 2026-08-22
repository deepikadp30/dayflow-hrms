import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, 
  User, 
  ShieldCheck, 
  Key, 
  Monitor, 
  CheckCircle2, 
  Building2, 
  Calendar
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Banner */}
      <div className="flex items-center space-x-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 shadow-xl">
        <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
          <Settings className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">System Settings & Preferences</h1>
          <p className="text-xs text-slate-400 mt-1">
            Account identity, authentication security, and platform preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Identity Card */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <User className="w-4 h-4 text-brand-400" />
            <span>Account Profile</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold">Username</span>
              <p className="text-white font-bold text-sm mt-0.5">{user?.username}</p>
            </div>

            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold">Email Address</span>
              <p className="text-slate-200 font-mono mt-0.5">{user?.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Role</span>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  user?.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {user?.role}
                </span>
              </div>

              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Department</span>
                <p className="text-slate-200 mt-0.5">{user?.department || 'Unassigned'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security & System Info */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <span>System Information</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold">Authentication Mode</span>
              <p className="text-emerald-400 font-mono font-semibold flex items-center space-x-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>JWT Bearer Token (Stateless)</span>
              </p>
            </div>

            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold">Theme Architecture</span>
              <p className="text-slate-200 mt-0.5">Modern Glassmorphism Dark Theme</p>
            </div>

            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold">Platform Build</span>
              <p className="text-slate-400 font-mono mt-0.5">Dayflow HRMS v1.0.0 (Phases 1-8 Complete)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
