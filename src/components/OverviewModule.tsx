import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { EvidenceRecord, Signal, Thesis } from '../types.ts';
import type { ActiveModule } from './Navigation.tsx';

interface OverviewModuleProps {
  thesis: Thesis;
  signals: Signal[];
  evidenceList: EvidenceRecord[];
  onNavigate: (mod: ActiveModule) => void;
  onAcceptSignal: (signalId: string) => void;
  onRejectSignal: (signalId: string) => void;
  onSelectSignalForInspection: (signal: Signal) => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  thesis,
  signals,
  evidenceList,
  onNavigate,
  onAcceptSignal,
  onRejectSignal,
  onSelectSignalForInspection,
}) => {
  const contradictedCount = thesis.assumptions.filter((a) => a.status === 'contradicted').length;
  const supportedCount = thesis.assumptions.filter((a) => a.status === 'supported').length;
  const partiallySupportedCount = thesis.assumptions.filter(
    (a) => a.status === 'partially_supported'
  ).length;
  const unreviewedSignals = signals.filter((s) => s.reviewStatus === 'unreviewed');
  const highMaterialitySignals = signals.filter((s) => s.materiality === 'high');

  return (
    <div className="space-y-6">
      {/* Institutional Mission Banner: 5 Core Questions */}
      <div className="bg-gradient-to-r from-[#0d1527] via-[#101b33] to-[#0c1322] border border-[#1e2f52] rounded-lg p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <span className="font-mono text-9xl font-black">//</span>
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                INVESTMENT THESIS STATUS // {thesis.ticker} ({thesis.exchange})
              </span>
              <span className="text-xs text-slate-400">• Last Reviewed: {new Date(thesis.lastReviewedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('brief')}
                className="text-xs font-mono text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-800/60 transition-colors"
              >
                <span>Read Full Research Brief</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-slate-100 mb-2 leading-snug">
            {thesis.thesisSummary}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4 pt-4 border-t border-[#1e2f52]/80 text-xs">
            <div className="bg-[#080d1a]/80 p-2.5 rounded border border-[#1a2744]">
              <span className="text-slate-400 block font-mono text-[10px] uppercase">1. Thesis Stance</span>
              <span className="font-semibold text-slate-200 mt-0.5 block flex items-center gap-1">
                {thesis.direction === 'long' ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                )}
                {thesis.direction.toUpperCase()} ({thesis.investmentHorizon})
              </span>
            </div>

            <div className="bg-[#080d1a]/80 p-2.5 rounded border border-[#1a2744]">
              <span className="text-slate-400 block font-mono text-[10px] uppercase">2. What Changed?</span>
              <span className="font-semibold text-rose-300 mt-0.5 block truncate">
                Product Rev decel to 28.3% YoY
              </span>
            </div>

            <div className="bg-[#080d1a]/80 p-2.5 rounded border border-[#1a2744]">
              <span className="text-slate-400 block font-mono text-[10px] uppercase">3. Evidence Balance</span>
              <span className="font-semibold text-amber-300 mt-0.5 block">
                {contradictedCount} Contradicted / {supportedCount} Supported
              </span>
            </div>

            <div className="bg-[#080d1a]/80 p-2.5 rounded border border-[#1a2744]">
              <span className="text-slate-400 block font-mono text-[10px] uppercase">4. Materiality & Conf.</span>
              <span className="font-semibold text-cyan-300 mt-0.5 block">
                HIGH Materiality / SEC 10-Q High
              </span>
            </div>

            <div className="bg-[#080d1a]/80 p-2.5 rounded border border-[#1a2744]">
              <span className="text-slate-400 block font-mono text-[10px] uppercase">5. Next Research Action</span>
              <span className="font-semibold text-slate-200 mt-0.5 block truncate">
                Validate Iceberg query margins
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quantitative Vital Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Thesis Health */}
        <div
          onClick={() => onNavigate('thesis')}
          className="bg-[#0d1322] border border-[#1e2c4a] hover:border-amber-500/50 rounded-lg p-4 cursor-pointer transition-all hover:bg-[#11192e] group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono font-medium uppercase">Thesis Health</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400 uppercase">
              {thesis.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {contradictedCount > 0
              ? `${contradictedCount} core assumption breached target hurdle`
              : 'All assumptions intact'}
          </p>
          <div className="mt-3 flex items-center text-[11px] text-cyan-400 font-mono group-hover:underline">
            <span>Manage 4 Core Assumptions →</span>
          </div>
        </div>

        {/* Card 2: Signal Feed */}
        <div
          onClick={() => onNavigate('signals')}
          className="bg-[#0d1322] border border-[#1e2c4a] hover:border-cyan-500/50 rounded-lg p-4 cursor-pointer transition-all hover:bg-[#11192e] group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono font-medium uppercase">Unreviewed Signals</span>
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">
              {unreviewedSignals.length}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {signals.length} total</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {highMaterialitySignals.length} flagged as HIGH materiality impact
          </p>
          <div className="mt-3 flex items-center text-[11px] text-cyan-400 font-mono group-hover:underline">
            <span>Open Signal Review Queue →</span>
          </div>
        </div>

        {/* Card 3: Evidence Room */}
        <div
          onClick={() => onNavigate('evidence')}
          className="bg-[#0d1322] border border-[#1e2c4a] hover:border-cyan-500/50 rounded-lg p-4 cursor-pointer transition-all hover:bg-[#11192e] group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono font-medium uppercase">Evidence Repository</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {evidenceList.length}
            </span>
            <span className="text-xs text-slate-400 font-mono">Filings & Releases</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            100% verified against official SEC EDGAR accession records
          </p>
          <div className="mt-3 flex items-center text-[11px] text-cyan-400 font-mono group-hover:underline">
            <span>Explore Claim-Level Sources →</span>
          </div>
        </div>

        {/* Card 4: Adversarial Testing */}
        <div
          onClick={() => onNavigate('counterthesis')}
          className="bg-[#0d1322] border border-[#1e2c4a] hover:border-purple-500/50 rounded-lg p-4 cursor-pointer transition-all hover:bg-[#11192e] group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono font-medium uppercase">Adversarial Testing</span>
            <HelpCircle className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-purple-300">
              2 Active Probes
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Iceberg storage disintermediation stress test active
          </p>
          <div className="mt-3 flex items-center text-[11px] text-purple-400 font-mono group-hover:underline">
            <span>Stress Test Counterthesis →</span>
          </div>
        </div>
      </div>

      {/* Main Split: Immediate Signals & Invalidation Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Unresolved Signals & Review Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-200 uppercase font-mono tracking-wider">
                Prioritized Signal Center Feed
              </h3>
            </div>
            <button
              onClick={() => onNavigate('signals')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
            >
              View All ({signals.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {signals.slice(0, 3).map((sig) => {
              const isContradiction = sig.direction === 'contradicts';
              const isSupport = sig.direction === 'supports';

              return (
                <div
                  key={sig.id}
                  className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-4 transition-all hover:border-[#2d416b]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          isContradiction
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                            : isSupport
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {sig.direction.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#162038] text-slate-300 border border-[#233357]">
                        {sig.materiality.toUpperCase()} MATERIALITY
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/50 text-blue-300 border border-blue-900">
                        {sig.reportingPeriod}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-slate-400">Confidence:</span>
                      <span className="text-cyan-400 font-semibold">
                        {(sig.confidenceScore * 100).toFixed(0)}% (SEC Verified)
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-100 mb-2 leading-relaxed">
                    {sig.summary}
                  </p>

                  {sig.deltaCalculation && (
                    <div className="bg-[#080d19] border border-[#1a2744] p-2 rounded mb-3 font-mono text-[11px] text-slate-300">
                      <span className="text-slate-400">Deterministic Delta: </span>
                      <span className={isContradiction ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {sig.deltaCalculation.deltaAbsolute > 0 ? '+' : ''}
                        {sig.deltaCalculation.deltaAbsolute}%
                      </span>
                      <span className="text-slate-500"> ({sig.deltaCalculation.formula})</span>
                    </div>
                  )}

                  <div className="text-xs text-slate-400 line-clamp-2 mb-3">
                    <span className="text-slate-300 font-medium">Why it matters: </span>
                    {sig.whyItMatters}
                  </div>

                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#18233c] text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectSignalForInspection(sig)}
                        className="text-cyan-400 hover:text-cyan-300 text-[11px] font-mono inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Inspect SEC Source</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {sig.reviewStatus === 'unreviewed' ? (
                        <>
                          <button
                            onClick={() => onAcceptSignal(sig.id)}
                            className="px-2.5 py-1 rounded bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[11px] font-mono"
                          >
                            Accept Finding
                          </button>
                          <button
                            onClick={() => onRejectSignal(sig.id)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400 uppercase">
                          Status: <span className="text-slate-200 font-semibold">{sig.reviewStatus}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Invalidation Radar & Immediate Next Actions */}
        <div className="space-y-6">
          {/* Invalidation Conditions Radar */}
          <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold uppercase text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Invalidation Radar
              </span>
              <span className="text-[10px] font-mono text-slate-400">Hurdles</span>
            </div>

            <div className="space-y-3">
              {thesis.invalidationConditions.slice(0, 3).map((cond, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded bg-[#10182b] border border-[#1b2847] text-xs space-y-1.5"
                >
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-rose-400 font-bold text-[11px]">0{i + 1}</span>
                    <p className="text-slate-200 leading-snug">{cond}</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#162340]">
                    <span>Proximity:</span>
                    <span
                      className={
                        i === 0
                          ? 'text-amber-400 font-semibold'
                          : i === 1
                          ? 'text-slate-300'
                          : 'text-slate-400'
                      }
                    >
                      {i === 0 ? 'ALERT: 28.3% (Threshold: < 25%)' : i === 1 ? 'Floor: 125% (Hurdle: < 120%)' : 'Monitoring'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Next Research Actions */}
          <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-4">
            <span className="text-xs font-mono font-semibold uppercase text-slate-300 flex items-center gap-1.5 mb-3">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              Next Recommended Investigations
            </span>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded bg-[#10182b] border border-[#1b2847] flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <p className="text-slate-300">
                  <strong className="text-slate-100">Audit Iceberg table unit economics:</strong> Analyze whether external table queries convert to high-margin compute workloads or permanently lower blended margin.
                </p>
              </div>

              <div className="p-2.5 rounded bg-[#10182b] border border-[#1b2847] flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <p className="text-slate-300">
                  <strong className="text-slate-100">Stress Test in Scenario Lab:</strong> Run 400 bps gross margin compression scenario against full-year FY26 cash flow.
                </p>
              </div>

              <div className="p-2.5 rounded bg-[#10182b] border border-[#1b2847] flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <p className="text-slate-300">
                  <strong className="text-slate-100">Upcoming Catalyst:</strong> Full-year FY25 earnings and initial FY26 product revenue guidance in late February 2025.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
