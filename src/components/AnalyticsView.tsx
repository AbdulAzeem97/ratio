import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { OptimizationResult } from '../types/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsViewProps {
  results: OptimizationResult[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ results }) => {
  // Check for empty results
  if (!results || results.length === 0) {
    return (
      <div className="p-6 bg-gradient-to-r from-indigo-300 to-indigo-100 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
        <p className="text-xl font-semibold text-gray-700">No data available</p>
      </div>
    );
  }

  // Calculate color distribution
  const colorDistribution = results.reduce((acc, curr) => {
    acc[curr.COLOR] = (acc[curr.COLOR] || 0) + curr.QTY;
    return acc;
  }, {} as Record<string, number>);

  // Calculate plate efficiency
  const plateEfficiency = results.reduce((acc, curr) => {
    acc[curr.PLATE] = {
      produced: (acc[curr.PLATE]?.produced || 0) + curr.QTY_PRODUCED,
      excess: (acc[curr.PLATE]?.excess || 0) + curr.EXCESS,
    };
    return acc;
  }, {} as Record<string, { produced: number; excess: number }>);

  const colorChartData = {
    labels: Object.keys(colorDistribution),
    datasets: [
      {
        label: 'Quantity by Color',
        data: Object.values(colorDistribution),
        backgroundColor: [
          'rgba(0, 123, 255, 0.6)', // Blue
          'rgba(0, 204, 255, 0.6)', // Light Blue
          'rgba(33, 150, 243, 0.6)', // Deep Sky Blue
          'rgba(66, 165, 245, 0.6)', // Sky Blue
        ],
        borderColor: [
          'rgba(0, 123, 255, 1)',
          'rgba(0, 204, 255, 1)',
          'rgba(33, 150, 243, 1)',
          'rgba(66, 165, 245, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const plateEfficiencyData = {
    labels: Object.keys(plateEfficiency),
    datasets: [
      {
        label: 'Production Quantity',
        data: Object.values(plateEfficiency).map(v => v.produced),
        backgroundColor: 'rgba(100, 181, 246, 0.6)', // Light Blue
        borderColor: 'rgba(100, 181, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Excess',
        data: Object.values(plateEfficiency).map(v => v.excess),
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Soft Red
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const wasteDistributionData = {
    labels: Object.keys(plateEfficiency),
    datasets: [
      {
        label: 'Waste %',
        data: Object.values(plateEfficiency).map(v =>
          parseFloat(((v.excess / v.produced) * 100).toFixed(2))
        ),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Color Distribution Chart */}
        <div className="bg-gradient-to-r from-gray-300 to-gray-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Color Distribution</h3>
          <div className="h-64">
            <Pie data={colorChartData} options={{ maintainAspectRatio: false, responsive: true }} />
          </div>
        </div>

        {/* Plate Efficiency Chart */}
        <div className="bg-gradient-to-r from-gray-300 to-gray-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Plate Efficiency</h3>
          <div className="h-64">
            <Bar
              data={plateEfficiencyData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Waste Distribution Chart */}
        <div className="bg-gradient-to-r from-gray-300 to-gray-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Waste by Plate</h3>
          <div className="h-64">
            <Bar
              data={wasteDistributionData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Plate Efficiency Table */}
      <div className="bg-gradient-to-r from-gray-300 to-gray-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Efficiency Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plate
                </th>
                <th className="px-4 py-3 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Production
                </th>
                <th className="px-4 py-3 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Excess
                </th>
                <th className="px-4 py-3 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(plateEfficiency).map(([plate, data]) => {
                const efficiency = ((data.produced - data.excess) / data.produced * 100).toFixed(2);
                return (
                  <tr key={plate}>
                    <td className="px-4 py-3 text-sm text-gray-900">Plate {plate}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{data.produced}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{data.excess}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{efficiency}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;

