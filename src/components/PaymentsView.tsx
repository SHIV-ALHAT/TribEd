/**
 * DBT Payments View: Direct Beneficiary Transfer Lifecycle
 * Aadhaar Payment Bridge System (APBS) & PFMS State Machine
 */

import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Building, 
  RefreshCw,
  AlertCircle,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { store } from '../services/store';
import { PaymentRecord, PaymentState } from '../types';

export const PaymentsView: React.FC = () => {
  const student = store.getActiveStudent();
  const applications = store.getStudentApplications(student.id);
  const activeApp = applications[0];
  const payment = activeApp ? store.getPaymentForApplication(activeApp.id) : undefined;
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulateDisbursement = async () => {
    if (!activeApp) return;
    setIsProcessing(true);
    await store.processDbtDisbursement(activeApp.id);
    setIsProcessing(false);
  };

  const getStepStatus = (stepState: PaymentState, currentState?: PaymentState) => {
    const states: PaymentState[] = ['NOT_STARTED', 'SANCTIONED', 'PROCESSING', 'PROCESSED'];
    const stepIdx = states.indexOf(stepState);
    const currIdx = states.indexOf(currentState || 'NOT_STARTED');

    if (currIdx > stepIdx) return 'DONE';
    if (currIdx === stepIdx) return 'ACTIVE';
    return 'UPCOMING';
  };

  return (
    <div className="space-y-6">
      {/* Top DBT Information Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-700 text-white rounded-xl shadow-inner shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900">Direct Beneficiary Transfer (DBT) Tracker</h2>
                <span className="text-xs bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.5 rounded border border-emerald-300">
                  APBS Enabled
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Scholarship funds are directly transferred to the student's Aadhaar-seeded primary bank account via Public Financial Management System (PFMS) & NPCI Aadhaar Payment Bridge. No middleman, zero deduction.
              </p>
            </div>
          </div>

          {payment && payment.state === 'SANCTIONED' && (
            <button
              onClick={handleSimulateDisbursement}
              disabled={isProcessing}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 self-start md:self-center"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Settling with RBI/NPCI...' : 'Simulate APBS / DBT Clearance'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Payment Status Card */}
      {payment ? (
        <div className="bg-white rounded-xl border border-stone-200 p-5 md:p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-mono font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                PFMS REF: {payment.pfmsTransactionId || 'QUEUED'}
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-1">{payment.schemeName}</h3>
              <p className="text-xs text-stone-500">Student: {payment.studentName} ({student.syntheticAadhaarRef})</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-stone-500 uppercase font-semibold">Total Sanctioned Grant</span>
              <p className="text-2xl font-bold text-stone-900">₹{payment.amount.toLocaleString('en-IN')}</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded inline-block mt-0.5 ${
                payment.state === 'PROCESSED' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : payment.state === 'PROCESSING'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
              }`}>
                {payment.state}
              </span>
            </div>
          </div>

          {/* 4-Step Visual State Machine Timeline */}
          <div>
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">
              DBT Settlement State Machine
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { 
                  title: '1. Sanction Order', 
                  desc: activeApp?.sanctionOrderNumber || 'Order Approved', 
                  state: 'SANCTIONED' as PaymentState,
                  date: payment.sanctionDate || '2026-08-15'
                },
                { 
                  title: '2. PFMS Transmission', 
                  desc: 'Gateway file generated', 
                  state: 'SANCTIONED' as PaymentState,
                  date: payment.sanctionDate || '2026-08-15'
                },
                { 
                  title: '3. APBS Clearing', 
                  desc: 'NPCI Aadhaar routing', 
                  state: 'PROCESSING' as PaymentState,
                  date: payment.processingDate || (payment.state === 'PROCESSED' ? '2026-08-16' : 'Pending')
                },
                { 
                  title: '4. Bank Account Credited', 
                  desc: payment.state === 'PROCESSED' ? 'Funds in Account' : 'Awaiting APBS batch', 
                  state: 'PROCESSED' as PaymentState,
                  date: payment.disbursedDate || (payment.state === 'PROCESSED' ? '2026-08-16' : 'Pending')
                }
              ].map((step, idx) => {
                const status = getStepStatus(step.state, payment.state);

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border text-xs transition-all ${
                      status === 'DONE'
                        ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                        : status === 'ACTIVE'
                          ? 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-300/40'
                          : 'bg-stone-50 border-stone-200 text-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">{step.title}</span>
                      {status === 'DONE' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {status === 'ACTIVE' && <Clock className="w-4 h-4 text-amber-600 animate-spin" />}
                    </div>
                    <p className={`text-[11px] leading-relaxed ${status === 'UPCOMING' ? 'text-stone-400' : 'text-stone-600'}`}>
                      {step.desc}
                    </p>
                    <span className="block mt-2 text-[10px] font-mono text-stone-500">{step.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bank Mandate & Remarks Strip */}
          <div className="bg-stone-50 rounded-lg p-4 border border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-stone-900 block mb-1">Beneficiary Account Mandate:</span>
              <p className="text-stone-600">Bank: State Bank of India (SBIN0001234)</p>
              <p className="text-stone-600">Account: {payment.maskedAccount}</p>
              <p className="text-emerald-700 font-medium mt-1">✓ NPCI Aadhaar Seeding: ACTIVE</p>
            </div>
            <div>
              <span className="font-bold text-stone-900 block mb-1">Transaction Remarks:</span>
              <p className="text-stone-600 leading-relaxed">{payment.remarks}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500 text-xs">
          No active payment record found. Sanction orders are generated automatically once verification passes.
        </div>
      )}
    </div>
  );
};
