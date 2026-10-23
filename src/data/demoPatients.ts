import { DemoPatient, VitalReading, VitalBaseline } from '../types/health';
import { calculateBaseline, analyzeReading } from '../services/mlEngine';

/**
 * Utility to generate synthetic timestamped readings with realistic circadian variability and optional anomaly events
 */
function generateTimeSeries(
  baseHR: number,
  baseSys: number,
  baseDia: number,
  baseSpO2: number,
  baseRR: number,
  baseTemp: number,
  baseHRV: number,
  hoursCount: number = 48,
  anomalyConfig?: {
    startHour: number;
    durationHours: number;
    hrDelta: number;
    sysDelta: number;
    spO2Delta: number;
    tempDelta: number;
  }
): VitalReading[] {
  const readings: VitalReading[] = [];
  const now = new Date('2026-10-20T10:30:00Z');

  for (let i = hoursCount; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 3600 * 1000);
    const hourOfDay = timestamp.getUTCHours();

    // Circadian variation (higher in afternoon, lower in early morning)
    const circadian = Math.sin(((hourOfDay - 6) / 24) * 2 * Math.PI);
    const randomNoise = (Math.sin(i * 12.3) + Math.cos(i * 7.9)) * 0.5;

    let hr = baseHR + circadian * 4 + randomNoise * 2;
    let sys = baseSys + circadian * 5 + randomNoise * 2.5;
    let dia = baseDia + circadian * 3 + randomNoise * 1.5;
    let spo2 = baseSpO2 - Math.max(0, circadian * -0.5) + randomNoise * 0.2;
    let rr = baseRR + circadian * 1.2 + randomNoise * 0.4;
    let temp = baseTemp + circadian * 0.25 + randomNoise * 0.05;
    let hrv = baseHRV - circadian * 5 - randomNoise * 3;

    // Check if within anomaly window
    let isAnomaly = false;
    if (anomalyConfig && i >= anomalyConfig.startHour && i < anomalyConfig.startHour + anomalyConfig.durationHours) {
      isAnomaly = true;
      hr += anomalyConfig.hrDelta;
      sys += anomalyConfig.sysDelta;
      spo2 += anomalyConfig.spO2Delta;
      temp += anomalyConfig.tempDelta;
      hrv -= 14;
    }

    readings.push({
      timestamp: timestamp.toISOString(),
      heartRate: Number(hr.toFixed(1)),
      systolicBP: Number(sys.toFixed(1)),
      diastolicBP: Number(dia.toFixed(1)),
      spO2: Number(Math.min(100, Math.max(82, spo2)).toFixed(1)),
      respiratoryRate: Number(Math.max(8, rr).toFixed(1)),
      bodyTemp: Number(temp.toFixed(2)),
      hrv: Number(Math.max(12, hrv).toFixed(1)),
      steps: Math.max(0, Math.round(circadian > 0 ? (circadian * 600) + Math.random() * 200 : Math.random() * 40)),
      sleepHours: hourOfDay === 7 ? 6.8 : undefined,
      stressScore: Math.round(Math.min(95, Math.max(12, 35 + (hr - baseHR) * 1.2))),
      isSimulated: true,
      isAnomaly,
    });
  }

  return readings;
}

// 1. Marcus Vance - Atrial Arrhythmia & Nocturnal Desaturation
const marcusReadings = generateTimeSeries(76, 134, 86, 96, 17, 36.7, 34, 48, {
  startHour: 2,
  durationHours: 4,
  hrDelta: 38, // tachycardia spike to ~114-118 bpm
  sysDelta: 18,
  spO2Delta: -6.5, // nocturnal desaturation to ~89.5%
  tempDelta: 0.1,
});

const marcusBaseline: VitalBaseline = calculateBaseline(marcusReadings.slice(0, 36));
const marcusLatest = marcusReadings[marcusReadings.length - 1];
const marcusReport = analyzeReading(marcusLatest, marcusBaseline);

// 2. Elena Rostova - Post-op Recovery & Low-grade Febrile Event
const elenaReadings = generateTimeSeries(82, 118, 76, 97.5, 18, 37.1, 42, 48, {
  startHour: 4,
  durationHours: 6,
  hrDelta: 14,
  sysDelta: 8,
  spO2Delta: -1.2,
  tempDelta: 0.9, // low-grade fever to ~38.0°C
});
const elenaBaseline: VitalBaseline = calculateBaseline(elenaReadings.slice(0, 36));
const elenaLatest = elenaReadings[elenaReadings.length - 1];
const elenaReport = analyzeReading(elenaLatest, elenaBaseline);

// 3. Dr. Sarah Chen - Essential Hypertension & Autonomic Strain
const sarahReadings = generateTimeSeries(74, 142, 90, 98, 16, 36.8, 38, 48, {
  startHour: 1,
  durationHours: 5,
  hrDelta: 12,
  sysDelta: 22, // systolic pressure elevated to ~164 mmHg
  spO2Delta: 0,
  tempDelta: 0.1,
});
const sarahBaseline: VitalBaseline = calculateBaseline(sarahReadings.slice(0, 36));
const sarahLatest = sarahReadings[sarahReadings.length - 1];
const sarahReport = analyzeReading(sarahLatest, sarahBaseline);

// 4. David Kim - Athletic Baseline & Optimal Recovery
const davidReadings = generateTimeSeries(52, 114, 72, 99, 13, 36.6, 78, 48);
const davidBaseline: VitalBaseline = calculateBaseline(davidReadings);
const davidLatest = davidReadings[davidReadings.length - 1];
const davidReport = analyzeReading(davidLatest, davidBaseline);

export const DEMO_PATIENTS: DemoPatient[] = [
  {
    id: 'pt-marcus-vance',
    fullName: 'Marcus Vance',
    age: 58,
    gender: 'Male',
    avatarInitials: 'MV',
    primaryCondition: 'Paroxysmal Atrial Fibrillation & Sleep-Disordered Breathing',
    riskCategory: 'High',
    medicalHistory: [
      'Paroxysmal Atrial Fibrillation (Dx 2023)',
      'Obstructive Sleep Apnea (moderate AHI 18)',
      'Stage 1 Essential Hypertension',
      'Mild Hyperlipidemia',
    ],
    medications: [
      { name: 'Metoprolol Tartrate', dosage: '50 mg', frequency: 'Twice daily', adherence: 94 },
      { name: 'Apixaban', dosage: '5 mg', frequency: 'Twice daily', adherence: 98 },
      { name: 'Lisinopril', dosage: '10 mg', frequency: 'Once daily (morning)', adherence: 90 },
      { name: 'Atorvastatin', dosage: '20 mg', frequency: 'Once daily at bedtime', adherence: 88 },
    ],
    allergies: ['Penicillin (urticaria)', 'Sulfa drugs'],
    wearableDevice: 'Apple Watch Series 9 + Continuous Ring Oximeter',
    batteryLevel: 82,
    baseline: marcusBaseline,
    recentTelemetry: marcusReadings.slice(-24),
    historicalReadings: marcusReadings,
    latestAnomalyReport: marcusReport,
    summaryNotes: 'Patient exhibits recurrent early morning tachycardia coupled with nocturnal desaturation episodes. CPAP adherence has been inconsistent (3.2 hrs/night).',
  },
  {
    id: 'pt-elena-rostova',
    fullName: 'Elena Rostova',
    age: 42,
    gender: 'Female',
    avatarInitials: 'ER',
    primaryCondition: 'Day 6 Post-Operative ACL Reconstruction (Infection Watch)',
    riskCategory: 'Moderate',
    medicalHistory: [
      'Left Knee Arthroscopic ACL Reconstruction (Hamstring Autograft, Day 6)',
      'Mild Intermittent Asthma (well controlled)',
      'Prior appendectomy (2018)',
    ],
    medications: [
      { name: 'Acetaminophen / Codeine', dosage: '500/30 mg', frequency: 'Every 6 hrs PRN pain', adherence: 90 },
      { name: 'Celecoxib', dosage: '200 mg', frequency: 'Once daily', adherence: 95 },
      { name: 'Albuterol MDI', dosage: '90 mcg', frequency: '2 puffs PRN wheezing', adherence: 100 },
    ],
    allergies: ['Latex (mild dermatitis)'],
    wearableDevice: 'Whoop 4.0 Biometric Strap',
    batteryLevel: 94,
    baseline: elenaBaseline,
    recentTelemetry: elenaReadings.slice(-24),
    historicalReadings: elenaReadings,
    latestAnomalyReport: elenaReport,
    summaryNotes: 'Surveillance for surgical site deep tissue infection or early systemic inflammatory response. Core temperature trended from 36.9°C to 37.8°C over 12 hours.',
  },
  {
    id: 'pt-sarah-chen',
    fullName: 'Dr. Sarah Chen',
    age: 64,
    gender: 'Female',
    avatarInitials: 'SC',
    primaryCondition: 'Metabolic Syndrome & Labile Essential Hypertension',
    riskCategory: 'Moderate',
    medicalHistory: [
      'Type 2 Diabetes Mellitus (HbA1c 7.1%, no neuropathy)',
      'Labile Essential Hypertension (stress-reactive)',
      'Dyslipidemia',
      'Mild Osteoarthritis (bilateral hands)',
    ],
    medications: [
      { name: 'Metformin XR', dosage: '1000 mg', frequency: 'Twice daily with meals', adherence: 96 },
      { name: 'Amlodipine', dosage: '5 mg', frequency: 'Once daily', adherence: 85 },
      { name: 'Rosuvastatin', dosage: '10 mg', frequency: 'Once daily', adherence: 92 },
    ],
    allergies: ['ACE Inhibitors (persistent dry cough)'],
    wearableDevice: 'Garmin Venu 3 Smartwatch',
    batteryLevel: 67,
    baseline: sarahBaseline,
    recentTelemetry: sarahReadings.slice(-24),
    historicalReadings: sarahReadings,
    latestAnomalyReport: sarahReport,
    summaryNotes: 'High occupational stress correlating with transient systolic pressure elevations reaching 164 mmHg. Fasting glucose stable.',
  },
  {
    id: 'pt-david-kim',
    fullName: 'David Kim',
    age: 29,
    gender: 'Male',
    avatarInitials: 'DK',
    primaryCondition: 'Athletic Recovery & Autonomic Baseline Optimization',
    riskCategory: 'Low',
    medicalHistory: [
      'Endurance Marathon Runner (VO2 Max 56 mL/kg/min)',
      'Physiological sinus bradycardia (asymptomatic baseline resting HR 46-52 bpm)',
      'Seasonal allergic rhinitis',
    ],
    medications: [
      { name: 'Vitamin D3 + K2', dosage: '2000 IU', frequency: 'Daily supplement', adherence: 99 },
      { name: 'Omega-3 EPA/DHA', dosage: '1200 mg', frequency: 'Daily supplement', adherence: 95 },
      { name: 'Cetirizine', dosage: '10 mg', frequency: 'PRN seasonal pollen', adherence: 80 },
    ],
    allergies: ['Tree pollens (birch, cedar)'],
    wearableDevice: 'Oura Ring Gen 3 Horizon',
    batteryLevel: 89,
    baseline: davidBaseline,
    recentTelemetry: davidReadings.slice(-24),
    historicalReadings: davidReadings,
    latestAnomalyReport: davidReport,
    summaryNotes: 'Ideal cardiovascular baseline control. Excellent parasympathetic tone (HRV 78 ms). Serves as healthy comparator model in digital twin evaluation.',
  },
];
