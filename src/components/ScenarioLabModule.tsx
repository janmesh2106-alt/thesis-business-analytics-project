import React, { useState } from 'react';
import {
  Sliders,
  Calculator,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Info,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import type { ScenarioModel, Thesis } from '../types.ts';
import { calculateScenarioOutput } from '../utils/finance.ts';

interface ScenarioLabModuleProps {
  thesis: Thesis;
  scenario: ScenarioModel;
  onUpdateScenario: (updated: ScenarioModel) => void;
}

export const ScenarioLabModule: React.FC<ScenarioLabModuleProps> = ({
  thesis,
  scenario,
  onUpdateScenario,
}) => {
  const [shockGrowth, setShockGrowth] = useState<number>(scenario.shockInputs.revenueGrowthRate);
  const [shockGrossMargin, setShockGrossMargin] = useState<number>(scenario.shockInputs.grossMargin);
  const [shockOpexRatio, setShockOpexRatio] = useState<number>(scenario.shockInputs.opexRatio);
  const [shockCapexRatio, setShockCapexRatio] = useState<number>(scenario.shockInputs.capexRatio);
  const [shockDebtAmount, setShockDebtAmount] = useState<number>(scenario.shockInputs.debtAmount);
  const [shockCostOfDebt, setShockCostOfDebt] = useState<number>(scenario.shockInputs.costOfDebt);

  // Recompute live
  const shockOutputs = calculateScenarioOutput({
    revenue: scenario.baseInputs.revenue,
    revenueGrowthRate: shockGrowth,
    grossMargin: shockGrossMargin,
    opexRatio: shockOpexRatio,
    capexRatio: shockCapexRatio,
    debtAmount: shockDebtAmount,
    costOfDebt: shockCostOfDebt,
  });

  const baseOutputs = scenario.calculatedBase;

  const fcfDeltaPct = Number(
    (((shockOutputs.freeCashFlow - baseOutputs.freeCashFlow) / Math.abs(baseOutputs.freeCashFlow)) * 100).toFixed(1)
  );

  const opIncDeltaPct = Number(
    (((shockOutputs.operatingIncome - baseOutputs.operatingIncome) / Math.abs(baseOutputs.operatingIncome)) * 100).toFixed(1)
  );

  const resetToDefaultShock = () => {
    setShockGrowth(22.0);
    setShockGrossMargin(71.5);
    setShockOpexRatio(55.0);
    setShockCapexRatio(5.5);
    setShockDebtAmount(300);
    setShockCostOfDebt(6.0);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                MODULE F // SCENARIO LAB
              </span>
              <span className="text-xs font-mono text-amber-300 font-bold px-1.5 py-0.5 rounded bg-amber-950/70 border border-amber-800">
                HYPOTHETICAL SENSITIVITY MODEL
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-1">
              Financial Shock Modeling: {scenario.name}
            </h2>
          </div>

          <button
            onClick={resetToDefaultShock}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#141d33] hover:bg-[#1c2948] border border-[#1e2c4a] text-xs font-mono text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Scenario Inputs</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Transparent, deterministic scenario calculations evaluating the impact of growth deceleration and margin compression on free cash flow generation and debt coverage.
        </p>

        {/* Disclaimer mandated by Section 5 */}
        <div className="mt-3 p-2.5 rounded bg-[#080d1a] border border-[#1b2847] flex items-center gap-2 text-[11px] text-amber-300 font-mono">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            DISCLAIMER: Outputs are deterministic mathematical sensitivity projections, NOT price targets, probability forecasts, or investment guarantees.
          </span>
        </div>
      </div>

      {/* Main Interactive Grid: Inputs on Left, Output Comparison on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Shocks Panel (5 cols) */}
        <div className="lg:col-span-5 bg-[#0d1322] border border-[#1e2c4a] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1a2744] pb-2">
            <span className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Adjust Scenario Stress Parameters
            </span>
            <span className="text-[10px] font-mono text-slate-500">Live Engine</span>
          </div>

          {/* Input 1: Revenue Growth */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-mono">
              <label htmlFor="revenue-growth-slider" className="text-slate-300">Revenue YoY Growth Rate:</label>
              <span className="text-cyan-300 font-bold">{shockGrowth.toFixed(1)}%</span>
            </div>
            <input
              id="revenue-growth-slider"
              aria-label="Revenue YoY Growth Rate"
              type="range"
              min="10"
              max="40"
              step="0.5"
              value={shockGrowth}
              onChange={(e) => setShockGrowth(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Base: {scenario.baseInputs.revenueGrowthRate}%</span>
              <span>Shock Delta: {(shockGrowth - scenario.baseInputs.revenueGrowthRate).toFixed(1)}%</span>
            </div>
          </div>

          {/* Input 2: Gross Margin */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-mono">
              <label htmlFor="gross-margin-slider" className="text-slate-300">Non-GAAP Gross Margin:</label>
              <span className="text-cyan-300 font-bold">{shockGrossMargin.toFixed(1)}%</span>
            </div>
            <input
              id="gross-margin-slider"
              aria-label="Non-GAAP Gross Margin"
              type="range"
              min="65"
              max="82"
              step="0.5"
              value={shockGrossMargin}
              onChange={(e) => setShockGrossMargin(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Base: {scenario.baseInputs.grossMargin}%</span>
              <span>Shock Delta: {(shockGrossMargin - scenario.baseInputs.grossMargin).toFixed(1)}%</span>
            </div>
          </div>

          {/* Input 3: Opex Ratio */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-mono">
              <label htmlFor="opex-ratio-slider" className="text-slate-300">Operating Expenses (% of Revenue):</label>
              <span className="text-cyan-300 font-bold">{shockOpexRatio.toFixed(1)}%</span>
            </div>
            <input
              id="opex-ratio-slider"
              aria-label="Operating Expenses (% of Revenue)"
              type="range"
              min="40"
              max="70"
              step="0.5"
              value={shockOpexRatio}
              onChange={(e) => setShockOpexRatio(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Base: {scenario.baseInputs.opexRatio}%</span>
              <span>Shock Delta: +{(shockOpexRatio - scenario.baseInputs.opexRatio).toFixed(1)}%</span>
            </div>
          </div>

          {/* Input 4: Capex Ratio */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-mono">
              <label htmlFor="capex-ratio-slider" className="text-slate-300">Capex Intensity (% of Revenue):</label>
              <span className="text-cyan-300 font-bold">{shockCapexRatio.toFixed(1)}%</span>
            </div>
            <input
              id="capex-ratio-slider"
              aria-label="Capex Intensity (% of Revenue)"
              type="range"
              min="2"
              max="12"
              step="0.5"
              value={shockCapexRatio}
              onChange={(e) => setShockCapexRatio(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Base: {scenario.baseInputs.capexRatio}%</span>
              <span>Shock Delta: +{(shockCapexRatio - scenario.baseInputs.capexRatio).toFixed(1)}%</span>
            </div>
          </div>

          {/* Input 5: Debt & Cost of Debt */}
          <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-[#1a2744]">
            <div>
              <label htmlFor="debt-principal-input" className="text-[11px] font-mono text-slate-400 block mb-1">Debt Principal ($M):</label>
              <input
                id="debt-principal-input"
                aria-label="Debt Principal in Millions USD"
                type="number"
                value={shockDebtAmount}
                onChange={(e) => setShockDebtAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 font-mono text-xs"
              />
            </div>
            <div>
              <label htmlFor="debt-cost-input" className="text-[11px] font-mono text-slate-400 block mb-1">Cost of Debt (%):</label>
              <input
                id="debt-cost-input"
                aria-label="Cost of Debt in Percent"
                type="number"
                step="0.25"
                value={shockCostOfDebt}
                onChange={(e) => setShockCostOfDebt(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#141d33] border border-[#1e2c4a] rounded p-2 text-slate-200 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Right: Comparative Output Metric Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Key Impact Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#0d1322] border border-[#1e2c4a] p-3.5 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Free Cash Flow Delta:
              </span>
              <span
                className={`text-xl font-bold font-mono mt-1 block ${
                  fcfDeltaPct < 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {fcfDeltaPct > 0 ? '+' : ''}
                {fcfDeltaPct}%
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                ${shockOutputs.freeCashFlow}M vs ${baseOutputs.freeCashFlow}M
              </span>
            </div>

            <div className="bg-[#0d1322] border border-[#1e2c4a] p-3.5 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Operating Income Delta:
              </span>
              <span
                className={`text-xl font-bold font-mono mt-1 block ${
                  opIncDeltaPct < 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {opIncDeltaPct > 0 ? '+' : ''}
                {opIncDeltaPct}%
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                ${shockOutputs.operatingIncome}M vs ${baseOutputs.operatingIncome}M
              </span>
            </div>

            <div className="bg-[#0d1322] border border-[#1e2c4a] p-3.5 rounded-lg col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Interest Coverage:
              </span>
              <span className="text-xl font-bold font-mono text-cyan-300 mt-1 block">
                {shockOutputs.interestCoverageRatio.toFixed(1)}x
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Base: {baseOutputs.interestCoverageRatio.toFixed(1)}x
              </span>
            </div>
          </div>

          {/* Full Metrics Comparison Table */}
          <div className="bg-[#0d1322] border border-[#1e2c4a] rounded-lg overflow-hidden">
            <div className="p-3 bg-[#10182b] border-b border-[#1b2847] flex items-center justify-between text-xs font-mono font-bold text-slate-200">
              <span>FINANCIAL METRIC BREAKDOWN (IN USD MILLIONS)</span>
              <span>BASE VS STRESS</span>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-[#080d19] text-[10px] font-mono text-slate-400 uppercase border-b border-[#1a2744]">
                <tr>
                  <th className="py-2.5 px-4">Metric</th>
                  <th className="py-2.5 px-4">Base Case</th>
                  <th className="py-2.5 px-4 text-amber-300">Stress Shock</th>
                  <th className="py-2.5 px-4 text-right">Delta ($ / %)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2744] font-mono">
                <tr>
                  <td className="py-2.5 px-4 text-slate-200 font-sans font-medium">Projected Total Revenue</td>
                  <td className="py-2.5 px-4 text-slate-300">${baseOutputs.revenue}M</td>
                  <td className="py-2.5 px-4 text-cyan-300 font-bold">${shockOutputs.revenue}M</td>
                  <td className="py-2.5 px-4 text-right text-slate-400">
                    {(shockOutputs.revenue - baseOutputs.revenue).toFixed(1)}M ({(((shockOutputs.revenue - baseOutputs.revenue) / baseOutputs.revenue) * 100).toFixed(1)}%)
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 text-slate-200 font-sans font-medium">Gross Profit</td>
                  <td className="py-2.5 px-4 text-slate-300">${baseOutputs.grossProfit}M ({baseOutputs.grossMarginPct}%)</td>
                  <td className="py-2.5 px-4 text-cyan-300 font-bold">${shockOutputs.grossProfit}M ({shockOutputs.grossMarginPct}%)</td>
                  <td className="py-2.5 px-4 text-right text-slate-400">
                    {(shockOutputs.grossProfit - baseOutputs.grossProfit).toFixed(1)}M
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 text-slate-200 font-sans font-medium">Operating Income (EBIT)</td>
                  <td className="py-2.5 px-4 text-slate-300">${baseOutputs.operatingIncome}M ({baseOutputs.operatingMarginPct}%)</td>
                  <td className="py-2.5 px-4 text-cyan-300 font-bold">${shockOutputs.operatingIncome}M ({shockOutputs.operatingMarginPct}%)</td>
                  <td className="py-2.5 px-4 text-right text-rose-400">
                    {(shockOutputs.operatingIncome - baseOutputs.operatingIncome).toFixed(1)}M ({opIncDeltaPct}%)
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 text-slate-200 font-sans font-medium">Free Cash Flow (FCF)</td>
                  <td className="py-2.5 px-4 text-slate-300">${baseOutputs.freeCashFlow}M ({baseOutputs.fcfMarginPct}%)</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-bold">${shockOutputs.freeCashFlow}M ({shockOutputs.fcfMarginPct}%)</td>
                  <td className="py-2.5 px-4 text-right text-rose-400 font-bold">
                    {(shockOutputs.freeCashFlow - baseOutputs.freeCashFlow).toFixed(1)}M ({fcfDeltaPct}%)
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 text-slate-200 font-sans font-medium">Interest Coverage Ratio</td>
                  <td className="py-2.5 px-4 text-slate-300">{baseOutputs.interestCoverageRatio.toFixed(1)}x</td>
                  <td className="py-2.5 px-4 text-cyan-300 font-bold">{shockOutputs.interestCoverageRatio.toFixed(1)}x</td>
                  <td className="py-2.5 px-4 text-right text-slate-400">
                    {(shockOutputs.interestCoverageRatio - baseOutputs.interestCoverageRatio).toFixed(1)}x
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Model Limitations & Notes */}
          <div className="bg-[#090d18] border border-[#1b2847] p-3.5 rounded-lg text-xs space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Explicit Model Limitations & Assumptions:
            </span>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
              {scenario.limitations.map((lim, i) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
