/**
 * Header Component: Ministry of Tribal Affairs Branding & Master Controls
 */

import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  Languages, 
  RefreshCw, 
  PlayCircle, 
  Bell, 
  UserCheck, 
  ChevronDown,
  Info
} from 'lucide-react';
import { store } from '../services/store';
import { User, SupportedLanguage } from '../types';
import { SEED_USERS } from '../data/seedData';
import { getTranslation } from '../utils/i18n';

interface HeaderProps {
  viewMode: 'student' | 'verifier' | 'mobile';
  setViewMode: (mode: 'student' | 'verifier' | 'mobile') => void;
  onOpenNotifications: () => void;
  onOpenConsent: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  onOpenNotifications,
  onOpenConsent
}) => {
  const state = store.getState();
  const unreadNotifs = state.notifications.filter(n => !n.isRead).length;
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  const handleRoleChange = (user: User) => {
    store.setCurrentUser(user);
    if (user.role === 'verifier' || user.role === 'admin') {
      setViewMode('verifier');
    } else {
      if (viewMode === 'verifier') setViewMode('student');
    }
    setShowRoleMenu(false);
  };

  const handleFastForward = async () => {
    setIsDemoRunning(true);
    await store.runFastForwardDemo();
    setIsDemoRunning(false);
  };

  const handleReset = () => {
    store.resetDemoData();
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      {/* Top Ministry Bar */}
      <div className="bg-stone-950 text-stone-300 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-amber-400 tracking-wide">भारत सरकार | GOVERNMENT OF INDIA</span>
          <span className="hidden md:inline text-stone-500">|</span>
          <span className="hidden md:inline text-stone-300">Ministry of Tribal Affairs (MoTA)</span>
          <span className="hidden lg:inline text-stone-500">·</span>
          <span className="hidden lg:inline text-emerald-400 font-medium">SIH 2026: SIH26238 (Smart Automation)</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenConsent}
            className="hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer text-xs"
            title="Privacy & Data Minimization Notice"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">DPDP & Sandbox Disclaimer</span>
          </button>
          
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-stone-800 rounded px-2 py-0.5 border border-stone-700">
            <Languages className="w-3 h-3 text-amber-400" />
            <select
              value={state.language}
              onChange={(e) => store.setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-xs text-stone-200 outline-none cursor-pointer"
            >
              <option value="en" className="bg-stone-800">English</option>
              <option value="hi" className="bg-stone-800">हिन्दी</option>
              <option value="mr" className="bg-stone-800">मराठी</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold text-xl shadow-inner border border-amber-500/40">
            <span>TE</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">TribEd</h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                MoTA Orchestrator
              </span>
            </div>
            <p className="text-xs text-stone-400">
              {getTranslation('portalSub', state.language)}
            </p>
          </div>
        </div>

        {/* View Mode Switcher (Web Student / Admin Queue / Android Flutter App) */}
        <div className="flex items-center bg-stone-950 p-1 rounded-lg border border-stone-800">
          <button
            onClick={() => setViewMode('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'student' 
                ? 'bg-amber-600 text-white shadow' 
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </button>
          
          <button
            onClick={() => setViewMode('verifier')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'verifier' 
                ? 'bg-amber-600 text-white shadow' 
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verifier Queue</span>
          </button>

          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'mobile' 
                ? 'bg-amber-600 text-white shadow' 
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android App</span>
          </button>
        </div>

        {/* Demo Fast Forward & User Switcher */}
        <div className="flex items-center gap-2.5">
          {/* 1-Click Fast Forward Journey */}
          <button
            onClick={handleFastForward}
            disabled={isDemoRunning}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow transition-colors cursor-pointer disabled:opacity-50"
            title="Auto-run complete Asha Patil demo journey (Deficiency -> Upload Bonafide -> Verifier Approve -> Sanction -> DBT)"
          >
            <PlayCircle className={`w-3.5 h-3.5 ${isDemoRunning ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isDemoRunning ? 'Executing...' : 'Run Full Demo Flow'}
            </span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-2.5 py-1.5 rounded-md border border-stone-700 transition-colors cursor-pointer"
            title="Reset to initial intentional deficiency baseline"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-md border border-stone-700 cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadNotifs}
              </span>
            )}
          </button>

          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs px-3 py-1.5 rounded-md border border-stone-700 transition-all cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <div className="text-left hidden sm:block">
                <p className="font-semibold leading-tight">{state.currentUser.name}</p>
                <p className="text-[10px] text-stone-400 capitalize">{state.currentUser.role}</p>
              </div>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-700 rounded-lg shadow-xl py-1.5 z-50 text-xs">
                <div className="px-3 py-1.5 text-stone-400 text-[10px] uppercase font-bold tracking-wider border-b border-stone-800">
                  Switch Demo Persona
                </div>
                {SEED_USERS.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleRoleChange(user)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-800 transition-colors ${
                      state.currentUser.id === user.id ? 'text-amber-400 font-semibold bg-stone-800/50' : 'text-stone-300'
                    }`}
                  >
                    <div>
                      <p className="text-xs">{user.name}</p>
                      <p className="text-[10px] text-stone-500 capitalize">{user.role}</p>
                    </div>
                    {state.currentUser.id === user.id && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">Active</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
