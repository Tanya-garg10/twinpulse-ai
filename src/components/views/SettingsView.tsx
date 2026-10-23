import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Bell,
  ShieldCheck,
  Radio,
  Cpu,
  Key,
  Database,
  CheckCircle2,
} from 'lucide-react';

interface SettingsViewProps {
  isDarkMode: boolean;
  onOpenArchitecture: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDarkMode,
  onOpenArchitecture,
}) => {
  const [anomalySensitivity, setAnomalySensitivity] = useState<number>(0.65);
  const [notifyCritical, setNotifyCritical] = useState<boolean>(true);
  const [notifyWarning, setNotifyWarning] = useState<boolean>(true);
  const [streamFrequency, setStreamFrequency] = useState<string>('1s');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-teal-500" />
          <span className="text-xs font-semibold tracking-wider uppercase text-teal-600 dark:text-teal-400 font-mono">
            Platform Configuration
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172B4D] dark:text-white mt-1">
          TwinPulse AI — System Settings
        </h1>
        <p className="text-sm text-[#697A90] dark:text-slate-400 mt-0.5">
          Tune ML anomaly detection thresholds, telemetry streaming frequencies, notification dispatches, and review research compliance.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>Configuration saved successfully. Model thresholds updated for active digital twins.</span>
        </div>
      )}

      {/* Anomaly Detection Sensitivity */}
      <div
        className={`p-6 rounded-2xl border space-y-4 ${
          isDarkMode ? 'bg-[#101B2D] border-slate-800 text-slate-100' : 'bg-white border-[#E3EAF2] text-[#172B4D] shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-inherit">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-500" />
            <h3 className="font-bold text-sm">Isolation Forest Anomaly Sensitivity</h3>
          </div>
          <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
            Threshold: {anomalySensitivity}
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-[#697A90] dark:text-slate-400 leading-relaxed">
            Adjust the decision boundary threshold for multi-sigma signal departures. Lower values increase sensitivity for high-risk ICU/post-op surveillance; higher values reduce false alarm fatigue for athletic patients.
          </p>

          <input
            type="range"
            min="0.4"
            max="0.85"
            step="0.05"
            value={anomalySensitivity}
            onChange={(e) => setAnomalySensitivity(parseFloat(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>0.40 (High Sensitivity / Critical Care)</span>
            <span>0.65 (Balanced Clinical Standard)</span>
            <span>0.85 (Conservative / Athletic)</span>
          </div>
        </div>
      </div>

      {/* Notification Alert Rules */}
      <div
        className={`p-6 rounded-2xl border space-y-4 ${
          isDarkMode ? 'bg-[#101B2D] border-slate-800 text-slate-100' : 'bg-white border-[#E3EAF2] text-[#172B4D] shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2 pb-3 border-b border-inherit">
          <Bell className="w-4 h-4 text-teal-500" />
          <h3 className="font-bold text-sm">Clinical Alert Dispatches</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold block">Critical Outlier Alarms</span>
              <span className="text-[#697A90] dark:text-slate-400 text-[11px]">
                Immediate notification on acute desaturation, severe tachycardia, or shock index &gt; 0.8
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyCritical}
              onChange={(e) => setNotifyCritical(e.target.checked)}
              className="rounded border-[#E3EAF2] text-teal-600 focus:ring-0 w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-inherit/40">
            <div>
              <span className="font-semibold block">Warning & Drift Observations</span>
              <span className="text-[#697A90] dark:text-slate-400 text-[11px]">
                Alert on sub-febrile shifts, gradual hypertensive creep, and sympathetic strain
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyWarning}
              onChange={(e) => setNotifyWarning(e.target.checked)}
              className="rounded border-[#E3EAF2] text-teal-600 focus:ring-0 w-4 h-4"
            />
          </div>
        </div>
      </div>

      {/* Model & Architecture Documentation Link */}
      <div
        className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDarkMode ? 'bg-[#101B2D] border-slate-800 text-slate-100' : 'bg-white border-[#E3EAF2] text-[#172B4D] shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">System Architecture & ML Specifications</h4>
            <p className="text-xs text-[#697A90] dark:text-slate-400">
              Inspect pipeline diagrams, Python scikit-learn models, and evaluation results.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenArchitecture}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shrink-0 shadow-xs"
        >
          View System Architecture
        </button>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#13B8A6] hover:bg-teal-600 text-white shadow-xs"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};
