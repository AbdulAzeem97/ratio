import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { OptimizationResult } from '../types/types';

interface ResultsTableProps {
  results: OptimizationResult[];
}

type SortField = keyof OptimizationResult;
type SortDirection = 'asc' | 'desc';

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  const [sortField, setSortField] = useState<SortField>('PLATE');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();

    if (sortDirection === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;

    return <ArrowUpDown className="ml-1 h-4 w-4 inline-block text-gray-400" />;
  };

  // Group results by PLATE to handle Sheets column rendering
  const groupedResults = sortedResults.reduce((acc, curr) => {
    const lastGroup = acc[acc.length - 1];
    if (lastGroup && lastGroup[0].PLATE === curr.PLATE) {
      lastGroup.push(curr); // Add to the existing group
    } else {
      acc.push([curr]); // Create a new group
    }
    return acc;
  }, [] as OptimizationResult[][]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Optimization Results</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th
                className="px-3 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('COLOR')}
              >
                Color {renderSortIndicator('COLOR')}
              </th>
              <th
                className="px-3 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('SIZE')}
              >
                Size {renderSortIndicator('SIZE')}
              </th>
              <th
                className="px-3 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('QTY')}
              >
                Qty {renderSortIndicator('QTY')}
              </th>
              <th
                className="px-3 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('PLATE')}
              >
                Plate {renderSortIndicator('PLATE')}
              </th>
              <th
                className="px-1 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('OPTIMAL_UPS')}
              >
                UPS {renderSortIndicator('OPTIMAL_UPS')}
              </th>
              <th
                className="px-1 py-1 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('SHEETS_NEEDED')}
              >
                Actual Sheets {renderSortIndicator('SHEETS_NEEDED')}
              </th>
              <th
                className="px-1 py-1 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('QTY_PRODUCED')}
              >
                Produced {renderSortIndicator('QTY_PRODUCED')}
              </th>
              <th
                className="px-3 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('EXCESS')}
              >
                Excess {renderSortIndicator('EXCESS')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {groupedResults.map((group, groupIndex) =>
              group.map((result, rowIndex) => (
                <tr key={groupIndex + '-' + rowIndex} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100">{result.COLOR}</td>
                  <td className="px-3 py-3
                   text-sm text-gray-900 dark:text-gray-100">{result.SIZE}</td>
                  <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100">{result.QTY}</td>
                  <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100">{result.PLATE}</td>
                  <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100">{result.OPTIMAL_UPS}</td>
                  <td className=" text-xl font-semibold mb-4 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 ">
                    {rowIndex === 0 ? result.SHEETS_NEEDED : ''}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100">{result.QTY_PRODUCED}</td>
                  <td
                    className={`px-3 py-2 text-sm ${
                      result.EXCESS > 0
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}
                  >
                    {result.EXCESS}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
