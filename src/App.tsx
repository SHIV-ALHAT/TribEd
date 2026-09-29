/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Clock, 
  FileText, 
  CreditCard, 
  Sparkles, 
  User, 
  History, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink,
  Info
} from 'lucide-react';
import { store } from './services/store';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ScholarshipsView } from './components/ScholarshipsView';
import { ApplicationTrackerView } from './components/ApplicationTrackerView';
import { DocumentWalletView } from './components/DocumentWalletView';
import { PaymentsView } from './components/PaymentsView';
import { JagoAssistantView } from './components/JagoAssistantView';
import { AdminQueueView } from './components/AdminQueueView';
import { AuditTrailView } from './components/AuditTrailView';
import { StudentProfileView } from './components/StudentProfileView';
import { MobileSimulator } from './components/MobileSimulator';
import { NotificationsModal } from './components/NotificationsModal';
import { ConsentPrivacyModal } from './components/ConsentPrivacyModal';
import { getTranslation } from './utils/i18n';

export default function App() {
  const [, setTick] = useState(0);
  const [viewMode, setViewMode] = useState<'student' | 'verifier' | 'mobile'>('student');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [jagoInitialPrompt, setJagoInitialPrompt] = useState<string | undefined>(undefined);

  // Re-render when store mutates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  const state = store.getState();
  const lang = state.language;

  const handleOpenJagoWithPrompt = (prompt: string) => {
    setJagoInitialPrompt(prompt);
    setActiveTab('jago');
  };

  const navItems = [
    { id: 'dashboard', label: getTranslation('dashboard', lang), icon: LayoutDashboard },
    { id: 'scholarships', label: getTranslation('scholarships', lang), icon: GraduationCap },
    { id: 'applications', label: getTranslation('applications', lang), icon: Clock },
    { id: 'documents', label: getTranslation('documents', lang), icon: FileText },
    { id: 'payments', label: getTranslation('payments', lang), icon: CreditCard },
    { id: 'jago', label: getTranslation('jagoAssistant', lang), icon: Sparkles },
    { id: 'profile', label: getTranslation('profile', lang), icon: User },
    { id: 'audit', label: getTranslation('auditLogs', lang), icon: History }
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col text-stone-900 font-sans selection:bg-amber-200">
      {/* Sovereign Header */}
      <Header
        viewMode={viewMode}
        setViewMode={(mode) => {
          setViewMode(mode);
          if (mode === 'verifier') setActiveTab('admin_queue');
        }}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenConsent={() => setIsConsentOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Navigation Tabs (Only in Student Web Portal mode) */}
        {viewMode === 'student' && (
          <nav className="bg-white rounded-xl border border-stone-200 p-1.5 shadow-xs flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id !== 'jago') setJagoInitialPrompt(undefined);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* VIEW MODE 1: STUDENT WEB PORTAL */}
        {viewMode === 'student' && (
          <div>
            {activeTab === 'dashboard' && (
              <DashboardView
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenJago={() => setActiveTab('jago')}
              />
            )}

            {activeTab === 'scholarships' && (
              <ScholarshipsView
                onSelectApplication={(schemeId) => {
                  setActiveTab('applications');
                }}
                onOpenJagoWithContext={handleOpenJagoWithPrompt}
              />
            )}

            {activeTab === 'applications' && (
              <ApplicationTrackerView
                onOpenJagoWithContext={handleOpenJagoWithPrompt}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'documents' && <DocumentWalletView />}

            {activeTab === 'payments' && <PaymentsView />}

            {activeTab === 'jago' && (
              <JagoAssistantView
                initialPrompt={jagoInitialPrompt}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'profile' && <StudentProfileView />}

            {activeTab === 'audit' && <AuditTrailView />}
          </div>
        )}

        {/* VIEW MODE 2: ADMIN & VERIFIER DASHBOARD */}
        {viewMode === 'verifier' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <div>
                  <h2 className="text-base font-bold text-stone-900">Ministry Reviewer & Exception Console</h2>
                  <p className="text-xs text-stone-500">Human-in-the-loop inspection and sovereign verification actions</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('admin_queue')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    activeTab === 'admin_queue' ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  Application Queue
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    activeTab === 'audit' ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  Audit Trail
                </button>
              </div>
            </div>

            {activeTab === 'audit' ? <AuditTrailView /> : <AdminQueueView />}
          </div>
        )}

        {/* VIEW MODE 3: ANDROID MOBILE SIMULATOR */}
        {viewMode === 'mobile' && <MobileSimulator />}
      </main>

      {/* Sovereign Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 mt-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-stone-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-sm">
                TE
              </div>
              <div>
                <p className="font-bold text-stone-200 text-sm">TribEd — Smart Unified Tribal Scholarship Orchestration</p>
                <p className="text-[11px] text-stone-400">Ministry of Tribal Affairs, Government of India · Smart India Hackathon 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <button 
                onClick={() => setIsConsentOpen(true)}
                className="hover:text-amber-400 transition-colors"
              >
                Data Privacy & Sandbox Policy
              </button>
              <span>•</span>
              <button 
                onClick={() => setViewMode('verifier')}
                className="hover:text-amber-400 transition-colors"
              >
                Official Reviewer Access
              </button>
              <span>•</span>
              <button 
                onClick={() => setViewMode('mobile')}
                className="hover:text-amber-400 transition-colors"
              >
                Flutter Mobile Mode
              </button>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
            <p>© 2026 Ministry of Tribal Affairs (MoTA). Prototype demonstration sandbox with synthetic fixtures.</p>
            <p>Built for SIH 2026 Problem Statement: SIH26238</p>
          </div>
        </div>
      </footer>

      {/* Drawers / Modals */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateTab={(tab) => {
          setViewMode('student');
          setActiveTab(tab);
        }}
      />

      <ConsentPrivacyModal
        isOpen={isConsentOpen}
        onClose={() => setIsConsentOpen(false)}
      />
    </div>
  );
}
