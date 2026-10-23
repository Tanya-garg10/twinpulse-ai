import React from 'react';
import { DemoPatient, VitalReading, PatientAlert } from '../../types/health';
import { VitalCard } from '../VitalCard';
import { TelemetryChart } from '../Charts/TelemetryChart';
import { NavRoute } from '../layout/Sidebar';
import {
  Heart,
  Activity,
  Wind,
  Thermometer,
  Moon,
  Footprints,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  Clock,
  UserCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface OverviewViewProps {
  patient: DemoPatient;
  currentReading: VitalReading;
  isStreaming: boolean;
  onNavigate: (route: NavRoute) => void;
  alerts: PatientAlert[];
  onOpenWhatIf: () => void;
  onAcknowledgeAlert?: (id: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  patient,
  currentReading,
  isStreaming,
  onNavigate,
  alerts,
  onOpenWhatIf,
}) => {
  const baseline = patient.baseline;
  const patientAlerts = alerts.filter((a) => a.patientId === patient.id && a.status === 'active');
  const topAlerts = patientAlerts.slice(0, 3);

  // Recent timeline events (subtle, minimal)
  const recentTimeline = [
    {
      time: '12 mins ago',
      title: 'Telemetry stream updated',
      desc: 'Resting pulse and respiration within baseline boundaries.',
      status: 'normal',
    },
    {
      time: '45 mins ago',
      title: 'Blood pressure reading registered',
      desc: `Recorded at ${Math.round(currentReading.systolicBP)}/${Math.round(currentReading.diastolicBP)} mmHg via ${patient.wearableDevice}.`,
      status: 'normal',
    },
    {
      time: '2h 15m ago',
      title: patient.riskCategory === 'High' ? 'Nocturnal desaturation event' : 'Morning baseline calibration',
      desc: patient.riskCategory === 'High'
        ? 'SpO2 dipped below baseline floor (89.5%) with concurrent tachycardic shift.'
        : 'Circadian mean re-indexed from 48-hour continuous sensor feed.',
      status: patient.riskCategory === 'High' ? 'alert' : 'normal',
    },
    {
      time: '7h 30m ago',
      title: 'Restorative sleep cycle logged',
      desc: `${currentReading.sleepHours ?? 6.8} hours recorded with 84% autonomic recovery efficiency.`,
      status: 'normal',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Calm Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202B33]">
            Your health, at a glance.
          </h2>
          <p className="text-xs sm:text-sm text-[#77838D] mt-0.5">
            TwinPulse AI helps you understand health trends through your personal Digital Twin.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('digital_twin')}
            className="px-3 py-1.5 rounded-lg border border-[#E8EDEB] bg-white hover:bg-[#F7F9F8] text-xs font-medium text-[#202B33] flex items-center gap-1.5 transition-colors shadow-soft"
          >
            <span>My Digital Twin</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#27866F]" />
          </button>
        </div>
      </div>

      {/* 2. Patient Summary Horizontal Profile */}
      <div className="p-4 rounded-xl bg-white border border-[#E8EDEB] shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-[#E6F2ED] text-[#27866F] font-bold text-base flex items-center justify-center font-mono shrink-0">
            {patient.avatarInitials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-[#202B33]">
                {patient.fullName}
              </h3>
              <span className="text-xs text-[#77838D] font-mono">
                {patient.age}y · {patient.gender}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F7F9F8] border border-[#E8EDEB] text-[#77838D]">
                Synthetic Demo Profile
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
                {patient.riskCategory} Risk Profile
              </span>
            </div>
            <p className="text-xs text-[#77838D] mt-0.5">
              {patient.primaryCondition} · Continuous wearable feed from {patient.wearableDevice}
            </p>
          </div>
        </div>

        {/* Sync & Freshness Stats */}
        <div className="flex items-center gap-4 text-xs font-mono text-[#77838D] pt-2 md:pt-0 border-t md:border-t-0 border-[#E8EDEB]">
          <div>
            <span className="text-[10px] uppercase text-[#77838D] block">Data Source</span>
            <span className="font-semibold text-[#202B33]">{patient.wearableDevice.split(' ')[0]}</span>
          </div>
          <div className="h-6 w-px bg-[#E8EDEB]" />
          <div>
            <span className="text-[10px] uppercase text-[#77838D] block">Data Freshness</span>
            <span className="font-semibold text-[#27866F]">
              {isStreaming ? 'Live (1Hz)' : 'Paused'}
            </span>
          </div>
          <div className="h-6 w-px bg-[#E8EDEB]" />
          <div>
            <span className="text-[10px] uppercase text-[#77838D] block">Observations</span>
            <span className="font-semibold text-[#202B33]">
              {patient.historicalReadings.length} pts
            </span>
          </div>
        </div>
      </div>

      {/* 3. Vital Signs Grid (6 Compact Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <VitalCard
          label="Heart Rate"
          value={currentReading.heartRate}
          unit="BPM"
          icon={Heart}
          baseline={`${baseline.heartRate.mean} BPM`}
          delta={{
            value: Number((currentReading.heartRate - baseline.heartRate.mean).toFixed(1)),
            text: `${currentReading.heartRate > baseline.heartRate.mean ? '+' : ''}${(
              currentReading.heartRate - baseline.heartRate.mean
            ).toFixed(1)} vs base`,
            direction: currentReading.heartRate > baseline.heartRate.mean ? 'up' : 'down',
            isAnomaly: currentReading.heartRate > baseline.heartRate.mean + baseline.heartRate.std * 1.8,
          }}
          status={currentReading.heartRate > 105 ? 'critical' : currentReading.heartRate > 90 ? 'watch' : 'normal'}
          isSimulated={currentReading.isSimulated}
          timestamp="Live"
          sparklineData={[
            baseline.heartRate.mean - 3,
            baseline.heartRate.mean - 1,
            baseline.heartRate.mean,
            baseline.heartRate.mean + 2,
            currentReading.heartRate - 1,
            currentReading.heartRate,
          ]}
        />

        <VitalCard
          label="Blood Pressure"
          value={`${Math.round(currentReading.systolicBP)}/${Math.round(currentReading.diastolicBP)}`}
          unit="mmHg"
          icon={Activity}
          baseline={`${baseline.systolicBP.mean}/${baseline.diastolicBP.mean}`}
          delta={{
            value: currentReading.systolicBP - baseline.systolicBP.mean,
            text: `${currentReading.systolicBP > baseline.systolicBP.mean ? '+' : ''}${Math.round(
              currentReading.systolicBP - baseline.systolicBP.mean
            )} mmHg`,
            direction: currentReading.systolicBP > baseline.systolicBP.mean ? 'up' : 'down',
            isAnomaly: currentReading.systolicBP > 145,
          }}
          status={currentReading.systolicBP > 145 ? 'critical' : currentReading.systolicBP > 130 ? 'watch' : 'normal'}
          isSimulated={currentReading.isSimulated}
          timestamp="Live"
          sparklineData={[
            baseline.systolicBP.mean - 4,
            baseline.systolicBP.mean - 2,
            baseline.systolicBP.mean,
            baseline.systolicBP.mean + 3,
            currentReading.systolicBP - 1,
            currentReading.systolicBP,
          ]}
        />

        <VitalCard
          label="Oxygen (SpO₂)"
          value={`${currentReading.spO2}%`}
          unit="SpO₂"
          icon={Wind}
          baseline={`${baseline.spO2.mean}%`}
          delta={{
            value: Number((currentReading.spO2 - baseline.spO2.mean).toFixed(1)),
            text: `${currentReading.spO2 < baseline.spO2.mean ? '' : '+'}${(
              currentReading.spO2 - baseline.spO2.mean
            ).toFixed(1)}%`,
            direction: currentReading.spO2 < baseline.spO2.mean ? 'down' : 'up',
            isAnomaly: currentReading.spO2 < 93,
          }}
          status={currentReading.spO2 < 92 ? 'critical' : currentReading.spO2 < 95 ? 'watch' : 'normal'}
          isSimulated={currentReading.isSimulated}
          timestamp="Live"
          sparklineData={[98, 98, 97, 96, 95, currentReading.spO2]}
        />

        <VitalCard
          label="Core Temp"
          value={`${currentReading.bodyTemp.toFixed(1)}°`}
          unit="°C"
          icon={Thermometer}
          baseline={`${baseline.bodyTemp.mean.toFixed(1)}°C`}
          delta={{
            value: Number((currentReading.bodyTemp - baseline.bodyTemp.mean).toFixed(2)),
            text: `${currentReading.bodyTemp > baseline.bodyTemp.mean ? '+' : ''}${(
              currentReading.bodyTemp - baseline.bodyTemp.mean
            ).toFixed(2)}°`,
            direction: currentReading.bodyTemp > baseline.bodyTemp.mean ? 'up' : 'down',
            isAnomaly: currentReading.bodyTemp >= 38.0,
          }}
          status={currentReading.bodyTemp >= 38.0 ? 'critical' : currentReading.bodyTemp >= 37.6 ? 'watch' : 'normal'}
          isSimulated={currentReading.isSimulated}
          timestamp="Live"
          sparklineData={[36.7, 36.8, 36.9, 36.8, currentReading.bodyTemp]}
        />

        <VitalCard
          label="Respiration"
          value={currentReading.respiratoryRate}
          unit="br/min"
          icon={Wind}
          baseline={`${baseline.respiratoryRate.mean}`}
          delta={{
            value: Number((currentReading.respiratoryRate - baseline.respiratoryRate.mean).toFixed(1)),
            text: `${currentReading.respiratoryRate > baseline.respiratoryRate.mean ? '+' : ''}${(
              currentReading.respiratoryRate - baseline.respiratoryRate.mean
            ).toFixed(1)}`,
            direction: currentReading.respiratoryRate > baseline.respiratoryRate.mean ? 'up' : 'down',
            isAnomaly: currentReading.respiratoryRate > 22,
          }}
          status={currentReading.respiratoryRate > 22 ? 'critical' : currentReading.respiratoryRate > 19 ? 'watch' : 'normal'}
          isSimulated={currentReading.isSimulated}
          timestamp="Live"
          sparklineData={[15, 16, 16, 17, currentReading.respiratoryRate]}
        />

        <VitalCard
          label="Daily Activity"
          value={currentReading.steps ? currentReading.steps.toLocaleString() : '6,840'}
          unit="steps"
          icon={Footprints}
          baseline="8,000 steps"
          delta={{
            value: (currentReading.steps ?? 6840) - 8000,
            text: '85% of goal',
            direction: 'neutral',
            isAnomaly: false,
          }}
          status="normal"
          isSimulated={currentReading.isSimulated}
          timestamp="Today"
          sparklineData={[2100, 3400, 4800, 5600, currentReading.steps ?? 6840]}
        />
      </div>

      {/* 4. Main Content Area (Two-Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (Col 7): Interactive Health-Trend Chart */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-xl border border-[#E8EDEB] shadow-soft space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8EDEB]">
            <div>
              <h3 className="text-sm font-semibold text-[#202B33]">
                Longitudinal Health Trends
              </h3>
              <p className="text-xs text-[#77838D]">
                Continuous telemetry relative to your personalized baseline corridor.
              </p>
            </div>
            <button
              onClick={() => onNavigate('timeline')}
              className="text-xs text-[#27866F] hover:underline font-medium"
            >
              Full History
            </button>
          </div>

          <TelemetryChart
            readings={patient.historicalReadings}
            baseline={patient.baseline}
          />
        </div>

        {/* Right (Col 5): Compact AI Insights Panel */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl border border-[#E8EDEB] shadow-soft flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8EDEB]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#27866F]" />
                <h3 className="text-sm font-semibold text-[#202B33]">
                  AI Insights & Attributions
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#77838D]">
                {topAlerts.length} observations
              </span>
            </div>

            {/* List of Insights */}
            <div className="space-y-2.5">
              {topAlerts.length > 0 ? (
                topAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg border border-[#E8EDEB] bg-[#F7F9F8] space-y-1.5 transition-colors hover:border-[#D5DFDC]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-[#202B33] leading-snug">
                        {alert.title}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded shrink-0 ${
                          alert.severity === 'critical'
                            ? 'bg-[#FEE2E2] text-[#DC2626]'
                            : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}
                      >
                        {alert.severity === 'critical' ? 'Elevated' : 'Watch'}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#77838D] leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="pt-1.5 border-t border-[#E8EDEB] flex items-center justify-between text-[10px] text-[#77838D] font-mono">
                      <span>{alert.readingsSummary.split('·')[0]}</span>
                      <span className="text-[#27866F] font-sans font-medium">
                        Next: Review vitals
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-[#77838D] text-xs">
                  <CheckCircle2 className="w-6 h-6 text-[#27866F] mx-auto mb-1.5" />
                  <p className="font-medium text-[#202B33]">All telemetry within nominal baseline.</p>
                  <p className="text-[11px] mt-0.5">No acute physiological shifts detected.</p>
                </div>
              )}
            </div>
          </div>

          {/* Action to explore all insights */}
          <div className="pt-3 border-t border-[#E8EDEB] flex items-center justify-between">
            <button
              onClick={() => onNavigate('insights')}
              className="text-xs text-[#27866F] font-semibold hover:underline flex items-center gap-1"
            >
              <span>View All Insights & Explanations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenWhatIf}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#E6F2ED] text-[#27866F] hover:bg-[#d5e9e0] transition-colors"
            >
              Test Scenario
            </button>
          </div>
        </div>
      </div>

      {/* 5. Recent Activity Minimal Timeline */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8EDEB] shadow-soft space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8EDEB]">
          <div>
            <h3 className="text-sm font-semibold text-[#202B33]">
              Recent Activity & Observation Log
            </h3>
            <p className="text-xs text-[#77838D]">
              Chronological log of verified biometric updates and algorithmic detections.
            </p>
          </div>
          <span className="text-xs font-mono text-[#77838D]">
            Last 24 Hours
          </span>
        </div>

        <div className="divide-y divide-[#E8EDEB]">
          {recentTimeline.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-start justify-between gap-4 first:pt-1 last:pb-1">
              <div className="flex items-start gap-3">
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    item.status === 'alert' ? 'bg-[#D97706]' : 'bg-[#27866F]'
                  }`}
                />
                <div>
                  <span className="text-xs font-semibold text-[#202B33] block">
                    {item.title}
                  </span>
                  <span className="text-xs text-[#77838D] block mt-0.5">
                    {item.desc}
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-mono text-[#77838D] shrink-0">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
