export interface CsvItem {
  COLOR: string;
  SIZE: string;
  QTY: number;
}

export interface OptimizationResult {
  COLOR: string;
  SIZE: string;
  QTY: number;
  PLATE: string;
  OPTIMAL_UPS: number;
  SHEETS_NEEDED: number;
  QTY_PRODUCED: number;
  EXCESS: number;
}

export interface OptimizationSummary {
  totalSheets: number;
  totalProduced: number;
  totalExcess: number;
  wastePercentage: number;
  totalPlates: number;
  totalItems: number;
  upsCapacity: number;
}