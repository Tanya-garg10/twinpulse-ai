import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Key,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  getFeatherlessApiKey,
  setFeatherlessApiKey,
  getFeatherlessModel,
  setFeatherlessModel,
  ClinicalAnalysisResult,
  analyzeAnomalyWithFeatherless,
  DEFAULT_MODEL,
} from '../services/featherlessService';
import { DemoPatient, VitalReading, PatientAlert } from '../types/health';

interface FeatherlessModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: DemoPatient;
  reading: VitalReading;
  alert?: PatientAlert;
}

export const FeatherlessModal: React.FC<FeatherlessModalProps> = ({
  isOpen,
  onClose,
  patient,
  reading,
  alert,
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState<string>(DEFAULT_MODEL);
  const [isConfiguringKey, setIsConfiguringKey] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<ClinicalAnalysisResult | null>(null);
  const [keySavedMessage, setKeySavedMessage] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getFeatherlessApiKey());
      setModel(getFeatherlessModel());
      handleRunAnalysis();
    }
  }, [isOpen, alert?.id, patient.id]);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setFeatherlessApiKey(apiKey);
    setFeatherlessModel(model);
    setKeySavedMessage(true);
    setTimeout(() => setKeySavedMessage(false), 2000);
    setIsConfiguringKey(false);
    handleRunAnalysis();
  };

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await analyzeAnomalyWithFeatherless(patient, reading, alert);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const hasApiKey = Boolean(getFeatherlessApiKey());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-[#E8EDEB] shadow-card-hover w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E8EDEB] flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#27866F] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#202B33]">
                  Featherless AI Clinical Copilot
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E6F2ED] text-[#27866F] font-semibold border border-[#c4e3d7]">
                  Open Weights Inference
                </span>
              </div>
              <p className="text-xs text-[#77838D]">
                Powered by Featherless AI ({model}) for {patient.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsConfiguringKey(!isConfiguringKey)}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                hasApiKey
                  ? 'border-[#E8EDEB] bg-white text-[#202B33] hover:bg-[#F7F9F8]'
                  : 'border-[#FDE68A] bg-[#FEF3C7] text-[#D97706] font-semibold animate-pulse'
              }`}
              title="Configure Featherless API Key & Model"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">
                {hasApiKey ? 'Settings' : 'Set API Key'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#77838D] hover:text-[#202B33] hover:bg-[#F7F9F8] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* API Key & Model Configuration Drawer */}
        {isConfiguringKey && (
          <form
            onSubmit={handleSaveConfig}
            className="p-4 bg-[#F7F9F8] border-b border-[#E8EDEB] space-y-3 animate-in slide-in-from-top-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#202B33] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#27866F]" />
                Featherless Inference Configuration
              </span>
              <a
                href="https://featherless.ai"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#27866F] hover:underline flex items-center gap-1"
              >
                Get Featherless Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold uppercase text-[#77838D] block mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="featherless_..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#E8EDEB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#27866F] font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-[#77838D] block mb-1">
                  Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#E8EDEB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#27866F]"
                >
                  <option value="Qwen/Qwen2.5-7B-Instruct">Qwen/Qwen2.5-7B-Instruct (Recommended)</option>
                  <option value="meta-llama/Meta-Llama-3.1-8B-Instruct">Meta-Llama-3.1-8B-Instruct</option>
                  <option value="mistralai/Mistral-7B-Instruct-v0.3">Mistral-7B-Instruct-v0.3</option>
                  <option value="google/gemma-2-9b-it">Google Gemma-2-9B-IT</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#77838D]">
                Keys are stored locally in your browser session.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfiguringKey(false)}
                  className="px-3 py-1 rounded-lg text-xs text-[#77838D] hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 bg-[#27866F] hover:bg-[#1f6d5a] text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Save & Analyze
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
              <RefreshCw className="w-7 h-7 text-[#27866F] animate-spin" />
              <div>
                <span className="text-sm font-semibold text-[#202B33] block">
                  Featherless AI Reasoning in Progress...
                </span>
                <span className="text-xs text-[#77838D]">
                  Evaluating multi-vital corridors with {model}
                </span>
              </div>
            </div>
          ) : analysis ? (
            <div className="space-y-4 text-xs">
              {/* Triage & Headline */}
              <div className="p-4 rounded-xl border border-[#E8EDEB] bg-[#F7F9F8] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        analysis.clinicalTriage === 'Immediate Clinical Response'
                          ? 'bg-[#FEE2E2] text-[#DC2626]'
                          : analysis.clinicalTriage === 'Urgent Observation'
                          ? 'bg-[#FEF3C7] text-[#D97706]'
                          : 'bg-[#E6F2ED] text-[#27866F]'
                      }`}
                    >
                      Triage: {analysis.clinicalTriage}
                    </span>
                    <span className="text-[11px] text-[#77838D] font-mono">
                      Telemetry Synced
                    </span>
                  </div>

                  <span className="text-[11px] text-[#27866F] font-mono font-medium">
                    {analysis.modelUsed}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#202B33]">
                  {analysis.headline}
                </h4>
              </div>

              {/* Physiological Mechanism */}
              <div className="p-4 rounded-xl border border-[#E8EDEB] bg-white space-y-1.5 shadow-soft">
                <span className="text-[10px] uppercase font-bold text-[#27866F] tracking-wider block">
                  Autonomic & Physiological Mechanism
                </span>
                <p className="text-[#202B33] leading-relaxed">
                  {analysis.physiologicalMechanism}
                </p>
              </div>

              {/* Grid: Differential Risks & Evidence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-[#E8EDEB] bg-white space-y-2 shadow-soft">
                  <span className="text-[10px] uppercase font-bold text-[#77838D] tracking-wider block">
                    Differential Clinical Risks
                  </span>
                  <ul className="space-y-1">
                    {analysis.differentialRisks.map((risk, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-[#202B33]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E8EDEB] bg-white space-y-2 shadow-soft">
                  <span className="text-[10px] uppercase font-bold text-[#77838D] tracking-wider block">
                    Supporting Telemetry Evidence
                  </span>
                  <ul className="space-y-1 font-mono text-[11px]">
                    {analysis.evidenceFactors.map((ev, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-[#202B33]">
                        <Activity className="w-3 h-3 text-[#27866F] shrink-0" />
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Advice */}
              <div className="p-4 rounded-xl border border-[#d5e9e0] bg-[#E6F2ED] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#27866F] tracking-wider block">
                  Recommended Clinical & Patient Action
                </span>
                <p className="text-[#202B33] font-medium leading-relaxed">
                  {analysis.patientActionableAdvice}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8EDEB] bg-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-[#77838D]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#27866F]" />
            <span>Digital Twin Clinical Support · Featherless AI Integration</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAnalysis}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-lg border border-[#E8EDEB] bg-white hover:bg-[#F7F9F8] text-[#202B33] font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Re-analyze</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#27866F] hover:bg-[#1f6d5a] text-white font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
