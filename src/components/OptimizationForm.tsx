import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Calculator, Minus, Plus, Printer } from 'lucide-react';

interface OptimizationFormProps {
  onOptimize: (upsPerPlate: number, plateCount: number) => void;
  isCalculating: boolean;
  isDisabled: boolean;
}

const OptimizationForm: React.FC<OptimizationFormProps> = ({ 
  onOptimize, 
  isCalculating,
  isDisabled 
}) => {
  const [upsPerPlate, setUpsPerPlate] = useState<number>(0);
  const [plateCount, setPlateCount] = useState<number>(0);
  
  const handleOptimize = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (upsPerPlate <= 0) {
      toast.error('UPS per plate must be greater than 0');
      return;
    }
    
    if (plateCount <= 0) {
      toast.error('Plate count must be greater than 0');
      return;
    }
    
    onOptimize(upsPerPlate, plateCount);
  };

  const incrementUps = () => {
    setUpsPerPlate(prev => Math.min(prev + 1, 99));
  };

  const decrementUps = () => {
    setUpsPerPlate(prev => Math.max(prev - 1, 1));
  };

  const incrementPlates = () => {
    setPlateCount(prev => Math.min(prev + 1, 26));
  };

  const decrementPlates = () => {
    setPlateCount(prev => Math.max(prev - 1, 1));
  };
  
  return (
    <form onSubmit={handleOptimize} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Optimization Settings
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Units Per Sheet (UPS)
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={decrementUps}
                disabled={isDisabled || isCalculating || upsPerPlate <= 1}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={upsPerPlate}
                onChange={e => setUpsPerPlate(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:text-white text-center"
                disabled={isDisabled || isCalculating}
                min="1"
                max="99"
              />
              <button
                type="button"
                onClick={incrementUps}
                disabled={isDisabled || isCalculating || upsPerPlate >= 99}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Total units that can fit on one sheet
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Plates
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={decrementPlates}
                disabled={isDisabled || isCalculating || plateCount <= 1}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={plateCount}
                onChange={e => setPlateCount(Math.max(1, Math.min(26, parseInt(e.target.value) || 1)))}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:text-white text-center"
                disabled={isDisabled || isCalculating}
                min="1"
                max="26"
              />
              <button
                type="button"
                onClick={incrementPlates}
                disabled={isDisabled || isCalculating || plateCount >= 26}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Number of printing plates to distribute work across
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={isDisabled || isCalculating}
      >
        {isCalculating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            Optimizing Layout...
          </>
        ) : (
          <>
            <Printer className="h-4 w-4 mr-2" />
            Optimize Print Layout
          </>
        )}
      </button>
    </form>
  );
};

export default OptimizationForm;