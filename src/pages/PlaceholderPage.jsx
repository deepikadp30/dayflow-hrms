import React from 'react';
import { NAVIGATION_ITEMS } from '../constants/navigation';
import { Sparkles, Layers, ShieldCheck, ArrowRight } from 'lucide-react';

export default function PlaceholderPage({ activeTab, currentRole }) {
  const activeNav = NAVIGATION_ITEMS.find(item => item.id === activeTab) || NAVIGATION_ITEMS[0];
  const Icon = activeNav.icon;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{activeNav.label}</h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Phase 1 Shell
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{activeNav.description}</p>
          </div>
        </div>

        {/* Current Active Role Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <span className="text-slate-400">Active View Context:</span>
          <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
            currentRole === 'admin' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
          }`}>
            {currentRole === 'admin' ? 'Admin / HR Mode' : 'Employee Mode'}
          </span>
        </div>
      </div>

      {/* Main Placeholder Container */}
      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-400">
            <Layers className="w-8 h-8 text-brand-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-white">
              {activeNav.label} Feature Module
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              This navigation view is wired into Dayflow's role-aware layout. Full interactive features for <strong className="text-slate-300">{activeNav.label}</strong> will be incrementally enabled in upcoming development phases.
            </p>
          </div>

          {/* Phase status indicator list */}
          <div className="pt-4 border-t border-slate-800/80 text-left space-y-2.5">
            <p className="text-[11px] uppercase font-semibold tracking-wider text-slate-500">
              Module Development Roadmap
            </p>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">Phase 1: Foundation & Layout Shell</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-slate-400">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-slate-500" />
                <span>Phase 2: Smart Quick Actions & Dashboards</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500">UPCOMING</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-slate-400">
              <div className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-slate-500" />
                <span>Phase 3: Smart Employee Snapshot & Analytics</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500">UPCOMING</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
