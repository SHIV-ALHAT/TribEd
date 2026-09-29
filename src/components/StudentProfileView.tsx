/**
 * Student Profile View: Unified Tribal Student Identity
 */

import React from 'react';
import { User, ShieldCheck, CreditCard, Building, GraduationCap, MapPin, Award } from 'lucide-react';
import { store } from '../services/store';

export const StudentProfileView: React.FC = () => {
  const student = store.getActiveStudent();

  return (
    <div className="space-y-6">
      {/* Top Profile Hero */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white text-2xl font-bold flex items-center justify-center border-4 border-white shadow-md">
            AP
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-bold text-stone-900">{student.fullName}</h2>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded border border-amber-300">
                {student.category} · {student.subTribe} Tribe
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-900 font-medium px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                <span>e-KYC Verified</span>
              </span>
            </div>
            
            <p className="text-xs text-stone-600 mt-1">
              {student.courseName} · Year {student.currentYear} · <strong className="text-stone-800">{student.institutionName}</strong>
            </p>
            
            <p className="text-xs text-stone-500 mt-0.5 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>{student.district}, {student.stateOfDomicile} - {student.pincode}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Profile Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Tribal & Identity Credentials */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2 text-stone-900 font-bold text-sm">
            <Award className="w-4 h-4 text-amber-700" />
            <span>Tribal Category & Identity</span>
          </div>

          <div className="space-y-2 text-xs text-stone-700">
            <div className="flex justify-between py-1 border-b border-stone-50">
              <span className="text-stone-500">Scheduled Tribe Group:</span>
              <span className="font-semibold text-stone-900">{student.category} ({student.subTribe})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-50">
              <span className="text-stone-500">Aadhaar Vault (Masked):</span>
              <span className="font-mono font-semibold text-stone-900">{student.syntheticAadhaarRef}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-50">
              <span className="text-stone-500">Caste Certificate No:</span>
              <span className="font-mono text-stone-800">{student.casteCertificateNo}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-50">
              <span className="text-stone-500">Annual Family Income:</span>
              <span className="font-semibold text-stone-900">₹{student.familyAnnualIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-500">Income Certificate Ref:</span>
              <span className="font-mono text-stone-800">{student.incomeCertificateNo}</span>
            </div>
          </div>
        </div>

        {/* Module 2: Academic Registry & AISHE */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2 text-stone-900 font-bold text-sm">
            <GraduationCap className="w-4 h-4 text-amber-700" />
            <span>Academic Enrollment & Institution</span>
          </div>

          <div className="space-y-2 text-xs text-stone-700">
            <div className="flex justify-between py-1 border-b border-stone-50">
              <span className="text-stone-500">APAAR / EduLocker ID:</span>
              <span className="font-mono font-semibold text-stone-900">{student.apaarId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-50">
              <span className="text-stone-500">Institution Name:</span>
              <span className="font-medium text-stone-900 text-right">{student.institutionName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-50">
              <span className="text-stone-500">AISHE Registry Code:</span>
              <span className="font-mono font-semibold text-stone-900">{student.institutionCode}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-50">
              <span className="text-stone-500">Enrolled Program:</span>
              <span className="font-medium text-stone-900">{student.courseName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-500">Current Academic Year:</span>
              <span className="font-semibold text-stone-900">Year {student.currentYear} (Semester 5)</span>
            </div>
          </div>
        </div>

        {/* Module 3: Direct Beneficiary Transfer (DBT) Mandate */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2 text-stone-900 font-bold text-sm">
            <CreditCard className="w-4 h-4 text-emerald-700" />
            <span>Aadhaar Payment Bridge (APBS) & DBT Mandate</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <span className="text-stone-500 block mb-1">Primary Bank Account:</span>
              <span className="font-bold text-stone-900 text-sm">{student.bankAccountMasked}</span>
              <span className="text-[11px] text-stone-500 block mt-0.5">IFSC: {student.bankIfsc} (SBI)</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="text-emerald-800 block mb-1">NPCI Aadhaar Mapping:</span>
              <span className="font-bold text-emerald-950 text-sm">Seeded & Verified</span>
              <span className="text-[11px] text-emerald-700 block mt-0.5">APBS Active for MoTA credits</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <span className="text-stone-500 block mb-1">Public Financial Management System:</span>
              <span className="font-bold text-stone-900 text-sm">PFMS Beneficiary Active</span>
              <span className="text-[11px] text-stone-500 block mt-0.5">Valid for DBT disbursements</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
