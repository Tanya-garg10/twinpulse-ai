import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface VitalCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  baseline: string | number;
  delta: {
    value: number;
    text: string;
    direction: 'up' | 'down' | 'neutral';
    isAnomaly?: boolean;
  };
  status?: 'normal' | 'watch' | 'critical';
  isSimulated?: boolean;
  timestamp?: string;
  sparklineData?: number[];
  colorClass?: string;
  isDarkMode?: boolean;
  freshness?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export const VitalCard: React.FC<VitalCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  baseline,
  delta,
  status = 'normal',
  isSimulated = true,
  timestamp = 'Just now',
  sparklineData = [70, 72, 71, 74, 73, 76, 75],
  onClick,
  isSelected = false,
}) => {
  // Simple clean SVG sparkline
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal || 1;
  const points = sparklineData
    .map((v, i) => {
      const x = (i / (sparklineData.length - 1)) * 52;
      const y = 20 - ((v - minVal) / range) * 14;
      return `${x},${y}`;
    })
    .join(' ');

  const isCritical = status === 'critical' || delta.isAnomaly;
  const isWatch = status === 'watch';

  return (
    <div
      onClick={onClick}
      className={`p-3.5 rounded-xl bg-white border transition-all duration-150 flex flex-col justify-between shadow-soft cursor-pointer ${
        isSelected
          ? 'border-[#27866F] ring-1 ring-[#27866F]'
          : 'border-[#E8EDEB] hover:border-[#D5DFDC] hover:shadow-card-hover'
      }`}
    >
      {/* Top Header: Label & Icon */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-6 h-6 rounded-md bg-[#E6F2ED] text-[#27866F] flex items-center justify-center shrink-0">
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-[#202B33] truncate">
            {label}
          </span>
        </div>

        {/* Status Pill (quiet, restrained) */}
        {isCritical ? (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#FEE2E2] text-[#DC2626]">
            Elevated
          </span>
        ) : isWatch ? (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#FEF3C7] text-[#D97706]">
            Shift
          </span>
        ) : (
          <span className="text-[10px] font-mono text-[#77838D]">
            {timestamp}
          </span>
        )}
      </div>

      {/* Main Metric Value & Sparkline */}
      <div className="my-2 flex items-end justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#202B33] tabular-nums">
              {value}
            </span>
            <span className="text-xs text-[#77838D] font-normal">
              {unit}
            </span>
          </div>

          {/* Delta Comparison */}
          <div className="flex items-center gap-1 mt-0.5 text-[11px] font-mono">
            {delta.direction === 'up' ? (
              <TrendingUp className={`w-3 h-3 ${isCritical ? 'text-[#DC2626]' : 'text-[#77838D]'}`} />
            ) : delta.direction === 'down' ? (
              <TrendingDown className={`w-3 h-3 ${isCritical ? 'text-[#DC2626]' : 'text-[#77838D]'}`} />
            ) : (
              <Minus className="w-3 h-3 text-[#77838D]" />
            )}
            <span className={isCritical ? 'text-[#DC2626] font-semibold' : 'text-[#77838D]'}>
              {delta.text}
            </span>
          </div>
        </div>

        {/* Tiny Sparkline */}
        <div className="w-14 h-6 shrink-0 flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 52 22">
            <polyline
              fill="none"
              stroke={isCritical ? '#DC2626' : '#27866F'}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>

      {/* Baseline reference footer */}
      <div className="pt-2 border-t border-[#E8EDEB] flex items-center justify-between text-[10px] font-mono text-[#77838D]">
        <span>Base: {baseline}</span>
        <span className="text-[10px] text-[#77838D]">
          {isSimulated ? 'Simulated' : 'Measured'}
        </span>
      </div>
    </div>
  );
};
