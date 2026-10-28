import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGrowth,
  calculateMargin,
  calculateInterestCoverage,
  evaluateThreshold,
  computeDeltaCalculation,
  determineMateriality,
  determineDirection,
  calculateConfidence,
  calculateScenarioOutput,
} from './finance.ts';

test('calculateGrowth handles standard YoY positive growth', () => {
  const growth = calculateGrowth(100, 130);
  assert.equal(growth, 30);
});

test('calculateGrowth handles negative growth and zero baseline', () => {
  assert.equal(calculateGrowth(100, 85), -15);
  assert.equal(calculateGrowth(0, 50), 0);
});

test('calculateMargin computes correct percentage', () => {
  assert.equal(calculateMargin(25, 100), 25);
  assert.equal(calculateMargin(33.33, 100), 33.33);
  assert.equal(calculateMargin(10, 0), 0);
});

test('calculateInterestCoverage returns correct ratio and handles negligible debt', () => {
  assert.equal(calculateInterestCoverage(100, 20), 5.0);
  assert.equal(calculateInterestCoverage(100, 0), 999.0);
});

test('evaluateThreshold correctly parses >=, <=, >, < operators', () => {
  assert.equal(evaluateThreshold(32.5, '>= 30.0%').passed, true);
  assert.equal(evaluateThreshold(29.1, '>= 30.0%').passed, false);
  assert.equal(evaluateThreshold(2.5, '<= 3.0x').passed, true);
  assert.equal(evaluateThreshold(3.8, '<= 3.0x').passed, false);
});

test('computeDeltaCalculation outputs deterministic delta and formula', () => {
  const result = computeDeltaCalculation('Product Revenue Growth', '33.0%', '29.5%', '>= 30.0%');
  assert.equal(result.deltaAbsolute, -3.5);
  assert.equal(result.thresholdPassed, false);
  assert.ok(result.formula.includes('Target: >= 30.0%'));
});

test('determineMateriality classifies breaches as high materiality', () => {
  assert.equal(determineMateriality(-16.0, false), 'high');
  assert.equal(determineMateriality(-3.5, true), 'high'); // Breached
  assert.equal(determineMateriality(8.0, false), 'medium');
  assert.equal(determineMateriality(2.0, false), 'low');
});

test('determineDirection reflects long vs short thesis logic', () => {
  assert.equal(determineDirection(true, 'long'), 'supports');
  assert.equal(determineDirection(false, 'long'), 'contradicts');
  assert.equal(determineDirection(false, 'short'), 'supports'); // Deterioration supports short
  assert.equal(determineDirection(true, 'short'), 'contradicts');
});

test('calculateConfidence differentiates verified SEC from unverified inference', () => {
  const secFact = calculateConfidence('verified_sec', '10-Q', 'reported_fact');
  const aiInfer = calculateConfidence('unverified', 'CUSTOM_IMPORT', 'ai_inference');
  assert.ok(secFact.score >= 0.85);
  assert.equal(secFact.level, 'high');
  assert.ok(aiInfer.score < 0.65);
});

test('calculateScenarioOutput deterministically calculates projected metrics', () => {
  const output = calculateScenarioOutput({
    revenue: 1000,
    revenueGrowthRate: 20, // 1200
    grossMargin: 70, // 840
    opexRatio: 50, // 600
    capexRatio: 5, // 60
    debtAmount: 200,
    costOfDebt: 5, // 10 interest
  });

  assert.equal(output.revenue, 1200);
  assert.equal(output.grossProfit, 840);
  assert.equal(output.operatingIncome, 240); // 840 - 600
  assert.equal(output.freeCashFlow, 170); // 240 - 10 - 60
  assert.equal(output.interestCoverageRatio, 24); // 240 / 10
});
