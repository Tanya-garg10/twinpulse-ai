#!/usr/bin/env python3
"""
Unit Test Suite for Predictive Patient Digital Twin ML Pipeline
Happiest Health Digital Twin Challenge 2026
"""

import unittest
from train_anomaly_detector import compute_baseline_stats, extract_features, score_anomaly
from synthetic_generator import generate_patient_telemetry


class TestPatientDigitalTwinPipeline(unittest.TestCase):
    def setUp(self):
        # Generate 48 hours of synthetic patient baseline telemetry
        self.telemetry = generate_patient_telemetry(hours_count=48)
        self.baseline = compute_baseline_stats(self.telemetry)

    def test_baseline_calculation(self):
        """Verifies that baseline statistics fall within expected physiological bounds."""
        hr_mean, hr_std = self.baseline["heart_rate"]
        self.assertTrue(55 <= hr_mean <= 85, f"Unrealistic baseline HR mean: {hr_mean}")
        self.assertTrue(1.0 <= hr_std <= 12.0, f"Unrealistic baseline HR std: {hr_std}")

        spo2_mean, spo2_std = self.baseline["spo2"]
        self.assertTrue(94 <= spo2_mean <= 100, f"Unrealistic baseline SpO2 mean: {spo2_mean}")

    def test_nominal_reading_low_risk(self):
        """Verifies that readings conforming to baseline yield low anomaly scores."""
        normal_reading = {
            "heart_rate": self.baseline["heart_rate"][0],
            "systolic_bp": self.baseline["systolic_bp"][0],
            "diastolic_bp": self.baseline["diastolic_bp"][0],
            "spo2": self.baseline["spo2"][0],
            "respiratory_rate": self.baseline["respiratory_rate"][0],
            "body_temp_c": self.baseline["body_temp_c"][0],
            "hrv_ms": self.baseline["hrv_ms"][0],
        }
        features = extract_features(normal_reading, self.baseline)
        score, _ = score_anomaly(features)
        self.assertLess(score, 0.35, f"Normal reading scored as anomaly: {score}")

    def test_multivariate_anomaly_detection(self):
        """Verifies that simultaneous tachycardia and hypoxemia trigger high anomaly alert."""
        acute_event = {
            "heart_rate": 128.0,
            "systolic_bp": 145.0,
            "diastolic_bp": 92.0,
            "spo2": 89.0,
            "respiratory_rate": 24.0,
            "body_temp_c": 37.2,
            "hrv_ms": 18.0,
        }
        features = extract_features(acute_event, self.baseline)
        score, attributions = score_anomaly(features)
        self.assertGreaterEqual(score, 0.70, f"Critical anomaly missed: {score}")
        self.assertIn("z_spo2", attributions)
        self.assertIn("z_heart_rate", attributions)

    def test_what_if_boundaries(self):
        """Verifies data shape and continuity in synthetic generator."""
        data = generate_patient_telemetry(hours_count=24)
        self.assertEqual(len(data), 48)  # 48 intervals for 24h
        for pt in data:
            self.assertTrue(pt["spo2"] <= 100.0)
            self.assertTrue(pt["heart_rate"] > 30.0)


if __name__ == "__main__":
    unittest.main()
