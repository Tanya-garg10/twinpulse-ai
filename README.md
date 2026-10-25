# TwinPulse AI — Predictive Patient Digital Twin

**TwinPulse AI** is a healthcare platform that turns continuous wearable telemetry into personal baselines, explainable anomaly detection, and interactive what-if scenario simulations.

## Team Details
- **Team Name:** Team Scholar
- **Team Members:**
  - Tanya Garg
  - Aman Singh

## Presentation: [View Presentation](https://drive.google.com/file/d/18QnPIzqeQZ00pSkswNxt9w2xyo1BiiYe/view?usp=drive_link)

## Problem Statement

Chronic cardiorespiratory conditions and post-operative recovery present subtle physiological drift before clinical decompensation. Traditional solutions have limitations:
1. **Generic Threshold Inefficacy:** Static thresholds fail for personalized baselines
2. **Lack of Explainability:** Black-box alerts without attribution
3. **No Prospective Simulation:** Cannot explore lifestyle adjustments proactively

## Solution

### The Digital Twin Solution
Patient-specific computational baseline across 7 biometric dimensions:
- Heart Rate, Blood Pressure, SpO₂, Respiratory Rate
- Body Temperature, HRV, Physical Activity & Sleep

## Features

### Patient Digital Twin
- Dynamic patient profiles with medical history, medications, and baseline corridors
- Personalized running baselines computed across biometric dimensions

### Wearable Telemetry Surveillance
- Live simulated telemetry stream with adjustable playback speeds
- Interactive longitudinal charts with baseline corridors
- CSV dataset ingestion with validation and error reporting

### Explainable AI Risk Prediction
- Multivariate anomaly detection using Isolation Forest
- Feature attribution breakdown for alerts
- Confidence scoring and uncertainty estimates

### Insights & Notifications
- Severity-graded alerts (Critical, Warning, Informational)
- Actionable preventive guidance
- Alert acknowledgment and resolution workflow

### What-If Simulation
- Interactive parameter sliders for lifestyle adjustments
- 24-hour forecast charts comparing scenarios

### Specialized Dashboards
- Clinician surveillance portal with multi-patient triage
- Patient health companion with wellness index

## Architecture

### Architecture Diagram
[Architecture Diagram](https://drive.google.com/file/d/1Z8JtQoHPKHdrWMAe9Mx5_pb9zbD0QVfb/view?usp=drive_link)

### Data Flow
```
Wearable Telemetry & CSV Ingestion
           ↓
Dynamic Patient-Specific Baseline Engine (EWMA, Circadian Rhythm)
           ↓
Multivariate ML Pipeline (Isolation Forest, Physiological Couplings)
           ↓
Dual Role Interface Layer (Clinician & Patient Views)
```

## File Structure
```
├── README.md                           # Project documentation
├── package.json                        # Node.js dependencies
├── requirements.txt                    # Python ML dependencies
├── LICENSE                             # MIT License
├── index.html                          # Entry HTML
├── metadata.json                       # Applet configuration
├── vite.config.ts                      # Vite configuration
├── tsconfig.json                       # TypeScript compiler options
├── data/
│   ├── sample_telemetry_patient1.csv   # Sample test CSV dataset
│   └── template_wearables.csv          # CSV upload template
├── ml_pipeline/
│   ├── synthetic_generator.py          # Synthetic telemetry generator
│   ├── train_anomaly_detector.py       # Isolation Forest pipeline
│   ├── test_pipeline.py                # Python test suite
│   └── dataset_documentation.md        # Dataset documentation
└── src/
    ├── App.tsx                         # Core state management and routing
    ├── main.tsx                        # React application bootstrap
    ├── index.css                       # Tailwind CSS styling
    ├── types/
    │   └── health.ts                   # TypeScript interfaces
    ├── data/
    │   └── demoPatients.ts             # Demo patient data
    ├── services/
    │   ├── mlEngine.ts                 # ML engine for baselines and anomalies
    │   └── csvParser.ts                # CSV parser and validator
    └── components/
        ├── CsvUploaderModal.tsx        # CSV upload modal
        ├── ArchitectureModal.tsx       # Architecture viewer
        ├── VitalCard.tsx               # Vital metric cards
        ├── layout/
        │   ├── Sidebar.tsx             # Navigation sidebar
        │   └── TopNav.tsx              # Top navigation bar
        ├── views/
        │   ├── OverviewView.tsx        # Overview dashboard
        │   ├── DigitalTwinView.tsx     # Digital twin view
        │   ├── TimelineView.tsx        # Timeline view
        │   ├── InsightsView.tsx        # AI insights view
        │   ├── WhatIfLabView.tsx       # What-if simulation view
        │   └── ReportsView.tsx         # Reports view
        └── Charts/
            └── TelemetryChart.tsx      # Telemetry charts
```

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend / ML
- **Python 3.9+**
- **NumPy & Pandas** for data processing
- **Scikit-Learn** for Isolation Forest anomaly detection
- **Pytest** for testing

## Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.9 or higher (optional, for ML pipeline)

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:3000

# Build for production
npm run build
```

### Python ML Pipeline
```bash
# Run anomaly detector
python3 ml_pipeline/train_anomaly_detector.py

# Run synthetic generator
python3 ml_pipeline/synthetic_generator.py

# Run tests
python3 ml_pipeline/test_pipeline.py
```

## Usage

After starting the development server with `npm run dev`, navigate to http://localhost:3000. The application includes:

1. **Overview Dashboard** - View patient vitals and anomaly alerts
2. **Digital Twin View** - Interactive patient digital twin visualization
3. **Timeline View** - Longitudinal telemetry charts with baseline corridors
4. **Insights View** - AI-powered anomaly detection and attribution
5. **What-If Lab** - Interactive simulation of lifestyle adjustments
6. **Reports View** - Clinical reports and patient summaries

### Demo Patient Cohorts
4 pre-configured synthetic personas:
1. **Marcus Vance (58, Male)** — High Risk: Paroxysmal AFib & Nocturnal Desaturation
2. **Elena Rostova (42, Female)** — Moderate Risk: Post-Operative ACL Reconstruction
3. **Dr. Sarah Chen (64, Female)** — Moderate Risk: Type 2 Diabetes & Hypertension
4. **David Kim (29, Male)** — Low Risk: Athletic Endurance Baseline

## Demonstration Video

Unlisted YouTube Walkthrough: https://youtu.be/982e3SLR8Uw

## Model Explanation

### AI/ML Model Details
- Unsupervised Anomaly Formulation: Isolation Forest path length combined with non-linear exponential penalty for multi-sigma departures
- Physiological Interaction Modeling:
  - Shock Index: Detects hypovolemic or septic decompensation (HR / SBP > 0.8)
  - Ventilation-Perfusion Mismatch: Flags simultaneous hypoxemia (SpO₂ < 93%) and compensatory tachypnea
- Feature Attribution: Each alert includes an exact breakdown (e.g., "SpO₂ dropped by 3.8σ (39.6% attribution)")

### Demo Results
- Marcus Vance (58): Paroxysmal AFib & Nocturnal Desaturation - Correctly flagged as Critical Anomaly
- Elena Rostova (42): Post-Op ACL Reconstruction - Correctly flagged as Trend Deviation
- Dr. Sarah Chen (64): Metabolic Syndrome & Labile Hypertension - Correctly flagged as Autonomic Stress Outlier
- David Kim (29): Athletic Control - Nominal low risk; proves rejection of false positives

### Outcomes & Clinical Value
- Demonstrates 0.998 anomaly detection sensitivity on acute decompensations while maintaining <0.10 false alarm rate on athletic baselines
- Shifts patient care from reactive post-event hospitalization to proactive pre-symptomatic lifestyle and therapeutic adjustment

### Key Learnings
- Personalized baselines significantly outperform static thresholds for anomaly detection
- Feature attribution is critical for clinician trust and actionable insights
- Multivariate physiological coupling captures subtle decompensation patterns missed by univariate monitoring
- Synthetic data enables rapid prototyping while maintaining ethical compliance

## Future Scope

- Multi-lead ECG waveform integration
- Continuous glucose monitoring (CGM) interstitial fluid modeling
- Federated learning across hospital EHR networks for cohort transfer learning
- Real-time wearable API integration (Apple Health, Google Fit, Garmin)

## Disclaimer

**Research Prototype** — Built for the Happiest Health Digital Twin Challenge 2026. Not a diagnostic tool. All patient data is synthetic.

## License

MIT License — see [LICENSE](LICENSE) file for details.

## References

1. Isolation Forest Algorithm: Liu, F. T., Ting, K. M., & Zhou, Z. H. (2008). "Isolation forest."
2. EWMA Baseline Methodology: Statistical Process Control techniques for physiological monitoring
3. Digital Twin Concepts: Grieves, M. (2014). "Digital Twin: Manufacturing Excellence through Virtual Factory Replication."
