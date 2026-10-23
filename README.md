# TwinPulse AI — Predictive Patient Digital Twin

**TwinPulse AI** is a healthcare platform that turns continuous wearable telemetry into personal baselines, explainable anomaly detection, and interactive what-if scenario simulations.

---

## Team Details
- **Team Name:** Predictive Twin AI
- **Track:** Happiest Health Digital Twin Challenge 2026
- **Affiliation:** Healthcare Technology & AI Systems Lab

---

## 1. Problem Statement & Solution

Chronic cardiorespiratory conditions and post-operative recovery present subtle physiological drift before clinical decompensation. Traditional solutions have limitations:
1. **Generic Threshold Inefficacy:** Static thresholds fail for personalized baselines
2. **Lack of Explainability:** Black-box alerts without attribution
3. **No Prospective Simulation:** Cannot explore lifestyle adjustments proactively

### The Digital Twin Solution
Patient-specific computational baseline across 7 biometric dimensions:
- Heart Rate, Blood Pressure, SpO₂, Respiratory Rate
- Body Temperature, HRV, Physical Activity & Sleep

---

## 2. Core Features

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

---

## 3. Technical Architecture

```
Wearable Telemetry & CSV Ingestion
           ↓
Dynamic Patient-Specific Baseline Engine (EWMA, Circadian Rhythm)
           ↓
Multivariate ML Pipeline (Isolation Forest, Physiological Couplings)
           ↓
Dual Role Interface Layer (Clinician & Patient Views)
```

---

## 4. Directory Structure
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
├── docs/
│   └── presentation.md                 # Hackathon slide deck
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

---

## 5. Local Setup

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

---

## 6. Demo Patient Cohorts

4 pre-configured synthetic personas:
1. **Marcus Vance (58, Male)** — High Risk: Paroxysmal AFib & Nocturnal Desaturation
2. **Elena Rostova (42, Female)** — Moderate Risk: Post-Operative ACL Reconstruction
3. **Dr. Sarah Chen (64, Female)** — Moderate Risk: Type 2 Diabetes & Hypertension
4. **David Kim (29, Male)** — Low Risk: Athletic Endurance Baseline

---

## 7. Disclaimer

**Research Prototype** — Built for the Happiest Health Digital Twin Challenge 2026. Not a diagnostic tool. All patient data is synthetic.

## 8. License

MIT License — see [LICENSE](LICENSE) file for details.

---

## 9. Technical Stack

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

---

## 10. Demo Video

Unlisted YouTube Walkthrough: `https://youtube.com/watch?v=PENDING_CHALLENGE_UPLOAD`

---

## 11. References

1. Isolation Forest Algorithm: Liu, F. T., Ting, K. M., & Zhou, Z. H. (2008). "Isolation forest."
2. EWMA Baseline Methodology: Statistical Process Control techniques for physiological monitoring
3. Digital Twin Concepts: Grieves, M. (2014). "Digital Twin: Manufacturing Excellence through Virtual Factory Replication."
