import React from 'react';

interface RadialGaugeProps {
  value: number; // 0-100
  totalLabel?: string; // e.g. "$23,316"
  caption?: string; // e.g. "All Total"
  size?: number; // px
  strokeWidth?: number; // px
  accentColor?: string; // tailwind color class like text-blue-600
}

const RadialGauge: React.FC<RadialGaugeProps> = ({
  value,
  totalLabel,
  caption = 'All Total',
  size = 160,
  strokeWidth = 14,
  accentColor = '#3b82f6', // blue-500
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="block">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb" /* gray-200 */
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={accentColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {totalLabel && (
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="font-semibold fill-gray-900"
            style={{ fontSize: size * 0.18 }}
          >
            {totalLabel}
          </text>
        )}
      </svg>
      <div className="mt-2 text-xs text-gray-600">{caption}</div>
    </div>
  );
};

export default RadialGauge;
