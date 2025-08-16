import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SeriesPoint { x: string; y: number }

interface SimpleAreaChartProps {
  title?: string;
  series?: SeriesPoint[];
  subtitle?: string;
  rangeLabel?: string;
  onViewMore?: () => void;
}

// Lightweight SVG area chart (no deps). Scales to container.
const SimpleAreaChart: React.FC<SimpleAreaChartProps> = ({
  title = 'Cash Flow',
  series = [
    { x: '18 Jul', y: 38 },
    { x: '19 Jul', y: 72 },
    { x: '20 Jul', y: 55 },
    { x: '21 Jul', y: 15 },
    { x: '22 Jul', y: 12 },
    { x: '23 Jul', y: 48 },
    { x: '24 Jul', y: 66 },
    { x: '25 Jul', y: 84 },
    { x: '26 Jul', y: 41 },
  ],
  subtitle = 'This week',
  rangeLabel = 'This week',
  onViewMore,
}) => {
  const width = 700; // virtual width
  const height = 220; // virtual height
  const max = Math.max(...series.map(s => s.y), 100);
  const min = Math.min(...series.map(s => s.y), 0);
  const padX = 20;
  const padY = 16;

  const scaleX = (i: number) => padX + (i * (width - padX * 2)) / (series.length - 1);
  const scaleY = (v: number) => padY + (height - padY * 2) * (1 - (v - min) / (max - min || 1));

  const line = series
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(p.y)}`)
    .join(' ');

  const area = `${line} L ${scaleX(series.length - 1)} ${height - padY} L ${scaleX(0)} ${height - padY} Z`;

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <button className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
          {rangeLabel}
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
      <div className="p-5">
        <div className="w-full h-64">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            {/* Grid */}
            <g stroke="#e5e7eb" strokeWidth="1">
              {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                <line key={i} x1={padX} x2={width - padX} y1={padY + (height - padY * 2) * t} y2={padY + (height - padY * 2) * t} />
              ))}
            </g>
            {/* Gradient */}
            <defs>
              <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#areaFill)" />
            <path d={line} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
            {/* Points */}
            {series.map((p, i) => (
              <circle key={i} cx={scaleX(i)} cy={scaleY(p.y)} r={4} fill="#3b82f6" />
            ))}
          </svg>
        </div>
        <div className="mt-4 text-right">
          <button 
            onClick={onViewMore} 
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            View More
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleAreaChart;
