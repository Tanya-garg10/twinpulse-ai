import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { DemoPatient, VitalReading, WhatIfParameters, SimulationResult } from '../../types/health';
import { runWhatIfSimulation } from '../../services/mlEngine';
import {
  RotateCcw,
  Sliders,
  CheckCircle2,
  TrendingUp,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface WhatIfLabViewProps {
  patient: DemoPatient;
  currentReading: VitalReading;
}

export const WhatIfLabView: React.FC<WhatIfLabViewProps> = ({
  patient,
  currentReading,
}) => {
  const defaultParams: WhatIfParameters = {
    sleepHoursDelta: 0,
    activityLevel: 'moderate',
    medicationAdherencePct: 95,
    acuteStressLevel: 'low',
    hydrationLevel: 'adequate',
    simulateRespiratoryInfection: false,
  };

  const [params, setParams] = useState<WhatIfParameters>(defaultParams);
  const [selectedMetric, setSelectedMetric] = useState<'heartRate' | 'systolicBP' | 'spO2'>('heartRate');

  // Compute simulation result via mlEngine
  const simulation: SimulationResult = runWhatIfSimulation(currentReading, patient.baseline, params);

  const presets = [
    {
      name: 'Sleep Debt & Work Crunch',
      desc: '-3.5h sleep + elevated stress + dehydration',
      params: {
        sleepHoursDelta: -3.5,
        activityLevel: 'sedentary' as const,
        medicationAdherencePct: 85,
        acuteStressLevel: 'high' as const,
        hydrationLevel: 'dehydrated' as const,
        simulateRespiratoryInfection: false,
      },
    },
    {
      name: 'Optimal Lifestyle Recovery',
      desc: '+1.5h sleep + 100% medication adherence + optimal hydration',
      params: {
        sleepHoursDelta: 1.5,
        activityLevel: 'moderate' as const,
        medicationAdherencePct: 100,
        acuteStressLevel: 'low' as const,
        hydrationLevel: 'optimal' as const,
        simulateRespiratoryInfection: false,
      },
    },
    {
      name: 'Skipped Antihypertensive',
      desc: '35% medication adherence + sedentary day',
      params: {
        sleepHoursDelta: 0,
        activityLevel: 'sedentary' as const,
        medicationAdherencePct: 35,
        acuteStressLevel: 'moderate' as const,
        hydrationLevel: 'adequate' as const,
        simulateRespiratoryInfection: false,
      },
    },
    {
      name: 'Respiratory Stress Test',
      desc: 'Simulate viral challenge, mild fever & shallow breathing',
      params: {
        sleepHoursDelta: -1.0,
        activityLevel: 'sedentary' as const,
        medicationAdherencePct: 95,
        acuteStressLevel: 'moderate' as const,
        hydrationLevel: 'adequate' as const,
        simulateRespiratoryInfection: true,
      },
    },
  ];

  const lastPoint = simulation.forecastPoints[simulation.forecastPoints.length - 1];
  const simHR = lastPoint ? Math.round(lastPoint.simulatedHR) : currentReading.heartRate;
  const simSystolic = lastPoint ? Math.round(lastPoint.simulatedSystolicBP) : Math.round(currentReading.systolicBP);
  const simSpO2 = lastPoint ? Number(lastPoint.simulatedSpO2.toFixed(1)) : currentReading.spO2;

  const getMetricConfig = () => {
    switch (selectedMetric) {
      case 'heartRate':
        return {
          title: 'Heart Rate',
          unit: 'BPM',
          currentVal: currentReading.heartRate,
          simVal: simHR,
          baseVal: patient.baseline.heartRate.mean,
          deltaVal: Number((simHR - currentReading.heartRate).toFixed(1)),
          domain: [50, 130],
        };
      case 'systolicBP':
        return {
          title: 'Systolic Blood Pressure',
          unit: 'mmHg',
          currentVal: Math.round(currentReading.systolicBP),
          simVal: simSystolic,
          baseVal: Math.round(patient.baseline.systolicBP.mean),
          deltaVal: Number((simSystolic - currentReading.systolicBP).toFixed(0)),
          domain: [85, 175],
        };
      case 'spO2':
        return {
          title: 'Oxygen Saturation',
          unit: '%',
          currentVal: currentReading.spO2,
          simVal: simSpO2,
          baseVal: patient.baseline.spO2.mean,
          deltaVal: Number((simSpO2 - currentReading.spO2).toFixed(1)),
          domain: [86, 100],
        };
    }
  };

  const metricConfig = getMetricConfig();

  // Combine forecast series for chart
  const chartData = simulation.forecastPoints.map((point) => {
    return {
      hourLabel: point.timeOffsetHours === 0 ? 'Now' : `+${point.timeOffsetHours}h`,
      'Baseline / Current Trajectory':
        selectedMetric === 'heartRate'
          ? point.baselineHR
          : selectedMetric === 'systolicBP'
          ? point.baselineSystolicBP
          : point.baselineSpO2,
      'Simulated Future':
        selectedMetric === 'heartRate'
          ? point.simulatedHR
          : selectedMetric === 'systolicBP'
          ? point.simulatedSystolicBP
          : point.simulatedSpO2,
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202B33]">
            Scenario Lab
          </h2>
          <p className="text-xs sm:text-sm text-[#77838D] mt-0.5">
            Test hypothetical lifestyle modifications and observe simulated trajectory across 24 hours.
          </p>
        </div>

        <button
          onClick={() => setParams(defaultParams)}
          className="px-3 py-1.5 rounded-lg border border-[#E8EDEB] bg-white hover:bg-[#F7F9F8] text-xs font-medium text-[#202B33] flex items-center gap-1.5 transition-colors shadow-soft self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#77838D]" />
          <span>Reset Parameters</span>
        </button>
      </div>

      {/* 2. Quick Presets */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase text-[#77838D] tracking-wider block">
          One-Click Scenarios
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setParams(preset.params)}
              className="p-3 text-left rounded-xl bg-white border border-[#E8EDEB] hover:border-[#27866F] hover:shadow-soft transition-all space-y-1 group"
            >
              <span className="text-xs font-semibold text-[#202B33] group-hover:text-[#27866F] block">
                {preset.name}
              </span>
              <p className="text-[11px] text-[#77838D] leading-tight">
                {preset.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Workspace: Controls (Col 5) vs Before-and-After Chart (Col 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Col 5): Adjustable Hypothetical Inputs */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-[#E8EDEB] shadow-soft space-y-4">
          <div className="pb-2 border-b border-[#E8EDEB] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#202B33]">
              Hypothetical Inputs
            </h3>
            <span className="text-[11px] font-mono text-[#77838D]">
              Simulation Mode
            </span>
          </div>

          {/* Slider 1: Sleep Hours Delta */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#202B33] font-medium">Sleep Duration Adjustment</span>
              <span className="font-mono font-bold text-[#27866F]">
                {params.sleepHoursDelta > 0 ? `+${params.sleepHoursDelta}` : params.sleepHoursDelta} hrs
              </span>
            </div>
            <input
              type="range"
              min="-4"
              max="3"
              step="0.5"
              value={params.sleepHoursDelta}
              onChange={(e) => setParams({ ...params, sleepHoursDelta: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-[#E8EDEB] rounded-lg appearance-none cursor-pointer accent-[#27866F]"
            />
            <div className="flex justify-between text-[10px] text-[#77838D]">
              <span>-4h Debt</span>
              <span>Baseline</span>
              <span>+3h Recovery</span>
            </div>
          </div>

          {/* Slider 2: Medication Adherence % */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#202B33] font-medium">Medication Adherence</span>
              <span className="font-mono font-bold text-[#27866F]">
                {params.medicationAdherencePct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={params.medicationAdherencePct}
              onChange={(e) => setParams({ ...params, medicationAdherencePct: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-[#E8EDEB] rounded-lg appearance-none cursor-pointer accent-[#27866F]"
            />
            <div className="flex justify-between text-[10px] text-[#77838D]">
              <span>Missed (0%)</span>
              <span>Partial (50%)</span>
              <span>Complete (100%)</span>
            </div>
          </div>

          {/* Segmented Control: Activity Level */}
          <div className="space-y-1.5">
            <span className="text-xs text-[#202B33] font-medium block">Daily Activity Exertion</span>
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#F7F9F8] rounded-lg border border-[#E8EDEB] text-xs">
              {(['sedentary', 'light', 'moderate', 'vigorous'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setParams({ ...params, activityLevel: lvl })}
                  className={`py-1 text-center rounded capitalize font-medium transition-colors ${
                    params.activityLevel === lvl
                      ? 'bg-white text-[#202B33] font-semibold shadow-xs'
                      : 'text-[#77838D] hover:text-[#202B33]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Segmented Control: Stress Level */}
          <div className="space-y-1.5">
            <span className="text-xs text-[#202B33] font-medium block">Sympathetic Stress Burden</span>
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#F7F9F8] rounded-lg border border-[#E8EDEB] text-xs">
              {(['low', 'moderate', 'high'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setParams({ ...params, acuteStressLevel: lvl })}
                  className={`py-1 text-center rounded capitalize font-medium transition-colors ${
                    params.acuteStressLevel === lvl
                      ? 'bg-white text-[#202B33] font-semibold shadow-xs'
                      : 'text-[#77838D] hover:text-[#202B33]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle: Viral Challenge */}
          <div className="pt-2 border-t border-[#E8EDEB]">
            <label className="flex items-center justify-between cursor-pointer text-xs">
              <div>
                <span className="font-medium text-[#202B33] block">Viral Respiratory Stress Test</span>
                <span className="text-[11px] text-[#77838D]">Simulates sub-febrile shift and tachypnea</span>
              </div>
              <input
                type="checkbox"
                checked={params.simulateRespiratoryInfection}
                onChange={(e) => setParams({ ...params, simulateRespiratoryInfection: e.target.checked })}
                className="w-4 h-4 rounded border-[#E8EDEB] text-[#27866F] focus:ring-0"
              />
            </label>
          </div>
        </div>

        {/* Right Column (Col 7): Clear Before-and-After Comparison & Chart */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-[#E8EDEB] shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8EDEB]">
            {/* Metric Switcher Tabs */}
            <div className="flex gap-1 p-1 bg-[#F7F9F8] rounded-lg border border-[#E8EDEB] text-xs">
              {(['heartRate', 'systolicBP', 'spO2'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMetric(m)}
                  className={`px-3 py-1 rounded capitalize font-medium transition-colors ${
                    selectedMetric === m
                      ? 'bg-white text-[#202B33] font-semibold shadow-xs'
                      : 'text-[#77838D] hover:text-[#202B33]'
                  }`}
                >
                  {m === 'heartRate' ? 'Heart Rate' : m === 'systolicBP' ? 'Blood Pressure' : 'SpO₂ Oxygen'}
                </button>
              ))}
            </div>

            {/* Delta Snapshot */}
            <div className="flex items-baseline gap-2 font-mono text-xs">
              <span className="text-[#77838D]">Simulated Delta:</span>
              <span
                className={`font-bold ${
                  metricConfig.deltaVal > 0 ? 'text-[#DC2626]' : 'text-[#27866F]'
                }`}
              >
                {metricConfig.deltaVal > 0 ? `+${metricConfig.deltaVal}` : metricConfig.deltaVal} {metricConfig.unit}
              </span>
            </div>
          </div>

          {/* Before & After Metric Card Summary */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-[#F7F9F8] border border-[#E8EDEB] text-xs">
            <div>
              <span className="text-[10px] uppercase text-[#77838D] block">Current Baseline</span>
              <span className="font-mono font-bold text-sm text-[#202B33]">
                {metricConfig.currentVal} {metricConfig.unit}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#77838D] block">Simulated 24h</span>
              <span className="font-mono font-bold text-sm text-[#27866F]">
                {metricConfig.simVal} {metricConfig.unit}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#77838D] block">Projected Risk</span>
              <span
                className={`font-semibold text-xs ${
                  simulation.projectedRiskLevel === 'CRITICAL'
                    ? 'text-[#DC2626]'
                    : simulation.projectedRiskLevel === 'ELEVATED'
                    ? 'text-[#D97706]'
                    : 'text-[#27866F]'
                }`}
              >
                {simulation.projectedRiskLevel}
              </span>
            </div>
          </div>

          {/* 24-Hour Comparative Projection Chart */}
          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
                <XAxis
                  dataKey="hourLabel"
                  stroke="#77838D"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#E8EDEB' }}
                />
                <YAxis
                  domain={metricConfig.domain}
                  stroke="#77838D"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#E8EDEB' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8EDEB',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(16, 24, 40, 0.06)',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="Baseline / Current Trajectory"
                  stroke="#77838D"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Simulated Future"
                  stroke="#27866F"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#27866F' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Concise Physiological Explanation */}
          <div className="p-3.5 rounded-lg bg-[#F7F9F8] border border-[#E8EDEB] space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#202B33]">
              <Info className="w-3.5 h-3.5 text-[#27866F]" />
              <span>Physiological Calculation Basis</span>
            </div>
            <p className="text-[11px] text-[#77838D] leading-relaxed">
              {simulation.physiologicalInsights.join(' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
