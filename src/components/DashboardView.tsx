/**
 * Student Dashboard View: Unified Student Experience
 * Answers the 3 primary questions:
 * 1. What scholarships can I get?
 * 2. What is happening to my application?
 * 3. What do I need to do next?
 */

import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  FileText, 
  Wallet, 
  GraduationCap, 
  Sparkles,
  Building,
  Upload,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { store } from '../services/store';
import { getTranslation } from '../utils/i18n';
import { screenAllScholarshipsForStudent } from '../services/eligibilityEngine';

interface DashboardViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenJago: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenJago
}) => {
  const state = store.getState();
  const student = store.getActiveStudent();
  const applications = store.getStudentApplications(student.id);
  const activeApp = applications[0];
  const payment = activeApp ? store.getPaymentForApplication(activeApp.id) : undefined;
  const screenedSchemes = screenAllScholarshipsForStudent(student);
  const highMatchCount = screenedSchemes.filter(s => s.isPotentiallyApplicable).length;
  const docs = store.getStudentDocuments(student.id);

  // Intentional demo deficiency
  const hasDeficiency = activeApp && activeApp.currentStatus === 'DEFICIENCY_NOTED' && activeApp.deficiency?.status === 'OPEN';

  const handleResolveDeficiency = () => {
    if (!activeApp) return;
    store.resolveDeficiencyWithUpdatedBonafide(activeApp.id);
  };

  const handleRerunVerification = async () => {
    if (!activeApp) return;
    await store.executeVerification(activeApp.id);
  };

  return (
    <div className="space-y-6">
      {/* Student Welcome & Profile Quick Strip */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-stone-100 border-2 border-amber-600 flex items-center justify-center overflow-hidden shrink-0">
              <span className="text-xl font-bold text-stone-700">AP</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900">{student.fullName}</h2>
                <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded border border-amber-300">
                  {student.category} · {student.subTribe} Tribe
                </span>
                <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-300">
                  {student.stateOfDomicile} ({student.district})
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                {student.courseName} · Year {student.currentYear} · <span className="font-medium text-stone-800">{student.institutionName}</span>
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 mt-2">
                <span>APAAR: <strong className="text-stone-700">{student.apaarId}</strong></span>
                <span>•</span>
                <span>Annual Family Income: <strong className="text-stone-700">₹{student.familyAnnualIncome.toLocaleString('en-IN')}</strong></span>
                <span>•</span>
                <span>Aadhaar Vault: <strong className="text-stone-700">{student.syntheticAadhaarRef}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={() => onNavigateTab('profile')}
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-lg transition-colors border border-stone-200"
            >
              View Full Profile
            </button>
            <button
              onClick={onOpenJago}
              className="text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-2 rounded-lg transition-colors border border-amber-300 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Ask JAGO</span>
            </button>
          </div>
        </div>
      </div>

      {/* PRIORITY ACTION BANNER: Intentional Deficiency Notice */}
      {hasDeficiency && (
        <div className="bg-amber-50 border-2 border-amber-500/80 rounded-xl p-5 shadow-sm transition-all animate-in fade-in">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-amber-500 text-white rounded-lg shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-amber-950">
                  Action Required: {activeApp.deficiency?.issueTitle}
                </h3>
                <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded border border-amber-400">
                  Exception Workflow #DEF-2026-01
                </span>
              </div>
              <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                {activeApp.deficiency?.issueDescription}
              </p>
              
              <div className="bg-white/80 rounded-lg p-3 border border-amber-300 mt-3 text-xs text-stone-700">
                <span className="font-semibold text-stone-900">Required Action: </span>
                {activeApp.deficiency?.requiredAction}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <button
                  onClick={handleResolveDeficiency}
                  className="bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload AY 2026-27 Bonafide & Resolve Deficiency</span>
                </button>
                <button
                  onClick={() => onNavigateTab('applications')}
                  className="bg-white hover:bg-amber-100/60 text-amber-950 border border-amber-400 font-medium text-xs px-3 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Inspect Verification Checks
                </button>
                <button
                  onClick={onOpenJago}
                  className="text-xs text-amber-900 underline hover:text-amber-950 ml-auto"
                >
                  Ask JAGO why this was flagged
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* When Deficiency was Resolved by student but verification pending */}
      {activeApp && activeApp.currentStatus === 'CORRECTION_SUBMITTED' && (
        <div className="bg-blue-50 border border-blue-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-blue-950">Correction Submitted: Updated Bonafide Received</p>
              <p className="text-xs text-blue-800">AY 2026-27 Bonafide Certificate attached. You can rerun automated verification now.</p>
            </div>
          </div>
          <button
            onClick={handleRerunVerification}
            className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Rerun Automated Verification
          </button>
        </div>
      )}

      {/* When application is VERIFIED or SANCTIONED */}
      {activeApp && (activeApp.currentStatus === 'VERIFIED' || activeApp.currentStatus === 'SANCTIONED' || activeApp.currentStatus === 'DBT_DISBURSED') && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-950">
                {activeApp.currentStatus === 'DBT_DISBURSED' 
                  ? 'Scholarship Amount Disbursed to Bank Account! 💰' 
                  : activeApp.currentStatus === 'SANCTIONED' 
                    ? 'Scholarship Sanctioned: ₹48,000 Approved' 
                    : 'All Statutory Checks Verified'}
              </p>
              <p className="text-xs text-emerald-800">{activeApp.statusReason}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('payments')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            View DBT Tracker
          </button>
        </div>
      )}

      {/* 4 Core Pillars Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Scheme Discovery */}
        <div 
          onClick={() => onNavigateTab('scholarships')}
          className="bg-white p-5 rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <GraduationCap className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              Pre-Screened
            </span>
          </div>
          <h3 className="text-2xl font-bold text-stone-900">{highMatchCount} Schemes</h3>
          <p className="text-xs text-stone-600 mt-1">Potentially applicable to your profile</p>
          <div className="mt-3 text-xs font-medium text-amber-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Explore Schemes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Active Application */}
        <div 
          onClick={() => onNavigateTab('applications')}
          className="bg-white p-5 rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <Clock className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
              Active
            </span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 truncate">
            {activeApp ? activeApp.id : 'No Active App'}
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            Status: <span className="font-semibold text-stone-800">{activeApp?.currentStatus.replace(/_/g, ' ')}</span>
          </p>
          <div className="mt-3 text-xs font-medium text-amber-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Track Application</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Document Wallet */}
        <div 
          onClick={() => onNavigateTab('documents')}
          className="bg-white p-5 rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <FileText className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              DigiLocker Active
            </span>
          </div>
          <h3 className="text-2xl font-bold text-stone-900">{docs.length} Documents</h3>
          <p className="text-xs text-stone-600 mt-1">Reusable digital wallet bundle</p>
          <div className="mt-3 text-xs font-medium text-amber-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Open Wallet</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 4: DBT & Bank */}
        <div 
          onClick={() => onNavigateTab('payments')}
          className="bg-white p-5 rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <CreditCard className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Aadhaar Seeded
            </span>
          </div>
          <h3 className="text-2xl font-bold text-stone-900">
            {payment?.amount ? `₹${payment.amount.toLocaleString('en-IN')}` : '₹48,000'}
          </h3>
          <p className="text-xs text-stone-600 mt-1">DBT direct transfer entitlement</p>
          <div className="mt-3 text-xs font-medium text-amber-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Check Payment</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Active Application Journey & Recommended Scheme Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Application Timeline */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">Unified Application Timeline</h3>
              <p className="text-xs text-stone-500">Live orchestration status across verifying bodies</p>
            </div>
            {activeApp && (
              <span className="text-xs font-mono font-medium text-stone-600 bg-stone-100 px-2.5 py-1 rounded border border-stone-200">
                {activeApp.id}
              </span>
            )}
          </div>

          {activeApp ? (
            <div className="space-y-4">
              <div className="bg-stone-50 rounded-lg p-3.5 border border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-800">{activeApp.schemeName}</span>
                  <span className="text-xs text-stone-500">Applied: {activeApp.appliedDate}</span>
                </div>
                <p className="text-xs text-stone-600 mt-1">{activeApp.statusReason}</p>
              </div>

              {/* Multi-step Horizontal Progression */}
              <div className="pt-2">
                <div className="grid grid-cols-5 gap-1 text-center">
                  {[
                    { label: 'Submitted', active: true, done: true },
                    { label: 'Auto Check', active: true, done: activeApp.currentStatus !== 'SUBMITTED' },
                    { 
                      label: activeApp.currentStatus === 'DEFICIENCY_NOTED' ? 'Deficiency' : 'Verification', 
                      active: true, 
                      done: ['VERIFIED', 'SANCTIONED', 'DBT_PROCESSING', 'DBT_DISBURSED'].includes(activeApp.currentStatus),
                      warning: activeApp.currentStatus === 'DEFICIENCY_NOTED'
                    },
                    { label: 'Sanctioned', active: ['SANCTIONED', 'DBT_PROCESSING', 'DBT_DISBURSED'].includes(activeApp.currentStatus), done: ['SANCTIONED', 'DBT_PROCESSING', 'DBT_DISBURSED'].includes(activeApp.currentStatus) },
                    { label: 'DBT Credit', active: activeApp.currentStatus === 'DBT_DISBURSED', done: activeApp.currentStatus === 'DBT_DISBURSED' }
                  ].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-colors ${
                        step.warning 
                          ? 'bg-amber-500 text-white' 
                          : step.done 
                            ? 'bg-emerald-600 text-white' 
                            : step.active 
                              ? 'bg-amber-600 text-white' 
                              : 'bg-stone-200 text-stone-500'
                      }`}>
                        {step.warning ? '!' : step.done ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[11px] font-medium leading-tight ${step.active ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => onNavigateTab('applications')}
                  className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                >
                  <span>View Full Verification Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-stone-400 text-xs">
              No active application found. Select a scheme below to start.
            </div>
          )}
        </div>

        {/* Right Col: Top Recommended Scheme */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 md:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
              <h3 className="text-base font-bold text-stone-900">Top Match Scheme</h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Match
              </span>
            </div>

            <h4 className="text-sm font-bold text-stone-900">Post-Matric Scholarship for ST Students</h4>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Centrally sponsored scheme for tribal students pursuing post-matric / undergraduate degree programs.
            </p>

            <div className="bg-stone-50 rounded-lg p-3 border border-stone-200 my-3 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Max Benefit:</span>
                <span className="font-semibold text-stone-800">Up to ₹48,000 / year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Income Limit:</span>
                <span className="font-semibold text-stone-800">₹2,50,000 / year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Your Income:</span>
                <span className="font-semibold text-emerald-700">₹2,40,000 (Eligible)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('scholarships')}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <span>View All 5 MoTA Schemes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
