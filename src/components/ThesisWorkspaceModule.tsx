import React, { useState } from 'react';
import {
  Target,
  Edit3,
  Plus,
  Trash2,
  Calendar,
  AlertOctagon,
  Clock,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Save,
  Layers,
  ChevronDown,
  Info,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import type { Catalyst, Thesis, ThesisAssumption } from '../types.ts';

interface ThesisWorkspaceModuleProps {
  thesis: Thesis;
  onUpdateThesis: (updated: Thesis) => void;
  onOpenSaveVersionModal: () => void;
  onOpenEditAssumptionModal: (assumption?: ThesisAssumption) => void;
}

export const ThesisWorkspaceModule: React.FC<ThesisWorkspaceModuleProps> = ({
  thesis,
  onUpdateThesis,
  onOpenSaveVersionModal,
  onOpenEditAssumptionModal,
}) => {
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState(thesis.thesisSummary);
  const [narrativeDraft, setNarrativeDraft] = useState(thesis.coreNarrative);
  const [horizonDraft, setHorizonDraft] = useState(thesis.investmentHorizon);
  const [directionDraft, setDirectionDraft] = useState<Thesis['direction']>(thesis.direction);
  const [statusDraft, setStatusDraft] = useState<Thesis['status']>(thesis.status);

  // New Invalidation Condition / Question drafts
  const [newConditionInput, setNewConditionInput] = useState('');
  const [newQuestionInput, setNewQuestionInput] = useState('');
  const [newCatalystTitle, setNewCatalystTitle] = useState('');
  const [newCatalystDate, setNewCatalystDate] = useState('');

  const handleSaveMeta = () => {
    onUpdateThesis({
      ...thesis,
      thesisSummary: summaryDraft,
      coreNarrative: narrativeDraft,
      investmentHorizon: horizonDraft,
      direction: directionDraft,
      status: statusDraft,
      lastReviewedAt: new Date().toISOString(),
    });
    setIsEditingMeta(false);
  };

  const handleDeleteAssumption = (id: string) => {
    const updated = thesis.assumptions.filter((a) => a.id !== id);
    onUpdateThesis({
      ...thesis,
      assumptions: updated,
      lastReviewedAt: new Date().toISOString(),
    });
  };

  const handleAddInvalidationCondition = () => {
    if (!newConditionInput.trim()) return;
    onUpdateThesis({
      ...thesis,
      invalidationConditions: [...thesis.invalidationConditions, newConditionInput.trim()],
      lastReviewedAt: new Date().toISOString(),
    });
    setNewConditionInput('');
  };

  const handleDeleteInvalidationCondition = (index: number) => {
    const updated = [...thesis.invalidationConditions];
    updated.splice(index, 1);
    onUpdateThesis({
      ...thesis,
      invalidationConditions: updated,
      lastReviewedAt: new Date().toISOString(),
    });
  };

  const handleAddQuestion = () => {
    if (!newQuestionInput.trim()) return;
    onUpdateThesis({
      ...thesis,
      openQuestions: [...thesis.openQuestions, newQuestionInput.trim()],
      lastReviewedAt: new Date().toISOString(),
    });
    setNewQuestionInput('');
  };

  const handleDeleteQuestion = (index: number) => {
    const updated = [...thesis.openQuestions];
    updated.splice(index, 1);
    onUpdateThesis({
      ...thesis,
      openQuestions: updated,
      lastReviewedAt: new Date().toISOString(),
    });
  };

  const handleAddCatalyst = () => {
    if (!newCatalystTitle.trim()) return;
    const newCat: Catalyst = {
      id: `cat-${Date.now()}`,
      title: newCatalystTitle.trim(),
      expectedDate: newCatalystDate || 'TBD',
      description: 'Catalyst tracking milestone added by analyst.',
      status: 'pending',
    };
    onUpdateThesis({
      ...thesis,
      expectedCatalysts: [...thesis.expectedCatalysts, newCat],
      lastReviewedAt: new Date().toISOString(),
    });
    setNewCatalystTitle('');
    setNewCatalystDate('');
  };

  const getStatusBadge = (status: ThesisAssumption['status']) => {
    switch (status) {
      case 'supported':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-bold uppercase">
            <CheckCircle className="w-3 h-3" />
            Supported by Evidence
          </span>
        );
      case 'partially_supported':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800 font-bold uppercase">
            <AlertTriangle className="w-3 h-3" />
            Partially Supported
          </span>
        );
      case 'contradicted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800 font-bold uppercase">
            <AlertOctagon className="w-3 h-3" />
            Contradicted by Evidence
          </span>
        );
      case 'stale_evidence':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold uppercase">
            <Clock className="w-3 h-3" />
            Stale Evidence
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800 font-bold uppercase">
            <HelpCircle className="w-3 h-3" />
            Unresolved
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Thesis Meta Bar */}
      <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                MODULE B // THESIS WORKSPACE
              </span>
              <span className="text-xs font-mono text-slate-400">• Version {thesis.version}.0</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-1">
              {thesis.company} ({thesis.ticker}:{thesis.exchange})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {!isEditingMeta ? (
              <>
                <button
                  onClick={() => {
                    setSummaryDraft(thesis.thesisSummary);
                    setNarrativeDraft(thesis.coreNarrative);
                    setHorizonDraft(thesis.investmentHorizon);
                    setDirectionDraft(thesis.direction);
                    setStatusDraft(thesis.status);
                    setIsEditingMeta(true);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#141d33] hover:bg-[#1c2948] border border-[#1e2c4a] text-xs font-mono text-slate-200 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Edit Thesis Framing</span>
                </button>
                <button
                  onClick={onOpenSaveVersionModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-xs font-mono font-medium text-white shadow-sm transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Revised Version (v{thesis.version + 1})</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditingMeta(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-xs font-mono text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMeta}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-xs font-mono text-white font-medium"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Framing Body */}
        {!isEditingMeta ? (
          <div className="space-y-3 pt-3 border-t border-[#1a2744]">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Direction:</span>
                <span className={`px-2 py-0.5 rounded font-bold uppercase ${thesis.direction === 'long' ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800' : 'bg-rose-950/70 text-rose-400 border border-rose-800'}`}>
                  {thesis.direction}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Horizon:</span>
                <span className="text-slate-200 font-semibold">{thesis.investmentHorizon}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Status:</span>
                <span className="text-amber-400 font-semibold uppercase">{thesis.status.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">CIK:</span>
                <span className="text-slate-300">{thesis.cik}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Thesis Summary:</span>
              <p className="text-sm text-slate-200 leading-relaxed font-medium bg-[#0a0f1d] p-3 rounded border border-[#16233d]">
                {thesis.thesisSummary}
              </p>
            </div>

            <div>
              <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Core Analytical Narrative:</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#0a0f1d] p-3 rounded border border-[#16233d]">
                {thesis.coreNarrative}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-3 border-t border-[#1a2744] text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Thesis Direction</label>
                <select
                  value={directionDraft}
                  onChange={(e) => setDirectionDraft(e.target.value as Thesis['direction'])}
                  className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 font-mono"
                >
                  <option value="long">LONG THESIS</option>
                  <option value="short">SHORT THESIS</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Investment Horizon</label>
                <input
                  type="text"
                  value={horizonDraft}
                  onChange={(e) => setHorizonDraft(e.target.value)}
                  className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Thesis Status</label>
                <select
                  value={statusDraft}
                  onChange={(e) => setStatusDraft(e.target.value as Thesis['status'])}
                  className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 font-mono"
                >
                  <option value="active">ACTIVE</option>
                  <option value="under_review">UNDER REVIEW</option>
                  <option value="invalidated">INVALIDATED</option>
                  <option value="archived">ARCHIVED</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Summary Statement</label>
              <textarea
                value={summaryDraft}
                onChange={(e) => setSummaryDraft(e.target.value)}
                rows={2}
                className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Core Analytical Narrative</label>
              <textarea
                value={narrativeDraft}
                onChange={(e) => setNarrativeDraft(e.target.value)}
                rows={4}
                className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Core Assumptions Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono uppercase tracking-wider">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Core Trackable Assumptions ({thesis.assumptions.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Each assumption must have measurable thresholds and explicit invalidation criteria.
            </p>
          </div>

          <button
            onClick={() => onOpenEditAssumptionModal()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#141d33] hover:bg-[#1a2542] border border-[#1e2c4a] text-cyan-400 text-xs font-mono font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Core Assumption</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {thesis.assumptions.map((assump, index) => (
            <div
              key={assump.id}
              className="bg-[#0d1322] border border-[#1e2c4a] hover:border-[#2d416b] rounded-lg p-5 transition-all shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    A0{index + 1} // [{assump.category.toUpperCase()}]
                  </span>
                  {getStatusBadge(assump.status)}
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <button
                    onClick={() => onOpenEditAssumptionModal(assump)}
                    className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-[#141d33] transition-colors"
                    title="Edit Assumption Parameters"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAssumption(assump.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-[#141d33] transition-colors"
                    title="Delete Assumption"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Assumption Statement */}
              <h4 className="text-sm font-semibold text-slate-100 mb-3 leading-relaxed">
                "{assump.statement}"
              </h4>

              {/* Threshold & Baseline Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs font-mono">
                <div className="p-2.5 rounded bg-[#090d18] border border-[#182642]">
                  <span className="text-slate-400 text-[10px] uppercase block">Target Hurdle:</span>
                  <span className="text-cyan-300 font-bold text-xs mt-0.5 block">{assump.targetThreshold}</span>
                </div>

                <div className="p-2.5 rounded bg-[#090d18] border border-[#182642]">
                  <span className="text-slate-400 text-[10px] uppercase block">Baseline Value:</span>
                  <span className="text-slate-200 font-medium text-xs mt-0.5 block">{assump.baselineValue}</span>
                </div>

                <div className="p-2.5 rounded bg-[#090d18] border border-[#182642]">
                  <span className="text-slate-400 text-[10px] uppercase block">Latest Reported:</span>
                  <span className={`font-bold text-xs mt-0.5 block ${assump.status === 'contradicted' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {assump.currentValue || 'Pending Next Filing'}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#090d18] border border-[#182642]">
                  <span className="text-slate-400 text-[10px] uppercase block">Period Assessed:</span>
                  <span className="text-slate-300 text-xs mt-0.5 block">{assump.currentPeriod || 'N/A'}</span>
                </div>
              </div>

              {/* Status Reason Explanation (Mandated by Section 5) */}
              <div className="p-3 rounded bg-[#10182b] border border-[#1a2744] text-xs mb-3">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  Status Rationale // Why this status was assigned:
                </span>
                <p className="text-slate-300 leading-relaxed">{assump.statusReason}</p>
              </div>

              {/* Invalidation Trigger */}
              <div className="text-xs flex items-start gap-2 text-rose-300 bg-rose-950/20 border border-rose-900/40 p-2.5 rounded">
                <AlertOctagon className="w-3.5 h-3.5 mt-0.5 text-rose-400 shrink-0" />
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-rose-400 block">
                    Specific Invalidation Trigger:
                  </span>
                  <span>{assump.invalidationTrigger}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invalidation Conditions & Expected Catalysts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invalidation Conditions */}
        <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              Thesis Invalidation Conditions
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              {thesis.invalidationConditions.length} Rules
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Explicit, pre-committed boundaries that force formal thesis invalidation or closure.
          </p>

          <div className="space-y-2 mb-4">
            {thesis.invalidationConditions.map((cond, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-2 p-2.5 rounded bg-[#10182b] border border-[#1b2847] text-xs"
              >
                <div className="flex items-start gap-2">
                  <span className="font-mono text-rose-400 font-bold text-[11px]">0{i + 1}</span>
                  <span className="text-slate-200 leading-snug">{cond}</span>
                </div>
                <button
                  onClick={() => handleDeleteInvalidationCondition(i)}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                  title="Remove condition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-[#18233c]">
            <input
              type="text"
              value={newConditionInput}
              onChange={(e) => setNewConditionInput(e.target.value)}
              placeholder="Add measurable invalidation condition..."
              className="flex-1 bg-[#090d18] border border-[#1e2c4a] rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddInvalidationCondition();
              }}
            />
            <button
              onClick={handleAddInvalidationCondition}
              className="px-3 py-1.5 rounded bg-[#141d33] hover:bg-[#1a2542] border border-[#1e2c4a] text-rose-400 text-xs font-mono"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Expected Catalysts */}
        <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Expected Catalysts & Events
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              {thesis.expectedCatalysts.length} Events
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Critical upcoming dates or disclosures expected to prove or disprove core assumptions.
          </p>

          <div className="space-y-2 mb-4">
            {thesis.expectedCatalysts.map((cat) => (
              <div
                key={cat.id}
                className="p-2.5 rounded bg-[#10182b] border border-[#1b2847] text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-100">{cat.title}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#16223b] text-cyan-300 border border-[#233457]">
                    {cat.expectedDate}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{cat.description}</p>
                {cat.impactAssessment && (
                  <div className="text-[10px] font-mono text-amber-300 pt-1 border-t border-[#182642]">
                    Impact: {cat.impactAssessment}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-[#18233c]">
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={newCatalystTitle}
                onChange={(e) => setNewCatalystTitle(e.target.value)}
                placeholder="Catalyst event title..."
                className="col-span-2 bg-[#090d18] border border-[#1e2c4a] rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                value={newCatalystDate}
                onChange={(e) => setNewCatalystDate(e.target.value)}
                placeholder="YYYY-MM-DD"
                className="bg-[#090d18] border border-[#1e2c4a] rounded px-2 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              onClick={handleAddCatalyst}
              className="w-full py-1.5 rounded bg-[#141d33] hover:bg-[#1a2542] border border-[#1e2c4a] text-cyan-400 text-xs font-mono"
            >
              + Add Catalyst Milestone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
