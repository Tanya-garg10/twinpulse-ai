import React, { useState, useEffect, useRef } from 'react';
import { DEMO_PATIENTS } from './data/demoPatients';
import { DemoPatient, VitalReading, PatientAlert } from './types/health';
import { analyzeReading, calculateBaseline } from './services/mlEngine';
import { Sidebar, NavRoute } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { OverviewView } from './components/views/OverviewView';
import { DigitalTwinView } from './components/views/DigitalTwinView';
import { TimelineView } from './components/views/TimelineView';
import { InsightsView } from './components/views/InsightsView';
import { WhatIfLabView } from './components/views/WhatIfLabView';
import { ReportsView } from './components/views/ReportsView';
import { CsvUploaderModal } from './components/CsvUploaderModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

export default function App() {
  const [patients, setPatients] = useState<DemoPatient[]>(DEMO_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pt-marcus-vance');
  const [currentRoute, setCurrentRoute] = useState<NavRoute>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Live streaming simulation state
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamingSpeed, setStreamingSpeed] = useState<number>(1);
  const [showCsvModal, setShowCsvModal] = useState<boolean>(false);
  const [showArchitectureModal, setShowArchitectureModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial clinical alerts feed
  const [alerts, setAlerts] = useState<PatientAlert[]>([
    {
      id: 'alt-101',
      patientId: 'pt-marcus-vance',
      timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      severity: 'critical',
      title: 'Nocturnal Tachycardia & Capillary Desaturation Coupling',
      message: 'Multivariate anomaly detected: Heart rate surged to 118 BPM concurrently with oxygen saturation drop to 89.5% (Z-score desaturation: -3.8σ).',
      readingsSummary: 'HR 118 BPM · SpO₂ 89.5% · Resp. Rate 22 br/min · Shock Index 0.81',
      category: 'MULTIVARIATE_DECOMPENSATION',
      status: 'active',
      recommendedGuidance: 'Advise patient to sit upright. Recheck pulse oximeter probe placement. If associated with chest tightness, activate clinical rapid response.',
    },
    {
      id: 'alt-102',
      patientId: 'pt-elena-rostova',
      timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
      severity: 'warning',
      title: 'Sub-Febrile Shift & Elevated Resting Pulse (Day 6 Post-Op)',
      message: 'Core temperature elevated to 37.9°C with upward heart rate trajectory (+16 BPM above individual baseline).',
      readingsSummary: 'Body Temp 37.9°C · HR 96 BPM · HRV 32 ms',
      category: 'TREND_DEVIATION',
      status: 'active',
      recommendedGuidance: 'Perform visual surgical wound inspection for erythema or induration. Check surgical dressing and encourage oral hydration.',
    },
    {
      id: 'alt-103',
      patientId: 'pt-sarah-chen',
      timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
      severity: 'warning',
      title: 'Systolic Hypertensive Spike During Autonomic Stress',
      message: 'Systolic blood pressure surged to 164 mmHg. Sympathetic stress index elevated to 78/100.',
      readingsSummary: 'BP 164/96 mmHg · HRV 28 ms · Stress 78/100',
      category: 'VITALS_OUTLIER',
      status: 'acknowledged',
      recommendedGuidance: 'Review medication timing (Amlodipine 5mg). Prompt patient to conduct a 5-minute paced diaphragmatic breathing protocol.',
    },
  ]);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const currentReading =
    selectedPatient.historicalReadings[selectedPatient.historicalReadings.length - 1] ||
    selectedPatient.recentTelemetry[selectedPatient.recentTelemetry.length - 1];

  const injectAnomalyNextTickRef = useRef<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live streaming simulator loop (advances historical readings and updates baselines)
  useEffect(() => {
    if (!isStreaming) return;

    const intervalMs = Math.max(800, Math.round(2500 / streamingSpeed));

    const timer = setInterval(() => {
      setPatients((prevPatients) => {
        return prevPatients.map((pat) => {
          if (pat.id === selectedPatientId) {
            const last = pat.historicalReadings[pat.historicalReadings.length - 1] || pat.recentTelemetry[0];
            const now = new Date();

            let isAnomalyEvent = false;
            let hr = last.heartRate;
            let sys = last.systolicBP;
            let dia = last.diastolicBP;
            let spo2 = last.spO2;
            let rr = last.respiratoryRate;
            let temp = last.bodyTemp;
            let hrv = last.hrv;
            let steps = (last.steps ?? 6800) + Math.round(Math.random() * 4);

            // Natural biological random walk
            const driftHR = (Math.random() - 0.5) * 2.2;
            const driftSys = (Math.random() - 0.5) * 2.8;
            const driftSpO2 = (Math.random() - 0.5) * 0.35;

            hr += driftHR;
            sys += driftSys;
            spo2 += driftSpO2;

            // If user clicked "Simulate Outlier"
            if (injectAnomalyNextTickRef.current) {
              injectAnomalyNextTickRef.current = false;
              isAnomalyEvent = true;
              hr = pat.baseline.heartRate.mean + pat.baseline.heartRate.std * 3.4;
              sys = pat.baseline.systolicBP.mean + pat.baseline.systolicBP.std * 2.5;
              spo2 = Math.max(88, pat.baseline.spO2.mean - 6.8);
              rr = pat.baseline.respiratoryRate.mean + 6;
              hrv = Math.max(14, pat.baseline.hrv.mean - 22);
            } else {
              // Biological homeostasis pulling toward baseline mean
              hr += (pat.baseline.heartRate.mean - hr) * 0.08;
              sys += (pat.baseline.systolicBP.mean - sys) * 0.08;
              dia += (pat.baseline.diastolicBP.mean - dia) * 0.08;
              spo2 += (pat.baseline.spO2.mean - spo2) * 0.1;
            }

            const newReading: VitalReading = {
              timestamp: now.toISOString(),
              heartRate: Number(hr.toFixed(1)),
              systolicBP: Number(sys.toFixed(1)),
              diastolicBP: Number(dia.toFixed(1)),
              spO2: Number(Math.min(100, Math.max(84, spo2)).toFixed(1)),
              respiratoryRate: Number(Math.max(8, rr).toFixed(1)),
              bodyTemp: Number(temp.toFixed(2)),
              hrv: Number(Math.max(12, hrv).toFixed(1)),
              steps,
              sleepHours: last.sleepHours ?? 6.8,
              stressScore: Math.min(
                95,
                Math.max(10, Math.round(last.stressScore || 40) + Math.round((hr - pat.baseline.heartRate.mean) * 0.6))
              ),
              isSimulated: true,
              isAnomaly: isAnomalyEvent || last.isAnomaly,
            };

            const updatedHistory = [...pat.historicalReadings.slice(-48), newReading];
            const updatedReport = analyzeReading(newReading, pat.baseline);

            // If an anomaly was just triggered, dispatch alert
            if (isAnomalyEvent) {
              const newAlert: PatientAlert = {
                id: `alt-${Date.now()}`,
                patientId: pat.id,
                timestamp: now.toISOString(),
                severity: 'critical',
                title: `Acute Outlier Departure Detected (${pat.fullName})`,
                message: `Dynamic stream anomaly: Heart rate surged to ${newReading.heartRate} BPM with SpO₂ ${newReading.spO2}% and Systolic BP ${newReading.systolicBP} mmHg.`,
                readingsSummary: `HR ${newReading.heartRate} BPM · SpO₂ ${newReading.spO2}% · BP ${newReading.systolicBP}/${newReading.diastolicBP} mmHg`,
                category: 'MULTIVARIATE_DECOMPENSATION',
                status: 'active',
                recommendedGuidance: 'Immediate resting re-evaluation recommended. Correlate with clinical patient presentation.',
              };
              setAlerts((prev) => [newAlert, ...prev]);
              showToast(`Acute outlier detected for ${pat.fullName}! Observation logged in AI Insights.`);
            }

            return {
              ...pat,
              historicalReadings: updatedHistory,
              recentTelemetry: updatedHistory.slice(-24),
              latestAnomalyReport: updatedReport,
            };
          }
          return pat;
        });
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isStreaming, streamingSpeed, selectedPatientId]);

  // Outlier Simulation Trigger
  const handleInjectAnomaly = () => {
    injectAnomalyNextTickRef.current = true;
    showToast('Outlier trigger armed — injecting physiological shift into stream...');
  };

  // CSV Data Ingestion Handler
  const handleDataIngested = (readings: VitalReading[], filename: string) => {
    setPatients((prev) =>
      prev.map((pat) => {
        if (pat.id === selectedPatientId) {
          const newBaseline = calculateBaseline(readings);
          const latest = readings[readings.length - 1];
          const report = analyzeReading(latest, newBaseline);

          return {
            ...pat,
            historicalReadings: readings,
            recentTelemetry: readings.slice(-24),
            baseline: newBaseline,
            latestAnomalyReport: report,
            summaryNotes: `Ingested external dataset: ${filename} (${readings.length} observations). Dynamic baselines updated.`,
          };
        }
        return pat;
      })
    );

    const newAlert: PatientAlert = {
      id: `alt-csv-${Date.now()}`,
      patientId: selectedPatientId,
      timestamp: new Date().toISOString(),
      severity: 'info',
      title: `Dataset Ingested: ${filename}`,
      message: `Successfully validated and integrated ${readings.length} measured wearable telemetry points. Dynamic baselines re-indexed.`,
      readingsSummary: `${readings.length} rows processed across all biometric dimensions`,
      category: 'VITALS_OUTLIER',
      status: 'active',
      recommendedGuidance: 'Review updated baseline reference corridors in health trends.',
    };
    setAlerts((prev) => [newAlert, ...prev]);
    showToast(`Successfully ingested ${readings.length} telemetry points for ${selectedPatient.fullName}.`);
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'acknowledged' } : a)));
    showToast('Observation acknowledged.');
  };

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'resolved' } : a)));
    showToast('Observation resolved.');
  };

  const activeAlertCount = alerts.filter((a) => a.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#202B33] flex">
      {/* 1. Slim Left Navigation Rail */}
      <Sidebar
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeAlertCount={activeAlertCount}
        onOpenArchitecture={() => setShowArchitectureModal(true)}
      />

      {/* 2. Main Container (Offset by Sidebar Width) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          isSidebarCollapsed ? 'pl-16' : 'pl-56'
        }`}
      >
        {/* Top Bar */}
        <TopNav
          currentRoute={currentRoute}
          patients={patients}
          selectedPatient={selectedPatient}
          onSelectPatient={(p) => setSelectedPatientId(p.id)}
          isStreaming={isStreaming}
          onToggleStreaming={() => setIsStreaming(!isStreaming)}
          streamingSpeed={streamingSpeed}
          onChangeSpeed={setStreamingSpeed}
          onInjectAnomaly={handleInjectAnomaly}
          onOpenCsvModal={() => setShowCsvModal(true)}
          activeAlertCount={activeAlertCount}
          onNavigateToInsights={() => setCurrentRoute('insights')}
        />

        {/* Spacious Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {currentRoute === 'overview' && (
            <OverviewView
              patient={selectedPatient}
              currentReading={currentReading}
              isStreaming={isStreaming}
              onNavigate={setCurrentRoute}
              alerts={alerts}
              onOpenWhatIf={() => setCurrentRoute('whatif')}
              onAcknowledgeAlert={handleAcknowledgeAlert}
            />
          )}

          {currentRoute === 'digital_twin' && (
            <DigitalTwinView
              patient={selectedPatient}
              currentReading={currentReading}
              isStreaming={isStreaming}
              onNavigateToWhatIf={() => setCurrentRoute('whatif')}
            />
          )}

          {currentRoute === 'timeline' && (
            <TimelineView
              patient={selectedPatient}
              onOpenCsvModal={() => setShowCsvModal(true)}
            />
          )}

          {currentRoute === 'insights' && (
            <InsightsView
              patient={selectedPatient}
              alerts={alerts}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onResolveAlert={handleResolveAlert}
            />
          )}

          {currentRoute === 'whatif' && (
            <WhatIfLabView
              patient={selectedPatient}
              currentReading={currentReading}
            />
          )}

          {currentRoute === 'reports' && (
            <ReportsView
              patient={selectedPatient}
              currentReading={currentReading}
            />
          )}
        </main>

        {/* Global Quiet Footer */}
        <footer className="px-8 py-3.5 border-t border-[#E8EDEB] bg-white text-xs font-mono text-[#77838D] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#27866F]" />
            <span>TwinPulse AI · Happiest Health Digital Twin Challenge 2026</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Model: Isolation Forest + EWMA</span>
            <span>Feed: {isStreaming ? `1Hz (${streamingSpeed}x)` : 'Paused'}</span>
            <span>Dataset: Synthetic Patient Data</span>
          </div>
        </footer>
      </div>

      {/* CSV Ingestion Modal */}
      <CsvUploaderModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        onDataIngested={handleDataIngested}
        patientName={selectedPatient.fullName}
        isDarkMode={false}
      />

      {/* Architecture & ML Specs Modal */}
      <ArchitectureModal
        isOpen={showArchitectureModal}
        onClose={() => setShowArchitectureModal(false)}
        isDarkMode={false}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-xl bg-[#202B33] text-white shadow-card-hover border border-slate-700 text-xs flex items-center gap-2 max-w-md animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#27866F] shrink-0" />
          <span className="leading-snug">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
