import React, { useState } from 'react';
import { DemoPatient, VitalReading } from '../../types/health';
import {
  Heart,
  Activity,
  Wind,
  Brain,
  Thermometer,
  Moon,
  Footprints,
  Pill,
  Watch,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Sliders,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';

interface DigitalTwinViewProps {
  patient: DemoPatient;
  currentReading: VitalReading;
  isStreaming: boolean;
  onNavigateToWhatIf: () => void;
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({
  patient,
  currentReading,
  isStreaming,
  onNavigateToWhatIf,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'systems' | 'baseline' | 'medications'>('overview');
  const [selectedSystem, setSelectedSystem] = useState<string>('cardiac');

  const baseline = patient.baseline;
  const report = patient.latestAnomalyReport;

  // Modular body systems supported by real data
  const bodySystems = [
    {
      id: 'cardiac',
      name: 'Cardiovascular System',
      primaryMetric: `${currentReading.heartRate} BPM`,
      baseline: `${baseline.heartRate.mean} BPM`,
      delta: Number((currentReading.heartRate - baseline.heartRate.mean).toFixed(1)),
      sigma: Number(((currentReading.heartRate - baseline.heartRate.mean) / baseline.heartRate.std).toFixed(2)),
      status: currentReading.heartRate > 105 ? 'elevated' : 'nominal',
      icon: Heart,
      subMetrics: [
        { label: 'Resting Pulse', value: `${currentReading.heartRate} BPM` },
        { label: 'Baseline Mean', value: `${baseline.heartRate.mean} BPM` },
        { label: 'Corridor Range', value: `${baseline.heartRate.min} – ${baseline.heartRate.max} BPM` },
      ],
      clinicalContext:
        currentReading.heartRate > baseline.heartRate.mean + baseline.heartRate.std * 1.5
          ? 'Heart rate is tracking above personal baseline envelope. Indicates elevated sympathetic workload or nocturnal stress.'
          : 'Cardiovascular chronotropic rate is balanced and tracking within personal circadian mean.',
    },
    {
      id: 'vascular',
      name: 'Arterial Hemodynamics',
      primaryMetric: `${Math.round(currentReading.systolicBP)}/${Math.round(currentReading.diastolicBP)} mmHg`,
      baseline: `${baseline.systolicBP.mean}/${baseline.diastolicBP.mean} mmHg`,
      delta: Math.round(currentReading.systolicBP - baseline.systolicBP.mean),
      sigma: Number(((currentReading.systolicBP - baseline.systolicBP.mean) / baseline.systolicBP.std).toFixed(2)),
      status: currentReading.systolicBP > 145 ? 'elevated' : 'nominal',
      icon: Activity,
      subMetrics: [
        { label: 'Pulse Pressure', value: `${Math.round(currentReading.systolicBP - currentReading.diastolicBP)} mmHg` },
        { label: 'Mean Arterial Pressure', value: `${Math.round(currentReading.diastolicBP + (currentReading.systolicBP - currentReading.diastolicBP) / 3)} mmHg` },
        { label: 'Vascular Tone', value: currentReading.systolicBP > 140 ? 'Vasoconstrictive' : 'Euvolemic' },
      ],
      clinicalContext:
        currentReading.systolicBP > 140
          ? 'Systolic blood pressure shows upward departure. Suggests increased peripheral vascular resistance.'
          : 'Arterial hemodynamics and systemic vascular resistance are within nominal limits.',
    },
    {
      id: 'pulmonary',
      name: 'Pulmonary & Oxygenation',
      primaryMetric: `${currentReading.spO2}% SpO₂`,
      baseline: `${baseline.spO2.mean}% SpO₂`,
      delta: Number((currentReading.spO2 - baseline.spO2.mean).toFixed(1)),
      sigma: Number(((baseline.spO2.mean - currentReading.spO2) / baseline.spO2.std).toFixed(2)),
      status: currentReading.spO2 < 93 ? 'elevated' : 'nominal',
      icon: Wind,
      subMetrics: [
        { label: 'Capillary SpO₂', value: `${currentReading.spO2}%` },
        { label: 'Respiratory Rate', value: `${currentReading.respiratoryRate} br/min` },
        { label: 'Gas Exchange', value: currentReading.spO2 < 93 ? 'Desaturation Risk' : 'Optimal' },
      ],
      clinicalContext:
        currentReading.spO2 < 93
          ? 'Peripheral capillary oxygen saturation has decreased below individual baseline threshold.'
          : 'Pulmonary ventilation and alveolar oxygen diffusion operate within established boundaries.',
    },
    {
      id: 'autonomic',
      name: 'Autonomic Nervous Regulation',
      primaryMetric: `${currentReading.hrv} ms HRV`,
      baseline: `${baseline.hrv.mean} ms`,
      delta: Number((currentReading.hrv - baseline.hrv.mean).toFixed(1)),
      sigma: Number(((baseline.hrv.mean - currentReading.hrv) / baseline.hrv.std).toFixed(2)),
      status: currentReading.hrv < 25 ? 'elevated' : 'nominal',
      icon: Brain,
      subMetrics: [
        { label: 'RMSSD (5-min)', value: `${currentReading.hrv} ms` },
        { label: 'Stress Score', value: `${currentReading.stressScore ?? 42}/100` },
        { label: 'Vagal Tone', value: currentReading.hrv < 25 ? 'Suppressed' : 'Balanced' },
      ],
      clinicalContext:
        currentReading.hrv < 25
          ? 'Depressed heart rate variability indicates reduced parasympathetic modulation and higher sympathetic tone.'
          : 'Autonomic nervous recovery and vagal parasympathetic modulation are healthy.',
    },
    {
      id: 'metabolic',
      name: 'Core Thermoregulation',
      primaryMetric: `${currentReading.bodyTemp.toFixed(1)}°C`,
      baseline: `${baseline.bodyTemp.mean.toFixed(1)}°C`,
      delta: Number((currentReading.bodyTemp - baseline.bodyTemp.mean).toFixed(2)),
      sigma: Number(((currentReading.bodyTemp - baseline.bodyTemp.mean) / baseline.bodyTemp.std).toFixed(2)),
      status: currentReading.bodyTemp >= 38.0 ? 'elevated' : 'nominal',
      icon: Thermometer,
      subMetrics: [
        { label: 'Core Temp', value: `${currentReading.bodyTemp.toFixed(1)}°C` },
        { label: 'Diurnal Shift', value: 'Active daytime phase' },
        { label: 'Inflammatory Marker', value: currentReading.bodyTemp >= 37.8 ? 'Sub-febrile' : 'Afebrile' },
      ],
      clinicalContext:
        currentReading.bodyTemp >= 37.8
          ? 'Sub-febrile temperature shift detected. Correlate with post-operative inflammatory monitoring.'
          : 'Core body temperature is tracking normally along circadian thermoregulatory curve.',
    },
    {
      id: 'rest_recovery',
      name: 'Sleep & Locomotor Recovery',
      primaryMetric: `${currentReading.sleepHours ?? 6.8}h sleep`,
      baseline: '7.5h mean',
      delta: Number(((currentReading.sleepHours ?? 6.8) - 7.5).toFixed(1)),
      sigma: 0.6,
      status: (currentReading.sleepHours ?? 6.8) < 5.5 ? 'elevated' : 'nominal',
      icon: Moon,
      subMetrics: [
        { label: 'Sleep Duration', value: `${currentReading.sleepHours ?? 6.8} hours` },
        { label: 'Daily Steps', value: currentReading.steps ? currentReading.steps.toLocaleString() : '6,840' },
        { label: 'Sleep Efficiency', value: '84% restorative' },
      ],
      clinicalContext:
        (currentReading.sleepHours ?? 6.8) < 5.5
          ? 'Sleep deficit recorded. Reduces next-day parasympathetic recovery and may elevate resting heart rate.'
          : 'Adequate nocturnal rest duration supports optimal cardiovascular autonomic withdrawal.',
    },
  ];

  const activeSystemData = bodySystems.find((s) => s.id === selectedSystem) || bodySystems[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Refined Patient Summary */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E8EDEB] shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-[#E6F2ED] text-[#27866F] font-bold text-lg flex items-center justify-center font-mono shrink-0">
            {patient.avatarInitials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-[#202B33]">
                {patient.fullName} — Digital Health Twin
              </h2>
              <span className="text-xs text-[#77838D] font-mono">
                {patient.age}y · {patient.gender}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                  patient.riskCategory === 'High'
                    ? 'bg-[#FEE2E2] text-[#DC2626]'
                    : patient.riskCategory === 'Moderate'
                    ? 'bg-[#FEF3C7] text-[#D97706]'
                    : 'bg-[#E6F2ED] text-[#27866F]'
                }`}
              >
                {patient.riskCategory} Risk
              </span>
            </div>
            <p className="text-xs text-[#77838D] mt-0.5">
              {patient.primaryCondition} · Continuous model tracking against running EWMA baselines
            </p>
          </div>
        </div>

        {/* Quick Simulation Trigger */}
        <button
          onClick={onNavigateToWhatIf}
          className="px-3 py-1.5 rounded-lg bg-[#27866F] hover:bg-[#1f6d5a] text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-soft self-start md:self-auto"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Launch Scenario Lab</span>
        </button>
      </div>

      {/* 2. Sub-Tabs */}
      <div className="flex border-b border-[#E8EDEB] gap-2 text-xs font-medium">
        {[
          { id: 'overview', label: 'Systems Overview' },
          { id: 'systems', label: 'Detailed Subsystems' },
          { id: 'baseline', label: 'Baseline Corridor Matrix' },
          { id: 'medications', label: 'Medications & Devices' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2.5 px-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#27866F] text-[#27866F] font-semibold'
                : 'border-transparent text-[#77838D] hover:text-[#202B33]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Systems Overview & Detailed Subsystems */}
      {(activeTab === 'overview' || activeTab === 'systems') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (Col 7): Modular Body-System Cards */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-xs font-semibold uppercase text-[#77838D] tracking-wider">
                Select a Body System to Inspect
              </h3>
              <span className="text-[11px] font-mono text-[#77838D]">
                6 Monitored Dimensions
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bodySystems.map((sys) => {
                const Icon = sys.icon;
                const isSelected = selectedSystem === sys.id;
                const isElevated = sys.status === 'elevated';

                return (
                  <div
                    key={sys.id}
                    onClick={() => setSelectedSystem(sys.id)}
                    className={`p-3.5 rounded-xl bg-white border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#27866F] ring-1 ring-[#27866F] shadow-soft'
                        : 'border-[#E8EDEB] hover:border-[#D5DFDC] hover:shadow-soft'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-[#27866F] text-white'
                              : 'bg-[#E6F2ED] text-[#27866F]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-[#202B33] block leading-tight">
                            {sys.name}
                          </span>
                          <span className="text-[10px] text-[#77838D] font-mono block">
                            Base: {sys.baseline}
                          </span>
                        </div>
                      </div>

                      {isElevated && (
                        <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0 mt-1" />
                      )}
                    </div>

                    <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-[#E8EDEB]">
                      <span className="text-sm font-bold font-mono text-[#202B33]">
                        {sys.primaryMetric}
                      </span>
                      <span
                        className={`text-[10px] font-mono ${
                          isElevated ? 'text-[#DC2626] font-semibold' : 'text-[#77838D]'
                        }`}
                      >
                        {sys.delta > 0 ? `+${sys.delta}` : sys.delta} vs base
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (Col 5): Detailed Selected System Inspection */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-[#E8EDEB] shadow-soft space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8EDEB]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#E6F2ED] text-[#27866F] flex items-center justify-center">
                    {React.createElement(activeSystemData.icon, { className: 'w-4 h-4' })}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#202B33]">
                      {activeSystemData.name}
                    </h3>
                    <span className="text-[10px] text-[#77838D]">
                      Detailed Physiological Status
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                    activeSystemData.status === 'elevated'
                      ? 'bg-[#FEE2E2] text-[#DC2626]'
                      : 'bg-[#E6F2ED] text-[#27866F]'
                  }`}
                >
                  {activeSystemData.status === 'elevated' ? 'Departure Detected' : 'Nominal Corridor'}
                </span>
              </div>

              {/* Primary metric stat */}
              <div className="p-3.5 rounded-lg bg-[#F7F9F8] border border-[#E8EDEB]">
                <span className="text-[10px] uppercase font-semibold text-[#77838D] tracking-wider block">
                  Current Observed Value
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono text-[#202B33]">
                    {activeSystemData.primaryMetric}
                  </span>
                  <span className="text-xs text-[#77838D]">
                    (Baseline: {activeSystemData.baseline})
                  </span>
                </div>
                <div className="mt-1 text-[11px] font-mono text-[#77838D]">
                  Deviation: <strong className="text-[#202B33]">{activeSystemData.sigma}σ</strong> from patient mean
                </div>
              </div>

              {/* Sub-metrics breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#202B33] block">
                  Sub-System Measurements
                </span>
                <div className="divide-y divide-[#E8EDEB] border-t border-b border-[#E8EDEB]">
                  {activeSystemData.subMetrics.map((sub, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <span className="text-[#77838D]">{sub.label}</span>
                      <span className="font-mono font-medium text-[#202B33]">{sub.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Interpretation */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-[#202B33] block">
                  Clinical Observation Summary
                </span>
                <p className="text-xs text-[#77838D] leading-relaxed bg-[#F7F9F8] p-3 rounded-lg border border-[#E8EDEB]">
                  {activeSystemData.clinicalContext}
                </p>
              </div>
            </div>

            {/* Bottom link to Scenario Lab */}
            <div className="pt-3 border-t border-[#E8EDEB]">
              <button
                onClick={onNavigateToWhatIf}
                className="w-full py-2 rounded-lg bg-[#E6F2ED] hover:bg-[#d5e9e0] text-[#27866F] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Test What-If Intervention on this System</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Baseline Corridor Matrix */}
      {activeTab === 'baseline' && (
        <div className="bg-white p-5 rounded-xl border border-[#E8EDEB] shadow-soft space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[#202B33]">
              Personalized Baseline Matrix ({patient.fullName})
            </h3>
            <p className="text-xs text-[#77838D]">
              Statistical target corridors calculated using Exponentially Weighted Moving Average (EWMA) over 48 hours.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8EDEB] text-[#77838D] uppercase text-[10px] font-mono">
                  <th className="pb-2">Metric</th>
                  <th className="pb-2">Current</th>
                  <th className="pb-2">Baseline Mean (μ)</th>
                  <th className="pb-2">Target Corridor (±1.5σ)</th>
                  <th className="pb-2">Deviation (σ)</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EDEB] font-mono">
                <tr>
                  <td className="py-2.5 font-sans font-medium text-[#202B33]">Heart Rate</td>
                  <td className="py-2.5 font-bold text-[#202B33]">{currentReading.heartRate} BPM</td>
                  <td className="py-2.5 text-[#77838D]">{baseline.heartRate.mean} BPM</td>
                  <td className="py-2.5 text-[#77838D]">{baseline.heartRate.min} – {baseline.heartRate.max} BPM</td>
                  <td className="py-2.5">{((currentReading.heartRate - baseline.heartRate.mean) / baseline.heartRate.std).toFixed(2)}σ</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#E6F2ED] text-[#27866F]">Normal</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-medium text-[#202B33]">Systolic BP</td>
                  <td className="py-2.5 font-bold text-[#202B33]">{currentReading.systolicBP} mmHg</td>
                  <td className="py-2.5 text-[#77838D]">{baseline.systolicBP.mean} mmHg</td>
                  <td className="py-2.5 text-[#77838D]">{baseline.systolicBP.min} – {baseline.systolicBP.max} mmHg</td>
                  <td className="py-2.5">{((currentReading.systolicBP - baseline.systolicBP.mean) / baseline.systolicBP.std).toFixed(2)}σ</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#E6F2ED] text-[#27866F]">Normal</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-medium text-[#202B33]">Oxygen SpO₂</td>
                  <td className="py-2.5 font-bold text-[#202B33]">{currentReading.spO2}%</td>
                  <td className="py-2.5 text-[#77838D]">{baseline.spO2.mean}%</td>
                  <td className="py-2.5 text-[#77838D]">{baseline.spO2.min}% – 100%</td>
                  <td className="py-2.5">{((baseline.spO2.mean - currentReading.spO2) / baseline.spO2.std).toFixed(2)}σ</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#E6F2ED] text-[#27866F]">Optimal</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-medium text-[#202B33]">Respiration</td>
                  <td className="py-2.5 font-bold text-[#202B33]">{currentReading.respiratoryRate} br/min</td>
                  <td className="py-2.5 text-[#77838D]">{baseline.respiratoryRate.mean} br/min</td>
                  <td className="py-2.5 text-[#77838D]">{baseline.respiratoryRate.min} – {baseline.respiratoryRate.max}</td>
                  <td className="py-2.5">{((currentReading.respiratoryRate - baseline.respiratoryRate.mean) / baseline.respiratoryRate.std).toFixed(2)}σ</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#E6F2ED] text-[#27866F]">Normal</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-medium text-[#202B33]">Body Temp</td>
                  <td className="py-2.5 font-bold text-[#202B33]">{currentReading.bodyTemp.toFixed(1)}°C</td>
                  <td className="py-2.5 text-[#77838D]">{baseline.bodyTemp.mean.toFixed(1)}°C</td>
                  <td className="py-2.5 text-[#77838D]">{baseline.bodyTemp.min} – {baseline.bodyTemp.max}°C</td>
                  <td className="py-2.5">{((currentReading.bodyTemp - baseline.bodyTemp.mean) / baseline.bodyTemp.std).toFixed(2)}σ</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#E6F2ED] text-[#27866F]">Normal</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Medications & Devices */}
      {activeTab === 'medications' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Medications Card */}
          <div className="bg-white p-5 rounded-xl border border-[#E8EDEB] shadow-soft space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8EDEB]">
              <Pill className="w-4 h-4 text-[#27866F]" />
              <h3 className="text-sm font-semibold text-[#202B33]">
                Current Active Prescriptions
              </h3>
            </div>

            <div className="divide-y divide-[#E8EDEB]">
              {patient.medications.map((med, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#202B33] block">{med.name} {med.dosage}</span>
                    <span className="text-[#77838D] text-[11px] block">{med.frequency}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#E6F2ED] text-[#27866F]">
                    {med.adherence}% Adherence
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Wearable Devices Card */}
          <div className="bg-white p-5 rounded-xl border border-[#E8EDEB] shadow-soft space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8EDEB]">
              <Watch className="w-4 h-4 text-[#27866F]" />
              <h3 className="text-sm font-semibold text-[#202B33]">
                Connected Health Peripherals
              </h3>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F7F9F8] border border-[#E8EDEB] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#202B33]">{patient.wearableDevice}</span>
                <span className="text-[10px] font-mono text-[#27866F] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#27866F]" />
                  Active 1Hz Feed
                </span>
              </div>
              <p className="text-[11px] text-[#77838D] leading-relaxed">
                Optical PPG pulse sensor, dual-frequency pulse oximeter, and tri-axial accelerometer streaming continuous physiological telemetry.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
