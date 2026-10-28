import React from 'react';
import {
  LayoutDashboard,
  Radio,
  Target,
  Database,
  ArrowRightLeft,
  Crosshair,
  Sliders,
  FileCheck,
  History,
  ShieldCheck,
} from 'lucide-react';

export type ActiveModule =
  | 'overview'
  | 'signals'
  | 'thesis'
  | 'evidence'
  | 'change_engine'
  | 'counterthesis'
  | 'scenarios'
  | 'brief'
  | 'audit'
  | 'evaluation';

interface NavigationProps {
  activeModule: ActiveModule;
  onChangeModule: (mod: ActiveModule) => void;
  unreviewedSignalsCount: number;
  evidenceCount: number;
  assumptionsAtRiskCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeModule,
  onChangeModule,
  unreviewedSignalsCount,
  evidenceCount,
  assumptionsAtRiskCount,
}) => {
  const navItems = [
    {
      id: 'overview' as ActiveModule,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'signals' as ActiveModule,
      label: 'Signal Center',
      icon: Radio,
      badge: unreviewedSignalsCount > 0 ? `${unreviewedSignalsCount} NEW` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      id: 'thesis' as ActiveModule,
      label: 'Thesis Workspace',
      icon: Target,
      badge: assumptionsAtRiskCount > 0 ? `${assumptionsAtRiskCount} RISK` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    {
      id: 'evidence' as ActiveModule,
      label: 'Evidence Room',
      icon: Database,
      badge: `${evidenceCount} DOCS`,
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    },
    {
      id: 'change_engine' as ActiveModule,
      label: 'Thesis Change Engine',
      icon: ArrowRightLeft,
      badge: 'DELTA',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    },
    {
      id: 'counterthesis' as ActiveModule,
      label: 'Counterthesis Lab',
      icon: Crosshair,
      badge: null,
    },
    {
      id: 'scenarios' as ActiveModule,
      label: 'Scenario Lab',
      icon: Sliders,
      badge: null,
    },
    {
      id: 'brief' as ActiveModule,
      label: 'Research Brief',
      icon: FileCheck,
      badge: null,
    },
    {
      id: 'audit' as ActiveModule,
      label: 'Audit & History',
      icon: History,
      badge: null,
    },
    {
      id: 'evaluation' as ActiveModule,
      label: 'Evaluation & Test Set',
      icon: ShieldCheck,
      badge: '12 TESTS',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <nav className="border-b border-[#1e2c4a] bg-[#090d16] px-4 overflow-x-auto scrollbar-none flex items-center gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeModule === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onChangeModule(item.id)}
            className={`flex items-center gap-2 py-2.5 px-3 text-xs font-medium whitespace-nowrap border-b-2 transition-all relative ${
              isActive
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#101827]'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span>{item.label}</span>
            {item.badge && (
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                  item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
