import React, { useState } from 'react';
import { DemoPatient, PatientAlert } from '../../types/health';
import {
  Sparkles,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Filter,
  Brain,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Info,
} from 'lucide-react';

interface InsightsViewProps {
  patient: DemoPatient;
  alerts: PatientAlert[];
  onAcknowledgeAlert?: (id: string) => void;
  onResolveAlert?: (id: string) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  patient,
  alerts,
  onAcknowledgeAlert,
  onResolveAlert,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const report = patient.latestAnomalyReport;
  const patientAlerts = alerts.filter((a) => a.patientId === patient.id || selectedSeverity === 'ALL');

  const filteredAlerts = patientAlerts.filter((a) => {
    if (selectedSeverity === 'ALL') return true;
    return a.severity === selectedSeverity;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202B33]">
            AI Health Insights
          </h2>
          <p className="text-xs sm:text-sm text-[#77838D] mt-0.5">
            Evidence-backed physiological observations and baseline deviation analysis for {patient.fullName}.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E8EDEB] rounded-lg shadow-soft text-xs font-medium">
          {[
            { id: 'ALL', label: 'All Observations' },
            { id: 'critical', label: 'Elevated' },
            { id: 'warning', label: 'Watch / Drift' },
            { id: 'info', label: 'Informational' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedSeverity(f.id)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedSeverity === f.id
                  ? 'bg-[#E6F2ED] text-[#27866F] font-semibold'
                  : 'text-[#77838D] hover:text-[#202B33]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Analytical Intelligence Model Summary Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E8EDEB] shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8EDEB]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#E6F2ED] text-[#27866F] flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#202B33]">
                Detection Model: Isolation Forest + EWMA Covariance
              </h3>
              <p className="text-xs text-[#77838D]">
                Evaluates multi-vital covariance (Shock Index, SpO₂ desaturation, and pulse pressure) against personalized rolling baselines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div>
              <span className="text-[#77838D] text-[10px] block uppercase">Model Confidence</span>
              <span className="font-bold text-[#27866F]">
                {report ? Math.round(report.confidence * 100) : 94}%
              </span>
            </div>
            <div className="h-6 w-px bg-[#E8EDEB]" />
            <div>
              <span className="text-[#77838D] text-[10px] block uppercase">Anomaly Score</span>
              <span
                className={`font-bold ${
                  report && report.anomalyScore > 0.65 ? 'text-[#DC2626]' : 'text-[#202B33]'
                }`}
              >
                {report ? report.anomalyScore.toFixed(2) : '0.18'} / 1.00
              </span>
            </div>
          </div>
        </div>

        {/* Non-diagnostic disclaimer */}
        <div className="flex items-start gap-2 text-xs text-[#77838D] bg-[#F7F9F8] p-3 rounded-lg border border-[#E8EDEB]">
          <Info className="w-4 h-4 text-[#27866F] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Clinical governance:</strong> Observations represent mathematical deviations from historical baseline corridors and do not constitute a diagnostic determination. Correlate with professional clinical evaluation.
          </p>
        </div>
      </div>

      {/* 3. Insight Cards List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const isExpanded = expandedId === alert.id;
            const isCritical = alert.severity === 'critical';

            return (
              <div
                key={alert.id}
                className="bg-white rounded-xl border border-[#E8EDEB] shadow-soft overflow-hidden transition-all hover:border-[#D5DFDC]"
              >
                {/* Main Card Header */}
                <div
                  onClick={() => toggleExpand(alert.id)}
                  className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isCritical ? 'bg-[#DC2626]' : 'bg-[#D97706]'
                        }`}
                      />
                      <h4 className="text-sm font-semibold text-[#202B33]">
                        {alert.title}
                      </h4>
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.2 rounded ${
                          isCritical
                            ? 'bg-[#FEE2E2] text-[#DC2626]'
                            : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}
                      >
                        {isCritical ? 'Elevated' : 'Watch'}
                      </span>
                    </div>

                    <p className="text-xs text-[#77838D] pl-4">
                      {alert.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0 pl-4 sm:pl-0">
                    <span className="text-[11px] font-mono text-[#77838D]">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button className="p-1 rounded-md text-[#77838D] hover:bg-[#F7F9F8]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Clinical Breakdown */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-[#E8EDEB] bg-[#F7F9F8] space-y-3.5 text-xs">
                    {/* Measurements / Evidence */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-lg bg-white border border-[#E8EDEB] space-y-1">
                        <span className="text-[10px] uppercase font-semibold text-[#77838D] tracking-wider block">
                          Supporting Telemetry Evidence
                        </span>
                        <p className="font-mono text-[#202B33] font-medium">
                          {alert.readingsSummary}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-white border border-[#E8EDEB] space-y-1">
                        <span className="text-[10px] uppercase font-semibold text-[#77838D] tracking-wider block">
                          Detection Methodology
                        </span>
                        <p className="text-[#202B33]">
                          Multivariate Isolation Forest detected co-occurring departure exceeding $\pm 2.0\sigma$ boundary.
                        </p>
                      </div>
                    </div>

                    {/* Next step recommendation */}
                    <div className="p-3 rounded-lg bg-[#E6F2ED] border border-[#d5e9e0] space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#27866F] tracking-wider block">
                        Recommended Next Step
                      </span>
                      <p className="text-[#202B33] leading-relaxed">
                        {alert.recommendedGuidance}
                      </p>
                    </div>

                    {/* Acknowledge / Resolve action buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      {alert.status === 'active' && onAcknowledgeAlert && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAcknowledgeAlert(alert.id);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-[#E8EDEB] bg-white hover:bg-[#F7F9F8] text-xs font-medium text-[#202B33] transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}

                      {onResolveAlert && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onResolveAlert(alert.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#27866F] hover:bg-[#1f6d5a] text-white text-xs font-semibold transition-colors"
                        >
                          Mark as Resolved
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-[#77838D] bg-white rounded-xl border border-[#E8EDEB] shadow-soft">
            <CheckCircle2 className="w-8 h-8 text-[#27866F] mx-auto mb-2" />
            <h4 className="font-semibold text-[#202B33] text-sm">No Active Anomaly Observations</h4>
            <p className="text-xs text-[#77838D] mt-1">All real-time telemetry is tracking within individual baseline envelopes.</p>
          </div>
        )}
      </div>
    </div>
  );
};
