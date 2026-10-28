/**
 * Thesis Version Diff Engine
 * Detects modifications, assumption mutations, and generates audit deltas
 */

import type { Thesis, ThesisAssumption } from '../types.ts';

export interface FieldDiff {
  field: string;
  previousValue: any;
  currentValue: any;
  description: string;
}

export interface AssumptionDiff {
  id: string;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  statement: string;
  changes: FieldDiff[];
}

export interface ThesisComparison {
  versionFrom: number;
  versionTo: number;
  hasChanges: boolean;
  metaChanges: FieldDiff[];
  assumptionDiffs: AssumptionDiff[];
  summaryNotes: string[];
}

export function compareTheses(prev: Thesis, next: Thesis): ThesisComparison {
  const metaChanges: FieldDiff[] = [];
  const summaryNotes: string[] = [];

  if (prev.direction !== next.direction) {
    metaChanges.push({
      field: 'direction',
      previousValue: prev.direction,
      currentValue: next.direction,
      description: `Thesis direction flipped from ${prev.direction.toUpperCase()} to ${next.direction.toUpperCase()}`,
    });
    summaryNotes.push(`Direction changed from ${prev.direction} to ${next.direction}`);
  }

  if (prev.status !== next.status) {
    metaChanges.push({
      field: 'status',
      previousValue: prev.status,
      currentValue: next.status,
      description: `Status changed from ${prev.status} to ${next.status}`,
    });
    summaryNotes.push(`Status updated to ${next.status.toUpperCase()}`);
  }

  if (prev.thesisSummary !== next.thesisSummary) {
    metaChanges.push({
      field: 'thesisSummary',
      previousValue: prev.thesisSummary,
      currentValue: next.thesisSummary,
      description: 'Thesis summary statement revised',
    });
    summaryNotes.push('Revised core summary statement');
  }

  if (prev.investmentHorizon !== next.investmentHorizon) {
    metaChanges.push({
      field: 'investmentHorizon',
      previousValue: prev.investmentHorizon,
      currentValue: next.investmentHorizon,
      description: `Investment horizon changed from ${prev.investmentHorizon} to ${next.investmentHorizon}`,
    });
  }

  const prevAssumpMap = new Map<string, ThesisAssumption>(
    prev.assumptions.map((a) => [a.id, a])
  );
  const nextAssumpMap = new Map<string, ThesisAssumption>(
    next.assumptions.map((a) => [a.id, a])
  );

  const assumptionDiffs: AssumptionDiff[] = [];

  // Check additions and modifications
  for (const [id, nextAssump] of nextAssumpMap.entries()) {
    const prevAssump = prevAssumpMap.get(id);
    if (!prevAssump) {
      assumptionDiffs.push({
        id,
        type: 'added',
        statement: nextAssump.statement,
        changes: [
          {
            field: 'assumption',
            previousValue: null,
            currentValue: nextAssump.statement,
            description: `New assumption added: "${nextAssump.statement}"`,
          },
        ],
      });
      summaryNotes.push(`Added assumption: ${nextAssump.statement.slice(0, 40)}...`);
    } else {
      const fieldChanges: FieldDiff[] = [];

      if (prevAssump.statement !== nextAssump.statement) {
        fieldChanges.push({
          field: 'statement',
          previousValue: prevAssump.statement,
          currentValue: nextAssump.statement,
          description: 'Assumption wording modified',
        });
      }

      if (prevAssump.status !== nextAssump.status) {
        fieldChanges.push({
          field: 'status',
          previousValue: prevAssump.status,
          currentValue: nextAssump.status,
          description: `Evidence status shifted from ${prevAssump.status} to ${nextAssump.status}`,
        });
        summaryNotes.push(`Assumption status: ${prevAssump.status} → ${nextAssump.status}`);
      }

      if (prevAssump.targetThreshold !== nextAssump.targetThreshold) {
        fieldChanges.push({
          field: 'targetThreshold',
          previousValue: prevAssump.targetThreshold,
          currentValue: nextAssump.targetThreshold,
          description: `Target threshold adjusted from ${prevAssump.targetThreshold} to ${nextAssump.targetThreshold}`,
        });
      }

      if (prevAssump.currentValue !== nextAssump.currentValue) {
        fieldChanges.push({
          field: 'currentValue',
          previousValue: prevAssump.currentValue,
          currentValue: nextAssump.currentValue,
          description: `Reported metric updated: ${prevAssump.currentValue || 'N/A'} → ${nextAssump.currentValue || 'N/A'}`,
        });
      }

      if (fieldChanges.length > 0) {
        assumptionDiffs.push({
          id,
          type: 'modified',
          statement: nextAssump.statement,
          changes: fieldChanges,
        });
      } else {
        assumptionDiffs.push({
          id,
          type: 'unchanged',
          statement: nextAssump.statement,
          changes: [],
        });
      }
    }
  }

  // Check removals
  for (const [id, prevAssump] of prevAssumpMap.entries()) {
    if (!nextAssumpMap.has(id)) {
      assumptionDiffs.push({
        id,
        type: 'removed',
        statement: prevAssump.statement,
        changes: [
          {
            field: 'assumption',
            previousValue: prevAssump.statement,
            currentValue: null,
            description: `Assumption removed: "${prevAssump.statement}"`,
          },
        ],
      });
      summaryNotes.push(`Removed assumption: ${prevAssump.statement.slice(0, 40)}...`);
    }
  }

  const hasChanges = metaChanges.length > 0 || assumptionDiffs.some((d) => d.type !== 'unchanged');

  return {
    versionFrom: prev.version,
    versionTo: next.version,
    hasChanges,
    metaChanges,
    assumptionDiffs,
    summaryNotes,
  };
}
