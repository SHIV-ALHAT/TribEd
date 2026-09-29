/**
 * Application Tracker View: End-to-End Multi-Source Verification Center
 * Highlights the intentional institution mismatch and real-time resolution.
 */

import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Upload, 
  RefreshCw, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Banknote
} from 'lucide-react';
import { store } from '../services/store';
import { Application, CheckStatus } from '../types';

interface ApplicationTrackerViewProps {
  onOpenJagoWithContext: (context: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  onOpenJagoWithContext,
  onNavigateTab
}) => {
  const student = store.getActiveStudent();
  const applications = store.getStudentApplications(student.id);
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [isVerifying, setIsVerifying] = useState(false);

  const application = applications.find(a => a.id === selectedAppId) || applications[0];
  const payment = application ? store.getPaymentForApplication(application.id) : undefined;
  const docs = store.getStudentDocuments(student.id);

  if (!application) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500 text-xs">
        No active scholarship applications found. Browse available schemes to apply.
      </div>
    );
  }

  const handleResolveDeficiency = () => {
    store.resolveDeficiencyWithUpdatedBonafide(application.id);
  };

  const handleRerunVerification = async () => {
    setIsVerifying(true);
    await store.executeVerification(application.id);
    setIsVerifying(false);
  };

  const handleSanction = () => {
    store.sanctionApplication(application.id, 48000);
  };

  const handleDisburse = async () => {
    await store.processDbtDisbursement(application.id);
  };

  const getStatusBadge = (status: Application['currentStatus']) => {
    switch (status) {
      case 'DEFICIENCY_NOTED':
        return (
          <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded border border-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>Deficiency Noted (Action Required)</span>
          </span>
        );
      case 'CORRECTION_SUBMITTED':
        return (
          <span className="text-xs font-bold bg-blue-100 text-blue-900 px-2.5 py-1 rounded border border-blue-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-700" />
            <span>Correction Submitted</span>
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded border border-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Statutory Verification Complete</span>
          </span>
        );
      case 'SANCTIONED':
        return (
          <span className="text-xs font-bold bg-purple-100 text-purple-900 px-2.5 py-1 rounded border border-purple-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
            <span>Sanction Order Issued (₹48,000)</span>
          </span>
        );
      case 'DBT_DISBURSED':
        return (
          <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded border border-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>DBT Disbursed to Bank Account</span>
          </span>
        );
      default:
        return (
          <span className="text-xs font-bold bg-stone-100 text-stone-800 px-2.5 py-1 rounded border border-stone-300">
            {status.replace(/_/g, ' ')}
          </span>
        );
    }
  };

  const getCheckStatusIcon = (status: CheckStatus) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'REVIEW_REQUIRED':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'FAIL':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Clock className="w-4 h-4 text-stone-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Application Overview Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                {application.id}
              </span>
              <span className="text-xs text-stone-500">Applied on: {application.appliedDate}</span>
              <span className="text-xs text-stone-400">·</span>
              <span className="text-xs text-stone-500">Updated: {new Date(application.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900">{application.schemeName}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {getStatusBadge(application.currentStatus)}
            
            <button
              onClick={() => onOpenJagoWithContext(`Help me with application ${application.id}`)}
              className="text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Ask JAGO</span>
            </button>
          </div>
        </div>

        {/* Live Status Narrative */}
        <div className="bg-stone-50 rounded-lg p-3.5 border border-stone-200 mt-4 text-xs text-stone-700 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-stone-900">Current Orchestration Status: </span>
            {application.statusReason}
          </div>
        </div>
      </div>

      {/* DEFICIENCY ACTION BOX: Highlighted for Demo Journey */}
      {application.deficiency && application.deficiency.status === 'OPEN' && (
        <div className="bg-amber-50 border-2 border-amber-500 rounded-xl p-5 md:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-amber-950">
                    Deficiency: {application.deficiency.issueTitle}
                  </h3>
                  <span className="text-[11px] font-mono bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded border border-amber-400">
                    {application.deficiency.id}
                  </span>
                </div>
                <p className="text-xs text-amber-900 mt-1 leading-relaxed max-w-3xl">
                  {application.deficiency.issueDescription}
                </p>
                <div className="mt-3 bg-white/90 p-3 rounded-lg border border-amber-300 text-xs text-stone-800">
                  <span className="font-bold text-stone-900">Required Correction: </span>
                  {application.deficiency.requiredAction}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={handleResolveDeficiency}
                className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload AY 2026-27 Bonafide</span>
              </button>
              <span className="text-[10px] text-amber-800 text-center">
                Simulates student uploading endorsed bonafide
              </span>
            </div>
          </div>
        </div>
      )}

      {/* If Correction Submitted: Offer Re-run button */}
      {application.currentStatus === 'CORRECTION_SUBMITTED' && (
        <div className="bg-blue-50 border border-blue-300 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-blue-950">Updated AY 2026-27 Bonafide Attached</h4>
            <p className="text-xs text-blue-800 mt-0.5">
              Correction uploaded. Rerun multi-source automated verification to validate institutional affiliation.
            </p>
          </div>
          <button
            onClick={handleRerunVerification}
            disabled={isVerifying}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Verifying Checks...' : 'Rerun Automated Verification'}</span>
          </button>
        </div>
      )}

      {/* If Verified: Offer Next Lifecycle Step (Sanction Order) */}
      {application.currentStatus === 'VERIFIED' && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-emerald-950">Statutory Verification Complete</h4>
            <p className="text-xs text-emerald-800 mt-0.5">
              All 5 checks passed. Ministry sanction order can now be approved.
            </p>
          </div>
          <button
            onClick={handleSanction}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Issue Sanction Order (₹48,000)</span>
          </button>
        </div>
      )}

      {/* If Sanctioned: Offer DBT Disbursement */}
      {application.currentStatus === 'SANCTIONED' && (
        <div className="bg-purple-50 border border-purple-300 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-purple-950">Sanction Approved: Queued on PFMS</h4>
            <p className="text-xs text-purple-800 mt-0.5">
              Sanction Order {application.sanctionOrderNumber || 'MOTA/2026/8491'} is ready for Direct Beneficiary Transfer credit.
            </p>
          </div>
          <button
            onClick={handleDisburse}
            className="bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Banknote className="w-4 h-4" />
            <span>Simulate APBS / DBT Credit</span>
          </button>
        </div>
      )}

      {/* Multi-Source Verification Checks Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900">Multi-Source Verification Engine</h3>
            <p className="text-xs text-stone-500">Automated orchestration against sovereign sandbox adapters</p>
          </div>
          
          <button
            onClick={handleRerunVerification}
            disabled={isVerifying}
            className="text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg border border-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>Rerun All Checks</span>
          </button>
        </div>

        <div className="divide-y divide-stone-100">
          {application.verificationChecks.map((check) => (
            <div key={check.id} className="p-5 hover:bg-stone-50/60 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {getCheckStatusIcon(check.status)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-stone-900">{check.name}</h4>
                      <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        {check.adapterUsed}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{check.details}</p>

                    {/* Mismatch banner if review required */}
                    {check.status === 'REVIEW_REQUIRED' && check.mismatchReason && (
                      <div className="mt-2 bg-amber-50 p-2.5 rounded-lg border border-amber-300 text-xs text-amber-900">
                        <strong className="text-amber-950">Mismatch Flag: </strong>
                        {check.mismatchReason}
                      </div>
                    )}

                    {/* Matched Values Strip */}
                    {check.matchedValues && (
                      <div className="flex flex-wrap gap-2 mt-2.5">
                        {Object.entries(check.matchedValues).map(([k, v]) => (
                          <span key={k} className="text-[11px] bg-white border border-stone-200 rounded px-2 py-0.5 text-stone-600">
                            <span className="text-stone-400 font-medium">{k}:</span> <strong className="text-stone-700">{v}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 self-start md:self-center">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded border ${
                    check.status === 'PASS' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : check.status === 'REVIEW_REQUIRED'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {check.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attached Documents Reusable from Wallet */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Attached Documents Bundle ({application.attachedDocumentIds.length})</h3>
            <p className="text-xs text-stone-500">Auto-linked from student DigiLocker wallet</p>
          </div>
          <button
            onClick={() => onNavigateTab('documents')}
            className="text-xs font-semibold text-amber-800 hover:text-amber-950"
          >
            Manage Document Wallet
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {docs.filter(d => application.attachedDocumentIds.includes(d.id)).map(doc => (
            <div key={doc.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-stone-900 truncate">{doc.title}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  doc.verifiedStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {doc.verifiedStatus}
                </span>
              </div>
              <p className="text-stone-500 font-mono text-[10px]">{doc.documentNumber}</p>
              <p className="text-stone-400 text-[10px] mt-1">{doc.source} · {doc.fileSize}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
