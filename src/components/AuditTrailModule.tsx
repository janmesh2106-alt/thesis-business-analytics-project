import React, { useState } from 'react';
import {
  History,
  GitBranch,
  RotateCcw,
  User,
  Cpu,
  ShieldAlert,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import type { AuditEntry, Thesis, ThesisVersion } from '../types.ts';
import { compareTheses } from '../utils/diff.ts';

interface AuditTrailModuleProps {
  thesis: Thesis;
  auditLog: AuditEntry[];
  versions: ThesisVersion[];
  onRestoreVersion: (version: ThesisVersion) => void;
}

export const AuditTrailModule: React.FC<AuditTrailModuleProps> = ({
  thesis,
  auditLog,
  versions,
  onRestoreVersion,
}) => {
  const [activeTab, setActiveTab] = useState<'log' | 'diff'>('diff');
  const [selectedVerFrom, setSelectedVerFrom] = useState<number>(versions[0]?.versionNumber || 1);
  const [selectedVerTo, setSelectedVerTo] = useState<number>(
    versions[versions.length - 1]?.versionNumber || 2
  );

  const verFromSnapshot = versions.find((v) => v.versionNumber === selectedVerFrom)?.snapshot;
  const verToSnapshot = versions.find((v) => v.versionNumber === selectedVerTo)?.snapshot;

  const comparison =
    verFromSnapshot && verToSnapshot ? compareTheses(verFromSnapshot, verToSnapshot) : null;

  const getActorBadge = (actor: AuditEntry['actor']) => {
    switch (actor) {
      case 'analyst':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-bold uppercase flex items-center gap-1">
            <User className="w-2.5 h-2.5" />
            Lead Analyst
          </span>
        );
      case 'system_change_engine':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800 font-bold uppercase flex items-center gap-1">
            <Cpu className="w-2.5 h-2.5" />
            Change Engine
          </span>
        );
      case 'sec_sync':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-bold uppercase flex items-center gap-1">
            <Database className="w-2.5 h-2.5" />
            SEC EDGAR Sync
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold uppercase flex items-center gap-1">
            <Info className="w-2.5 h-2.5" />
            System Evaluator
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                MODULE H // AUDIT TRAIL & VERSION HISTORY
              </span>
              <span className="text-xs font-mono text-slate-400">• {versions.length} Snapshots Archived</span>
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-1">
              Version Diff Inspection & Institutional Lineage Log
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-[#090d18] p-1 rounded border border-[#1b2847]">
            <button
              onClick={() => setActiveTab('diff')}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                activeTab === 'diff' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Version Diff Comparator
            </button>
            <button
              onClick={() => setActiveTab('log')}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                activeTab === 'log' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Changelog Event Log ({auditLog.length})
            </button>
          </div>
        </div>

        {/* Audit Limitations Transparency mandated by Section 5 */}
        <div className="p-2.5 rounded bg-[#090d18] border border-[#1b2847] text-[11px] text-slate-400 font-mono flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
          <span>
            DISCLOSURE: This prototype maintains full stateful version snapshots and in-session audit entries. In institutional production environments, this connects to an immutable WORM (Write Once, Read Many) or cryptographic audit ledger for compliance retention.
          </span>
        </div>
      </div>

      {activeTab === 'diff' ? (
        <div className="space-y-6">
          {/* Version Selector Bar */}
          <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Compare Baseline:</span>
                <select
                  aria-label="Select Baseline Version"
                  value={selectedVerFrom}
                  onChange={(e) => setSelectedVerFrom(parseInt(e.target.value, 10))}
                  className="bg-[#141d33] border border-[#1e2c4a] text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
                >
                  {versions.map((v) => (
                    <option key={v.versionNumber} value={v.versionNumber}>
                      v{v.versionNumber}.0 ({new Date(v.timestamp).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-500" />

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Against Revised:</span>
                <select
                  aria-label="Select Revised Version"
                  value={selectedVerTo}
                  onChange={(e) => setSelectedVerTo(parseInt(e.target.value, 10))}
                  className="bg-[#141d33] border border-[#1e2c4a] text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
                >
                  {versions.map((v) => (
                    <option key={v.versionNumber} value={v.versionNumber}>
                      v{v.versionNumber}.0 ({new Date(v.timestamp).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedVerFrom !== thesis.version && (
              <button
                onClick={() => {
                  const target = versions.find((v) => v.versionNumber === selectedVerFrom);
                  if (target) onRestoreVersion(target);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 text-xs font-mono transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Snapshot v{selectedVerFrom}.0</span>
              </button>
            )}
          </div>

          {/* Diff Result Cards */}
          {comparison ? (
            <div className="space-y-4">
              {/* High-level status & meta diff */}
              {comparison.metaChanges.length > 0 && (
                <div className="bg-[#0d1322] border border-amber-500/40 rounded-lg p-4 space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-amber-400 block">
                    Macro Framing & Status Changes:
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {comparison.metaChanges.map((mc, i) => (
                      <div key={i} className="p-2.5 rounded bg-[#10182b] border border-[#1a2744] font-mono">
                        <span className="text-slate-400 uppercase text-[10px]">{mc.field}: </span>
                        <span className="text-rose-400 line-through">{String(mc.previousValue)}</span>
                        <span className="text-slate-400"> → </span>
                        <span className="text-emerald-400 font-bold">{String(mc.currentValue)}</span>
                        <p className="text-slate-300 text-[11px] font-sans mt-0.5">{mc.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assumptions Diff */}
              <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-5 space-y-3">
                <span className="text-xs font-mono font-bold uppercase text-slate-300 block">
                  Assumption Modifications (v{selectedVerFrom}.0 vs v{selectedVerTo}.0):
                </span>

                <div className="space-y-3">
                  {comparison.assumptionDiffs.map((ad) => (
                    <div
                      key={ad.id}
                      className="p-3.5 rounded bg-[#10182b] border border-[#1a2744] text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-100">"{ad.statement}"</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                            ad.type === 'modified'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : ad.type === 'added'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : ad.type === 'removed'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {ad.type}
                        </span>
                      </div>

                      {ad.changes.length > 0 ? (
                        <div className="space-y-1 pt-1 border-t border-[#182642] font-mono text-[11px]">
                          {ad.changes.map((c, idx) => (
                            <div key={idx} className="text-slate-300">
                              <span className="text-cyan-400">• {c.field}: </span>
                              <span className="text-slate-400">{c.description}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500 block">
                          No parameter changes between selected snapshots.
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-10 text-center text-slate-400 text-xs font-mono">
              Select two versions to run comparison.
            </div>
          )}
        </div>
      ) : (
        /* Event Log Subtab */
        <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-300">
              Chronological System & Analyst Action Log
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {auditLog.length} Immutable Events
            </span>
          </div>

          <div className="space-y-2.5">
            {auditLog.map((entry) => (
              <div
                key={entry.id}
                className="p-3 rounded bg-[#10182b] border border-[#1a2744] text-xs space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getActorBadge(entry.actor)}
                    <span className="font-mono text-slate-200 font-bold uppercase text-[11px]">
                      {entry.action.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>

                <p className="text-slate-300 leading-snug">{entry.details}</p>

                {entry.diffSummary && (
                  <div className="pt-1 text-[10px] font-mono text-cyan-300 border-t border-[#182642]">
                    Diff: {entry.diffSummary}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
