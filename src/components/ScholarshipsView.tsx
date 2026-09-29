/**
 * Scholarships Discovery & Rule-Based Pre-Screening View
 * Displays 5 MoTA schemes with transparent eligibility criteria matching.
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  FileText, 
  Calendar, 
  IndianRupee, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Sparkles
} from 'lucide-react';
import { store } from '../services/store';
import { SCHOLARSHIP_SCHEMES } from '../data/scholarshipSchemes';
import { screenAllScholarshipsForStudent } from '../services/eligibilityEngine';
import { ScholarshipScheme } from '../types';

interface ScholarshipsViewProps {
  onSelectApplication: (schemeId: string) => void;
  onOpenJagoWithContext: (context: string) => void;
}

export const ScholarshipsView: React.FC<ScholarshipsViewProps> = ({
  onSelectApplication,
  onOpenJagoWithContext
}) => {
  const student = store.getActiveStudent();
  const applications = store.getStudentApplications(student.id);
  const screenedResults = screenAllScholarshipsForStudent(student);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HIGH_MATCH' | 'UNDERGRAD' | 'RESEARCH'>('ALL');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>('SCHEME-POST-MATRIC');

  const filteredResults = screenedResults.filter(item => {
    const matchesSearch = 
      item.scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scheme.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'HIGH_MATCH') return item.isPotentiallyApplicable;
    if (selectedFilter === 'UNDERGRAD') return ['SCHEME-POST-MATRIC', 'SCHEME-TOP-CLASS'].includes(item.scheme.id);
    if (selectedFilter === 'RESEARCH') return ['SCHEME-NFST', 'SCHEME-NOS'].includes(item.scheme.id);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Pre-Screening Guidance Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-stone-900">Scholarship Pre-Screening Engine</h2>
            </div>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Transparent rule evaluation matching your profile against official Ministry of Tribal Affairs scheme criteria.
              Indicates <strong className="text-stone-800">"Potentially Applicable"</strong> based on preliminary attributes before statutory verification.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 px-3 py-2 rounded-lg border border-stone-200">
            <span>Evaluating for:</span>
            <strong className="text-stone-800">{student.category} · {student.courseName}</strong>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-stone-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search scheme name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'ALL', label: 'All 5 Schemes' },
              { id: 'HIGH_MATCH', label: 'High Match Only' },
              { id: 'UNDERGRAD', label: 'Higher Secondary & UG' },
              { id: 'RESEARCH', label: 'Fellowship & Overseas' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id as any)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedFilter === f.id
                    ? 'bg-amber-700 text-white font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schemes List */}
      <div className="space-y-4">
        {filteredResults.map(({ scheme, isPotentiallyApplicable, matchScorePercent, matchedCriteria, unmetCriteria, verificationNeeded }) => {
          const isExpanded = expandedSchemeId === scheme.id;
          const existingApp = applications.find(a => a.schemeId === scheme.id);

          return (
            <div
              key={scheme.id}
              className={`bg-white rounded-xl border transition-all shadow-sm ${
                isPotentiallyApplicable ? 'border-stone-200 hover:border-amber-400' : 'border-stone-200 opacity-90'
              }`}
            >
              {/* Card Header Header Strip */}
              <div className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-mono font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        {scheme.code.toUpperCase()}
                      </span>
                      {isPotentiallyApplicable ? (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Potentially Applicable ({matchScorePercent}%)</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-300 flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-stone-500" />
                          <span>Not Applicable ({matchScorePercent}%)</span>
                        </span>
                      )}
                      <span className="text-xs text-stone-500">
                        Deadline: {scheme.deadlineDate}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-stone-900">{scheme.name}</h3>
                    <p className="text-xs text-stone-500 font-medium italic mt-0.5">
                      {scheme.hindiName}
                    </p>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {scheme.description}
                    </p>
                  </div>

                  {/* Benefit Badge & Action */}
                  <div className="flex md:flex-col items-center md:items-end justify-between shrink-0 gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-stone-500 uppercase font-semibold">Max Benefit</span>
                      <p className="text-lg font-bold text-stone-900">
                        Up to ₹{scheme.annualBenefitMax.toLocaleString('en-IN')}<span className="text-xs font-normal text-stone-500">/yr</span>
                      </p>
                    </div>

                    {existingApp ? (
                      <button
                        onClick={() => onSelectApplication(scheme.id)}
                        className="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Track Application ({existingApp.id})
                      </button>
                    ) : isPotentiallyApplicable ? (
                      <button
                        onClick={() => onSelectApplication(scheme.id)}
                        className="bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Apply / View Requirements
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenJagoWithContext(`Why am I not eligible for ${scheme.name}?`)}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                        <span>Why Not Eligible?</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Criteria Match Checklist Toggle */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Criteria Breakdown' : 'Show Eligibility Criteria & Documents'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onOpenJagoWithContext(`Tell me more about ${scheme.name} guidelines and benefits`)}
                    className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Ask JAGO about this scheme</span>
                  </button>
                </div>
              </div>

              {/* Expandable Breakdown Drawer */}
              {isExpanded && (
                <div className="bg-stone-50/70 border-t border-stone-200 p-5 md:p-6 text-xs space-y-4">
                  {/* Criteria Grid */}
                  <div>
                    <h4 className="font-bold text-stone-900 mb-2">Automated Pre-Screening Evaluation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {matchedCriteria.map((c, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-emerald-200 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-stone-900">{c.title}</span>
                            <p className="text-stone-600 mt-0.5">{c.detail}</p>
                          </div>
                        </div>
                      ))}

                      {unmetCriteria.map((c, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-rose-200 flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-rose-900">{c.title}</span>
                            <p className="text-stone-600 mt-0.5">{c.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mandatory Documents & Verification Requirements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-white p-3.5 rounded-lg border border-stone-200">
                      <span className="font-bold text-stone-900 block mb-2">Mandatory Documents (Reusable from Wallet):</span>
                      <ul className="space-y-1.5 text-stone-600">
                        {scheme.rules.mandatoryDocuments.map((docType, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                            <span className="font-mono text-[11px] text-stone-700">{docType.replace(/_/g, ' ')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-stone-200">
                      <span className="font-bold text-stone-900 block mb-2">Statutory Verification Required Upon Applying:</span>
                      <ul className="space-y-1.5 text-stone-600">
                        {verificationNeeded.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Scheme Benefits Detail */}
                  <div className="bg-amber-50/60 p-3.5 rounded-lg border border-amber-200 text-stone-800">
                    <span className="font-bold text-amber-950 block mb-1">Financial Benefits Structure:</span>
                    <p className="text-stone-700 leading-relaxed">{scheme.benefitsDescription}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
