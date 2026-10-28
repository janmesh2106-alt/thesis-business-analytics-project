import React, { useState } from 'react';
import {
  FileCheck,
  Printer,
  Copy,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import type { ResearchBrief, Thesis } from '../types.ts';

interface ResearchBriefModuleProps {
  brief: ResearchBrief;
  thesis: Thesis;
  onRefreshBriefWithAI: () => void;
  isGeneratingAI: boolean;
}

export const ResearchBriefModule: React.FC<ResearchBriefModuleProps> = ({
  brief,
  thesis,
  onRefreshBriefWithAI,
  isGeneratingAI,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSignedOff, setIsSignedOff] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `# ${brief.title}
**Company:** ${brief.company} (${brief.ticker}) | **Direction:** ${brief.thesisDirection.toUpperCase()} | **Version:** ${brief.version}.0
**Date:** ${new Date(brief.generatedAt).toLocaleDateString()}

## 1. Executive Summary
${brief.executiveSummary}

## 2. What Changed
${brief.whatChanged}

## 3. Assumptions Affected
${brief.keyDeltas.map((d) => `- **${d.assumption}**: Prior: ${d.priorValue} | Reported: ${d.reportedValue} | Delta: ${d.delta} (${d.impact.toUpperCase()})`).join('\n')}

## 4. Supporting Evidence
${brief.supportingEvidence.map((s) => `- ${s.claim} (${s.source}, ${s.date})`).join('\n')}

## 5. Contradicting Evidence
${brief.contradictingEvidence.map((c) => `- ${c.claim} (${c.source}, ${c.date})`).join('\n')}

## 6. Counterthesis Highlights
${brief.counterthesisHighlights}

## 7. Next Research Actions
${brief.nextResearchActions.map((a) => `- ${a}`).join('\n')}

## 8. Sources & Methodology
${brief.sourcesAndMethodology.map((s) => `- ${s}`).join('\n')}
`;

    navigator.clipboard?.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto print:max-w-none print:m-0">
      {/* Control bar (hidden during printing) */}
      <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>MODULE G // RESEARCH BRIEF MEMORANDUM</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional research note with claim-level provenance and deterministic delta reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefreshBriefWithAI}
            disabled={isGeneratingAI}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-mono font-medium transition-colors"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? 'Compiling Synthesis...' : 'Refresh with AI Synthesis'}</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#141d33] hover:bg-[#1c2948] border border-[#1e2c4a] text-xs font-mono text-slate-200 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-400" />
            <span>{copied ? 'Copied MD!' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Institutional Memorandum Container */}
      <div className="bg-[#0b101c] print:bg-white print:text-black border border-[#1e2c4a] print:border-none rounded-lg p-8 shadow-xl space-y-6">
        {/* Memo Header */}
        <div className="border-b-2 border-cyan-500/80 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 print:text-gray-600 mb-2">
            <span>THESIS//OS INSTITUTIONAL EQUITY RESEARCH</span>
            <span>MEMORANDUM v{brief.version}.0 // {new Date(brief.generatedAt).toLocaleDateString()}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-100 print:text-black tracking-tight">
            {brief.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 print:bg-gray-200 print:text-black font-bold">
              {brief.ticker} ({brief.company})
            </span>
            <span
              className={`px-2 py-0.5 rounded font-bold uppercase ${
                brief.thesisDirection === 'long'
                  ? 'bg-emerald-950 text-emerald-400 print:bg-emerald-100 print:text-emerald-800'
                  : 'bg-rose-950 text-rose-400 print:bg-rose-100 print:text-rose-800'
              }`}
            >
              {brief.thesisDirection.toUpperCase()} STANCE
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 print:bg-amber-100 print:text-amber-800 font-bold uppercase">
              STATUS: {thesis.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <section className="space-y-2">
          <h2 className="text-xs font-mono uppercase text-cyan-400 print:text-cyan-700 font-bold tracking-wider">
            1. Executive Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 print:text-gray-900 leading-relaxed bg-[#0e162a] print:bg-gray-50 p-4 rounded border border-[#1b2b4d] print:border-gray-200">
            {brief.executiveSummary}
          </p>
        </section>

        {/* Section 2: What Changed Since Baseline */}
        <section className="space-y-2">
          <h2 className="text-xs font-mono uppercase text-cyan-400 print:text-cyan-700 font-bold tracking-wider">
            2. What Has Changed Since Baseline
          </h2>
          <div className="text-xs sm:text-sm text-slate-300 print:text-gray-800 whitespace-pre-line leading-relaxed bg-[#0e162a] print:bg-gray-50 p-4 rounded border border-[#1b2b4d] print:border-gray-200 font-sans">
            {brief.whatChanged}
          </div>
        </section>

        {/* Section 3: Material Evidence & Assumptions Affected */}
        <section className="space-y-2">
          <h2 className="text-xs font-mono uppercase text-cyan-400 print:text-cyan-700 font-bold tracking-wider">
            3. Key Assumption Deltas & Mathematical Reconciliations
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-[#1e2c4a] print:border-gray-300">
              <thead className="bg-[#10182b] print:bg-gray-100 text-[10px] font-mono uppercase text-slate-400 print:text-gray-600 border-b border-[#1e2c4a] print:border-gray-300">
                <tr>
                  <th className="py-2.5 px-3">Assumption</th>
                  <th className="py-2.5 px-3">Baseline</th>
                  <th className="py-2.5 px-3">Reported</th>
                  <th className="py-2.5 px-3">Calculated Delta</th>
                  <th className="py-2.5 px-3">Impact</th>
                  <th className="py-2.5 px-3">Materiality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18233d] print:divide-gray-200 font-mono text-[11px]">
                {brief.keyDeltas.map((kd, idx) => (
                  <tr key={idx} className="hover:bg-[#10182b]/50">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-200 print:text-black">
                      {kd.assumption}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 print:text-gray-600">{kd.priorValue}</td>
                    <td className="py-2.5 px-3 text-slate-200 print:text-black font-bold">{kd.reportedValue}</td>
                    <td className="py-2.5 px-3 text-cyan-300 print:text-cyan-700">{kd.delta}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          kd.impact === 'contradicted'
                            ? 'bg-rose-950 text-rose-300 print:bg-rose-100 print:text-rose-800'
                            : kd.impact === 'supported'
                            ? 'bg-emerald-950 text-emerald-300 print:bg-emerald-100 print:text-emerald-800'
                            : 'bg-slate-800 text-slate-300 print:bg-gray-100 print:text-gray-700'
                        }`}
                      >
                        {kd.impact}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 uppercase text-slate-300 print:text-black font-bold">
                      {kd.materiality}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Supporting Evidence vs Contradicting Evidence */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase text-emerald-400 print:text-emerald-700 font-bold tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              4. Supporting Disclosures
            </h2>
            <div className="space-y-2 text-xs">
              {brief.supportingEvidence.map((s, i) => (
                <div
                  key={i}
                  className="p-3 rounded bg-[#0d1626] print:bg-emerald-50 border border-emerald-900/40 print:border-emerald-200"
                >
                  <p className="text-slate-200 print:text-gray-900 font-medium">{s.claim}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-emerald-300 print:text-emerald-800">
                    <span>{s.source} ({s.date})</span>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-0.5">
                      <span>SEC Source</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase text-rose-400 print:text-rose-700 font-bold tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              5. Contradicting Disclosures
            </h2>
            <div className="space-y-2 text-xs">
              {brief.contradictingEvidence.map((c, i) => (
                <div
                  key={i}
                  className="p-3 rounded bg-[#180e14] print:bg-rose-50 border border-rose-900/40 print:border-rose-200"
                >
                  <p className="text-slate-200 print:text-gray-900 font-medium">{c.claim}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-rose-300 print:text-rose-800">
                    <span>{c.source} ({c.date})</span>
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-0.5">
                      <span>SEC Source</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Counterthesis */}
        <section className="space-y-2">
          <h2 className="text-xs font-mono uppercase text-purple-400 print:text-purple-700 font-bold tracking-wider">
            6. Adversarial Counterthesis Highlights
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 print:text-gray-800 leading-relaxed bg-[#100d1c] print:bg-purple-50 p-4 rounded border border-purple-900/50 print:border-purple-200">
            {brief.counterthesisHighlights}
          </p>
        </section>

        {/* Section 7: Suggested Next Actions */}
        <section className="space-y-2">
          <h2 className="text-xs font-mono uppercase text-cyan-400 print:text-cyan-700 font-bold tracking-wider">
            7. Recommended Follow-Up Investigations
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300 print:text-gray-800">
            {brief.nextResearchActions.map((action, i) => (
              <li key={i}>{action}</li>
            ))}
          </ul>
        </section>

        {/* Section 8: Methodology & Analyst Sign-off */}
        <div className="pt-4 border-t border-[#1e2c4a] print:border-gray-300 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 print:text-gray-600">
          <div>
            <span className="block text-slate-500 uppercase text-[10px]">Methodology Standards:</span>
            <span>All claims verified against SEC EDGAR. Deterministic delta calculations enforced.</span>
          </div>

          <div className="flex items-center gap-2">
            {!isSignedOff ? (
              <button
                onClick={() => setIsSignedOff(true)}
                className="px-3 py-1.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-mono print:hidden"
              >
                Sign Off & Authorize Brief
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold print:text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                SIGNED OFF BY LEAD ANALYST
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
