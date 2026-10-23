import React, { useState } from 'react';
import { DemoPatient, VitalReading } from '../../types/health';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  User,
  Clock,
  Heart,
  Activity,
  Wind,
  Thermometer,
} from 'lucide-react';

interface ReportsViewProps {
  patient: DemoPatient;
  currentReading: VitalReading;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  patient,
  currentReading,
}) => {
  const [reportType, setReportType] = useState<'surveillance' | 'longitudinal' | 'discharge'>('surveillance');

  const baseline = patient.baseline;
  const report = patient.latestAnomalyReport;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202B33]">
            Clinical Reports
          </h2>
          <p className="text-xs sm:text-sm text-[#77838D] mt-0.5">
            Standardized clinical documentation and baseline audit export for {patient.fullName}.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-3.5 py-1.5 rounded-lg bg-[#27866F] hover:bg-[#1f6d5a] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-soft self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* 2. Standardized Document Container (Printable Paper Style) */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8EDEB] shadow-soft space-y-6 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E8EDEB]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-[#202B33]">TwinPulse AI</span>
              <span className="text-xs px-2 py-0.2 rounded font-mono bg-[#E6F2ED] text-[#27866F]">
                Clinical Digital Twin Report
              </span>
            </div>
            <span className="text-xs text-[#77838D] block mt-1">
              Document Ref: EMR-DT-{patient.id.toUpperCase()}-2026
            </span>
          </div>

          <div className="text-right text-xs font-mono text-[#77838D]">
            <div>Generated: {new Date().toLocaleDateString()}</div>
            <div>Source: {patient.wearableDevice}</div>
          </div>
        </div>

        {/* Patient Profile Demographics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-[#F7F9F8] border border-[#E8EDEB] text-xs font-mono">
          <div>
            <span className="text-[10px] uppercase text-[#77838D] block font-sans">Patient Name</span>
            <span className="font-bold text-[#202B33] font-sans">{patient.fullName}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#77838D] block font-sans">Age & Gender</span>
            <span className="text-[#202B33]">{patient.age} yrs · {patient.gender}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#77838D] block font-sans">Primary Indication</span>
            <span className="text-[#202B33] font-sans truncate block">{patient.primaryCondition}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#77838D] block font-sans">Risk Stratification</span>
            <span
              className={`font-semibold ${
                patient.riskCategory === 'High' ? 'text-[#DC2626]' : 'text-[#27866F]'
              }`}
            >
              {patient.riskCategory} Risk
            </span>
          </div>
        </div>

        {/* Real-time Physiological Observations vs Baseline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#77838D]">
            1. Current Biometrics vs Established Baseline
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-[#E8EDEB] space-y-1">
              <span className="text-[10px] text-[#77838D] uppercase font-mono block">Heart Rate</span>
              <div className="font-mono font-bold text-base text-[#202B33]">{currentReading.heartRate} BPM</div>
              <span className="text-[10px] text-[#77838D] font-mono block">Baseline: {baseline.heartRate.mean} BPM</span>
            </div>

            <div className="p-3 rounded-lg border border-[#E8EDEB] space-y-1">
              <span className="text-[10px] text-[#77838D] uppercase font-mono block">Blood Pressure</span>
              <div className="font-mono font-bold text-base text-[#202B33]">{Math.round(currentReading.systolicBP)}/{Math.round(currentReading.diastolicBP)}</div>
              <span className="text-[10px] text-[#77838D] font-mono block">Baseline: {baseline.systolicBP.mean}/{baseline.diastolicBP.mean}</span>
            </div>

            <div className="p-3 rounded-lg border border-[#E8EDEB] space-y-1">
              <span className="text-[10px] text-[#77838D] uppercase font-mono block">SpO₂ Oxygen</span>
              <div className="font-mono font-bold text-base text-[#202B33]">{currentReading.spO2}%</div>
              <span className="text-[10px] text-[#77838D] font-mono block">Baseline: {baseline.spO2.mean}%</span>
            </div>

            <div className="p-3 rounded-lg border border-[#E8EDEB] space-y-1">
              <span className="text-[10px] text-[#77838D] uppercase font-mono block">Respiration</span>
              <div className="font-mono font-bold text-base text-[#202B33]">{currentReading.respiratoryRate} br/min</div>
              <span className="text-[10px] text-[#77838D] font-mono block">Baseline: {baseline.respiratoryRate.mean}</span>
            </div>
          </div>
        </div>

        {/* Verified Medications */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#77838D]">
            2. Pharmacotherapy Regimen
          </h4>
          <div className="divide-y divide-[#E8EDEB] border border-[#E8EDEB] rounded-lg overflow-hidden text-xs">
            {patient.medications.map((m, i) => (
              <div key={i} className="p-2.5 flex items-center justify-between bg-white">
                <span className="font-medium text-[#202B33]">{m.name} {m.dosage} ({m.frequency})</span>
                <span className="text-[#77838D] font-mono text-[11px]">{m.adherence}% Adherence</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detected Anomaly Attribution Summary */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#77838D]">
            3. Algorithmic Risk Evaluation (Isolation Forest + EWMA)
          </h4>
          <div className="p-3.5 rounded-lg bg-[#F7F9F8] border border-[#E8EDEB] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#202B33]">
                {report ? report.summary : 'No critical deviations observed.'}
              </span>
              <span className="text-[10px] font-mono text-[#77838D]">
                Confidence: {report ? Math.round(report.confidence * 100) : 94}%
              </span>
            </div>
            <p className="text-[11px] text-[#77838D] leading-relaxed">
              {report ? report.recommendedAction : 'Continue routine continuous wearable telemetry monitoring.'}
            </p>
          </div>
        </div>

        {/* Clinical Sign-off Footer */}
        <div className="pt-6 border-t border-[#E8EDEB] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#77838D]">
          <div>
            <span className="block font-semibold text-[#202B33]">Attending Clinician Sign-Off</span>
            <span className="block text-[11px]">Dr. Taylor Vance, MD — Clinical Health Twin Lead</span>
          </div>

          <div className="text-right">
            <span className="font-mono text-[11px] text-[#27866F] font-semibold block">
              VERIFIED EMR ATTESTATION
            </span>
            <span className="text-[10px]">Happiest Health Digital Twin Challenge 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
