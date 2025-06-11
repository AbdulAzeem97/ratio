import React from 'react';
import { OptimizationSummary, CsvItem } from '../types/types';
import { optimizeUpsWithPlates } from '../utils/optimizer';

interface PredictionPanelProps {
  items: CsvItem[];
  ups: number;
  plates: number;
}

// Simple prediction component. It runs the optimizer with one additional plate
// and displays the projected waste percentage. This provides a quick what-if
// scenario for users.
const PredictionPanel: React.FC<PredictionPanelProps> = ({ items, ups, plates }) => {
  if (!items || items.length === 0) return null;

  const { summary } = optimizeUpsWithPlates(items, ups, plates + 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mt-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Prediction with {plates + 1} plates
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Estimated waste: {summary.wastePercentage.toFixed(2)}% ({summary.totalExcess} pcs)
      </p>
    </div>
  );
};

export default PredictionPanel;
