import React from 'react';
import {
  ArrowRightLeft,
  CheckCircle,
  AlertOctagon,
  HelpCircle,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  Calculator,
  ArrowRight,
  Info,
} from 'lucide-react';
import type { EvidenceRecord, Signal, Thesis, ThesisAssumption } from '../types.ts';

interface ChangeEngineModuleProps {
  thesis: Thesis;
  signals: Signal[];
  evidenceList: EvidenceRecord[];
  onRunEngine: () => void;
  isRunning: boolean;
  onSelectEvidence: (evidence: EvidenceRecord) => void;
}

export const ChangeEngineModule: React.FC<ChangeEngineModuleProps> = ({
  thesis,
  signals,
  evidenceList,
  onRunEngine,
  isRunning,
  onSelectEvidence,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                MODULE D // THESIS CHANGE ENGINE
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-800">
                DETERMINISTIC PRECISION ENGINE
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-1">
              Comparative Analytical Matrix: Baseline vs Reported Evidence
            </h2>
          </div>

          <button
            onClick={onRunEngine}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-mono font-bold shadow-md transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Recalculating Deltas...' : 'Run Change Engine Scan'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          The defining analytical core of THESIS//OS. Compares newly ingested SEC disclosures against individual thesis assumptions using strictly deterministic formulas for numerical calculations, while applying contextual analysis for alternative explanations.
        </p>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="space-y-4">
        {thesis.assumptions.map((assump, index) => {
          const matchingSignal = signals.find((s) => s.assumptionId === assump.id);
          const isContradicted = assump.status === 'contradicted';
          const isSupported = assump.status === 'supported';

          return (
            <div
              key={assump.id}
              className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg overflow-hidden transition-all hover:border-[#2d416b] shadow-sm"
            >
              {/* Card Header: Assumption Statement + Status */}
              <div className="bg-[#10182b] px-4 py-3 border-b border-[#1b2847] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    ASSUMPTION 0{index + 1} // [{assump.category.toUpperCase()}]
                  </span>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      isContradicted
                        ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                        : isSupported
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {assump.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  Target Hurdle: <strong className="text-cyan-300">{assump.targetThreshold}</strong>
                </div>
              </div>

              {/* Statement */}
              <div className="p-4 pb-3">
                <h3 className="text-sm font-semibold text-slate-100 leading-relaxed">
                  "{assump.statement}"
                </h3>
              </div>

              {/* 3-Column Delta Breakdown: Prior vs New vs Mathematical Delta */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-b border-[#1a2744] divide-y md:divide-y-0 md:divide-x divide-[#1a2744] bg-[#090d18] text-xs">
                {/* Col 1: Previous Evidence */}
                <div className="p-3.5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                    1. Previous Evidence (Baseline)
                  </span>
                  <div className="text-sm font-mono font-bold text-slate-200">
                    {assump.baselineValue}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Established upon initial thesis formation (FY2024 Baseline).
                  </p>
                </div>

                {/* Col 2: New Evidence */}
                <div className="p-3.5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                    2. Newly Reported Evidence
                  </span>
                  <div
                    className={`text-sm font-mono font-bold ${
                      isContradicted ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {assump.currentValue || 'Pending Disclosure'}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Latest Period: {assump.currentPeriod || 'N/A'} (Verified SEC 10-Q)
                  </p>
                </div>

                {/* Col 3: Calculated Delta & Hurdle */}
                <div className="p-3.5 space-y-1 bg-[#0c1222]">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 block font-bold flex items-center gap-1">
                    <Calculator className="w-3 h-3 text-cyan-400" />
                    3. Deterministic Delta Formula
                  </span>
                  <div className="text-xs font-mono font-semibold text-slate-100">
                    {matchingSignal?.deltaCalculation?.formula ||
                      `Delta = ${assump.currentValue || 'N/A'} vs Target ${assump.targetThreshold}`}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Threshold Breached:{' '}
                    <strong className={isContradicted ? 'text-rose-400' : 'text-emerald-400'}>
                      {isContradicted ? 'YES (Triggered Under Review)' : 'NO (Compliant)'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Analytical Interpretation & Uncertainty Resolution */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-[#10182b] border border-[#1a2744]">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                    Why This Delta Matters:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {assump.statusReason}
                  </p>
                </div>

                <div className="p-3 rounded bg-[#10182b] border border-[#1a2744]">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">
                    Uncertainty & What Evidence Would Resolve It:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {matchingSignal?.suggestedInvestigation ||
                      'Review next quarterly 10-Q filing notes and customer renewal telemetry to confirm whether change is structural or transient.'}
                  </p>
                </div>
              </div>

              {/* Source Citation Footer */}
              {matchingSignal?.sourceReferences && (
                <div className="px-4 py-2.5 bg-[#090d18] border-t border-[#18233c] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="text-slate-400">Underlying Source Provenance:</span>
                  <div className="flex items-center gap-2">
                    {matchingSignal.sourceReferences.map((ref, i) => (
                      <a
                        key={i}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1"
                      >
                        <span>{ref.docType} ({ref.citation})</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
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
