import React, { useState } from 'react';
import {
  Filter,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Info,
  Calendar,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import type { EvidenceRecord, Signal, Thesis } from '../types.ts';

interface SignalCenterModuleProps {
  thesis: Thesis;
  signals: Signal[];
  evidenceList: EvidenceRecord[];
  onAcceptSignal: (id: string) => void;
  onRejectSignal: (id: string) => void;
  onAnnotateSignal: (id: string, note: string) => void;
  onSelectEvidence: (evidence: EvidenceRecord) => void;
}

export const SignalCenterModule: React.FC<SignalCenterModuleProps> = ({
  thesis,
  signals,
  evidenceList,
  onAcceptSignal,
  onRejectSignal,
  onAnnotateSignal,
  onSelectEvidence,
}) => {
  const [filterDirection, setFilterDirection] = useState<string>('all');
  const [filterMateriality, setFilterMateriality] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeSignalForDetail, setActiveSignalForDetail] = useState<Signal | null>(null);
  const [annotationInput, setAnnotationInput] = useState<string>('');
  const [isAnnotatingId, setIsAnnotatingId] = useState<string | null>(null);

  const filteredSignals = signals.filter((sig) => {
    if (filterDirection !== 'all' && sig.direction !== filterDirection) return false;
    if (filterMateriality !== 'all' && sig.materiality !== filterMateriality) return false;
    if (filterStatus !== 'all' && sig.reviewStatus !== filterStatus) return false;
    return true;
  });

  const getDirectionBadge = (direction: Signal['direction']) => {
    switch (direction) {
      case 'supports':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-bold uppercase">
            <TrendingUp className="w-3 h-3" />
            Supports {thesis.direction.toUpperCase()}
          </span>
        );
      case 'contradicts':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800 font-bold uppercase">
            <TrendingDown className="w-3 h-3" />
            Contradicts {thesis.direction.toUpperCase()}
          </span>
        );
      case 'mixed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800 font-bold uppercase">
            <AlertCircle className="w-3 h-3" />
            Mixed / Ambiguous
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold uppercase">
            <Info className="w-3 h-3" />
            Insufficient Evidence
          </span>
        );
    }
  };

  const getMaterialityBadge = (materiality: Signal['materiality']) => {
    switch (materiality) {
      case 'high':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/50 text-rose-300 border border-rose-800/80 font-semibold">
            HIGH MATERIALITY
          </span>
        );
      case 'medium':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-800/80 font-semibold">
            MEDIUM MATERIALITY
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 border border-slate-700 font-semibold">
            LOW MATERIALITY
          </span>
        );
    }
  };

  const getConfidenceBadge = (confidenceScore: number, confidence: Signal['confidence']) => {
    return (
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-300 border border-cyan-800/80 font-semibold">
        {(confidenceScore * 100).toFixed(0)}% CONFIDENCE ({confidence.toUpperCase()})
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Module Header & Filters */}
      <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>MODULE A // SIGNAL CENTER</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                ({filteredSignals.length} of {signals.length} Disclosures Analyzed)
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Prioritized feed connecting newly reported SEC facts directly to existing investment thesis assumptions.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-[#080d1a] px-3 py-1.5 rounded border border-[#1b2847]">
            Active Stance: <strong className="text-cyan-400 uppercase">{thesis.direction}</strong> • Review Gate: <strong className="text-amber-400">{signals.filter(s => s.reviewStatus === 'unreviewed').length} Pending</strong>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#1a2744] text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>FILTERS:</span>
          </div>

          {/* Direction Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">Direction:</span>
            <select
              aria-label="Filter by Direction"
              value={filterDirection}
              onChange={(e) => setFilterDirection(e.target.value)}
              className="bg-[#141d33] border border-[#1e2c4a] text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">All Directions</option>
              <option value="contradicts">Contradicts Stance</option>
              <option value="supports">Supports Stance</option>
              <option value="mixed">Mixed / Ambiguous</option>
              <option value="insufficient_evidence">Insufficient Evidence</option>
            </select>
          </div>

          {/* Materiality Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">Materiality:</span>
            <select
              aria-label="Filter by Materiality"
              value={filterMateriality}
              onChange={(e) => setFilterMateriality(e.target.value)}
              className="bg-[#141d33] border border-[#1e2c4a] text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">All Materiality Levels</option>
              <option value="high">High Materiality</option>
              <option value="medium">Medium Materiality</option>
              <option value="low">Low Materiality</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">Review Status:</span>
            <select
              aria-label="Filter by Review Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#141d33] border border-[#1e2c4a] text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">All Statuses</option>
              <option value="unreviewed">Unreviewed (Pending)</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="annotated">Annotated</option>
            </select>
          </div>

          {(filterDirection !== 'all' || filterMateriality !== 'all' || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setFilterDirection('all');
                setFilterMateriality('all');
                setFilterStatus('all');
              }}
              className="text-[11px] font-mono text-cyan-400 hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Signals List */}
      <div className="space-y-4">
        {filteredSignals.length === 0 ? (
          <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-10 text-center text-slate-400 text-xs font-mono">
            No signals match the selected filters.
          </div>
        ) : (
          filteredSignals.map((sig) => {
            const relatedAssumption = thesis.assumptions.find((a) => a.id === sig.assumptionId);
            const isEditingNote = isAnnotatingId === sig.id;

            return (
              <div
                key={sig.id}
                className="bg-[#0d1322] border border-[#1e2c4a] hover:border-[#2d416b] rounded-lg p-5 transition-all shadow-sm"
              >
                {/* Header row: Direction + Materiality + Confidence + Date */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {getDirectionBadge(sig.direction)}
                    {getMaterialityBadge(sig.materiality)}
                    {getConfidenceBadge(sig.confidenceScore, sig.confidence)}
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Filing Date: {sig.publicationDate}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#141d33] border border-[#1e2c4a] text-slate-300">
                      {sig.reportingPeriod}
                    </span>
                  </div>
                </div>

                {/* Summary Statement */}
                <h3 className="text-sm font-semibold text-slate-100 mb-2 leading-relaxed">
                  {sig.summary}
                </h3>

                {/* Linked Thesis Assumption */}
                {relatedAssumption && (
                  <div className="bg-[#090d18] border border-[#182642] p-2.5 rounded-md mb-3 flex items-start gap-2 text-xs">
                    <Layers className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">
                        Affects Assumption [{relatedAssumption.category.toUpperCase()}]:
                      </span>
                      <span className="text-slate-200 font-medium">"{relatedAssumption.statement}"</span>
                      <div className="mt-1 flex items-center gap-3 text-[11px] font-mono text-slate-400">
                        <span>Target: <strong className="text-cyan-300">{relatedAssumption.targetThreshold}</strong></span>
                        <span>Baseline: {relatedAssumption.baselineValue}</span>
                        <span>Current: <strong className={sig.direction === 'contradicts' ? 'text-rose-400' : 'text-emerald-400'}>{relatedAssumption.currentValue || 'N/A'}</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Deterministic Delta Calculation (if available) */}
                {sig.deltaCalculation && (
                  <div className="bg-[#0c1220] border-l-2 border-cyan-500 p-2.5 rounded-r mb-3 text-xs font-mono">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="text-slate-400">Deterministic Mathematical Delta:</span>
                      <span className={sig.deltaCalculation.thresholdPassed ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                        {sig.deltaCalculation.thresholdPassed ? 'Target Passed' : 'Hurdle Breached'}
                      </span>
                    </div>
                    <div className="text-slate-200 font-semibold mt-1">
                      {sig.deltaCalculation.formula}
                    </div>
                  </div>
                )}

                {/* Analytical Rationale: Why it matters & Suggested Investigation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-4">
                  <div className="p-3 rounded bg-[#10182b] border border-[#1a2744]">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-1">
                      Analytical Rationale // Why This Matters:
                    </span>
                    <p className="text-slate-300 leading-relaxed">{sig.whyItMatters}</p>
                  </div>

                  <div className="p-3 rounded bg-[#10182b] border border-[#1a2744]">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold block mb-1">
                      Suggested Follow-Up Investigation:
                    </span>
                    <p className="text-slate-300 leading-relaxed">{sig.suggestedInvestigation}</p>
                  </div>
                </div>

                {/* User Annotation Display or Editor */}
                {sig.userAnnotation && !isEditingNote && (
                  <div className="mb-3 p-2.5 rounded bg-emerald-950/20 border border-emerald-800/40 text-xs">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-0.5">
                      Analyst Annotation // Logged:
                    </span>
                    <p className="text-emerald-200">{sig.userAnnotation}</p>
                  </div>
                )}

                {isEditingNote && (
                  <div className="mb-3 p-3 rounded bg-[#141e36] border border-cyan-500/50 space-y-2">
                    <span className="text-xs font-mono text-cyan-300 block font-semibold">
                      Add Analyst Research Note:
                    </span>
                    <textarea
                      value={annotationInput}
                      onChange={(e) => setAnnotationInput(e.target.value)}
                      placeholder="Record institutional rationale, dissenting views, or conference call commentary..."
                      className="w-full bg-[#090d18] border border-[#1e2c4a] rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans h-20"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsAnnotatingId(null)}
                        className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onAnnotateSignal(sig.id, annotationInput);
                          setIsAnnotatingId(null);
                        }}
                        className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono"
                      >
                        Save Annotation
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Controls: Source Verification & Review Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#18233c] text-xs">
                  {/* Sources List */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">Source Citations:</span>
                    {sig.sourceReferences.map((ref, idx) => {
                      const matchedEvidence = evidenceList.find((e) => e.id === ref.evidenceId);
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (matchedEvidence) onSelectEvidence(matchedEvidence);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#141d33] hover:bg-[#1c2948] border border-[#1e2c4a] text-cyan-400 text-[11px] font-mono transition-colors"
                          title={ref.citation}
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{ref.docType} ({ref.title.slice(0, 16)}...)</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Accept / Reject / Annotate Workflow */}
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <button
                      onClick={() => {
                        setIsAnnotatingId(sig.id);
                        setAnnotationInput(sig.userAnnotation || '');
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#141d33] hover:bg-[#1a2542] border border-[#1e2c4a] text-slate-300 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3 text-cyan-400" />
                      <span>{sig.userAnnotation ? 'Edit Note' : 'Annotate'}</span>
                    </button>

                    {sig.reviewStatus !== 'accepted' && (
                      <button
                        onClick={() => onAcceptSignal(sig.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Accept Finding</span>
                      </button>
                    )}

                    {sig.reviewStatus !== 'rejected' && (
                      <button
                        onClick={() => onRejectSignal(sig.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-300 transition-colors"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                    )}

                    {sig.reviewStatus !== 'unreviewed' && (
                      <span className="px-2 py-0.5 rounded bg-[#090d18] border border-[#1c2948] text-slate-300 text-[10px] uppercase font-bold">
                        Reviewed: {sig.reviewStatus}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
