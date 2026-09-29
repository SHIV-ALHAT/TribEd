/**
 * Consent, Privacy, & Sandbox Notice Modal
 * Digital Personal Data Protection (DPDP) Act 2023 compliance & synthetic data disclosure.
 */

import React from 'react';
import { ShieldCheck, Lock, AlertCircle, X, Check } from 'lucide-react';

interface ConsentPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsentPrivacyModal: React.FC<ConsentPrivacyModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in space-y-4">
        <div className="flex items-start justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700 text-white rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Privacy & Sovereign Data Ethics</h3>
              <p className="text-xs text-stone-500">Ministry of Tribal Affairs (MoTA) Standards</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-stone-700 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-amber-950 font-medium">
            <strong>SIH 2026 Demonstration Disclosure:</strong> All student names (Asha Patil, Ramesh Gond), Aadhaar tokens (XXXXXXXX4892), bank account identifiers, and certificates in this application are <strong>100% synthetic mock fixtures</strong>. Zero real-world citizen personal data is stored or processed.
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900">1. Data Minimization & Tokenization</h4>
            <p>
              TribEd never stores raw Aadhaar biometric or demographic records on the application layer. Identity verification is delegated entirely to UIDAI e-KYC sandbox tokens via the <code className="bg-stone-100 px-1 py-0.5 rounded">MockIdentityAdapter</code>.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900">2. Sovereign Adapters Architecture</h4>
            <p>
              TribEd acts strictly as an orchestration layer connecting students to sovereign platforms (DigiLocker, APAAR, AISHE, and PFMS). In this demo, mock adapter connectors simulate these systems to enable reliable evaluation without falsely claiming live production integration.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900">3. DPDP Act 2023 Principles</h4>
            <p>
              Explicit consent is required for document retrieval, verified status checks, and DBT account validation. Beneficiaries retain the right to review their digital footprint and audit log history at any time.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            I Understand & Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
