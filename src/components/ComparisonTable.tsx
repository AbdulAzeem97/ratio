import React from 'react';
import { OptimizationResult } from '../types/types';

interface ComparisonTableProps {
  results: OptimizationResult[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ results }) => {
  // Group results by color and size
  const groupedResults = results.reduce((acc, curr) => {
    const key = `${curr.COLOR}-${curr.SIZE}`;
    if (!acc[key]) {
      acc[key] = {
        color: curr.COLOR,
        size: curr.SIZE,
        plates: {},
      };
    }
    acc[key].plates[curr.PLATE] = {
      ups: curr.OPTIMAL_UPS,
      sheets: curr.SHEETS_NEEDED,
      produced: curr.QTY_PRODUCED,
      excess: curr.EXCESS,
    };
    return acc;
  }, {} as Record<string, {
    color: string;
    size: string;
    plates: Record<string, {
      ups: number;
      sheets: number;
      produced: number;
      excess: number;
    }>;
  }>);

  // Get unique plate names
  const plates = [...new Set(results.map(r => r.PLATE))].sort();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Plate Comparison Analysis
      </h3>
      
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Color
            </th>
            <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Size
            </th>
            {plates.map(plate => (
              <th 
                key={plate}
                className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                colSpan={4}
              >
                Plate {plate}
              </th>
            ))}
          </tr>
          <tr>
            <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800"></th>
            <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800"></th>
            {plates.map(plate => (
              <React.Fragment key={`metrics-${plate}`}>
                <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  UPS
                </th>
                <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Sheets
                </th>
                <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Produced
                </th>
                <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Excess
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {Object.values(groupedResults).map((group, idx) => (
            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                {group.color}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                {group.size}
              </td>
              {plates.map(plate => (
                <React.Fragment key={`data-${plate}`}>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {group.plates[plate]?.ups || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {group.plates[plate]?.sheets || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {group.plates[plate]?.produced || '-'}
                  </td>
                  <td className={`px-4 py-3 text-sm ${
                    group.plates[plate]?.excess > 0 
                      ? 'text-amber-600 dark:text-amber-400' 
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {group.plates[plate]?.excess || '-'}
                  </td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;