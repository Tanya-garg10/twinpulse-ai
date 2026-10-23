import React from 'react';
import { X, Cpu, Server, Activity, ShieldCheck, Database, Layers, Video } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose, isDarkMode = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`rounded-3xl border w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden transition-all ${
          isDarkMode ? 'bg-[#101B2D] border-slate-700 text-slate-100' : 'bg-white border-[#E3EAF2] text-[#172B4D]'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-sans">TwinPulse AI — Architecture & ML Specifications</h3>
              <p className="text-xs text-[#697A90] dark:text-slate-400 font-sans">
                Happiest Health Digital Twin Challenge 2026 Platform Specs
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#172B4D] dark:text-slate-300">
          {/* Architecture Diagram */}
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-[#E3EAF2]'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block font-mono">
              End-to-End System Flow Architecture
            </span>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
              <div
                className={`p-3.5 rounded-xl border space-y-1.5 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-[#E3EAF2]'
                }`}
              >
                <div className="p-2 w-8 h-8 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="font-bold block">1. Telemetry Ingestion</span>
                <p className="text-[11px] text-[#697A90] dark:text-slate-400">
                  Continuous wearable stream sync (Apple Watch, Oura, Whoop, Garmin) & CSV validation.
                </p>
              </div>

              <div
                className={`p-3.5 rounded-xl border space-y-1.5 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-[#E3EAF2]'
                }`}
              >
                <div className="p-2 w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 mx-auto flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <span className="font-bold block">2. Dynamic Baselines</span>
                <p className="text-[11px] text-[#697A90] dark:text-slate-400">
                  Patient-specific EWMA baseline corridors with diurnal circadian rhythm parameters.
                </p>
              </div>

              <div
                className={`p-3.5 rounded-xl border space-y-1.5 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-[#E3EAF2]'
                }`}
              >
                <div className="p-2 w-8 h-8 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="font-bold block">3. Multivariate ML Core</span>
                <p className="text-[11px] text-[#697A90] dark:text-slate-400">
                  Isolation Forest + physiological couplings (Shock Index, Desaturation cardiac stress).
                </p>
              </div>

              <div
                className={`p-3.5 rounded-xl border space-y-1.5 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-[#E3EAF2]'
                }`}
              >
                <div className="p-2 w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="font-bold block">4. Twin Avatar & What-If</span>
                <p className="text-[11px] text-[#697A90] dark:text-slate-400">
                  Dynamic digital silhouette, Shapley feature attributions, and 24h prospective sandbox.
                </p>
              </div>
            </div>
          </div>

          {/* Model Formulation */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-[#E3EAF2]'
            }`}
          >
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-500" />
              Machine Learning Formulation: Isolation Forest & Multivariate Scoring
            </h4>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              Rather than hardcoding rigid clinical thresholds that trigger alarm fatigue, incoming signals are normalized against running patient baselines:
            </p>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-inherit font-mono text-[11px] text-teal-700 dark:text-teal-300 space-y-1">
              <div>z_i = (x_i - μ_baseline,i) / σ_baseline,i</div>
              <div>Shock_Index = HR / SBP (Clinical Shock Marker: 0.50 – 0.70)</div>
              <div>Anomaly_Score = Sigmoid( -α · (Isolation_Path_Length(Z) + Interaction_Terms - Threshold) )</div>
            </div>
          </div>

          {/* Video Demonstration Placeholder */}
          <div
            className={`p-5 rounded-2xl border space-y-2 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-[#E3EAF2]'
            }`}
          >
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Video className="w-4 h-4 text-rose-500" />
              Challenge Demonstration Video (15–20 Minute Unlisted Walkthrough)
            </h4>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-inherit flex items-center justify-between">
              <div>
                <span className="font-semibold block">YouTube Demonstration Walkthrough</span>
                <span className="text-[10px] text-slate-400 font-mono">Placeholder for final submission recording</span>
              </div>
              <span className="text-xs font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-700">
                https://youtube.com/watch?v=PENDING_CHALLENGE_UPLOAD
              </span>
            </div>
          </div>

          {/* Ethics Declaration */}
          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-500/30 text-teal-800 dark:text-teal-200 text-[11px] leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-0.5">Responsible AI & Clinical Ethics Declaration</strong>
              Engineered strictly as a research proof-of-concept for the Happiest Health Challenge 2026. All patient profiles are synthetic. It does not replace medical consultation or certified diagnostic devices.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-inherit bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#13B8A6] text-white"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
