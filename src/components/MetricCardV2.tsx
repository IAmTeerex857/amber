import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardV2Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  sublabel?: string;
  sparkline?: number[]; // optional tiny chart; values 0-100
  actionText?: string;
  onAction?: () => void;
}

const MetricCardV2: React.FC<MetricCardV2Props> = ({
  title,
  value,
  icon: Icon,
  delta,
  trend = 'neutral',
  sublabel,
  sparkline,
  actionText = 'View More',
  onAction,
}) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <div className="mt-1 text-3xl font-semibold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</div>
          {sublabel && (
            <div className="mt-1 text-xs text-gray-500">{sublabel}</div>
          )}
        </div>
        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon className="h-5 w-5 text-gray-700" />
        </div>
      </div>

      <div className="mt-3">
        {sparkline ? (
          <div className="h-8 flex items-end space-x-1">
            {sparkline.map((v, i) => (
              <div
                key={i}
                className="w-1.5 rounded-t bg-blue-500/70"
                style={{ height: `${Math.max(8, Math.min(100, v)) * 0.6}%` }}
              />
            ))}
          </div>
        ) : (
          <div className="h-8" />
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        {delta ? (
          <span className={`text-xs font-medium ${trendColor}`}>{delta}</span>
        ) : <span />}
        <button
          type="button"
          onClick={onAction}
          className="text-xs font-medium text-gray-600 hover:text-gray-800"
        >
          {actionText}
        </button>
      </div>
    </div>
  );
};

export default MetricCardV2;
