/**
 * Document Wallet View: Reusable Digital Document Ecosystem
 * Integrates with sovereign DigiLocker Sandbox Adapter.
 */

import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Download, 
  Upload, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  FolderLock,
  Plus
} from 'lucide-react';
import { store } from '../services/store';
import { DocumentItem } from '../types';

export const DocumentWalletView: React.FC = () => {
  const student = store.getActiveStudent();
  const documents = store.getStudentDocuments(student.id);
  const [isFetchingDigi, setIsFetchingDigi] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  const handleFetchDigiLocker = async () => {
    setIsFetchingDigi(true);
    await store.fetchFromDigiLocker(student.id, 'ST_CERTIFICATE');
    setIsFetchingDigi(false);
  };

  const handleUploadBonafide2026 = () => {
    store.resolveDeficiencyWithUpdatedBonafide('MOTA-2026-ST-1042');
  };

  return (
    <div className="space-y-6">
      {/* Top Wallet Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-amber-600 text-white rounded-xl shadow-inner shrink-0">
              <FolderLock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900">Reusable Document Wallet</h2>
                <span className="text-xs bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>DigiLocker Linked</span>
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Documents stored once are instantly reusable across all MoTA scholarship schemes. Digital signatures are verified in real time without requiring physical notarization or attested photocopies.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            <button
              onClick={handleFetchDigiLocker}
              disabled={isFetchingDigi}
              className="text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingDigi ? 'animate-spin' : ''}`} />
              <span>Sync from DigiLocker</span>
            </button>
            <button
              onClick={handleUploadBonafide2026}
              className="text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 px-3 py-2 rounded-lg transition-colors shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload AY 2026-27 Bonafide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => {
          const isFlagged = doc.verifiedStatus === 'FLAGGED';

          return (
            <div
              key={doc.id}
              className={`bg-white rounded-xl border p-5 transition-all shadow-sm flex flex-col justify-between ${
                isFlagged ? 'border-amber-300 bg-amber-50/20' : 'border-stone-200 hover:border-amber-400'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    {doc.type.replace(/_/g, ' ')}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                    doc.verifiedStatus === 'VERIFIED'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-300'
                  }`}>
                    {doc.verifiedStatus === 'VERIFIED' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                    )}
                    <span>{doc.verifiedStatus}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-900 mt-2 line-clamp-2">{doc.title}</h3>
                
                <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Doc No:</span>
                    <span className="font-mono font-medium text-stone-800">{doc.documentNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Source:</span>
                    <span className="font-medium text-stone-700">{doc.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Issuer:</span>
                    <span className="font-medium text-stone-700 text-right truncate max-w-[180px]">{doc.issuer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Issued Date:</span>
                    <span className="font-medium text-stone-700">{doc.issuedDate}</span>
                  </div>
                </div>

                {isFlagged && (
                  <div className="mt-3 p-2.5 bg-amber-100/70 border border-amber-300 rounded text-[11px] text-amber-900">
                    <strong>Note:</strong> Bonafide certificate corresponds to expired AY 2024-25. Upload the AY 2026-27 certificate to clear institutional deficiency.
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-stone-400 truncate max-w-[130px]">
                  {doc.syntheticHash}
                </span>

                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>Preview</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-stone-400">{selectedDoc.type}</span>
                <h3 className="text-base font-bold text-stone-900">{selectedDoc.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                <p><strong>Document Number:</strong> {selectedDoc.documentNumber}</p>
                <p><strong>Issued By:</strong> {selectedDoc.issuer}</p>
                <p><strong>Issued On:</strong> {selectedDoc.issuedDate}</p>
                <p><strong>Source Repository:</strong> {selectedDoc.source}</p>
                <p><strong>Verification Integrity Hash:</strong> <span className="font-mono text-[11px]">{selectedDoc.syntheticHash}</span></p>
                <p><strong>Size:</strong> {selectedDoc.fileSize}</p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Digitally signed sandbox token verified against National Informatics Centre (NIC) Root CA.</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
