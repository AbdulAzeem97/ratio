// // src/utils/optimizer.ts
// import { OptimizationResult, OptimizationSummary } from '../types/types';

// export const optimizeUpsWithPlates = (
//   items: Array<{ COLOR: string; SIZE: string; QTY: number }>,
//   upsPerPlate: number,
//   plateCount: number
// ): { results: OptimizationResult[]; summary: OptimizationSummary } => {
//   const sortedItems = [...items].sort((a, b) => b.QTY - a.QTY);

//   const plates: Array<{ load: number; index: number; items: Array<{ COLOR: string; SIZE: string; QTY: number }> }> =
//     Array.from({ length: plateCount }, (_, index) => ({ load: 0, index, items: [] }));

//   // Distribute items across plates by quantity
//   for (const item of sortedItems) {
//     let qtyRemaining = item.QTY;
//     while (qtyRemaining > 0) {
//       plates.sort((a, b) => a.load - b.load);
//       const targetPlate = plates[0];
//       const allocQty = Math.min(qtyRemaining, upsPerPlate * 100); // Cap to avoid oversized batches
//       targetPlate.items.push({ ...item, QTY: allocQty });
//       targetPlate.load += allocQty;
//       qtyRemaining -= allocQty;
//     }
//   }

//   const results: OptimizationResult[] = [];
//   const summary: OptimizationSummary = {
//     totalSheets: 0,
//     totalProduced: 0,
//     totalExcess: 0,
//     wastePercentage: 0,
//     totalItems: sortedItems.reduce((sum, item) => sum + item.QTY, 0),
//     upsCapacity: upsPerPlate,
//     totalPlates: plateCount
//   };

//   for (const plate of plates) {
//     const { index, items: plateItems } = plate;
//     if (plateItems.length === 0) continue;

//     const totalQty = plateItems.reduce((sum, item) => sum + item.QTY, 0);
//     let upsAllocations = plateItems.map(item =>
//       Math.max(1, Math.round((item.QTY / totalQty) * upsPerPlate))
//     );

//     let totalAllocated = upsAllocations.reduce((sum, val) => sum + val, 0);

//     // Adjust UPS to match exact upsPerPlate
//     while (totalAllocated !== upsPerPlate) {
//       if (totalAllocated > upsPerPlate) {
//         const maxIdx = upsAllocations.indexOf(Math.max(...upsAllocations));
//         if (upsAllocations[maxIdx] > 1) {
//           upsAllocations[maxIdx]--;
//           totalAllocated--;
//         } else break;
//       } else {
//         const maxQtyIdx = plateItems.reduce(
//           (maxIdx, item, idx, arr) => (item.QTY > arr[maxIdx].QTY ? idx : maxIdx),
//           0
//         );
//         upsAllocations[maxQtyIdx]++;
//         totalAllocated++;
//       }
//     }

//     const sheetsNeeded = Math.max(
//       ...plateItems.map((item, idx) => Math.ceil(item.QTY / upsAllocations[idx]))
//     );

//     const plateLabel = String.fromCharCode(65 + index); // A, B, C...

//     for (let i = 0; i < plateItems.length; i++) {
//       const item = plateItems[i];
//       const ups = upsAllocations[i];
//       const produced = sheetsNeeded * ups;
//       const excess = produced - item.QTY;

//       results.push({
//         COLOR: item.COLOR,
//         SIZE: item.SIZE,
//         QTY: item.QTY,
//         PLATE: plateLabel,
//         OPTIMAL_UPS: ups,
//         SHEETS_NEEDED: sheetsNeeded,
//         QTY_PRODUCED: produced,
//         EXCESS: excess
//       });
//     }

//     summary.totalSheets += sheetsNeeded;
//     summary.totalProduced += sheetsNeeded * upsAllocations.reduce((sum, ups) => sum + ups, 0);
//   }

//   summary.totalExcess = summary.totalProduced - summary.totalItems;
//   summary.wastePercentage =
//     summary.totalProduced > 0
//       ? parseFloat(((summary.totalExcess / summary.totalProduced) * 100).toFixed(2))
//       : 0;

//   return { results, summary };
// };


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

export const optimizeUpsWithPlates = (
  items: Array<{ COLOR: string; SIZE: string; QTY: number }>,
  upsPerPlate: number,
  plateCount: number
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
    totalPlates: plateCount
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

    const plateLabel = String.fromCharCode(65 + plateIndex); // A, B, C...

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
    const plateLabel = String.fromCharCode(65 + plateIndex);

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

  return { results, summary };
};