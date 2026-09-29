/**
 * Android Mobile App Simulator (Flutter UI Experience)
 * Renders the authentic Android mobile interface with bottom navigation.
 */

import React, { useState } from 'react';
import { 
  Home, 
  GraduationCap, 
  Sparkles, 
  User, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  CreditCard, 
  Upload, 
  Bell, 
  ChevronRight,
  ShieldCheck,
  Send,
  ArrowLeft,
  RefreshCw,
  FolderLock
} from 'lucide-react';
import { store } from '../services/store';
import { SCHOLARSHIP_SCHEMES } from '../data/scholarshipSchemes';
import { jagoService } from '../services/jagoService';
import { ChatMessage } from '../types';

export const MobileSimulator: React.FC = () => {
  const student = store.getActiveStudent();
  const applications = store.getStudentApplications(student.id);
  const activeApp = applications[0];
  const payment = activeApp ? store.getPaymentForApplication(activeApp.id) : undefined;
  const docs = store.getStudentDocuments(student.id);

  // Mobile Bottom Tabs: 'home' | 'schemes' | 'jago' | 'profile'
  const [activeTab, setActiveTab] = useState<'home' | 'schemes' | 'jago' | 'profile'>('home');
  // Secondary screen: 'none' | 'app_detail' | 'scheme_detail' | 'documents' | 'dbt' | 'notifications'
  const [activeSubScreen, setActiveSubScreen] = useState<string>('none');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('SCHEME-POST-MATRIC');

  // JAGO Chat State inside Mobile
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'jago',
      text: `Hello ${student.fullName}! I am JAGO, your scholarship guide. How can I help you today?`,
      timestamp: '12:00'
    }
  ]);
  const [mobileInput, setMobileInput] = useState('');
  const [isJagoThinking, setIsJagoThinking] = useState(false);

  const handleResolveDeficiency = () => {
    if (!activeApp) return;
    store.resolveDeficiencyWithUpdatedBonafide(activeApp.id);
  };

  const handleRerunVerification = async () => {
    if (!activeApp) return;
    await store.executeVerification(activeApp.id);
  };

  const handleMobileSend = async (queryText?: string) => {
    const text = queryText || mobileInput;
    if (!text.trim() || isJagoThinking) return;

    const userMsg: ChatMessage = {
      id: `m-u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);
    setMobileInput('');
    setIsJagoThinking(true);

    try {
      const resp = await jagoService.processUserQuery(text, store.getState().language);
      const jagoMsg: ChatMessage = {
        id: `m-j-${Date.now() + 1}`,
        sender: 'jago',
        text: resp.message,
        timestamp: 'Just now',
        actionSuggestions: resp.actionSuggestions
      };
      setChatMessages(prev => [...prev, jagoMsg]);
    } catch {
      // fallback
    } finally {
      setIsJagoThinking(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      {/* Device Frame */}
      <div className="w-[380px] h-[780px] bg-stone-900 rounded-[44px] p-3.5 shadow-2xl border-4 border-stone-800 relative flex flex-col overflow-hidden">
        {/* Android Punch Hole Camera & Speaker */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-stone-950 rounded-full z-50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-800 mr-2"></div>
          <div className="w-10 h-1 bg-stone-800 rounded-full"></div>
        </div>

        {/* Screen Bezel Content */}
        <div className="flex-1 bg-stone-50 rounded-[34px] overflow-hidden flex flex-col relative text-stone-900 font-sans">
          {/* Status Bar */}
          <div className="bg-stone-900 text-stone-300 px-6 pt-3 pb-1 text-[11px] flex items-center justify-between font-medium">
            <span>12:30</span>
            <div className="flex items-center gap-1.5">
              <span>VoLTE</span>
              <span>5G</span>
              <span>88%</span>
            </div>
          </div>

          {/* Android App Bar */}
          <div className="bg-stone-900 text-white px-4 py-2.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              {activeSubScreen !== 'none' ? (
                <button 
                  onClick={() => setActiveSubScreen('none')}
                  className="p-1 hover:bg-stone-800 rounded-full"
                >
                  <ArrowLeft className="w-4 h-4 text-stone-200" />
                </button>
              ) : (
                <div className="w-6 h-6 rounded bg-amber-600 flex items-center justify-center text-[10px] font-bold">
                  TE
                </div>
              )}
              <div>
                <h3 className="font-bold text-xs tracking-tight text-white leading-tight">
                  {activeSubScreen === 'app_detail' ? 'Application Tracker' : 
                   activeSubScreen === 'scheme_detail' ? 'Scheme Details' : 
                   activeSubScreen === 'documents' ? 'Document Wallet' : 
                   activeSubScreen === 'dbt' ? 'DBT Payment' : 
                   'TribEd Mobile'}
                </h3>
                <span className="text-[9px] text-amber-400 leading-none">MoTA · Govt. of India</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveSubScreen('documents')}
                className="p-1 text-stone-300 hover:text-white"
                title="Wallet"
              >
                <FolderLock className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setActiveTab('jago')}
                className="p-1 text-amber-400"
                title="JAGO Assistant"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Screen Content Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 pb-16 text-xs">
            {/* 1. SUB-SCREEN: Application Details */}
            {activeSubScreen === 'app_detail' && activeApp && (
              <div className="space-y-3">
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono font-bold text-stone-700">{activeApp.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      {activeApp.currentStatus}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs">{activeApp.schemeName}</h4>
                  <p className="text-[11px] text-stone-600 mt-1">{activeApp.statusReason}</p>
                </div>

                {activeApp.currentStatus === 'DEFICIENCY_NOTED' && (
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-400 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Action: {activeApp.deficiency?.issueTitle}</span>
                    </div>
                    <p className="text-[11px] text-amber-900">{activeApp.deficiency?.issueDescription}</p>
                    <button
                      onClick={handleResolveDeficiency}
                      className="w-full bg-amber-700 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload AY 2026-27 Bonafide</span>
                    </button>
                  </div>
                )}

                {activeApp.currentStatus === 'CORRECTION_SUBMITTED' && (
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-300">
                    <p className="font-bold text-blue-950 text-xs">Correction Uploaded</p>
                    <button
                      onClick={handleRerunVerification}
                      className="mt-2 w-full bg-blue-700 text-white font-semibold py-1.5 rounded-lg text-xs"
                    >
                      Rerun Verification
                    </button>
                  </div>
                )}

                {/* Verification Checks */}
                <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2">
                  <h5 className="font-bold text-stone-800 text-[11px]">Verification Checks</h5>
                  {activeApp.verificationChecks.map(c => (
                    <div key={c.id} className="flex items-center justify-between py-1 border-b border-stone-100 last:border-0">
                      <span className="text-[11px] text-stone-700">{c.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        c.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. SUB-SCREEN: Documents Wallet */}
            {activeSubScreen === 'documents' && (
              <div className="space-y-2.5">
                <div className="bg-white p-3 rounded-xl border border-stone-200 flex justify-between items-center">
                  <span className="font-bold text-stone-800 text-xs">DigiLocker Reusable Vault</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Linked</span>
                </div>
                {docs.map(d => (
                  <div key={d.id} className="bg-white p-3 rounded-xl border border-stone-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-stone-900 text-xs">{d.title}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">{d.source}</span>
                    </div>
                    <p className="text-[10px] font-mono text-stone-500 mt-1">{d.documentNumber}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 3. MAIN TABS (When no subscreen active) */}
            {activeSubScreen === 'none' && (
              <>
                {/* TAB 1: HOME */}
                {activeTab === 'home' && (
                  <>
                    {/* Welcome Strip */}
                    <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center shrink-0">
                          AP
                        </div>
                        <div>
                          <h4 className="font-bold text-stone-900 text-xs">{student.fullName}</h4>
                          <span className="text-[10px] text-stone-500">
                            ST ({student.subTribe}) · B.Tech 3rd Yr
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Intentional Deficiency Card */}
                    {activeApp && activeApp.currentStatus === 'DEFICIENCY_NOTED' && (
                      <div className="bg-amber-50 p-3 rounded-xl border border-amber-400 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Action Required on Application</span>
                        </div>
                        <p className="text-[11px] text-amber-900 leading-tight">
                          College Bonafide certificate is from previous year (2024-25). Please upload AY 2026-27 certificate.
                        </p>
                        <button
                          onClick={handleResolveDeficiency}
                          className="w-full bg-amber-700 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload AY 2026-27 Bonafide</span>
                        </button>
                      </div>
                    )}

                    {/* Active Application Card */}
                    {activeApp && (
                      <div 
                        onClick={() => setActiveSubScreen('app_detail')}
                        className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs cursor-pointer hover:border-amber-400"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-mono text-stone-400">ACTIVE APPLICATION</span>
                          <span className="text-[10px] font-bold text-amber-700">Track &gt;</span>
                        </div>
                        <h4 className="font-bold text-stone-900 text-xs">{activeApp.schemeName}</h4>
                        <div className="mt-2 flex items-center justify-between text-[11px]">
                          <span className="text-stone-500">Status:</span>
                          <span className="font-bold text-stone-800">{activeApp.currentStatus}</span>
                        </div>
                      </div>
                    )}

                    {/* Quick 2-Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <div 
                        onClick={() => setActiveTab('schemes')}
                        className="bg-white p-3 rounded-xl border border-stone-200 cursor-pointer"
                      >
                        <GraduationCap className="w-4 h-4 text-amber-700 mb-1" />
                        <h5 className="font-bold text-stone-900 text-xs">5 Schemes</h5>
                        <p className="text-[10px] text-stone-500">Pre-screened match</p>
                      </div>

                      <div 
                        onClick={() => setActiveSubScreen('documents')}
                        className="bg-white p-3 rounded-xl border border-stone-200 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-amber-700 mb-1" />
                        <h5 className="font-bold text-stone-900 text-xs">Wallet</h5>
                        <p className="text-[10px] text-stone-500">{docs.length} DigiLocker docs</p>
                      </div>
                    </div>

                    {/* DBT Grant Banner */}
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-800">DBT Entitlement</span>
                          <h4 className="text-base font-bold text-emerald-950">₹48,000 / yr</h4>
                        </div>
                        <span className="text-[10px] font-bold bg-white text-emerald-800 px-2 py-1 rounded border border-emerald-300">
                          {payment?.state || 'SANCTIONED'}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* TAB 2: SCHOLARSHIPS */}
                {activeTab === 'schemes' && (
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-stone-900 text-xs">MoTA Centrally Sponsored Schemes</h4>
                    {SCHOLARSHIP_SCHEMES.map(s => (
                      <div key={s.id} className="bg-white p-3 rounded-xl border border-stone-200 space-y-1.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-mono text-stone-400">{s.code.toUpperCase()}</span>
                          <span className="text-[10px] font-bold text-stone-900">Up to ₹{s.annualBenefitMax.toLocaleString('en-IN')}</span>
                        </div>
                        <h5 className="font-bold text-stone-900 text-xs">{s.name}</h5>
                        <p className="text-[10px] text-stone-500 line-clamp-2">{s.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 3: JAGO CHAT */}
                {activeTab === 'jago' && (
                  <div className="flex flex-col h-[520px]">
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                      {chatMessages.map(m => (
                        <div
                          key={m.id}
                          className={`p-2.5 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                            m.sender === 'user'
                              ? 'bg-amber-700 text-white ml-auto rounded-tr-none'
                              : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none'
                          }`}
                        >
                          <div className="whitespace-pre-line">{m.text}</div>
                        </div>
                      ))}
                      {isJagoThinking && (
                        <div className="text-[10px] text-stone-500 bg-white p-2 rounded-lg border border-stone-200 w-fit">
                          JAGO is thinking...
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex gap-1.5 border-t border-stone-200">
                      <input
                        type="text"
                        placeholder="Ask JAGO about scholarship..."
                        value={mobileInput}
                        onChange={(e) => setMobileInput(e.target.value)}
                        className="flex-1 bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
                      />
                      <button
                        onClick={() => handleMobileSend()}
                        className="bg-amber-700 text-white p-1.5 rounded-lg"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 4: PROFILE */}
                {activeTab === 'profile' && (
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-xl border border-stone-200 text-center">
                      <div className="w-14 h-14 rounded-full bg-amber-700 text-white text-lg font-bold flex items-center justify-center mx-auto mb-2">
                        AP
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">{student.fullName}</h4>
                      <p className="text-[11px] text-stone-500">{student.category} ({student.subTribe}) · {student.district}</p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-500">Aadhaar (Masked):</span>
                        <span className="font-mono font-semibold">{student.syntheticAadhaarRef}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-500">APAAR ID:</span>
                        <span className="font-mono">{student.apaarId}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-500">Bank Account:</span>
                        <span>{student.bankAccountMasked} (SBI)</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-stone-500">Income:</span>
                        <span className="font-semibold">₹{student.familyAnnualIncome.toLocaleString('en-IN')}/yr</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Android Bottom Navigation Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-stone-200 py-1.5 px-4 flex items-center justify-around z-40">
            <button
              onClick={() => { setActiveTab('home'); setActiveSubScreen('none'); }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                activeTab === 'home' && activeSubScreen === 'none' ? 'text-amber-700 font-bold' : 'text-stone-400'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-[9px]">Home</span>
            </button>

            <button
              onClick={() => { setActiveTab('schemes'); setActiveSubScreen('none'); }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                activeTab === 'schemes' && activeSubScreen === 'none' ? 'text-amber-700 font-bold' : 'text-stone-400'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="text-[9px]">Schemes</span>
            </button>

            <button
              onClick={() => { setActiveTab('jago'); setActiveSubScreen('none'); }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                activeTab === 'jago' && activeSubScreen === 'none' ? 'text-amber-700 font-bold' : 'text-stone-400'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-[9px]">JAGO</span>
            </button>

            <button
              onClick={() => { setActiveTab('profile'); setActiveSubScreen('none'); }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                activeTab === 'profile' && activeSubScreen === 'none' ? 'text-amber-700 font-bold' : 'text-stone-400'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-[9px]">Profile</span>
            </button>
          </div>

          {/* Android Home Indicator Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-stone-300 rounded-full z-50"></div>
        </div>
      </div>
      <p className="text-xs text-stone-500 mt-3 text-center">
        Native Android (Flutter) simulation with bottom tabs and touch routing.
      </p>
    </div>
  );
};
