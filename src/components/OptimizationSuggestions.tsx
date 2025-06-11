import React from 'react';
import { OptimizationSummary } from '../types/types';

interface OptimizationSuggestionsProps {
  summary: OptimizationSummary;
}

const OptimizationSuggestions: React.FC<OptimizationSuggestionsProps> = ({ summary }) => {
  const suggestions: string[] = [];

  if (summary.wastePercentage > 5) {
    suggestions.push('High waste detected. Consider reducing UPS per plate or increasing plate count.');
  } else if (summary.wastePercentage > 0) {
    suggestions.push('Good job! Waste is within acceptable limits but could be optimized further.');
  } else {
    suggestions.push('Perfect optimization achieved with zero waste.');
  }

  if (summary.totalPlates < 3) {
    suggestions.push('Using more plates may further reduce waste and production time.');
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Optimization Suggestions</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300 text-sm">
        {suggestions.map((s, idx) => (
          <li key={idx}>{s}</li>
        ))}
      </ul>
    </div>
  );
};

export default OptimizationSuggestions;
