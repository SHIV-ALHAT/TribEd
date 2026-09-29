/**
 * Audit Trail View: Sovereign Compliance & System Event Logging
 */

import React, { useState } from 'react';
import { History, Shield, Filter, Search, Download } from 'lucide-react';
import { store } from '../services/store';

export const AuditTrailView: React.FC = () => {
  const state = store.getState();
  const logs = state.auditLogs;
  const [filterEntity, setFilterEntity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => {
    if (filterEntity !== 'ALL' && log.entityType !== filterEntity) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        log.action.toLowerCase().includes(term) ||
        log.actor.toLowerCase().includes(term) ||
        log.details.toLowerCase().includes(term) ||
        log.entityId.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-stone-900 text-amber-400 rounded-xl shadow-inner shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900">Sovereign Audit Trail</h2>
                <span className="text-xs bg-stone-100 text-stone-700 font-semibold px-2 py-0.5 rounded border border-stone-300">
                  Immutable Event Log
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Every state transition, automated verification result, human reviewer override, and DBT disbursement is recorded with actor credentials and precise ISO timestamps.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-stone-500 font-mono">Total Recorded Events</span>
            <p className="text-2xl font-bold text-stone-900">{logs.length}</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 pt-4 border-t border-stone-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit actions, actors, or IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'APPLICATION', 'VERIFICATION', 'DEFICIENCY', 'PAYMENT', 'DOCUMENT'].map(eType => (
              <button
                key={eType}
                onClick={() => setFilterEntity(eType)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterEntity === eType
                    ? 'bg-amber-700 text-white font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {eType}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-stone-100">
          {filteredLogs.map(log => (
            <div key={log.id} className="p-4 hover:bg-stone-50/60 transition-colors text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    {log.action}
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {log.entityType}
                  </span>
                  <span className="text-stone-500 font-mono text-[11px]">ID: {log.entityId}</span>
                </div>

                <span className="text-stone-400 font-mono text-[11px]">
                  {new Date(log.timestamp).toLocaleString('en-IN')}
                </span>
              </div>

              <p className="text-stone-700 mt-1.5 leading-relaxed">{log.details}</p>

              <div className="flex items-center gap-2 mt-2 text-[11px] text-stone-500">
                <span>Actor: <strong className="text-stone-700">{log.actor}</strong></span>
                <span>•</span>
                <span>Role: <strong className="capitalize text-stone-700">{log.actorRole}</strong></span>
                <span>•</span>
                <span className="font-mono text-[10px] text-stone-400">{log.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
