import React, { useState } from 'react';
import { DemoPatient, VitalReading } from '../../types/health';
import { TelemetryChart } from '../Charts/TelemetryChart';
import {
  Download,
  Search,
  Filter,
  FileSpreadsheet,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface TimelineViewProps {
  patient: DemoPatient;
  onOpenCsvModal: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  patient,
  onOpenCsvModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnomalyOnly, setFilterAnomalyOnly] = useState(false);

  const readings = patient.historicalReadings;

  const filteredReadings = readings.filter((r) => {
    if (filterAnomalyOnly && !r.isAnomaly) return false;
    if (!searchTerm) return true;
    return r.timestamp.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleExportCsv = () => {
    const headers = ['timestamp', 'heart_rate', 'systolic_bp', 'diastolic_bp', 'spo2', 'respiratory_rate', 'body_temp', 'hrv', 'is_anomaly'];
    const rows = filteredReadings.map((r) => [
      r.timestamp,
      r.heartRate,
      r.systolicBP,
      r.diastolicBP,
      r.spO2,
      r.respiratoryRate,
      r.bodyTemp,
      r.hrv,
      r.isAnomaly ? 'true' : 'false',
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${patient.fullName.replace(/\s+/g, '_')}_telemetry_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202B33]">
            Health Trends & Telemetry
          </h2>
          <p className="text-xs sm:text-sm text-[#77838D] mt-0.5">
            48-hour continuous time-series sensor observations and baseline envelope analysis for {patient.fullName}.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onOpenCsvModal}
            className="px-3 py-1.5 rounded-lg border border-[#E8EDEB] bg-white hover:bg-[#F7F9F8] text-xs font-medium text-[#202B33] flex items-center gap-1.5 transition-colors shadow-soft"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#27866F]" />
            <span>Import Dataset</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-1.5 rounded-lg bg-[#27866F] hover:bg-[#1f6d5a] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-soft"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV ({filteredReadings.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Telemetry Chart with Corridor */}
      <div className="p-5 rounded-xl bg-white border border-[#E8EDEB] shadow-soft space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8EDEB]">
          <div>
            <h3 className="text-sm font-semibold text-[#202B33]">
              Continuous Multi-Metric Time-Series
            </h3>
            <p className="text-xs text-[#77838D]">
              Switch dimensions to analyze how individual telemetry tracks relative to running circadian mean.
            </p>
          </div>
        </div>

        <TelemetryChart
          readings={patient.historicalReadings}
          baseline={patient.baseline}
        />
      </div>

      {/* 3. Raw Sensor Readings Table */}
      <div className="p-5 rounded-xl bg-white border border-[#E8EDEB] shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8EDEB]">
          <div>
            <h3 className="text-sm font-semibold text-[#202B33]">
              Telemetry Inspection Log
            </h3>
            <p className="text-xs text-[#77838D]">
              Verified timestamped observations from {patient.wearableDevice}.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <label className="flex items-center gap-1.5 text-xs text-[#77838D] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterAnomalyOnly}
                onChange={(e) => setFilterAnomalyOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[#E8EDEB] text-[#27866F] focus:ring-0"
              />
              <span>Outliers Only</span>
            </label>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#77838D]" />
              <input
                type="text"
                placeholder="Search timestamp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs rounded-lg border border-[#E8EDEB] bg-[#F7F9F8] text-[#202B33] focus:outline-none focus:border-[#27866F] w-44"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-[#E8EDEB] text-[#77838D] uppercase text-[10px] font-mono">
                <th className="pb-2.5">Timestamp</th>
                <th className="pb-2.5">Heart Rate</th>
                <th className="pb-2.5">Blood Pressure</th>
                <th className="pb-2.5">SpO₂</th>
                <th className="pb-2.5">Resp. Rate</th>
                <th className="pb-2.5">Core Temp</th>
                <th className="pb-2.5">HRV</th>
                <th className="pb-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EDEB] font-mono">
              {filteredReadings.slice(-30).reverse().map((r, idx) => {
                const isOutlier = r.isAnomaly;
                const d = new Date(r.timestamp);
                const formattedTime = `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;

                return (
                  <tr key={idx} className="hover:bg-[#F7F9F8] transition-colors">
                    <td className="py-2.5 text-[#77838D]">{formattedTime}</td>
                    <td className={`py-2.5 ${isOutlier && r.heartRate > 100 ? 'text-[#DC2626] font-bold' : 'text-[#202B33]'}`}>
                      {r.heartRate} BPM
                    </td>
                    <td className="py-2.5 text-[#202B33]">
                      {Math.round(r.systolicBP)}/{Math.round(r.diastolicBP)}
                    </td>
                    <td className={`py-2.5 ${isOutlier && r.spO2 < 93 ? 'text-[#DC2626] font-bold' : 'text-[#202B33]'}`}>
                      {r.spO2}%
                    </td>
                    <td className="py-2.5 text-[#202B33]">{r.respiratoryRate}</td>
                    <td className="py-2.5 text-[#202B33]">{r.bodyTemp.toFixed(1)}°C</td>
                    <td className="py-2.5 text-[#202B33]">{r.hrv} ms</td>
                    <td className="py-2.5 text-right">
                      {isOutlier ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FEE2E2] text-[#DC2626]">
                          Outlier
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#E6F2ED] text-[#27866F]">
                          Nominal
                        </span>
                      )}
                    </td>
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
