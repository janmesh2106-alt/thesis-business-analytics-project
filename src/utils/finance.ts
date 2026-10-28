/**
 * Deterministic Financial Calculations & Evaluation Engine
 * Pure logic decoupled from UI for strict institutional precision.
 */

import type {
  ConfidenceLevel,
  DeltaCalculation,
  DocumentType,
  EvidenceDirection,
  MaterialityLevel,
  ScenarioMetrics,
  VerificationStatus,
} from '../types.ts';

/**
 * Calculates percentage growth between baseline and reported values
 */
export function calculateGrowth(baseline: number, reported: number): number {
  if (baseline === 0) return 0;
  return Number((((reported - baseline) / Math.abs(baseline)) * 100).toFixed(2));
}

/**
 * Calculates margin percentage
 */
export function calculateMargin(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Number(((numerator / denominator) * 100).toFixed(2));
}

/**
 * Calculates interest coverage ratio (Operating Income / Interest Expense)
 */
export function calculateInterestCoverage(operatingIncome: number, interestExpense: number): number {
  if (interestExpense <= 0) return 999.0; // Infinite or negligible coverage
  return Number((operatingIncome / interestExpense).toFixed(2));
}

/**
 * Parses numeric value from a string (e.g. "$829.3M" -> 829.3, "29.5%" -> 29.5, "125%" -> 125)
 */
export function parseNumericValue(val: string | number | undefined): number | null {
  if (val === undefined || val === null) return null;
  if (typeof val === 'number') return val;
  const cleaned = val.replace(/[\$,%]/g, '').trim();
  const match = cleaned.match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  let num = parseFloat(match[0]);
  if (/b|billion/i.test(val)) num *= 1000; // normalize billions to millions if needed
  return isNaN(num) ? null : num;
}

/**
 * Evaluates whether reported value passes a defined threshold condition
 * Supports formats: ">= 30%", "> 25.0", "<= 4.0x", "< 10%", "== 125"
 */
export function evaluateThreshold(
  reported: number,
  thresholdStr: string
): { passed: boolean; operator: string; targetNum: number } {
  const match = thresholdStr.match(/(>=|<=|>|<|==|=)\s*([-\d.]+)/);
  if (!match) {
    // Default fallback: parse number directly and assume >=
    const num = parseNumericValue(thresholdStr) ?? 0;
    return { passed: reported >= num, operator: '>=', targetNum: num };
  }

  const operator = match[1];
  const targetNum = parseFloat(match[2]);

  let passed = false;
  switch (operator) {
    case '>=':
      passed = reported >= targetNum;
      break;
    case '<=':
      passed = reported <= targetNum;
      break;
    case '>':
      passed = reported > targetNum;
      break;
    case '<':
      passed = reported < targetNum;
      break;
    case '==':
    case '=':
      passed = Math.abs(reported - targetNum) < 0.001;
      break;
  }

  return { passed, operator, targetNum };
}

/**
 * Calculates deterministic delta between baseline and reported evidence
 */
export function computeDeltaCalculation(
  metric: string,
  baseline: string | number,
  reported: string | number,
  threshold: string,
  unit: string = '%'
): DeltaCalculation {
  const baseNum = parseNumericValue(baseline) ?? 0;
  const repNum = parseNumericValue(reported) ?? 0;
  const deltaAbsolute = Number((repNum - baseNum).toFixed(2));
  const deltaPercent = baseNum !== 0 ? Number((((repNum - baseNum) / Math.abs(baseNum)) * 100).toFixed(2)) : 0;
  const evaluation = evaluateThreshold(repNum, threshold);

  const formula = `${metric} Delta = ${repNum} ${unit} - ${baseNum} ${unit} = ${deltaAbsolute > 0 ? '+' : ''}${deltaAbsolute} ${unit} (Target: ${threshold})`;

  return {
    metric,
    baseline,
    reported,
    deltaAbsolute,
    deltaPercent,
    unit,
    threshold,
    thresholdPassed: evaluation.passed,
    formula,
  };
}

/**
 * Deterministic materiality calculation
 * Based on deviation spread from threshold or baseline
 */
export function determineMateriality(
  deltaPercent: number,
  isThresholdBreached: boolean
): MaterialityLevel {
  const absDelta = Math.abs(deltaPercent);
  if (isThresholdBreached || absDelta >= 15.0) {
    return 'high';
  }
  if (absDelta >= 5.0) {
    return 'medium';
  }
  return 'low';
}

/**
 * Determines evidence direction for an assumption
 * Takes into account whether user is Long or Short
 */
export function determineDirection(
  thresholdPassed: boolean,
  thesisDirection: 'long' | 'short' = 'long'
): EvidenceDirection {
  if (thesisDirection === 'long') {
    return thresholdPassed ? 'supports' : 'contradicts';
  } else {
    // For short thesis, failing financial growth or metrics supports short thesis
    return thresholdPassed ? 'contradicts' : 'supports';
  }
}

/**
 * Calculate confidence score and level
 * Distinct from materiality: confidence reflects provenance and claim certainty
 */
export function calculateConfidence(
  verificationStatus: VerificationStatus,
  docType: DocumentType,
  claimType: string
): { score: number; level: ConfidenceLevel } {
  let docWeight = 0.5;
  if (verificationStatus === 'verified_sec') {
    docWeight = docType === '10-K' ? 1.0 : docType === '10-Q' ? 0.95 : 0.85;
  } else if (verificationStatus === 'curated_historical') {
    docWeight = 0.9;
  } else if (verificationStatus === 'official_release') {
    docWeight = 0.8;
  } else {
    docWeight = 0.45;
  }

  let claimWeight = 0.5;
  switch (claimType) {
    case 'reported_fact':
      claimWeight = 1.0;
      break;
    case 'calculated_metric':
      claimWeight = 0.95;
      break;
    case 'management_statement':
      claimWeight = 0.75;
      break;
    case 'user_annotation':
      claimWeight = 0.7;
      break;
    case 'ai_inference':
      claimWeight = 0.55;
      break;
  }

  const score = Number((docWeight * 0.6 + claimWeight * 0.4).toFixed(2));
  let level: ConfidenceLevel = 'low';
  if (score >= 0.8) level = 'high';
  else if (score >= 0.6) level = 'medium';

  return { score, level };
}

/**
 * Computes deterministic financial metrics for Scenario Lab
 */
export function calculateScenarioOutput(inputs: {
  revenue: number;
  revenueGrowthRate: number;
  grossMargin: number;
  opexRatio: number;
  capexRatio: number;
  debtAmount: number;
  costOfDebt: number;
}): ScenarioMetrics {
  const projectedRevenue = inputs.revenue * (1 + inputs.revenueGrowthRate / 100);
  const grossProfit = projectedRevenue * (inputs.grossMargin / 100);
  const grossMarginPct = inputs.grossMargin;

  const operatingExpenses = projectedRevenue * (inputs.opexRatio / 100);
  const operatingIncome = grossProfit - operatingExpenses;
  const operatingMarginPct = calculateMargin(operatingIncome, projectedRevenue);

  const interestExpense = inputs.debtAmount * (inputs.costOfDebt / 100);
  const interestCoverageRatio = calculateInterestCoverage(operatingIncome, interestExpense);

  const capex = projectedRevenue * (inputs.capexRatio / 100);
  // Free Cash Flow = Operating Income (EBIT) - Interest - Capex (simplified transparent formula)
  const freeCashFlow = operatingIncome - interestExpense - capex;
  const fcfMarginPct = calculateMargin(freeCashFlow, projectedRevenue);

  return {
    revenue: Number(projectedRevenue.toFixed(2)),
    grossProfit: Number(grossProfit.toFixed(2)),
    grossMarginPct: Number(grossMarginPct.toFixed(2)),
    operatingIncome: Number(operatingIncome.toFixed(2)),
    operatingMarginPct: Number(operatingMarginPct.toFixed(2)),
    freeCashFlow: Number(freeCashFlow.toFixed(2)),
    fcfMarginPct: Number(fcfMarginPct.toFixed(2)),
    interestCoverageRatio: Number(interestCoverageRatio.toFixed(2)),
  };
}
