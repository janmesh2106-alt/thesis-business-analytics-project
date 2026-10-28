import React, { useState } from 'react';
import {
  X,
  FileText,
  Sparkles,
  Plus,
  Save,
  Database,
  Building2,
  TrendingUp,
  TrendingDown,
  Layers,
} from 'lucide-react';
import type { DocumentType, EvidenceRecord, Thesis, ThesisAssumption } from '../types.ts';

// 1. ADD EVIDENCE MODAL
interface AddEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvidence: (newEvidence: Partial<EvidenceRecord>, runAIAnalysis: boolean) => void;
  thesis: Thesis;
}

export const AddEvidenceModal: React.FC<AddEvidenceModalProps> = ({
  isOpen,
  onClose,
  onAddEvidence,
  thesis,
}) => {
  const [sourceTitle, setSourceTitle] = useState('');
  const [docType, setDocType] = useState<DocumentType>('10-Q');
  const [reportingPeriod, setReportingPeriod] = useState('Q4 FY2025');
  const [publicationDate, setPublicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [relatedAssumptionId, setRelatedAssumptionId] = useState(thesis.assumptions[0]?.id || '');
  const [runAIAnalysis, setRunAIAnalysis] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceTitle.trim() || !excerpt.trim()) return;

    onAddEvidence(
      {
        sourceTitle: sourceTitle.trim(),
        issuer: thesis.company,
        ticker: thesis.ticker,
        docType,
        reportingPeriod,
        publicationDate,
        originalUrl: originalUrl.trim() || `https://www.sec.gov/edgar/browse/?CIK=${thesis.cik}`,
        accessionNumber: `MANUAL-${Date.now().toString().slice(-6)}`,
        excerpt: excerpt.trim(),
        relatedAssumptionIds: relatedAssumptionId ? [relatedAssumptionId] : [],
        verificationStatus: docType.startsWith('10-') ? 'verified_sec' : 'official_release',
      },
      runAIAnalysis
    );
    onClose();
  };

  const handleFillSampleFiling = () => {
    setSourceTitle(`SEC Form 10-Q (${reportingPeriod})`);
    setDocType('10-Q');
    setOriginalUrl(`https://www.sec.gov/Archives/edgar/data/${thesis.cik}/snow-sample.htm`);
    setExcerpt(
      `Product revenue for the quarter was $940.5 million, representing 27.8% year-over-year growth. Net revenue retention rate was 124%. Remaining performance obligations grew 52% to $6.1 billion. Non-GAAP gross margin was 75.2%. Management noted: 'Customer enterprise AI workload trials transitioned to production, driving accelerated query consumption.'`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
      <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg max-w-2xl w-full p-6 shadow-2xl relative space-y-4">
        <div className="flex items-center justify-between border-b border-[#1a2744] pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold text-slate-100 uppercase">
              Ingest New Evidence Document // {thesis.ticker}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Manual upload or SEC filing paste:</span>
            <button
              type="button"
              onClick={handleFillSampleFiling}
              className="text-[11px] font-mono text-cyan-400 hover:underline"
            >
              Fill Sample Q4 10-Q Filing Excerpt
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Document Title</label>
              <input
                type="text"
                required
                value={sourceTitle}
                onChange={(e) => setSourceTitle(e.target.value)}
                placeholder="e.g. SEC Form 10-Q (Q4 FY2025)"
                className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentType)}
                className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 font-mono"
              >
                <option value="10-Q">10-Q Quarterly Report</option>
                <option value="10-K">10-K Annual Report</option>
                <option value="8-K">8-K Current Report</option>
                <option value="EARNINGS_RELEASE">Earnings Release</option>
                <option value="EARNINGS_TRANSCRIPT">Call Transcript</option>
                <option value="CUSTOM_IMPORT">Custom Text Import</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Reporting Period</label>
              <input
                type="text"
                value={reportingPeriod}
                onChange={(e) => setReportingPeriod(e.target.value)}
                placeholder="e.g. Q4 FY2025"
                className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Publication Date</label>
              <input
                type="date"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Original SEC EDGAR URL or Filing Identifier</label>
            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://www.sec.gov/ix?doc=/Archives/edgar/data/..."
              className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 font-mono text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Filing / Disclosure Excerpt Text</label>
            <textarea
              required
              rows={5}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Paste exact text excerpt from disclosure..."
              className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 font-sans text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Link to Primary Target Assumption</label>
            <select
              value={relatedAssumptionId}
              onChange={(e) => setRelatedAssumptionId(e.target.value)}
              className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 font-mono text-xs"
            >
              {thesis.assumptions.map((a) => (
                <option key={a.id} value={a.id}>
                  [{a.category.toUpperCase()}] {a.statement.slice(0, 70)}...
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="runAI"
              checked={runAIAnalysis}
              onChange={(e) => setRunAIAnalysis(e.target.checked)}
              className="accent-cyan-400 rounded"
            />
            <label htmlFor="runAI" className="text-slate-300 font-mono text-[11px] cursor-pointer flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Automatically trigger AI claim extraction and Change Detection</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#1a2744]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium"
            >
              Ingest & Extract Claims
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. EDIT / ADD ASSUMPTION MODAL
interface EditAssumptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assumption: ThesisAssumption) => void;
  initialData?: ThesisAssumption | null;
}

export const EditAssumptionModal: React.FC<EditAssumptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const isEditing = !!initialData;

  const [statement, setStatement] = useState(initialData?.statement || '');
  const [category, setCategory] = useState<ThesisAssumption['category']>(
    initialData?.category || 'revenue'
  );
  const [metricName, setMetricName] = useState(initialData?.metricName || 'Product Revenue Growth');
  const [targetThreshold, setTargetThreshold] = useState(initialData?.targetThreshold || '>= 30.0%');
  const [targetPeriod, setTargetPeriod] = useState(initialData?.targetPeriod || 'FY2025 Quarters');
  const [baselineValue, setBaselineValue] = useState(initialData?.baselineValue || '34.2% (FY24)');
  const [currentValue, setCurrentValue] = useState(initialData?.currentValue || '');
  const [invalidationTrigger, setInvalidationTrigger] = useState(
    initialData?.invalidationTrigger || 'Deceleration below 25.0% YoY.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement.trim() || !targetThreshold.trim()) return;

    onSave({
      id: initialData?.id || `asmp-${Date.now()}`,
      category,
      statement: statement.trim(),
      metricName: metricName.trim(),
      targetThreshold: targetThreshold.trim(),
      targetPeriod: targetPeriod.trim(),
      baselineValue: baselineValue.trim(),
      currentValue: currentValue.trim() || undefined,
      currentPeriod: initialData?.currentPeriod || 'Pending Filing',
      status: initialData?.status || 'unresolved',
      statusReason: initialData?.statusReason || 'Newly configured assumption awaiting evaluation.',
      affectedSignalIds: initialData?.affectedSignalIds || [],
      evidenceCount: initialData?.evidenceCount || 0,
      lastAssessedAt: new Date().toISOString(),
      invalidationTrigger: invalidationTrigger.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
      <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg max-w-xl w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1a2744] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold text-slate-100 uppercase">
              {isEditing ? 'Edit Core Assumption' : 'Add New Core Assumption'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 font-mono"
            >
              <option value="revenue">Revenue Growth</option>
              <option value="margin">Gross / Operating Margin</option>
              <option value="fcf">Free Cash Flow</option>
              <option value="unit_economics">Unit Economics & Retention</option>
              <option value="balance_sheet">Balance Sheet & Leverage</option>
              <option value="market_share">Market Share & RPO</option>
              <option value="other">Other Indicator</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Assumption Statement</label>
            <textarea
              required
              rows={3}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="e.g. Product revenue growth sustains >= 30.0% YoY as AI adoption ramps..."
              className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 font-sans focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Target Hurdle / Threshold</label>
              <input
                type="text"
                required
                value={targetThreshold}
                onChange={(e) => setTargetThreshold(e.target.value)}
                placeholder="e.g. >= 30.0% or <= 3.0x"
                className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Baseline Value</label>
              <input
                type="text"
                value={baselineValue}
                onChange={(e) => setBaselineValue(e.target.value)}
                placeholder="e.g. 34.2% (FY24)"
                className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Specific Invalidation Trigger</label>
            <input
              type="text"
              required
              value={invalidationTrigger}
              onChange={(e) => setInvalidationTrigger(e.target.value)}
              placeholder="Condition that definitively disproves this assumption..."
              className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#1a2744]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium"
            >
              Save Assumption
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. SAVE VERSION MODAL
interface SaveVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSave: (changeSummary: string) => void;
  nextVersion: number;
}

export const SaveVersionModal: React.FC<SaveVersionModalProps> = ({
  isOpen,
  onClose,
  onConfirmSave,
  nextVersion,
}) => {
  const [summary, setSummary] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;
    onConfirmSave(summary.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
      <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1a2744] pb-3">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold text-slate-100 uppercase">
              Save Revised Thesis Version (v{nextVersion}.0)
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <p className="text-slate-300 text-xs leading-relaxed">
            Preserves an immutable snapshot of the existing version and records field mutations in the audit trail.
          </p>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Version Change Summary / Analyst Rationalization:
            </label>
            <textarea
              required
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g. Placed thesis UNDER REVIEW after Q2/Q3 10-Qs revealed Product Revenue growth slowing to 28.3%..."
              className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 font-sans focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#1a2744]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium"
            >
              Commit Snapshot v{nextVersion}.0
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
