#!/usr/bin/env python3
"""
Predictive Patient Digital Twin - Synthetic Telemetry Generator
Happiest Health Digital Twin Challenge 2026

Generates realistic time-series data modeling circadian variations,
autonomic noise, and targeted clinical anomalies (arrhythmia, nocturnal
desaturation, febrile response, and hypertensive spikes).
"""

import math
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional


def generate_patient_telemetry(
    base_hr: float = 72.0,
    base_sys: float = 120.0,
    base_dia: float = 80.0,
    base_spo2: float = 98.0,
    base_rr: float = 16.0,
    base_temp: float = 36.8,
    base_hrv: float = 45.0,
    hours_count: int = 48,
    anomaly_window: Optional[Dict[str, float]] = None,
) -> List[Dict]:
    """Generates continuous timestamped wearable telemetry points."""
    readings = []
    end_time = datetime(2026, 10, 20, 10, 30, 0)
    start_time = end_time - timedelta(hours=hours_count)

    for i in range(hours_count * 2):  # 30-min intervals
        current_time = start_time + timedelta(minutes=i * 30)
        hour = current_time.hour

        # Circadian diurnal oscillation
        circadian = math.sin(((hour - 6) / 24.0) * 2.0 * math.pi)
        noise = (math.sin(i * 0.7) + math.cos(i * 1.3)) * 0.5

        hr = base_hr + circadian * 4.0 + noise * 1.5
        sys = base_sys + circadian * 5.0 + noise * 2.0
        dia = base_dia + circadian * 3.0 + noise * 1.2
        spo2 = base_spo2 - max(0.0, circadian * -0.4) + noise * 0.15
        rr = base_rr + circadian * 1.0 + noise * 0.3
        temp = base_temp + circadian * 0.2 + noise * 0.04
        hrv = base_hrv - circadian * 4.0 - noise * 2.0

        is_anomaly = False
        if anomaly_window:
            start_h = anomaly_window.get("start_hour", 36)
            end_h = start_h + anomaly_window.get("duration_hours", 4)
            current_elapsed_h = i * 0.5
            if start_h <= current_elapsed_h < end_h:
                is_anomaly = True
                hr += anomaly_window.get("hr_delta", 35.0)
                sys += anomaly_window.get("sys_delta", 20.0)
                spo2 += anomaly_window.get("spo2_delta", -7.0)
                temp += anomaly_window.get("temp_delta", 0.2)
                hrv -= 16.0

        readings.append(
            {
                "timestamp": current_time.isoformat() + "Z",
                "heart_rate": round(hr, 1),
                "systolic_bp": round(sys, 1),
                "diastolic_bp": round(dia, 1),
                "spo2": round(min(100.0, max(80.0, spo2)), 1),
                "respiratory_rate": round(max(8.0, rr), 1),
                "body_temp_c": round(temp, 2),
                "hrv_ms": round(max(10.0, hrv), 1),
                "is_anomaly": is_anomaly,
            }
        )

    return readings


if __name__ == "__main__":
    data = generate_patient_telemetry(hours_count=24)
    print(f"Generated {len(data)} continuous telemetry records.")
    print("Sample record:", data[-1])
