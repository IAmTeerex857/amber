import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

const ChartWidget: React.FC = () => {
  // Mock data for the chart
  const chartData = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 78 },
    { label: 'Mar', value: 52 },
    { label: 'Apr', value: 91 },
    { label: 'May', value: 84 },
    { label: 'Jun', value: 73 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Usage Analytics
            </h3>
            <p className="text-sm text-gray-600 mt-1">Monthly system usage overview</p>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-semibold text-green-600">+23.5%</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-end space-x-4 h-64">
          {chartData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors cursor-pointer"
                style={{ 
                  height: `${(data.value / maxValue) * 200}px`,
                  minHeight: '20px'
                }}
                title={`${data.label}: ${data.value}%`}
              />
              <span className="text-sm text-gray-600 mt-2">{data.label}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Average usage: <span className="font-semibold text-gray-900">73.8%</span>
            </div>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
              View detailed report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartWidget;