/**
 * Admin & Verifier Dashboard: Human-in-the-Loop Exception Management
 * Allows official reviewers to inspect mismatches against upstream sovereign registries.
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  FileText, 
  Building, 
  History, 
  Filter, 
  Search,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { store } from '../services/store';
import { Application, User } from '../types';

export const AdminQueueView: React.FC = () => {
  const state = store.getState();
  const applications = state.applications;
  const [selectedApp, setSelectedApp] = useState<Application | null>(applications[0] || null);
  const [filterType, setFilterType] = useState<'ALL' | 'EXCEPTIONS' | 'VERIFIED' | 'SANCTIONED'>('ALL');
  const [verifierNotes, setVerifierNotes] = useState('Documents and updated bonafide inspected. Institution affiliation approved.');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const filteredApps = applications.filter(app => {
    if (filterType === 'EXCEPTIONS') return ['DEFICIENCY_NOTED', 'CORRECTION_SUBMITTED'].includes(app.currentStatus);
    if (filterType === 'VERIFIED') return app.currentStatus === 'VERIFIED';
    if (filterType === 'SANCTIONED') return ['SANCTIONED', 'DBT_PROCESSING', 'DBT_DISBURSED'].includes(app.currentStatus);
    return true;
  });

  const handleAction = (action: 'APPROVE' | 'REQUEST_CORRECTION' | 'REJECT') => {
    if (!selectedApp) return;
    store.adminReviewAction(selectedApp.id, action, verifierNotes);
    setActionSuccessMsg(`Action '${action}' successfully executed on ${selectedApp.id}. Logged to audit trail.`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const student = store.getActiveStudent();
  const docs = store.getStudentDocuments(student.id);

  return (
    <div className="space-y-6">
      {/* Top Verifier Analytics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-xs font-semibold text-stone-500 uppercase">Total Queue</span>
          <p className="text-2xl font-bold text-stone-900 mt-1">{applications.length} Applications</p>
          <span className="text-[11px] text-stone-500 mt-1 block">MoTA Centrally Monitored</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-300 shadow-sm bg-amber-50/20">
          <span className="text-xs font-semibold text-amber-800 uppercase">Exceptions / Deficiencies</span>
          <p className="text-2xl font-bold text-amber-900 mt-1">
            {applications.filter(a => ['DEFICIENCY_NOTED', 'CORRECTION_SUBMITTED'].includes(a.currentStatus)).length} Active
          </p>
          <span className="text-[11px] text-amber-700 mt-1 block">Human-in-the-loop review needed</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-300 shadow-sm bg-emerald-50/20">
          <span className="text-xs font-semibold text-emerald-800 uppercase">Verified Today</span>
          <p className="text-2xl font-bold text-emerald-900 mt-1">
            {applications.filter(a => ['VERIFIED', 'SANCTIONED', 'DBT_DISBURSED'].includes(a.currentStatus)).length} Completed
          </p>
          <span className="text-[11px] text-emerald-700 mt-1 block">99.4% Automated Pass Rate</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-xs font-semibold text-stone-500 uppercase">DBT Total Sanctioned</span>
          <p className="text-2xl font-bold text-stone-900 mt-1">₹48,000</p>
          <span className="text-[11px] text-stone-500 mt-1 block">Direct to Aadhaar Bank Vault</span>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Main Reviewer Layout: Queue Table on Left, Deep Inspection Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Applications Queue (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Verification Queue</h3>
              <p className="text-[11px] text-stone-500">Scheduled Tribe applications</p>
            </div>

            {/* Filter pills */}
            <div className="flex gap-1 text-[11px]">
              {(['ALL', 'EXCEPTIONS', 'VERIFIED'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors ${
                    filterType === f ? 'bg-amber-700 text-white font-semibold' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-stone-100 overflow-y-auto flex-1">
            {filteredApps.map(app => {
              const isSelected = selectedApp?.id === app.id;
              const isException = ['DEFICIENCY_NOTED', 'CORRECTION_SUBMITTED'].includes(app.currentStatus);

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected ? 'bg-amber-50/60 border-l-4 border-amber-600' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-stone-800">{app.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      app.currentStatus === 'DEFICIENCY_NOTED'
                        ? 'bg-amber-100 text-amber-900'
                        : app.currentStatus === 'CORRECTION_SUBMITTED'
                          ? 'bg-blue-100 text-blue-900'
                          : app.currentStatus === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-purple-100 text-purple-900'
                    }`}>
                      {app.currentStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-stone-900 truncate">{app.schemeName}</h4>
                  <p className="text-[11px] text-stone-500 mt-1">Student: Asha Patil (B.Tech 3rd Yr)</p>
                  
                  {isException && (
                    <div className="mt-2 text-[11px] text-amber-900 bg-amber-100/70 px-2 py-1 rounded border border-amber-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" />
                      <span className="truncate">AISHE Affiliation & Bonafide Mismatch</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Inspection & Human-in-the-Loop Action Panel (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 shadow-sm p-5 md:p-6 overflow-y-auto h-[700px] space-y-5">
          {selectedApp ? (
            <>
              {/* Header */}
              <div className="border-b border-stone-100 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-stone-500 font-semibold">{selectedApp.id}</span>
                    <h3 className="text-lg font-bold text-stone-900">{selectedApp.schemeName}</h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-stone-100 border border-stone-200">
                    Status: {selectedApp.currentStatus}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed bg-stone-50 p-2.5 rounded border border-stone-200">
                  {selectedApp.statusReason}
                </p>
              </div>

              {/* Side-by-Side Verification Inspector (Student Claim vs Upstream AISHE) */}
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <div className="bg-stone-900 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between">
                  <span>Exception Analysis: Claimed vs Sovereign Registry Record</span>
                  <span className="text-amber-400 font-mono text-[10px]">AISHE Code: AISHE-C-49210</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 text-xs">
                  {/* Left: Claimed by Student */}
                  <div className="p-4 bg-stone-50/50 space-y-2">
                    <span className="font-bold text-stone-900 block border-b border-stone-200 pb-1">
                      Student Claim / Application Data
                    </span>
                    <p><strong>Full Name:</strong> {student.fullName}</p>
                    <p><strong>Caste:</strong> {student.category} ({student.subTribe})</p>
                    <p><strong>Annual Income:</strong> ₹{student.familyAnnualIncome.toLocaleString('en-IN')}</p>
                    <p><strong>Claimed College:</strong> {student.institutionName}</p>
                    <p><strong>Course:</strong> {student.courseName} (Year {student.currentYear})</p>
                    <p>
                      <strong>Attached Bonafide:</strong>{' '}
                      <span className={docs.some(d => d.title.includes('2026-27')) ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                        {docs.some(d => d.title.includes('2026-27')) ? 'AY 2026-27 Bonafide (Valid)' : 'AY 2024-25 Bonafide (Expired)'}
                      </span>
                    </p>
                  </div>

                  {/* Right: Mock AISHE Master Registry Data */}
                  <div className="p-4 bg-stone-50/50 space-y-2">
                    <span className="font-bold text-stone-900 block border-b border-stone-200 pb-1">
                      Upstream AISHE Sandbox Match
                    </span>
                    <p><strong>Registry Institution:</strong> Demo Institute of Technology</p>
                    <p><strong>Type:</strong> Govt. Aided Autonomous College</p>
                    <p><strong>State DTE Affiliation:</strong> Audit Sync Pending for AY 2026-27</p>
                    <p><strong>MoTA Eligibility:</strong> Eligible for Post-Matric & Top-Class</p>
                    <p><strong>Resolution Rule:</strong> Head of Institution endorsement required to bypass annual sync delay.</p>
                  </div>
                </div>
              </div>

              {/* Multi-Check Verification State */}
              <div>
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Automated Check Results
                </h4>
                <div className="space-y-1.5 text-xs">
                  {selectedApp.verificationChecks.map(check => (
                    <div key={check.id} className="p-2.5 rounded-lg border border-stone-200 flex items-center justify-between bg-white">
                      <div>
                        <span className="font-semibold text-stone-900">{check.name}</span>
                        <span className="text-[10px] text-stone-400 block font-mono">{check.adapterUsed}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        check.status === 'PASS' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : check.status === 'REVIEW_REQUIRED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                      }`}>
                        {check.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviewer Action Controls */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                <span className="font-bold text-stone-900 text-xs block">
                  Verifier Decision & Audit Notes:
                </span>
                
                <textarea
                  value={verifierNotes}
                  onChange={(e) => setVerifierNotes(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="Enter official remark / justification for audit trail..."
                />

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={() => handleAction('APPROVE')}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Mark Verified</span>
                  </button>

                  <button
                    onClick={() => handleAction('REQUEST_CORRECTION')}
                    className="bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Request Correction</span>
                  </button>

                  <button
                    onClick={() => handleAction('REJECT')}
                    className="bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Application</span>
                  </button>
                </div>
                <p className="text-[10px] text-stone-400">
                  Every verifier action is cryptographically recorded in the sovereign audit trail with role and timestamp.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center text-stone-400 py-12 text-xs">
              Select an application from the queue to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
