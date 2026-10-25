import { DemoPatient, VitalReading, PatientAlert, SimulationResult, WhatIfParameters } from '../types/health';

export interface FeatherlessConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

const STORAGE_KEY = 'featherless_api_key';
const MODEL_STORAGE_KEY = 'featherless_model';

export const DEFAULT_MODEL = 'Qwen/Qwen2.5-7B-Instruct';
export const DEFAULT_BASE_URL = 'https://api.featherless.ai/v1';

export function getFeatherlessApiKey(): string {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local && local.trim()) return local.trim();
  }
  return (
    (import.meta as any).env?.VITE_FEATHERLESS_API_KEY ||
    (import.meta as any).env?.FEATHERLESS_API_KEY ||
    ''
  );
}

export function setFeatherlessApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, key.trim());
  }
}

export function getFeatherlessModel(): string {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(MODEL_STORAGE_KEY);
    if (local && local.trim()) return local.trim();
  }
  return (import.meta as any).env?.VITE_FEATHERLESS_MODEL || DEFAULT_MODEL;
}

export function setFeatherlessModel(model: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MODEL_STORAGE_KEY, model.trim());
  }
}

export interface ClinicalAnalysisResult {
  headline: string;
  physiologicalMechanism: string;
  differentialRisks: string[];
  clinicalTriage: 'Routine' | 'Urgent Observation' | 'Immediate Clinical Response';
  patientActionableAdvice: string;
  evidenceFactors: string[];
  modelUsed: string;
}

/**
 * Calls Featherless AI chat completions endpoint with structured clinical reasoning
 */
export async function callFeatherlessChat(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  temperature: number = 0.2
): Promise<string> {
  const apiKey = getFeatherlessApiKey();
  const baseUrl = (import.meta as any).env?.VITE_FEATHERLESS_BASE_URL || DEFAULT_BASE_URL;
  const model = getFeatherlessModel();

  if (!apiKey) {
    throw new Error('FEATHERLESS_API_KEY_MISSING');
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: 700,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Featherless API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Generates an in-depth clinical explanation for an anomaly or vital reading
 */
export async function analyzeAnomalyWithFeatherless(
  patient: DemoPatient,
  reading: VitalReading,
  alert?: PatientAlert
): Promise<ClinicalAnalysisResult> {
  const apiKey = getFeatherlessApiKey();

  // If no API key configured, use high-fidelity physiological fallback synthesis
  if (!apiKey) {
    return generateLocalClinicalFallback(patient, reading, alert);
  }

  const prompt = `You are a clinical decision support specialist and digital twin bio-analyst.
Analyze this patient's acute wearable telemetry deviation.

Patient Profile:
- Name: ${patient.fullName}, ${patient.age}yo ${patient.gender}
- Primary Condition: ${patient.primaryCondition}
- Baseline: HR ${patient.baseline.heartRate.mean}+-${patient.baseline.heartRate.std} bpm, BP ${patient.baseline.systolicBP.mean}/${patient.baseline.diastolicBP.mean} mmHg, SpO2 ${patient.baseline.spO2.mean}%
- Current Reading: HR ${reading.heartRate} bpm, BP ${reading.systolicBP}/${reading.diastolicBP} mmHg, SpO2 ${reading.spO2}%, RR ${reading.respiratoryRate} br/min, HRV ${reading.hrv}ms
- Medications: ${patient.medications.map((m) => `${m.name} ${m.dosage}`).join(', ')}
${alert ? `- Triggered Alert: "${alert.title}" - ${alert.message}` : ''}

Respond with strict JSON with these keys:
{
  "headline": "concise 1-sentence clinical summary",
  "physiologicalMechanism": "detailed explanation of underlying autonomic or organ interaction",
  "differentialRisks": ["risk 1", "risk 2", "risk 3"],
  "clinicalTriage": "Routine" | "Urgent Observation" | "Immediate Clinical Response",
  "patientActionableAdvice": "clear guidance for the patient or nursing staff",
  "evidenceFactors": ["vital 1 departure", "vital 2 departure"]
}`;

  try {
    const rawContent = await callFeatherlessChat([
      { role: 'system', content: 'You are an evidence-based clinical digital twin assistant. Always respond with pure valid JSON.' },
      { role: 'user', content: prompt },
    ]);

    const cleanJson = rawContent.replace(/```json\n?|```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    return {
      headline: parsed.headline || 'Telemetry anomaly evaluated',
      physiologicalMechanism: parsed.physiologicalMechanism || 'Cardiorespiratory autonomic response detected.',
      differentialRisks: parsed.differentialRisks || ['Autonomic imbalance', 'Sub-clinical desaturation'],
      clinicalTriage: parsed.clinicalTriage || 'Urgent Observation',
      patientActionableAdvice: parsed.patientActionableAdvice || 'Rest quietly and re-measure telemetry in 15 minutes.',
      evidenceFactors: parsed.evidenceFactors || [`HR: ${reading.heartRate} bpm`, `SpO2: ${reading.spO2}%`],
      modelUsed: getFeatherlessModel(),
    };
  } catch (err) {
    console.warn('Featherless API request failed, falling back to local clinical synthesis:', err);
    return generateLocalClinicalFallback(patient, reading, alert);
  }
}

/**
 * Generates an LLM assessment of What-If scenario projections
 */
export async function analyzeWhatIfWithFeatherless(
  patient: DemoPatient,
  params: WhatIfParameters,
  simulation: SimulationResult
): Promise<string> {
  const apiKey = getFeatherlessApiKey();

  if (!apiKey) {
    return `Simulated 24-hour trajectory indicates a ${simulation.projectedRiskLevel} risk profile (${simulation.riskScoreDelta > 0 ? '+' : ''}${simulation.riskScoreDelta}% relative to baseline). ${simulation.physiologicalInsights.join(' ')} Recommend maintaining regular therapeutic adherence and restorative sleep hygiene.`;
  }

  const prompt = `You are an expert preventive cardiologist and clinical pharmacologist.
Evaluate this 24-hour simulated digital twin forecast for:
Patient: ${patient.fullName} (${patient.primaryCondition})
Modifications:
- Sleep adjustment: ${params.sleepHoursDelta} hours
- Medication Adherence: ${params.medicationAdherencePct}%
- Physical Activity: ${params.activityLevel}
- Sympathetic Stress Burden: ${params.acuteStressLevel}
- Respiratory Infection Challenge: ${params.simulateRespiratoryInfection ? 'YES' : 'NO'}

Projected Outcome:
- Projected Risk Tier: ${simulation.projectedRiskLevel}
- Relative Risk Delta: ${simulation.riskScoreDelta}%
- Algorithmic Insights: ${simulation.physiologicalInsights.join(' ')}

Provide a concise, 3-paragraph clinical assessment:
1. Primary physiological trajectory and organ stress (cardiovascular/pulmonary).
2. Pharmacological vulnerability and autonomic balance.
3. Actionable preventive recommendation for clinical management.`;

  try {
    return await callFeatherlessChat([
      { role: 'system', content: 'You are an advanced digital twin physiological evaluator.' },
      { role: 'user', content: prompt },
    ]);
  } catch (err) {
    return `Projected 24-hour physiological response: ${simulation.physiologicalInsights.join(' ')} (Featherless model: ${getFeatherlessModel()})`;
  }
}

function generateLocalClinicalFallback(
  patient: DemoPatient,
  reading: VitalReading,
  alert?: PatientAlert
): ClinicalAnalysisResult {
  const isHighRisk = reading.spO2 < 91 || reading.heartRate > 120 || reading.systolicBP > 160;
  const isHypoxemic = reading.spO2 < 93;
  const isTachycardic = reading.heartRate > patient.baseline.heartRate.mean + 18;

  return {
    headline: isHighRisk
      ? `Acute multi-vital deviation requiring priority observation for ${patient.fullName}`
      : `Subtle baseline drift flagged during autonomous surveillance for ${patient.fullName}`,
    physiologicalMechanism: isHypoxemic && isTachycardic
      ? 'Ventilation-perfusion divergence triggers sympathetic compensatory tachycardia to maintain peripheral tissue oxygen delivery.'
      : isTachycardic
      ? 'Elevated chronotropic drive with diminished parasympathetic vagal reactivation, narrowing pulse interval reserve.'
      : 'Vascular resistance shift against personal hemodynamic baseline corridor.',
    differentialRisks: [
      isHypoxemic ? 'Nocturnal desaturation or micro-atelectasis' : 'Autonomic hyper-arousal',
      'Sub-therapeutic medication window',
      'Position-dependent respiratory resistance',
    ],
    clinicalTriage: isHighRisk ? 'Immediate Clinical Response' : 'Urgent Observation',
    patientActionableAdvice: 'Assume high-Fowler (seated upright) position, loosen tight clothing around collar, and confirm oximeter probe placement.',
    evidenceFactors: [
      `Heart rate: ${reading.heartRate} bpm (Baseline ${patient.baseline.heartRate.mean} bpm)`,
      `Oxygen saturation: ${reading.spO2}% (Baseline ${patient.baseline.spO2.mean}%)`,
      `Blood pressure: ${reading.systolicBP}/${reading.diastolicBP} mmHg`,
    ],
    modelUsed: `${getFeatherlessModel()} (Local Clinical Engine)`,
  };
}
