import { OptimizationResult, OptimizationSummary } from '../types/types';

// Generate all UPS combinations that sum to upsPerPlate with a limit of 4 items per plate
function getUPSCombinations(total: number, maxItems = 4): number[][] {
  const results: number[][] = [];
  function backtrack(path: number[], sum: number) {
    if (path.length > maxItems || sum > total) return;
    if (sum === total) {
      results.push([...path]);
      return;
    }
    for (let i = 1; i <= total; i++) {
      backtrack([...path, i], sum + i);
    }
  }
  backtrack([], 0);
  return results;
}

// Convert a zero-based index to an alphabetical plate label
function getPlateLabel(index: number): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let label = '';
  index += 1; // switch to 1-based numbering
  while (index > 0) {
    index -= 1;
    label = letters[index % 26] + label;
    index = Math.floor(index / 26);
  }
  return label;
}

export const optimizeUpsWithPlates = (
  items: Array<{ COLOR: string; SIZE: string; QTY: number }>,
  upsPerPlate: number,
  plateCount: number,
  paperCost = 0,
  inkCost = 0
): { results: OptimizationResult[]; summary: OptimizationSummary } => {
  const sortedItems = [...items].sort((a, b) => b.QTY - a.QTY);
  const totalItems = sortedItems.reduce((sum, item) => sum + item.QTY, 0);
  const upsCombos = getUPSCombinations(upsPerPlate, 4);

  const results: OptimizationResult[] = [];
  const summary: OptimizationSummary = {
    totalSheets: 0,
    totalProduced: 0,
    totalExcess: 0,
    wastePercentage: 0,
    totalItems,
    upsCapacity: upsPerPlate,
    totalPlates: plateCount,
    totalCost: 0
  };

  let plateIndex = 0;
  let remainingItems = [...sortedItems];

  while (remainingItems.length > 0 && plateIndex < plateCount) {
    const plateItems = remainingItems.slice(0, 4); // pick max 4 for combo
    const bestCombo = upsCombos
      .filter(c => c.length === plateItems.length)
      .map(c => {
        const sheetsNeeded = Math.max(
          ...plateItems.map((item, i) => Math.ceil(item.QTY / c[i]))
        );
        return { combo: c, sheetsNeeded };
      })
      .sort((a, b) => a.sheetsNeeded - b.sheetsNeeded)[0];

    if (!bestCombo) break;

    const plateLabel = getPlateLabel(plateIndex); // A, B, C... AA after Z

    for (let i = 0; i < plateItems.length; i++) {
      const item = plateItems[i];
      const ups = bestCombo.combo[i];
      const sheetsNeeded = bestCombo.sheetsNeeded;
      const produced = sheetsNeeded * ups;
      const excess = produced - item.QTY;

      results.push({
        COLOR: item.COLOR,
        SIZE: item.SIZE,
        QTY: item.QTY,
        PLATE: plateLabel,
        OPTIMAL_UPS: ups,
        SHEETS_NEEDED: sheetsNeeded,
        QTY_PRODUCED: produced,
        EXCESS: excess
      });
    }

    summary.totalSheets += bestCombo.sheetsNeeded;
    summary.totalProduced += bestCombo.sheetsNeeded * upsPerPlate;

    remainingItems = remainingItems.slice(plateItems.length);
    plateIndex++;
  }

  // Handle leftovers with 1 item per plate
  for (const item of remainingItems) {
    const ups = upsPerPlate;
    const sheets = Math.ceil(item.QTY / ups);
    const produced = sheets * ups;
    const excess = produced - item.QTY;
    const plateLabel = getPlateLabel(plateIndex);

    results.push({
      COLOR: item.COLOR,
      SIZE: item.SIZE,
      QTY: item.QTY,
      PLATE: plateLabel,
      OPTIMAL_UPS: ups,
      SHEETS_NEEDED: sheets,
      QTY_PRODUCED: produced,
      EXCESS: excess
    });

    summary.totalSheets += sheets;
    summary.totalProduced += produced;
    plateIndex++;
  }

  summary.totalExcess = summary.totalProduced - summary.totalItems;
  summary.wastePercentage = summary.totalProduced
    ? parseFloat(((summary.totalExcess / summary.totalProduced) * 100).toFixed(2))
    : 0;

  const costPerSheet = paperCost + inkCost;
  summary.totalCost = parseFloat((summary.totalSheets * costPerSheet).toFixed(2));

  return { results, summary };
};