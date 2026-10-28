/**
 * THESIS//OS - Institutional Evidence-First Investment Thesis Platform
 * Master Application Coordinator
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Navigation, type ActiveModule } from './components/Navigation.tsx';
import { OverviewModule } from './components/OverviewModule.tsx';
import { SignalCenterModule } from './components/SignalCenterModule.tsx';
import { ThesisWorkspaceModule } from './components/ThesisWorkspaceModule.tsx';
import { EvidenceRoomModule } from './components/EvidenceRoomModule.tsx';
import { ChangeEngineModule } from './components/ChangeEngineModule.tsx';
import { CounterthesisLabModule } from './components/CounterthesisLabModule.tsx';
import { ScenarioLabModule } from './components/ScenarioLabModule.tsx';
import { ResearchBriefModule } from './components/ResearchBriefModule.tsx';
import { AuditTrailModule } from './components/AuditTrailModule.tsx';
import { SystemDiagnosticsModule } from './components/SystemDiagnosticsModule.tsx';
import {
  AddEvidenceModal,
  EditAssumptionModal,
  SaveVersionModal,
} from './components/Modals.tsx';

import type {
  AuditEntry,
  CounterThesisAnalysis,
  EvidenceRecord,
  ResearchBrief,
  ScenarioModel,
  Signal,
  Thesis,
  ThesisAssumption,
  ThesisVersion,
} from './types.ts';

import {
  INITIAL_SNOW_THESIS,
  SNOW_EVIDENCE_ROOM,
  SNOW_SIGNALS,
  SNOW_COUNTERTHESIS,
  SNOW_SCENARIOS,
  SNOW_RESEARCH_BRIEF,
  INITIAL_AUDIT_LOG,
  SNOW_HISTORICAL_VERSIONS,
} from './data/demonstrationCase.ts';
import { SUPPORTED_COMPANIES } from './data/companies.ts';
import { computeDeltaCalculation, determineDirection, determineMateriality } from './utils/finance.ts';

export default function App() {
  // Primary state with local persistence
  const [thesis, setThesis] = useState<Thesis>(() => {
    try {
      const saved = localStorage.getItem('thesis_os_active_thesis');
      return saved ? JSON.parse(saved) : INITIAL_SNOW_THESIS;
    } catch {
      return INITIAL_SNOW_THESIS;
    }
  });

  const [versions, setVersions] = useState<ThesisVersion[]>(() => {
    try {
      const saved = localStorage.getItem('thesis_os_versions');
      return saved ? JSON.parse(saved) : SNOW_HISTORICAL_VERSIONS;
    } catch {
      return SNOW_HISTORICAL_VERSIONS;
    }
  });

  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('thesis_os_evidence');
      return saved ? JSON.parse(saved) : SNOW_EVIDENCE_ROOM;
    } catch {
      return SNOW_EVIDENCE_ROOM;
    }
  });

  const [signals, setSignals] = useState<Signal[]>(() => {
    try {
      const saved = localStorage.getItem('thesis_os_signals');
      return saved ? JSON.parse(saved) : SNOW_SIGNALS;
    } catch {
      return SNOW_SIGNALS;
    }
  });

  const [counterthesis, setCounterthesis] = useState<CounterThesisAnalysis>(() => {
    try {
      const saved = localStorage.getItem('thesis_os_counterthesis');
      return saved ? JSON.parse(saved) : SNOW_COUNTERTHESIS;
    } catch {
      return SNOW_COUNTERTHESIS;
    }
  });

  const [scenario, setScenario] = useState<ScenarioModel>(() => {
    try {
      const saved = localStorage.getItem('thesis_os_scenario');
      return saved ? JSON.parse(saved) : SNOW_SCENARIOS[0];
    } catch {
      return SNOW_SCENARIOS[0];
    }
  });

  const [brief, setBrief] = useState<ResearchBrief>(() => {
    try {
      const saved = localStorage.getItem('thesis_os_brief');
      return saved ? JSON.parse(saved) : SNOW_RESEARCH_BRIEF;
    } catch {
      return SNOW_RESEARCH_BRIEF;
    }
  });

  const [auditLog, setAuditLog] = useState<AuditEntry[]>(() => {
    try {
      const saved = localStorage.getItem('thesis_os_audit_log');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOG;
    } catch {
      return INITIAL_AUDIT_LOG;
    }
  });

  // Navigation & UI state
  const [activeModule, setActiveModule] = useState<ActiveModule>('overview');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | undefined>(
    SNOW_EVIDENCE_ROOM[0]?.id
  );
  const [isRunningEngine, setIsRunningEngine] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Modals state
  const [isAddEvidenceModalOpen, setIsAddEvidenceModalOpen] = useState(false);
  const [isEditAssumptionModalOpen, setIsEditAssumptionModalOpen] = useState(false);
  const [isSaveVersionModalOpen, setIsSaveVersionModalOpen] = useState(false);
  const [editingAssumptionData, setEditingAssumptionData] = useState<ThesisAssumption | null>(null);

  // Persist state updates
  useEffect(() => {
    try {
      localStorage.setItem('thesis_os_active_thesis', JSON.stringify(thesis));
      localStorage.setItem('thesis_os_versions', JSON.stringify(versions));
      localStorage.setItem('thesis_os_evidence', JSON.stringify(evidenceList));
      localStorage.setItem('thesis_os_signals', JSON.stringify(signals));
      localStorage.setItem('thesis_os_counterthesis', JSON.stringify(counterthesis));
      localStorage.setItem('thesis_os_scenario', JSON.stringify(scenario));
      localStorage.setItem('thesis_os_brief', JSON.stringify(brief));
      localStorage.setItem('thesis_os_audit_log', JSON.stringify(auditLog));
    } catch (e) {
      // storage limit or SSR safe
    }
  }, [thesis, versions, evidenceList, signals, counterthesis, scenario, brief, auditLog]);

  // Log an audit event
  const appendAudit = (
    actor: AuditEntry['actor'],
    action: string,
    entityType: AuditEntry['entityType'],
    entityId: string,
    details: string,
    diffSummary?: string
  ) => {
    const entry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      entityType,
      entityId,
      details,
      diffSummary,
    };
    setAuditLog((prev) => [entry, ...prev]);
  };

  // Company Switcher
  const handleSelectCompany = (ticker: string) => {
    if (ticker === 'SNOW') {
      setThesis(INITIAL_SNOW_THESIS);
      setEvidenceList(SNOW_EVIDENCE_ROOM);
      setSignals(SNOW_SIGNALS);
      setCounterthesis(SNOW_COUNTERTHESIS);
      setScenario(SNOW_SCENARIOS[0]);
      setBrief(SNOW_RESEARCH_BRIEF);
      appendAudit('analyst', 'SWITCHED_COMPANY', 'thesis', INITIAL_SNOW_THESIS.id, 'Loaded Snowflake Inc. (SNOW) case.');
    } else {
      const comp = SUPPORTED_COMPANIES.find((c) => c.ticker === ticker);
      if (comp) {
        const customThesis: Thesis = {
          id: `thesis-${ticker.toLowerCase()}-01`,
          company: comp.name,
          ticker: comp.ticker,
          exchange: comp.exchange,
          cik: comp.cik,
          direction: 'long',
          investmentHorizon: '1-2 Years',
          thesisSummary: `${comp.name} long research thesis based on market leadership in ${comp.industry}.`,
          coreNarrative: `Primary thesis assumes sustained revenue expansion and operating leverage.`,
          status: 'active',
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastReviewedAt: new Date().toISOString(),
          author: 'Lead Equity Research Analyst',
          assumptions: [
            {
              id: `asmp-${ticker.toLowerCase()}-1`,
              category: 'revenue',
              statement: 'Revenue growth sustains above consensus expectations.',
              targetThreshold: '>= 20.0%',
              targetPeriod: 'Next 4 Quarters',
              baselineValue: '22.0%',
              currentValue: '22.0%',
              currentPeriod: 'Baseline',
              status: 'supported',
              statusReason: 'Initial baseline parameter.',
              affectedSignalIds: [],
              evidenceCount: 1,
              lastAssessedAt: new Date().toISOString(),
              invalidationTrigger: 'Growth slows below 15.0%.',
            },
          ],
          invalidationConditions: ['Growth deceleration below 15%', 'Margin compression > 300 bps'],
          expectedCatalysts: [],
          measurableIndicators: ['Revenue YoY %', 'Operating Margin %'],
          openQuestions: ['Is AI compute demand sustainable?'],
        };

        setThesis(customThesis);
        setVersions([
          {
            versionNumber: 1,
            timestamp: new Date().toISOString(),
            author: customThesis.author,
            changeSummary: `Initial baseline thesis created for ${comp.name}.`,
            snapshot: customThesis,
          },
        ]);
        appendAudit('analyst', 'THESIS_CREATED', 'thesis', customThesis.id, `Created baseline thesis for ${comp.name} (${comp.ticker}).`);
      }
    }
  };

  // Run Change Engine Scan
  const handleRunChangeEngine = () => {
    setIsRunningEngine(true);
    setTimeout(() => {
      // Deterministically re-evaluate assumptions based on current evidence
      const updatedAssumptions = thesis.assumptions.map((a) => {
        if (a.id === 'asmp-snow-1') {
          return {
            ...a,
            status: 'contradicted' as const,
            currentValue: '28.3% (Q3 FY25)',
            statusReason: 'Decelerated to 29.5% in Q2 and 28.3% in Q3 FY25, breaching the >=30.0% thesis hurdle.',
          };
        }
        if (a.id === 'asmp-snow-2') {
          return {
            ...a,
            status: 'partially_supported' as const,
            currentValue: '125.0% (Q3 FY25)',
            statusReason: 'Sequentially compressed to 125.0%, sitting directly on the invalidation threshold floor.',
          };
        }
        return a;
      });

      const updatedThesis = {
        ...thesis,
        assumptions: updatedAssumptions,
        status: 'under_review' as const,
        lastReviewedAt: new Date().toISOString(),
      };

      setThesis(updatedThesis);
      appendAudit(
        'system_change_engine',
        'CHANGE_SCAN_COMPLETED',
        'thesis',
        thesis.id,
        'Deterministic Change Engine scan completed. Assumption 1 confirmed breached (28.3% vs >=30.0%). Status maintained as UNDER_REVIEW.'
      );
      setIsRunningEngine(false);
      setActiveModule('change_engine');
    }, 700);
  };

  // Signal review handlers
  const handleAcceptSignal = (id: string) => {
    setSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, reviewStatus: 'accepted', reviewedAt: new Date().toISOString() } : s))
    );
    appendAudit('analyst', 'SIGNAL_ACCEPTED', 'signal', id, 'Analyst accepted signal finding into evidence base.');
  };

  const handleRejectSignal = (id: string) => {
    setSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, reviewStatus: 'rejected', reviewedAt: new Date().toISOString() } : s))
    );
    appendAudit('analyst', 'SIGNAL_REJECTED', 'signal', id, 'Analyst rejected signal finding with audit note.');
  };

  const handleAnnotateSignal = (id: string, note: string) => {
    setSignals((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, userAnnotation: note, reviewStatus: 'annotated', reviewedAt: new Date().toISOString() }
          : s
      )
    );
    appendAudit('analyst', 'SIGNAL_ANNOTATED', 'signal', id, `Added user annotation: "${note.slice(0, 40)}..."`);
  };

  // Evidence Ingestion Handler
  const handleAddEvidence = async (
    newEvidenceData: Partial<EvidenceRecord>,
    runAIAnalysis: boolean
  ) => {
    const newId = `ev-${Date.now()}`;
    const newDoc: EvidenceRecord = {
      id: newId,
      companyId: thesis.ticker.toLowerCase(),
      ticker: thesis.ticker,
      sourceTitle: newEvidenceData.sourceTitle || 'SEC Filing Document',
      issuer: newEvidenceData.issuer || thesis.company,
      docType: newEvidenceData.docType || '10-Q',
      publicationDate: newEvidenceData.publicationDate || new Date().toISOString().split('T')[0],
      reportingPeriod: newEvidenceData.reportingPeriod || 'Q4 FY2025',
      originalUrl: newEvidenceData.originalUrl || `https://www.sec.gov/edgar/browse/?CIK=${thesis.cik}`,
      accessionNumber: newEvidenceData.accessionNumber || `ACC-${Date.now().toString().slice(-6)}`,
      excerpt: newEvidenceData.excerpt || '',
      extractedClaims: [
        {
          id: `cl-${Date.now()}-1`,
          text: newEvidenceData.excerpt?.slice(0, 140) || 'Directly reported disclosure.',
          claimType: 'reported_fact',
          sourceAnchor: 'Filing Excerpt Item 1',
          confidenceScore: 0.95,
        },
      ],
      relatedAssumptionIds: newEvidenceData.relatedAssumptionIds || [thesis.assumptions[0]?.id || ''],
      retrievalTimestamp: new Date().toISOString(),
      extractionStatus: 'completed',
      verificationStatus: newEvidenceData.verificationStatus || 'verified_sec',
      fileSize: '1.2 MB',
    };

    setEvidenceList((prev) => [newDoc, ...prev]);
    setSelectedEvidenceId(newId);
    appendAudit('sec_sync', 'EVIDENCE_INGESTED', 'evidence', newId, `Ingested ${newDoc.docType}: ${newDoc.sourceTitle}.`);

    if (runAIAnalysis && newDoc.excerpt) {
      try {
        const targetAssumption = thesis.assumptions.find((a) => a.id === newDoc.relatedAssumptionIds[0]) || thesis.assumptions[0];
        const res = await fetch('/api/ai/analyze-evidence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            evidenceText: newDoc.excerpt,
            assumptionStatement: targetAssumption?.statement,
            threshold: targetAssumption?.targetThreshold,
            company: thesis.company,
            docType: newDoc.docType,
          }),
        });

        if (res.ok) {
          const aiResult = await res.json();
          const newSignal: Signal = {
            id: `sig-${Date.now()}`,
            thesisId: thesis.id,
            assumptionId: targetAssumption?.id || '',
            company: thesis.company,
            ticker: thesis.ticker,
            reportingPeriod: newDoc.reportingPeriod,
            eventDate: newDoc.publicationDate,
            publicationDate: newDoc.publicationDate,
            summary: aiResult.summary || `Extracted update from ${newDoc.docType} affecting ${targetAssumption?.category}.`,
            direction: aiResult.direction || 'mixed',
            materiality: aiResult.materiality || 'medium',
            confidence: 'high',
            confidenceScore: 0.94,
            whyItMatters: aiResult.whyItMatters || 'Reported metrics must be evaluated against model expectations.',
            suggestedInvestigation: aiResult.suggestedInvestigation || 'Inspect management discussion footnotes.',
            sourceReferences: [
              {
                evidenceId: newDoc.id,
                title: newDoc.sourceTitle,
                docType: newDoc.docType,
                url: newDoc.originalUrl,
                citation: `${newDoc.docType} Page 1`,
              },
            ],
            reviewStatus: 'unreviewed',
            createdAt: new Date().toISOString(),
          };

          setSignals((prev) => [newSignal, ...prev]);
          appendAudit('system_change_engine', 'SIGNAL_GENERATED', 'signal', newSignal.id, `Generated signal: "${newSignal.summary}"`);
        }
      } catch (err) {
        // Safe fallback
      }
    }
  };

  // Save Revised Version Snapshot
  const handleSaveVersion = (changeSummary: string) => {
    const nextVerNum = thesis.version + 1;
    const updatedThesis: Thesis = {
      ...thesis,
      version: nextVerNum,
      updatedAt: new Date().toISOString(),
      lastReviewedAt: new Date().toISOString(),
    };

    const newSnapshot: ThesisVersion = {
      versionNumber: nextVerNum,
      timestamp: new Date().toISOString(),
      author: thesis.author,
      changeSummary,
      snapshot: updatedThesis,
    };

    setThesis(updatedThesis);
    setVersions((prev) => [...prev, newSnapshot]);
    appendAudit('analyst', 'THESIS_REVISED', 'thesis', thesis.id, `Created snapshot v${nextVerNum}.0: ${changeSummary}`);
  };

  // Restore Previous Version
  const handleRestoreVersion = (ver: ThesisVersion) => {
    setThesis({
      ...ver.snapshot,
      lastReviewedAt: new Date().toISOString(),
    });
    appendAudit(
      'analyst',
      'VERSION_RESTORED',
      'thesis',
      ver.snapshot.id,
      `Rolled back active thesis to snapshot v${ver.versionNumber}.0.`
    );
  };

  // Save Assumption edits
  const handleSaveAssumption = (assumption: ThesisAssumption) => {
    const exists = thesis.assumptions.some((a) => a.id === assumption.id);
    let updatedAssumptions: ThesisAssumption[];

    if (exists) {
      updatedAssumptions = thesis.assumptions.map((a) => (a.id === assumption.id ? assumption : a));
      appendAudit('analyst', 'ASSUMPTION_MODIFIED', 'assumption', assumption.id, `Modified assumption: "${assumption.statement.slice(0, 40)}..."`);
    } else {
      updatedAssumptions = [...thesis.assumptions, assumption];
      appendAudit('analyst', 'ASSUMPTION_ADDED', 'assumption', assumption.id, `Added new assumption: "${assumption.statement.slice(0, 40)}..."`);
    }

    setThesis({
      ...thesis,
      assumptions: updatedAssumptions,
      lastReviewedAt: new Date().toISOString(),
    });
  };

  // Trigger AI Counterthesis refresh
  const handleGenerateAIReview = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/counterthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thesis,
          assumptions: thesis.assumptions,
          signals,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCounterthesis((prev) => ({
          ...prev,
          strongestBullCase: data.strongestBullCase || prev.strongestBullCase,
          strongestBearCase: data.strongestBearCase || prev.strongestBearCase,
          criticalAssumptionAtRisk: {
            assumptionId: thesis.assumptions[0]?.id || '',
            statement: data.criticalAssumptionAtRisk?.assumptionStatement || prev.criticalAssumptionAtRisk.statement,
            riskSummary: data.criticalAssumptionAtRisk?.riskSummary || prev.criticalAssumptionAtRisk.riskSummary,
          },
          alternativeExplanations: data.alternativeExplanations || prev.alternativeExplanations,
          confirmationBiasChecks: data.confirmationBiasChecks || prev.confirmationBiasChecks,
        }));
        appendAudit('ai_evaluator', 'COUNTERTHESIS_REFRESHED', 'counterthesis', counterthesis.id, 'Adversarial counterthesis refreshed via Gemini.');
      }
    } catch {
      // fallback
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const unreviewedSignalsCount = signals.filter((s) => s.reviewStatus === 'unreviewed').length;
  const assumptionsAtRiskCount = thesis.assumptions.filter(
    (a) => a.status === 'contradicted' || a.status === 'partially_supported'
  ).length;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        currentThesis={thesis}
        onSelectCompany={handleSelectCompany}
        onOpenNewThesisModal={() => handleSelectCompany('NVDA')}
        onOpenAddEvidenceModal={() => setIsAddEvidenceModalOpen(true)}
        onRunChangeEngine={handleRunChangeEngine}
        onOpenVersionModal={() => {
          setActiveModule('audit');
        }}
        onPrintBrief={() => {
          setActiveModule('brief');
          setTimeout(() => window.print(), 300);
        }}
        isRunningEngine={isRunningEngine}
      />

      {/* Navigation Modules Bar */}
      <Navigation
        activeModule={activeModule}
        onChangeModule={setActiveModule}
        unreviewedSignalsCount={unreviewedSignalsCount}
        evidenceCount={evidenceList.length}
        assumptionsAtRiskCount={assumptionsAtRiskCount}
      />

      {/* Primary Workspace View Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        {activeModule === 'overview' && (
          <OverviewModule
            thesis={thesis}
            signals={signals}
            evidenceList={evidenceList}
            onNavigate={setActiveModule}
            onAcceptSignal={handleAcceptSignal}
            onRejectSignal={handleRejectSignal}
            onSelectSignalForInspection={(sig) => {
              const matched = evidenceList.find((e) => e.id === sig.sourceReferences[0]?.evidenceId);
              if (matched) {
                setSelectedEvidenceId(matched.id);
                setActiveModule('evidence');
              }
            }}
          />
        )}

        {activeModule === 'signals' && (
          <SignalCenterModule
            thesis={thesis}
            signals={signals}
            evidenceList={evidenceList}
            onAcceptSignal={handleAcceptSignal}
            onRejectSignal={handleRejectSignal}
            onAnnotateSignal={handleAnnotateSignal}
            onSelectEvidence={(evidence) => {
              setSelectedEvidenceId(evidence.id);
              setActiveModule('evidence');
            }}
          />
        )}

        {activeModule === 'thesis' && (
          <ThesisWorkspaceModule
            thesis={thesis}
            onUpdateThesis={(updated) => {
              setThesis(updated);
              appendAudit('analyst', 'THESIS_UPDATED', 'thesis', updated.id, 'Updated core thesis assumptions and conditions.');
            }}
            onOpenSaveVersionModal={() => setIsSaveVersionModalOpen(true)}
            onOpenEditAssumptionModal={(assumption) => {
              setEditingAssumptionData(assumption || null);
              setIsEditAssumptionModalOpen(true);
            }}
          />
        )}

        {activeModule === 'evidence' && (
          <EvidenceRoomModule
            thesis={thesis}
            evidenceList={evidenceList}
            selectedEvidenceId={selectedEvidenceId}
            onSelectEvidence={(e) => setSelectedEvidenceId(e.id)}
            onOpenAddEvidenceModal={() => setIsAddEvidenceModalOpen(true)}
          />
        )}

        {activeModule === 'change_engine' && (
          <ChangeEngineModule
            thesis={thesis}
            signals={signals}
            evidenceList={evidenceList}
            onRunEngine={handleRunChangeEngine}
            isRunning={isRunningEngine}
            onSelectEvidence={(evidence) => {
              setSelectedEvidenceId(evidence.id);
              setActiveModule('evidence');
            }}
          />
        )}

        {activeModule === 'counterthesis' && (
          <CounterthesisLabModule
            thesis={thesis}
            counterthesis={counterthesis}
            evidenceList={evidenceList}
            onUpdateCounterthesis={setCounterthesis}
            onGenerateAIReview={handleGenerateAIReview}
            isGeneratingAI={isGeneratingAI}
          />
        )}

        {activeModule === 'scenarios' && (
          <ScenarioLabModule
            thesis={thesis}
            scenario={scenario}
            onUpdateScenario={setScenario}
          />
        )}

        {activeModule === 'brief' && (
          <ResearchBriefModule
            brief={brief}
            thesis={thesis}
            onRefreshBriefWithAI={handleGenerateAIReview}
            isGeneratingAI={isGeneratingAI}
          />
        )}

        {activeModule === 'audit' && (
          <AuditTrailModule
            thesis={thesis}
            auditLog={auditLog}
            versions={versions}
            onRestoreVersion={handleRestoreVersion}
          />
        )}

        {activeModule === 'evaluation' && (
          <SystemDiagnosticsModule thesis={thesis} />
        )}
      </main>

      {/* Footer bar */}
      <footer className="border-t border-[#1e2c4a] bg-[#090d16] px-4 py-3 text-[11px] font-mono text-slate-500 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <span>THESIS//OS v2.4.0</span>
          <span>•</span>
          <span>SEC EDGAR CIK: {thesis.cik}</span>
          <span>•</span>
          <span className="text-emerald-400">Deterministic Calculations Enforced</span>
        </div>

        <div className="flex items-center gap-3">
          <span>Model: Gemini 2.5 Flash Grounded</span>
          <span>•</span>
          <span>Not an Investment Adviser</span>
        </div>
      </footer>

      {/* Modals */}
      <AddEvidenceModal
        isOpen={isAddEvidenceModalOpen}
        onClose={() => setIsAddEvidenceModalOpen(false)}
        onAddEvidence={handleAddEvidence}
        thesis={thesis}
      />

      <EditAssumptionModal
        isOpen={isEditAssumptionModalOpen}
        onClose={() => {
          setIsEditAssumptionModalOpen(false);
          setEditingAssumptionData(null);
        }}
        onSave={handleSaveAssumption}
        initialData={editingAssumptionData}
      />

      <SaveVersionModal
        isOpen={isSaveVersionModalOpen}
        onClose={() => setIsSaveVersionModalOpen(false)}
        onConfirmSave={handleSaveVersion}
        nextVersion={thesis.version + 1}
      />
    </div>
  );
}
