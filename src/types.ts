/**
 * THESIS//OS - Type Definitions
 * Institutional Evidence-First Investment Thesis Platform
 */

export type ThesisDirection = 'long' | 'short';

export type ThesisStatus = 'active' | 'under_review' | 'invalidated' | 'archived';

export type AssumptionStatus =
  | 'supported'
  | 'partially_supported'
  | 'contradicted'
  | 'unresolved'
  | 'stale_evidence';

export type EvidenceDirection =
  | 'supports'
  | 'contradicts'
  | 'mixed'
  | 'insufficient_evidence';

export type MaterialityLevel = 'high' | 'medium' | 'low';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type VerificationStatus =
  | 'verified_sec'
  | 'official_release'
  | 'curated_historical'
  | 'unverified';

export type ClaimType =
  | 'reported_fact'
  | 'calculated_metric'
  | 'management_statement'
  | 'ai_inference'
  | 'user_annotation';

export type DocumentType =
  | '10-K'
  | '10-Q'
  | '8-K'
  | 'EARNINGS_RELEASE'
  | 'EARNINGS_TRANSCRIPT'
  | 'SEC_XBRL_FACT'
  | 'INVESTOR_PRESENTATION'
  | 'CUSTOM_IMPORT';

export interface ExtractedClaim {
  id: string;
  text: string;
  claimType: ClaimType;
  metricKey?: string;
  metricValue?: number | string;
  unit?: string;
  period?: string;
  sourceAnchor: string;
  confidenceScore: number; // 0.0 - 1.0
}

export interface EvidenceRecord {
  id: string;
  companyId: string;
  ticker: string;
  sourceTitle: string;
  issuer: string;
  docType: DocumentType;
  publicationDate: string;
  reportingPeriod: string;
  originalUrl: string;
  accessionNumber?: string;
  excerpt: string;
  extractedClaims: ExtractedClaim[];
  relatedAssumptionIds: string[];
  retrievalTimestamp: string;
  extractionStatus: 'completed' | 'processing' | 'partial';
  verificationStatus: VerificationStatus;
  verificationDetails?: string;
  fileSize?: string;
  rawText?: string;
}

export interface DeltaCalculation {
  metric: string;
  baseline: string | number;
  reported: string | number;
  deltaAbsolute: number;
  deltaPercent: number;
  unit: string;
  threshold: string;
  thresholdPassed: boolean;
  formula: string;
}

export interface Signal {
  id: string;
  thesisId: string;
  assumptionId: string;
  company: string;
  ticker: string;
  reportingPeriod: string;
  eventDate: string;
  publicationDate: string;
  summary: string;
  direction: EvidenceDirection;
  materiality: MaterialityLevel;
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0.0 to 1.0
  sourceReferences: {
    evidenceId: string;
    title: string;
    docType: DocumentType;
    url: string;
    citation: string;
  }[];
  whyItMatters: string;
  suggestedInvestigation: string;
  reviewStatus: 'unreviewed' | 'accepted' | 'rejected' | 'annotated';
  userAnnotation?: string;
  deltaCalculation?: DeltaCalculation;
  createdAt: string;
  reviewedAt?: string;
}

export interface ThesisAssumption {
  id: string;
  category: 'revenue' | 'margin' | 'fcf' | 'balance_sheet' | 'unit_economics' | 'market_share' | 'other';
  statement: string;
  metricName?: string;
  targetThreshold: string;
  targetPeriod: string;
  baselineValue: string;
  currentValue?: string;
  currentPeriod?: string;
  status: AssumptionStatus;
  statusReason: string;
  affectedSignalIds: string[];
  evidenceCount: number;
  lastAssessedAt: string;
  invalidationTrigger: string;
}

export interface Catalyst {
  id: string;
  title: string;
  expectedDate: string;
  description: string;
  status: 'pending' | 'occurred' | 'delayed' | 'cancelled';
  impactAssessment?: string;
}

export interface Thesis {
  id: string;
  company: string;
  ticker: string;
  exchange: string;
  cik: string;
  direction: ThesisDirection;
  investmentHorizon: string;
  thesisSummary: string;
  coreNarrative: string;
  status: ThesisStatus;
  assumptions: ThesisAssumption[];
  invalidationConditions: string[];
  expectedCatalysts: Catalyst[];
  measurableIndicators: string[];
  openQuestions: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
  lastReviewedAt: string;
  author: string;
}

export interface ThesisVersion {
  versionNumber: number;
  timestamp: string;
  author: string;
  changeSummary: string;
  snapshot: Thesis;
}

export interface AdversarialProbe {
  id: string;
  category: 'counter_evidence' | 'vulnerable_assumption' | 'alternative_explanation' | 'confirmation_bias' | 'skeptical_analyst';
  question: string;
  adversarialArgument: string;
  userResponse?: string;
  linkedEvidenceIds?: string[];
  status: 'unaddressed' | 'countered' | 'conceded' | 'under_investigation';
  updatedAt?: string;
}

export interface CounterThesisAnalysis {
  id: string;
  thesisId: string;
  generatedAt: string;
  strongestBullCase: string;
  strongestBearCase: string;
  criticalAssumptionAtRisk: {
    assumptionId: string;
    statement: string;
    riskSummary: string;
  };
  alternativeExplanations: string[];
  confirmationBiasChecks: {
    biasPattern: string;
    riskDescription: string;
    mitigationPrompt: string;
  }[];
  missingInformation: string[];
  skepticalAnalystProbes: AdversarialProbe[];
  evidenceThatWouldBreakThesis: string[];
}

export interface ScenarioMetrics {
  revenue: number;
  grossProfit: number;
  grossMarginPct: number;
  operatingIncome: number;
  operatingMarginPct: number;
  freeCashFlow: number;
  fcfMarginPct: number;
  interestCoverageRatio: number;
}

export interface ScenarioModel {
  id: string;
  name: string;
  description: string;
  company: string;
  ticker: string;
  baseInputs: {
    revenue: number; // in Millions USD
    revenueGrowthRate: number; // in %
    grossMargin: number; // in %
    opexRatio: number; // in %
    capexRatio: number; // in %
    debtAmount: number; // in Millions USD
    costOfDebt: number; // in %
  };
  shockInputs: {
    revenueGrowthRate: number;
    grossMargin: number;
    opexRatio: number;
    capexRatio: number;
    debtAmount: number;
    costOfDebt: number;
  };
  calculatedBase: ScenarioMetrics;
  calculatedShock: ScenarioMetrics;
  deltaSummary: {
    revenueDeltaPct: number;
    fcfDeltaPct: number;
    operatingIncomeDeltaPct: number;
    interestCoverageDelta: number;
  };
  limitations: string[];
  sensitivityMatrix: {
    variable: string;
    steps: { delta: string; resultFcf: number; resultOperatingIncome: number }[];
  }[];
}

export interface ResearchBrief {
  id: string;
  thesisId: string;
  version: number;
  generatedAt: string;
  title: string;
  company: string;
  ticker: string;
  thesisDirection: ThesisDirection;
  executiveSummary: string;
  whatChanged: string;
  keyDeltas: {
    assumption: string;
    priorValue: string;
    reportedValue: string;
    delta: string;
    impact: 'supported' | 'contradicted' | 'neutral';
    materiality: MaterialityLevel;
  }[];
  supportingEvidence: {
    claim: string;
    source: string;
    docType: DocumentType;
    date: string;
    url: string;
  }[];
  contradictingEvidence: {
    claim: string;
    source: string;
    docType: DocumentType;
    date: string;
    url: string;
  }[];
  counterthesisHighlights: string;
  unresolvedQuestions: string[];
  nextResearchActions: string[];
  sourcesAndMethodology: string[];
  analystSignOff?: {
    approvedBy: string;
    approvedAt: string;
    notes: string;
  };
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: 'analyst' | 'system_change_engine' | 'ai_evaluator' | 'sec_sync';
  action: string;
  entityType: 'thesis' | 'assumption' | 'evidence' | 'signal' | 'counterthesis' | 'scenario' | 'brief';
  entityId: string;
  details: string;
  diffSummary?: string;
  metadata?: Record<string, any>;
}

export interface EvaluationTestCase {
  id: string;
  caseNumber: number;
  title: string;
  description: string;
  expectedBehavior: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  lastRunTimestamp?: string;
  evidenceTraceabilityScore: number; // 0-100
  numericalAccuracyScore: number; // 0-100
  unsupportedClaimRate: number; // 0-100 (lower is better)
  actualResultNotes: string;
}
