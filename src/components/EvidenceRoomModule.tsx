import React, { useState } from 'react';
import {
  Database,
  ExternalLink,
  ShieldCheck,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  User,
  Calculator,
  MessageSquare,
  HelpCircle,
  Copy,
  Plus,
} from 'lucide-react';
import type { ClaimType, EvidenceRecord, ExtractedClaim, Thesis } from '../types.ts';

interface EvidenceRoomModuleProps {
  thesis: Thesis;
  evidenceList: EvidenceRecord[];
  selectedEvidenceId?: string;
  onSelectEvidence: (evidence: EvidenceRecord) => void;
  onOpenAddEvidenceModal: () => void;
}

export const EvidenceRoomModule: React.FC<EvidenceRoomModuleProps> = ({
  thesis,
  evidenceList,
  selectedEvidenceId,
  onSelectEvidence,
  onOpenAddEvidenceModal,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterVerification, setFilterVerification] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeEvidence =
    evidenceList.find((e) => e.id === selectedEvidenceId) || evidenceList[0] || null;

  const filteredEvidence = evidenceList.filter((e) => {
    if (filterType !== 'all' && e.docType !== filterType) return false;
    if (filterVerification !== 'all' && e.verificationStatus !== filterVerification) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const inTitle = e.sourceTitle.toLowerCase().includes(term);
      const inExcerpt = e.excerpt.toLowerCase().includes(term);
      const inClaims = e.extractedClaims.some((c) => c.text.toLowerCase().includes(term));
      if (!inTitle && !inExcerpt && !inClaims) return false;
    }
    return true;
  });

  const getVerificationBadge = (status: EvidenceRecord['verificationStatus']) => {
    switch (status) {
      case 'verified_sec':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-bold uppercase">
            <ShieldCheck className="w-3 h-3" />
            Verified SEC EDGAR
          </span>
        );
      case 'official_release':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800 font-bold uppercase">
            <CheckCircle2 className="w-3 h-3" />
            Official Press Release
          </span>
        );
      case 'curated_historical':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800 font-bold uppercase">
            <Database className="w-3 h-3" />
            Curated Historical
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800 font-bold uppercase">
            <AlertTriangle className="w-3 h-3" />
            Unverified Source
          </span>
        );
    }
  };

  const getClaimTypeBadge = (claimType: ClaimType) => {
    switch (claimType) {
      case 'reported_fact':
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800 font-bold uppercase flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5 text-blue-400" />
            Directly Reported Fact
          </span>
        );
      case 'calculated_metric':
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-bold uppercase flex items-center gap-1">
            <Calculator className="w-2.5 h-2.5 text-cyan-400" />
            Calculated Metric
          </span>
        );
      case 'management_statement':
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-bold uppercase flex items-center gap-1">
            <MessageSquare className="w-2.5 h-2.5 text-amber-400" />
            Management Statement
          </span>
        );
      case 'ai_inference':
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800 font-bold uppercase flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-purple-400" />
            AI Inference (Hypothesis)
          </span>
        );
      case 'user_annotation':
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-bold uppercase flex items-center gap-1">
            <User className="w-2.5 h-2.5 text-emerald-400" />
            Analyst Annotation
          </span>
        );
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Evidence Room Header */}
      <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>MODULE C // EVIDENCE ROOM</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                ({evidenceList.length} Verified Filings & Records)
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Source-centric repository with claim-level provenance, strict fact-vs-inference classification, and verifiable SEC EDGAR accessions.
            </p>
          </div>

          <button
            onClick={onOpenAddEvidenceModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Ingest New Filing / Evidence</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#1a2744] text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search source titles, excerpts, or claims..."
              className="w-full bg-[#141d33] border border-[#1e2c4a] rounded pl-8 pr-3 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">Doc Type:</span>
            <select
              aria-label="Filter by Doc Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#141d33] border border-[#1e2c4a] text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">All Document Types</option>
              <option value="10-Q">10-Q Quarterly Report</option>
              <option value="10-K">10-K Annual Report</option>
              <option value="8-K">8-K Current Report</option>
              <option value="EARNINGS_RELEASE">Earnings Release</option>
              <option value="CUSTOM_IMPORT">Custom Import</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">Verification:</span>
            <select
              aria-label="Filter by Verification Status"
              value={filterVerification}
              onChange={(e) => setFilterVerification(e.target.value)}
              className="bg-[#141d33] border border-[#1e2c4a] text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">All Verification Tiers</option>
              <option value="verified_sec">Verified SEC EDGAR</option>
              <option value="official_release">Official Release</option>
              <option value="curated_historical">Curated Historical</option>
              <option value="unverified">Unverified Source</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Document Browser on Left, Detailed Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Document List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400 font-bold px-1">
            Filing Directory ({filteredEvidence.length})
          </div>

          <div className="space-y-2.5">
            {filteredEvidence.map((doc) => {
              const isSelected = activeEvidence?.id === doc.id;

              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectEvidence(doc)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#141e36] border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-[#0d1322] border-[#1e2c4a] hover:border-[#2b3c62] hover:bg-[#10182b]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {doc.docType}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {doc.reportingPeriod}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-slate-200 mb-2 leading-snug line-clamp-1">
                    {doc.sourceTitle}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] font-mono">
                    {getVerificationBadge(doc.verificationStatus)}
                    <span className="text-slate-400">
                      {doc.extractedClaims.length} Claims
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Document & Claims Inspector (7 cols) */}
        <div className="lg:col-span-7">
          {activeEvidence ? (
            <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-5 space-y-5 sticky top-16">
              {/* Document Metadata Bar */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                      {activeEvidence.docType}
                    </span>
                    {getVerificationBadge(activeEvidence.verificationStatus)}
                  </div>

                  <a
                    href={activeEvidence.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    <span>View Official SEC Filing</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <h3 className="text-base font-bold text-slate-100">
                  {activeEvidence.sourceTitle}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#1a2744] text-[11px] font-mono text-slate-400">
                  <div>
                    <span className="block text-slate-500 uppercase">Accession No:</span>
                    <span className="text-slate-200">{activeEvidence.accessionNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 uppercase">Filing Date:</span>
                    <span className="text-slate-200">{activeEvidence.publicationDate}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 uppercase">Reporting Period:</span>
                    <span className="text-slate-200">{activeEvidence.reportingPeriod}</span>
                  </div>
                </div>
              </div>

              {/* Exact Source Excerpt */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                    Primary Disclosure Excerpt:
                  </span>
                  <button
                    onClick={() => copyToClipboard(activeEvidence.excerpt, 'excerpt')}
                    className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 inline-flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedId === 'excerpt' ? 'Copied' : 'Copy Excerpt'}</span>
                  </button>
                </div>
                <div className="bg-[#080d19] border border-[#1b2a47] rounded-md p-3.5 text-xs text-slate-300 leading-relaxed font-sans max-h-56 overflow-y-auto">
                  "{activeEvidence.excerpt}"
                </div>
              </div>

              {/* Extracted Claims with 5 Mandatory Classifications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                    Claim-Level Traceability ({activeEvidence.extractedClaims.length} Claims):
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Fact vs AI Inference Segregation
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeEvidence.extractedClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className="bg-[#10182b] border border-[#1b2847] rounded p-3 text-xs space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {getClaimTypeBadge(claim.claimType)}
                        <span className="text-[10px] font-mono text-slate-400">
                          Confidence: {(claim.confidenceScore * 100).toFixed(0)}%
                        </span>
                      </div>

                      <p className="text-slate-200 font-medium leading-snug">
                        {claim.text}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#16233d] text-[10px] font-mono text-slate-400">
                        <span>Source Anchor: {claim.sourceAnchor}</span>
                        {claim.metricValue && (
                          <span className="text-cyan-300 font-bold">
                            Metric Value: {claim.metricValue} {claim.unit || ''}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-10 text-center text-slate-400 text-xs font-mono">
              Select an evidence document to inspect source excerpt and extracted claims.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
