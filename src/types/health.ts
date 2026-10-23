export interface VitalReading {
  timestamp: string; // ISO string
  heartRate: number; // bpm
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  spO2: number; // %
  respiratoryRate: number; // breaths/min
  bodyTemp: number; // Celsius
  hrv: number; // ms (RMSSD)
  steps?: number;
  sleepHours?: number;
  stressScore?: number; // 0-100
  isSimulated?: boolean;
  anomalyScore?: number; // 0 to 1
  isAnomaly?: boolean;
}

export interface VitalBaseline {
  heartRate: { mean: number; std: number; min: number; max: number };
  systolicBP: { mean: number; std: number; min: number; max: number };
  diastolicBP: { mean: number; std: number; min: number; max: number };
  spO2: { mean: number; std: number; min: number; max: number };
  respiratoryRate: { mean: number; std: number; min: number; max: number };
  bodyTemp: { mean: number; std: number; min: number; max: number };
  hrv: { mean: number; std: number; min: number; max: number };
}

export interface ContributingFactor {
  metric: string;
  label: string;
  currentValue: number;
  baselineValue: number;
  unit: string;
  deviationSigma: number;
  contributionPct: number; // 0 - 100
  impact: 'elevating' | 'depressing' | 'irregular';
}

export interface AnomalyReport {
  timestamp: string;
  overallRiskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  anomalyScore: number; // 0.0 - 1.0 (threshold ~0.65)
  confidence: number; // 0.0 - 1.0
  contributingFactors: ContributingFactor[];
  summary: string;
  recommendedAction: string;
  organImpact: {
    cardiac: number; // 0 - 100% stress
    pulmonary: number;
    vascular: number;
    metabolic: number;
  };
}

export interface PatientAlert {
  id: string;
  patientId: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  readingsSummary: string;
  category: 'VITALS_OUTLIER' | 'MULTIVARIATE_DECOMPENSATION' | 'MISSING_DATA' | 'TREND_DEVIATION';
  status: 'active' | 'acknowledged' | 'resolved';
  recommendedGuidance: string;
}

export interface DemoPatient {
  id: string;
  fullName: string;
  age: number;
  gender: 'Female' | 'Male' | 'Non-Binary';
  avatarInitials: string;
  primaryCondition: string;
  riskCategory: 'Low' | 'Moderate' | 'High';
  medicalHistory: string[];
  medications: { name: string; dosage: string; frequency: string; adherence: number }[];
  allergies: string[];
  wearableDevice: string;
  batteryLevel: number;
  baseline: VitalBaseline;
  recentTelemetry: VitalReading[];
  historicalReadings: VitalReading[];
  latestAnomalyReport?: AnomalyReport;
  summaryNotes: string;
}

export interface WhatIfParameters {
  sleepHoursDelta: number; // -4 to +4 hours
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'vigorous'; // step multiplier
  medicationAdherencePct: number; // 0 - 100%
  acuteStressLevel: 'low' | 'moderate' | 'high'; // stress autonomic response
  hydrationLevel: 'dehydrated' | 'adequate' | 'optimal';
  simulateRespiratoryInfection: boolean;
}

export interface SimulationForecastPoint {
  timeOffsetHours: number;
  timestamp: string;
  baselineHR: number;
  simulatedHR: number;
  baselineSystolicBP: number;
  simulatedSystolicBP: number;
  baselineSpO2: number;
  simulatedSpO2: number;
  simulatedStress: number;
  riskScore: number;
}

export interface SimulationResult {
  scenarioName: string;
  parameters: WhatIfParameters;
  forecastPoints: SimulationForecastPoint[];
  projectedRiskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  riskScoreDelta: number; // e.g. -15% or +28%
  physiologicalInsights: string[];
  disclaimer: string;
}
