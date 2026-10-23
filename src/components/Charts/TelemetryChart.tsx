import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import { VitalReading, VitalBaseline } from '../../types/health';
import { AlertCircle } from 'lucide-react';

interface TelemetryChartProps {
  readings: VitalReading[];
  baseline: VitalBaseline;
  activeMetric?: string;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({ readings, baseline }) => {
  const [selectedMetric, setSelectedMetric] = useState<'heartRate' | 'bloodPressure' | 'spO2' | 'respiratoryRate' | 'bodyTemp' | 'hrv'>('heartRate');
  const [timeWindow, setTimeWindow] = useState<'24h' | '48h' | '7d'>('24h');
  const [showBaselineCorridor, setShowBaselineCorridor] = useState<boolean>(true);

  // Filter based on time window
  const windowCount = timeWindow === '24h' ? 24 : timeWindow === '48h' ? 48 : readings.length;
  const filteredData = readings.slice(-windowCount).map((r) => {
    const d = new Date(r.timestamp);
    const timeLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      ...r,
      timeLabel,
      baselineMean:
        selectedMetric === 'heartRate'
          ? baseline.heartRate.mean
          : selectedMetric === 'spO2'
          ? baseline.spO2.mean
          : selectedMetric === 'respiratoryRate'
          ? baseline.respiratoryRate.mean
          : selectedMetric === 'bodyTemp'
          ? baseline.bodyTemp.mean
          : baseline.hrv.mean,
    };
  });

  const getMetricConfig = () => {
    switch (selectedMetric) {
      case 'heartRate':
        return {
          title: 'Heart Rate',
          unit: 'BPM',
          color: '#27866F',
          domain: [45, 140],
          mean: baseline.heartRate.mean,
          std: baseline.heartRate.std,
          minCorridor: Math.max(50, baseline.heartRate.mean - baseline.heartRate.std * 1.5),
          maxCorridor: Math.min(130, baseline.heartRate.mean + baseline.heartRate.std * 1.5),
        };
      case 'bloodPressure':
        return {
          title: 'Blood Pressure',
          unit: 'mmHg',
          color: '#27866F',
          secondaryColor: '#5C9E8E',
          domain: [60, 175],
          mean: baseline.systolicBP.mean,
          std: baseline.systolicBP.std,
          minCorridor: baseline.systolicBP.mean - baseline.systolicBP.std * 1.5,
          maxCorridor: baseline.systolicBP.mean + baseline.systolicBP.std * 1.5,
        };
      case 'spO2':
        return {
          title: 'Oxygen Saturation',
          unit: '%',
          color: '#27866F',
          domain: [86, 100],
          mean: baseline.spO2.mean,
          std: baseline.spO2.std,
          minCorridor: Math.max(92, baseline.spO2.mean - baseline.spO2.std * 1.5),
          maxCorridor: 100,
        };
      case 'respiratoryRate':
        return {
          title: 'Respiratory Rate',
          unit: 'br/min',
          color: '#27866F',
          domain: [8, 28],
          mean: baseline.respiratoryRate.mean,
          std: baseline.respiratoryRate.std,
          minCorridor: Math.max(10, baseline.respiratoryRate.mean - baseline.respiratoryRate.std * 1.5),
          maxCorridor: Math.min(24, baseline.respiratoryRate.mean + baseline.respiratoryRate.std * 1.5),
        };
      case 'bodyTemp':
        return {
          title: 'Body Temperature',
          unit: '°C',
          color: '#27866F',
          domain: [35.8, 38.8],
          mean: baseline.bodyTemp.mean,
          std: baseline.bodyTemp.std,
          minCorridor: baseline.bodyTemp.mean - 0.4,
          maxCorridor: baseline.bodyTemp.mean + 0.4,
        };
      case 'hrv':
        return {
          title: 'Heart Rate Variability',
          unit: 'ms',
          color: '#27866F',
          domain: [12, 100],
          mean: baseline.hrv.mean,
          std: baseline.hrv.std,
          minCorridor: Math.max(16, baseline.hrv.mean - baseline.hrv.std * 1.5),
          maxCorridor: baseline.hrv.mean + baseline.hrv.std * 1.5,
        };
    }
  };

  const config = getMetricConfig();

  // Custom sleek tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: VitalReading = payload[0].payload;
      return (
        <div className="bg-white border border-[#E8EDEB] p-3 rounded-xl shadow-card-hover text-xs space-y-1 min-w-[170px]">
          <div className="flex items-center justify-between pb-1 border-b border-[#E8EDEB]">
            <span className="font-mono text-[#77838D]">{label}</span>
            {data.isAnomaly && (
              <span className="flex items-center gap-1 text-[10px] text-[#DC2626] font-semibold bg-[#FEE2E2] px-1.5 py-0.2 rounded font-mono">
                <AlertCircle className="w-3 h-3" /> Outlier
              </span>
            )}
          </div>
          {selectedMetric === 'bloodPressure' ? (
            <>
              <div className="flex justify-between">
                <span className="text-[#77838D]">Systolic:</span>
                <span className="font-mono font-bold text-[#202B33]">{data.systolicBP} mmHg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#77838D]">Diastolic:</span>
                <span className="font-mono font-bold text-[#202B33]">{data.diastolicBP} mmHg</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span className="text-[#77838D]">{config.title}:</span>
              <span className="font-mono font-bold text-[#202B33]">
                {(data as any)[selectedMetric]} {config.unit}
              </span>
            </div>
          )}
          <div className="flex justify-between text-[11px] text-[#77838D] pt-1 border-t border-[#E8EDEB]">
            <span>Baseline μ:</span>
            <span className="font-mono text-[#27866F] font-semibold">{config.mean} {config.unit}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-3">
      {/* Metric Selector Tabs & Time Range Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        {/* Metric Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-[#F7F9F8] rounded-lg border border-[#E8EDEB]">
          {[
            { id: 'heartRate', label: 'Heart Rate' },
            { id: 'bloodPressure', label: 'Blood Pressure' },
            { id: 'spO2', label: 'SpO₂ Oxygen' },
            { id: 'respiratoryRate', label: 'Respiration' },
            { id: 'bodyTemp', label: 'Temperature' },
            { id: 'hrv', label: 'HRV' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMetric(m.id as any)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                selectedMetric === m.id
                  ? 'bg-white text-[#202B33] font-semibold shadow-xs'
                  : 'text-[#77838D] hover:text-[#202B33]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Range switcher & baseline toggle */}
        <div className="flex items-center gap-2.5">
          <label className="flex items-center gap-1.5 text-xs text-[#77838D] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showBaselineCorridor}
              onChange={(e) => setShowBaselineCorridor(e.target.checked)}
              className="rounded border-[#E8EDEB] text-[#27866F] focus:ring-0 w-3.5 h-3.5"
            />
            <span>Baseline Envelope</span>
          </label>

          <div className="border border-[#E8EDEB] rounded-lg p-0.5 flex bg-[#F7F9F8]">
            {(['24h', '48h', '7d'] as const).map((w) => (
              <button
                key={w}
                onClick={() => setTimeWindow(w)}
                className={`px-2 py-0.5 text-xs rounded-md font-mono font-medium transition-colors ${
                  timeWindow === w
                    ? 'bg-white text-[#202B33] font-semibold shadow-xs'
                    : 'text-[#77838D] hover:text-[#202B33]'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="h-64 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#27866F" stopOpacity={0.14} />
                <stop offset="95%" stopColor="#27866F" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="timeLabel"
              stroke="#77838D"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E8EDEB' }}
            />
            <YAxis
              domain={config.domain}
              stroke="#77838D"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E8EDEB' }}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Patient Baseline Target Corridor (±1.5σ) */}
            {showBaselineCorridor && (
              <ReferenceArea
                y1={config.minCorridor}
                y2={config.maxCorridor}
                fill="#E6F2ED"
                fillOpacity={0.7}
                stroke="#27866F"
                strokeOpacity={0.25}
                strokeDasharray="3 3"
              />
            )}

            {/* Baseline Center Mean Line */}
            <ReferenceLine
              y={config.mean}
              stroke="#27866F"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />

            {/* Dual Line for Blood Pressure (Sys & Dia) or Single for others */}
            {selectedMetric === 'bloodPressure' ? (
              <>
                <Area
                  type="monotone"
                  dataKey="systolicBP"
                  stroke="#27866F"
                  fill="url(#metricGrad)"
                  strokeWidth={2}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    if (payload.isAnomaly) {
                      return <circle cx={cx} cy={cy} r={4} fill="#DC2626" stroke="#ffffff" strokeWidth={1.5} />;
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="diastolicBP"
                  stroke="#5C9E8E"
                  strokeWidth={2}
                  dot={false}
                />
              </>
            ) : (
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#27866F"
                fill="url(#metricGrad)"
                strokeWidth={2}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.isAnomaly) {
                    return <circle cx={cx} cy={cy} r={4} fill="#DC2626" stroke="#ffffff" strokeWidth={1.5} />;
                  }
                  return null;
                }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary */}
      <div className="flex flex-wrap items-center justify-between text-xs text-[#77838D] pt-2 border-t border-[#E8EDEB]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 rounded bg-[#27866F]" />
            <span>Measured Telemetry</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2 rounded bg-[#E6F2ED] border border-[#27866F]/40 border-dashed" />
            <span>Baseline Corridor (±1.5σ)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
            <span>Detected Deviation</span>
          </div>
        </div>

        <span className="text-[11px] font-mono text-[#77838D]">
          Baseline mean: {config.mean} {config.unit}
        </span>
      </div>
    </div>
  );
};
