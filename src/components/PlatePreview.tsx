import React from 'react';
import { OptimizationResult } from '../types/types';

interface PlatePreviewProps {
  results: OptimizationResult[];
}

// Visual preview of items on each plate. Items are displayed as colored blocks
// with their UPS value. This is a lightweight visual aid rather than a true
// layout representation.
const PlatePreview: React.FC<PlatePreviewProps> = ({ results }) => {
  if (!results || results.length === 0) return null;

  // Group results by plate
  const plates = results.reduce<Record<string, OptimizationResult[]>>((acc, r) => {
    acc[r.PLATE] = acc[r.PLATE] ? [...acc[r.PLATE], r] : [r];
    return acc;
  }, {});

  // A simple color palette for blocks
  const palette = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-red-500'
  ];

  return (
    <div className="space-y-6">
      {Object.entries(plates).map(([plate, items]) => (
        <div key={plate} className="border rounded-md p-4 bg-white dark:bg-gray-800 shadow">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Plate {plate}</h3>
          <div className="flex flex-wrap gap-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`text-white text-xs px-2 py-1 rounded ${palette[idx % palette.length]}`}
                title={`${item.COLOR} ${item.SIZE} - UPS ${item.OPTIMAL_UPS}`}
              >
                {item.COLOR}-{item.SIZE} ({item.OPTIMAL_UPS})
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlatePreview;
