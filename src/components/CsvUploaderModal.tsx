import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, Download, FileUp } from 'lucide-react';
import { parseAndValidateCsv, generateSampleCsvContent, CsvValidationResult } from '../services/csvParser';
import { VitalReading } from '../types/health';

interface CsvUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataIngested: (readings: VitalReading[], filename: string) => void;
  patientName: string;
  isDarkMode?: boolean;
}

export const CsvUploaderModal: React.FC<CsvUploaderModalProps> = ({
  isOpen,
  onClose,
  onDataIngested,
  patientName,
  isDarkMode = false,
}) => {
  const [csvContent, setCsvContent] = useState<string>('');
  const [filename, setFilename] = useState<string>('');
  const [validationResult, setValidationResult] = useState<CsvValidationResult | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      const result = parseAndValidateCsv(text);
      setValidationResult(result);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    const sample = generateSampleCsvContent();
    setFilename('sample_telemetry_patient1.csv');
    setCsvContent(sample);
    const result = parseAndValidateCsv(sample);
    setValidationResult(result);
  };

  const handleDownloadTemplate = () => {
    const sample = generateSampleCsvContent();
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template_wearables.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApply = () => {
    if (validationResult && validationResult.isValid && validationResult.readings.length > 0) {
      onDataIngested(validationResult.readings, filename || 'custom_upload.csv');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`rounded-2xl border w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-all ${
          isDarkMode ? 'bg-[#101B2D] border-slate-700 text-slate-100' : 'bg-white border-[#E3EAF2] text-[#172B4D]'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Ingest Wearable Telemetry Dataset</h3>
              <p className="text-xs text-[#697A90] dark:text-slate-400">
                Upload CSV time-series for <strong className="text-[#172B4D] dark:text-slate-200">{patientName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Action Row: Load Sample & Download Template */}
          <div
            className={`flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border text-xs ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-[#E3EAF2]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[#697A90] dark:text-slate-400">Need sample test data?</span>
              <button
                onClick={handleLoadSample}
                className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-300 font-semibold border border-inherit shadow-2xs"
              >
                Load Sample Telemetry CSV
              </button>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 text-slate-500 hover:text-teal-600 font-mono text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download Template
            </button>
          </div>

          {/* Upload Drop Zone */}
          <label
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center ${
              isDarkMode
                ? 'border-slate-700 hover:border-teal-500/80 bg-slate-900/40 hover:bg-slate-900/70'
                : 'border-slate-300 hover:border-teal-500/80 bg-slate-50 hover:bg-slate-100/70'
            }`}
          >
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            <FileUp className="w-8 h-8 text-teal-600 dark:text-teal-400 mb-2" />
            <span className="text-sm font-semibold text-[#172B4D] dark:text-white">
              {filename ? filename : 'Click to browse or drop CSV file'}
            </span>
            <span className="text-xs text-[#697A90] dark:text-slate-400 mt-1">
              Required: timestamp, heart_rate. Optional: systolic_bp, diastolic_bp, spo2, respiratory_rate, body_temp, hrv
            </span>
          </label>

          {/* Validation Feedback */}
          {validationResult && (
            <div className="space-y-3">
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  validationResult.isValid
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-500/30 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:border-rose-500/30 dark:text-rose-300'
                }`}
              >
                {validationResult.isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-1">
                  <div className="font-semibold">
                    {validationResult.isValid
                      ? `Dataset Validated: ${validationResult.validRows} valid telemetry rows processed.`
                      : 'Dataset Validation Failed'}
                  </div>
                  {validationResult.errors.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5">
                      {validationResult.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                  {validationResult.warnings.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 opacity-90">
                      {validationResult.warnings.map((warn, i) => (
                        <li key={i}>{warn}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Data Preview Table */}
              {validationResult.readings.length > 0 && (
                <div className="border border-inherit rounded-xl overflow-hidden text-xs">
                  <div className="bg-slate-50 dark:bg-slate-900 px-3 py-2 border-b border-inherit font-semibold text-[#172B4D] dark:text-slate-300 flex justify-between">
                    <span>Parsed Telemetry Preview (First 5 Rows)</span>
                    <span className="font-mono text-teal-600 dark:text-teal-400">Total: {validationResult.readings.length} points</span>
                  </div>
                  <div className="overflow-x-auto max-h-40">
                    <table className="w-full text-left font-mono">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase">
                        <tr>
                          <th className="p-2">Timestamp</th>
                          <th className="p-2">HR (BPM)</th>
                          <th className="p-2">BP (mmHg)</th>
                          <th className="p-2">SpO₂ (%)</th>
                          <th className="p-2">RR</th>
                          <th className="p-2">Temp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-inherit">
                        {validationResult.readings.slice(0, 5).map((r, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="p-2 text-slate-400">{new Date(r.timestamp).toLocaleTimeString()}</td>
                            <td className="p-2 text-rose-600 dark:text-rose-300 font-bold">{r.heartRate}</td>
                            <td className="p-2 text-amber-600 dark:text-amber-300">{r.systolicBP}/{r.diastolicBP}</td>
                            <td className="p-2 text-cyan-600 dark:text-cyan-300">{r.spO2}%</td>
                            <td className="p-2">{r.respiratoryRate}</td>
                            <td className="p-2">{r.bodyTemp}°C</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-inherit flex justify-end gap-2 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!validationResult?.isValid || validationResult.readings.length === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#13B8A6] hover:bg-teal-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
          >
            Ingest to Digital Twin
          </button>
        </div>
      </div>
    </div>
  );
};
