import React from 'react';
import {
  ShieldAlert,
  ArrowRightLeft,
  FileText,
  Printer,
  Sparkles,
  RefreshCw,
  GitBranch,
  Building2,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import type { Thesis } from '../types.ts';
import { SUPPORTED_COMPANIES } from '../data/companies.ts';

interface HeaderProps {
  currentThesis: Thesis;
  onSelectCompany: (ticker: string) => void;
  onOpenNewThesisModal: () => void;
  onOpenAddEvidenceModal: () => void;
  onRunChangeEngine: () => void;
  onOpenVersionModal: () => void;
  onPrintBrief: () => void;
  isRunningEngine: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentThesis,
  onSelectCompany,
  onOpenNewThesisModal,
  onOpenAddEvidenceModal,
  onRunChangeEngine,
  onOpenVersionModal,
  onPrintBrief,
  isRunningEngine,
}) => {
  const isLong = currentThesis.direction === 'long';

  const getStatusColor = (status: Thesis['status']) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'under_review':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'invalidated':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'archived':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <header className="border-b border-[#1e2c4a] bg-[#0d1322] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40">
      {/* Brand & Ticker Switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-cyan-400 text-sm shadow-sm">
            //
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold tracking-wider text-slate-100">
                THESIS<span className="text-cyan-400">//</span>OS
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-800 text-cyan-300">
                INSTITUTIONAL
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight">
              Evidence-First Investment Intelligence
            </p>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-[#1e2c4a] hidden md:block" />

        {/* Company Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <label htmlFor="company-select" className="sr-only">Select Company</label>
            <select
              id="company-select"
              aria-label="Select Company"
              value={currentThesis.ticker}
              onChange={(e) => {
                if (e.target.value === '__NEW__') {
                  onOpenNewThesisModal();
                } else {
                  onSelectCompany(e.target.value);
                }
              }}
              className="bg-[#141d33] border border-[#1e2c4a] text-xs font-medium text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 pr-7 appearance-none cursor-pointer"
            >
              {SUPPORTED_COMPANIES.map((c) => (
                <option key={c.ticker} value={c.ticker}>
                  {c.ticker} — {c.name} {c.isDemoCase ? '(Demo SEC Case)' : ''}
                </option>
              ))}
              <option value="__NEW__">+ Create New Company Thesis...</option>
            </select>
            <Building2 className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Direction Pill */}
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold px-2 py-1 rounded border ${
              isLong
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700/50'
                : 'bg-rose-950/60 text-rose-400 border-rose-700/50'
            }`}
          >
            {isLong ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {currentThesis.direction.toUpperCase()} THESIS
          </div>

          {/* Status Pill */}
          <div
            className={`text-[11px] font-mono px-2 py-0.5 rounded border ${getStatusColor(
              currentThesis.status
            )} font-semibold uppercase tracking-wider`}
          >
            {currentThesis.status.replace('_', ' ')}
          </div>

          {/* Version badge */}
          <button
            onClick={onOpenVersionModal}
            className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-[#141d33] border border-[#1e2c4a] hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-colors"
            title="Inspect Version History & Diffs"
          >
            <GitBranch className="w-3 h-3 text-cyan-400" />
            <span>v{currentThesis.version}.0</span>
          </button>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRunChangeEngine}
          disabled={isRunningEngine}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 disabled:opacity-50 text-white text-xs font-medium shadow-sm transition-all font-mono"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunningEngine ? 'animate-spin' : ''}`} />
          <span>{isRunningEngine ? 'Scanning Evidence...' : 'Run Change Engine'}</span>
        </button>

        <button
          onClick={onOpenAddEvidenceModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#141d33] hover:bg-[#1a2542] border border-[#1e2c4a] text-slate-200 text-xs font-medium transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>+ Import Evidence</span>
        </button>

        <button
          onClick={onPrintBrief}
          className="p-1.5 rounded bg-[#141d33] hover:bg-[#1a2542] border border-[#1e2c4a] text-slate-300 hover:text-white transition-colors"
          title="Print / Export Research Brief"
          aria-label="Print or Export Research Brief"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
