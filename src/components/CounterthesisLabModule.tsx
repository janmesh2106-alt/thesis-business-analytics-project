import React, { useState } from 'react';
import {
  Crosshair,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Save,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import type { CounterThesisAnalysis, EvidenceRecord, Thesis } from '../types.ts';

interface CounterthesisLabModuleProps {
  thesis: Thesis;
  counterthesis: CounterThesisAnalysis;
  evidenceList: EvidenceRecord[];
  onUpdateCounterthesis: (updated: CounterThesisAnalysis) => void;
  onGenerateAIReview: () => void;
  isGeneratingAI: boolean;
}

export const CounterthesisLabModule: React.FC<CounterthesisLabModuleProps> = ({
  thesis,
  counterthesis,
  evidenceList,
  onUpdateCounterthesis,
  onGenerateAIReview,
  isGeneratingAI,
}) => {
  const [editingProbeId, setEditingProbeId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string>('');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('');
  const [probeStatus, setProbeStatus] = useState<any>('countered');

  const handleStartEditProbe = (probe: any) => {
    setEditingProbeId(probe.id);
    setResponseText(probe.userResponse || '');
    setSelectedEvidenceId(probe.linkedEvidenceIds?.[0] || '');
    setProbeStatus(probe.status || 'countered');
  };

  const handleSaveProbeResponse = (probeId: string) => {
    const updatedProbes = counterthesis.skepticalAnalystProbes.map((p) => {
      if (p.id === probeId) {
        return {
          ...p,
          userResponse: responseText,
          status: probeStatus,
          linkedEvidenceIds: selectedEvidenceId ? [selectedEvidenceId] : [],
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });

    onUpdateCounterthesis({
      ...counterthesis,
      skepticalAnalystProbes: updatedProbes,
    });
    setEditingProbeId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                MODULE E // COUNTERTHESIS LAB
              </span>
              <span className="text-xs font-mono text-purple-300 font-bold px-1.5 py-0.5 rounded bg-purple-950/70 border border-purple-800">
                ADVERSARIAL STRESS-TEST
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-1">
              Structured Counteranalysis & Confirmation Bias Mitigation
            </h2>
          </div>

          <button
            onClick={onGenerateAIReview}
            disabled={isGeneratingAI}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-mono font-bold shadow-md transition-all"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? 'Synthesizing Counterthesis...' : 'Refresh Adversarial Probes'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Institutional research discipline requires actively challenging convictions. THESIS//OS systematically constructs the strongest adversarial bear case, audits confirmation bias, and records analyst responses grounded in documentary evidence.
        </p>
      </div>

      {/* Bull Case vs Bear Case Tension Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strongest Bull Case */}
        <div className="bg-[#0d1322] border border-emerald-900/50 rounded-lg p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              STRONGEST BULL ARGUMENT
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-[10px]">
              THESIS FOUNDATION
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed bg-[#080d19] p-3.5 rounded border border-[#16273f]">
            {counterthesis.strongestBullCase}
          </p>
        </div>

        {/* Strongest Bear Case */}
        <div className="bg-[#0d1322] border border-rose-900/50 rounded-lg p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-400">
            <span className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" />
              STRONGEST ADVERSARIAL BEAR CASE
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-[10px]">
              STRUCTURAL RISK
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed bg-[#080d19] p-3.5 rounded border border-[#2f1823]">
            {counterthesis.strongestBearCase}
          </p>
        </div>
      </div>

      {/* Critical Assumption at Risk Highlight */}
      <div className="bg-[#120d1c] border border-purple-800/60 rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-purple-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-purple-400" />
            Most Vulnerable Core Assumption Under Test
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700">
            HIGH PROBABILITY DEFECT
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-100">
          "{counterthesis.criticalAssumptionAtRisk.statement}"
        </h3>

        <div className="text-xs text-slate-300 bg-[#090710] p-3 rounded border border-purple-900/50 leading-relaxed">
          <strong className="text-purple-300 font-mono text-[11px] block mb-1">
            Why This Assumption May Be Fatally Flawed:
          </strong>
          {counterthesis.criticalAssumptionAtRisk.riskSummary}
        </div>
      </div>

      {/* Alternative Explanations & Confirmation Bias Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Alternative Explanations */}
        <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-5 space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            Alternative Explanations for Observed Trends
          </h3>

          <div className="space-y-2.5 text-xs">
            {counterthesis.alternativeExplanations.map((alt, i) => (
              <div key={i} className="p-3 rounded bg-[#10182b] border border-[#1a2744] flex items-start gap-2">
                <span className="font-mono text-cyan-400 font-bold mt-0.5 text-[11px]">0{i + 1}</span>
                <p className="text-slate-300 leading-relaxed">{alt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmation Bias Checklist */}
        <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-5 space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Confirmation Bias Audit Checklist
          </h3>

          <div className="space-y-2.5 text-xs">
            {counterthesis.confirmationBiasChecks.map((bias, i) => (
              <div key={i} className="p-3 rounded bg-[#10182b] border border-[#1a2744] space-y-1.5">
                <div className="flex items-center justify-between text-amber-300 font-semibold">
                  <span>{bias.biasPattern}</span>
                  <span className="text-[10px] font-mono text-slate-500">BIAS RISK</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{bias.riskDescription}</p>
                <div className="pt-1 text-[11px] font-mono text-cyan-300 border-t border-[#182642]">
                  Mitigation: {bias.mitigationPrompt}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Skeptical Analyst Probes Workspace */}
      <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono uppercase tracking-wider">
            <Crosshair className="w-4 h-4 text-rose-400" />
            <span>Skeptical Analyst Challenge Probes ({counterthesis.skepticalAnalystProbes.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Record formal institutional defenses or concede vulnerabilities with linked evidence citations.
          </p>
        </div>

        <div className="space-y-4">
          {counterthesis.skepticalAnalystProbes.map((probe) => {
            const isEditing = editingProbeId === probe.id;
            const linkedDoc = evidenceList.find((e) => e.id === probe.linkedEvidenceIds?.[0]);

            return (
              <div
                key={probe.id}
                className="bg-[#10182b] border border-[#1a2744] rounded-lg p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                    Challenge Probe // [{probe.category.replace('_', ' ')}]
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      probe.status === 'countered'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : probe.status === 'conceded'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    Status: {probe.status || 'unaddressed'}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-rose-200">
                  {probe.question}
                </h4>

                <div className="p-2.5 rounded bg-[#090e1a] border border-[#17243d] text-xs text-slate-300">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-0.5">
                    Adversarial Argument:
                  </span>
                  {probe.adversarialArgument}
                </div>

                {/* Response Display or Editor */}
                {!isEditing ? (
                  <div className="pt-2 border-t border-[#16233d] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex-1">
                      {probe.userResponse ? (
                        <div className="text-slate-200">
                          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-0.5">
                            Logged Analyst Defense:
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{probe.userResponse}</p>
                          {linkedDoc && (
                            <span className="text-[10px] font-mono text-cyan-300 mt-1 inline-block">
                              Linked Evidence: {linkedDoc.docType} ({linkedDoc.sourceTitle.slice(0, 30)}...)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs italic">
                          No analyst defense recorded yet.
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleStartEditProbe(probe)}
                      className="px-3 py-1.5 rounded bg-[#141d33] hover:bg-[#1c2948] border border-[#1e2c4a] text-xs font-mono text-cyan-400 transition-colors"
                    >
                      {probe.userResponse ? 'Edit Defense' : 'Record Defense'}
                    </button>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-cyan-500/40 space-y-3">
                    <div>
                      <label className="text-[11px] font-mono text-cyan-300 block mb-1">
                        Analyst Response & Counterargument:
                      </label>
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Provide rigorous counterargument grounded in reported numbers..."
                        rows={3}
                        className="w-full bg-[#090d18] border border-[#1e2c4a] rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[11px] font-mono text-slate-400 block mb-1">
                          Link Supporting Evidence Source:
                        </label>
                        <select
                          value={selectedEvidenceId}
                          onChange={(e) => setSelectedEvidenceId(e.target.value)}
                          className="w-full bg-[#090d18] border border-[#1e2c4a] rounded p-2 text-slate-200 font-mono text-xs"
                        >
                          <option value="">None / Narrative Argument</option>
                          {evidenceList.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                              {doc.docType} — {doc.sourceTitle.slice(0, 40)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-slate-400 block mb-1">
                          Probe Status Stance:
                        </label>
                        <select
                          value={probeStatus}
                          onChange={(e) => setProbeStatus(e.target.value)}
                          className="w-full bg-[#090d18] border border-[#1e2c4a] rounded p-2 text-slate-200 font-mono text-xs"
                        >
                          <option value="countered">Countered (Rebutted with data)</option>
                          <option value="under_investigation">Under Investigation (Awaiting disclosure)</option>
                          <option value="conceded">Conceded (Vulnerability accepted)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setEditingProbeId(null)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveProbeResponse(probe.id)}
                        className="px-3.5 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium"
                      >
                        Save Defense
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
