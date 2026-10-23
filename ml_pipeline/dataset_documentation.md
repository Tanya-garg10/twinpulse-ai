# Dataset Documentation & Methodology
## Happiest Health Digital Twin Challenge 2026

### 1. Dataset Overview & Attribution
To guarantee complete patient privacy, avoid committing any Protected Health Information (PHI/PII), and provide 100% reproducible testing across judges and peer researchers, the Predictive Patient Digital Twin platform utilizes **reproducible synthetic physiological time-series datasets**.

- **Synthetic Generator Code**: `ml_pipeline/synthetic_generator.py`
- **Data License**: Creative Commons Zero (CC0) / MIT Open Source
- **Generation Frequency**: 30-minute to 1-minute high-frequency intervals across 24h to 48h observation windows
- **Clinical Alignment**: Parameterized using published clinical reference corridors from the American Heart Association (AHA), Global Initiative for Chronic Obstructive Lung Disease (GOLD), and autonomic literature on HRV (RMSSD).

---

### 2. Biometric Dimensions & Physiological Validations
All generated and ingested time-series adhere to realistic biological boundaries and diurnal circadian oscillations:

| Metric | Dimension | Valid Adult Bounds | Healthy Baseline Range | Circadian Pattern |
| :--- | :--- | :--- | :--- | :--- |
| **Heart Rate** | bpm | 30 – 220 | 60 – 85 (Athletic: 45–55) | Peak: 14:00–16:00, Trough: 04:00–06:00 |
| **Systolic BP** | mmHg | 70 – 240 | 110 – 130 | Diurnal dip during restorative NREM sleep |
| **Diastolic BP** | mmHg | 40 – 140 | 70 – 85 | Correlated with vascular resistance |
| **SpO₂ (Oximetry)** | % | 70 – 100 | 95 – 100 | Stable; desaturations flagged below 93% |
| **Respiratory Rate**| breaths/min | 8 – 40 | 12 – 18 | Coupled with autonomic sympathetic tone |
| **Core Temperature**| °C | 35.0 – 41.5 | 36.5 – 37.3 | Circadian amplitude ±0.3°C |
| **HRV (RMSSD)** | ms | 10 – 150 | 35 – 80 | Higher during parasympathetic rest |

---

### 3. Patient Personas & Anomaly Profiles
Four demo cohorts are pre-parameterized to test clinical surveillance capabilities:

1. **Marcus Vance (Age 58, Male)** - *High Risk*
   - Paroxysmal AFib & Nocturnal Desaturation (SpO₂ drops to 89.5% with tachycardia 118 bpm).
   - Demonstrates multi-vital desaturation coupling and elevated Shock Index.
2. **Elena Rostova (Age 42, Female)** - *Moderate Risk*
   - Post-Operative ACL Reconstruction Day 6.
   - Demonstrates sub-febrile temperature elevation (37.9°C) and inflammatory pulse rise.
3. **Dr. Sarah Chen (Age 64, Female)** - *Moderate Risk*
   - Type 2 Diabetes & Labile Essential Hypertension.
   - Demonstrates sympathetic stress-reactive blood pressure surges (164 mmHg).
4. **David Kim (Age 29, Male)** - *Low Risk*
   - Marathon runner athletic baseline (Resting HR 48–52 bpm, HRV 78 ms).
   - Serves as the negative control comparator model.

---

### 4. Responsible AI & Medical Device Disclaimer
This dataset and the associated ML models are designed exclusively for research, education, and algorithmic benchmarking in the Happiest Health Challenge 2026. The prototype does not diagnose medical conditions, predict medical emergencies with clinical certainty, or replace medical devices.
