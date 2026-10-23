import { VitalReading } from '../types/health';

export interface CsvValidationResult {
  isValid: boolean;
  readings: VitalReading[];
  errors: string[];
  warnings: string[];
  totalRows: number;
  validRows: number;
}

export function generateSampleCsvContent(): string {
  const headers = [
    'timestamp',
    'heart_rate',
    'systolic_bp',
    'diastolic_bp',
    'spo2',
    'respiratory_rate',
    'body_temp_c',
    'hrv_ms',
    'steps',
  ];

  const rows = [
    ['2026-10-20T06:00:00Z', '68', '118', '78', '98.5', '14', '36.6', '52', '120'],
    ['2026-10-20T08:00:00Z', '74', '122', '80', '98.0', '15', '36.8', '46', '1450'],
    ['2026-10-20T10:00:00Z', '82', '126', '82', '97.5', '16', '36.9', '40', '3200'],
    ['2026-10-20T12:00:00Z', '78', '124', '81', '98.0', '16', '37.0', '44', '4100'],
    ['2026-10-20T14:00:00Z', '112', '145', '92', '92.0', '22', '37.2', '24', '850'], // anomaly spike
    ['2026-10-20T16:00:00Z', '105', '138', '88', '93.5', '20', '37.1', '28', '600'],
    ['2026-10-20T18:00:00Z', '84', '126', '82', '97.0', '17', '36.9', '38', '5600'],
    ['2026-10-20T20:00:00Z', '72', '120', '79', '98.2', '15', '36.7', '48', '6800'],
  ];

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function parseAndValidateCsv(csvText: string): CsvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const readings: VitalReading[] = [];

  const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length < 2) {
    return {
      isValid: false,
      readings: [],
      errors: ['File is empty or contains only a single header line. At least one row of data is required.'],
      warnings: [],
      totalRows: 0,
      validRows: 0,
    };
  }

  const rawHeaders = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));

  // Header column index matching with aliases
  const findCol = (aliases: string[]) => {
    for (const a of aliases) {
      const idx = rawHeaders.findIndex((h) => h === a || h.includes(a));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const tsIdx = findCol(['timestamp', 'time', 'date', 'datetime']);
  const hrIdx = findCol(['heart_rate', 'heartrate', 'hr', 'pulse', 'bpm']);
  const sysIdx = findCol(['systolic_bp', 'systolic', 'sys', 'bp_sys', 'sbp']);
  const diaIdx = findCol(['diastolic_bp', 'diastolic', 'dia', 'bp_dia', 'dbp']);
  const spo2Idx = findCol(['spo2', 'oxygen', 'oximetry', 'sat']);
  const rrIdx = findCol(['respiratory_rate', 'respiratory', 'rr', 'breaths']);
  const tempIdx = findCol(['body_temp', 'temp', 'temperature', 'celsius']);
  const hrvIdx = findCol(['hrv', 'variability', 'rmssd']);
  const stepsIdx = findCol(['steps', 'step_count', 'activity']);

  if (tsIdx === -1) {
    errors.push("Missing required 'timestamp' column (e.g. 2026-10-20T08:00:00Z).");
  }
  if (hrIdx === -1) {
    errors.push("Missing required 'heart_rate' column (bpm).");
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      readings: [],
      errors,
      warnings,
      totalRows: lines.length - 1,
      validRows: 0,
    };
  }

  let rowCount = 0;

  for (let i = 1; i < lines.length; i++) {
    rowCount++;
    const lineNum = i + 1;
    const cols = lines[i].split(',').map((c) => c.trim().replace(/['"]/g, ''));

    if (cols.length < 2) continue;

    const rawTs = cols[tsIdx];
    const parsedDate = new Date(rawTs);
    if (isNaN(parsedDate.getTime())) {
      errors.push(`Row ${lineNum}: Invalid timestamp format "${rawTs}". Use ISO-8601 (e.g. 2026-10-20T12:00:00Z).`);
      continue;
    }

    const hr = parseFloat(cols[hrIdx]);
    if (isNaN(hr) || hr < 25 || hr > 250) {
      errors.push(`Row ${lineNum}: Heart rate value ${cols[hrIdx]} is physiologically implausible (valid: 25-250 bpm).`);
      continue;
    }

    const sys = sysIdx !== -1 && !isNaN(parseFloat(cols[sysIdx])) ? parseFloat(cols[sysIdx]) : 120;
    if (sys < 50 || sys > 260) {
      warnings.push(`Row ${lineNum}: Extreme systolic BP ${sys} mmHg detected.`);
    }

    const dia = diaIdx !== -1 && !isNaN(parseFloat(cols[diaIdx])) ? parseFloat(cols[diaIdx]) : 80;
    const spo2 = spo2Idx !== -1 && !isNaN(parseFloat(cols[spo2Idx])) ? parseFloat(cols[spo2Idx]) : 98;
    if (spo2 < 60 || spo2 > 100) {
      warnings.push(`Row ${lineNum}: SpO2 reading ${spo2}% is outside standard range.`);
    }

    const rr = rrIdx !== -1 && !isNaN(parseFloat(cols[rrIdx])) ? parseFloat(cols[rrIdx]) : 16;
    const temp = tempIdx !== -1 && !isNaN(parseFloat(cols[tempIdx])) ? parseFloat(cols[tempIdx]) : 36.8;
    const hrv = hrvIdx !== -1 && !isNaN(parseFloat(cols[hrvIdx])) ? parseFloat(cols[hrvIdx]) : 45;
    const steps = stepsIdx !== -1 && !isNaN(parseInt(cols[stepsIdx])) ? parseInt(cols[stepsIdx]) : 0;

    readings.push({
      timestamp: parsedDate.toISOString(),
      heartRate: hr,
      systolicBP: sys,
      diastolicBP: dia,
      spO2: spo2,
      respiratoryRate: rr,
      bodyTemp: temp,
      hrv,
      steps,
      isSimulated: false, // Uploaded real/demo user data marked as measured
    });
  }

  // Sort chronologically
  readings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return {
    isValid: errors.length === 0 && readings.length > 0,
    readings,
    errors,
    warnings,
    totalRows: rowCount,
    validRows: readings.length,
  };
}
