import React, { useState } from 'react';
import { DemoPatient, PatientAlert } from '../../types/health';
import { NavRoute } from './Sidebar';
import {
  ChevronDown,
  Play,
  Pause,
  Upload,
  Zap,
  CheckCircle2,
  Bell,
  Clock,
  Sparkles,
  User,
} from 'lucide-react';

interface TopNavProps {
  currentRoute: NavRoute;
  patients: DemoPatient[];
  selectedPatient: DemoPatient;
  onSelectPatient: (patient: DemoPatient) => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  streamingSpeed: number;
  onChangeSpeed: (speed: number) => void;
  onInjectAnomaly: () => void;
  onOpenCsvModal: () => void;
  activeAlertCount: number;
  onNavigateToInsights: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentRoute,
  patients,
  selectedPatient,
  onSelectPatient,
  isStreaming,
  onToggleStreaming,
  streamingSpeed,
  onChangeSpeed,
  onInjectAnomaly,
  onOpenCsvModal,
  activeAlertCount,
  onNavigateToInsights,
}) => {
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  const getPageTitle = (route: NavRoute) => {
    switch (route) {
      case 'overview':
        return 'Overview';
      case 'digital_twin':
        return 'My Digital Twin';
      case 'timeline':
        return 'Health Trends';
      case 'insights':
        return 'AI Insights';
      case 'whatif':
        return 'Scenario Lab';
      case 'reports':
        return 'Clinical Reports';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-[#E8EDEB] px-6 flex items-center justify-between gap-4">
      {/* 1. Page Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-[#202B33] tracking-tight">
          {getPageTitle(currentRoute)}
        </h1>
        <span className="text-[#E8EDEB]">|</span>
        <div className="flex items-center gap-1.5 text-xs text-[#77838D]">
          <Clock className="w-3.5 h-3.5 text-[#27866F]" />
          <span>Synced {isStreaming ? 'just now' : 'paused'}</span>
        </div>
      </div>

      {/* 2. Patient Selector, Controls & Actions */}
      <div className="flex items-center gap-3">
        {/* Patient Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPatientDropdown(!showPatientDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E8EDEB] bg-[#F7F9F8] hover:bg-[#EFF3F1] hover:border-[#D5DFDC] transition-colors text-xs font-medium text-[#202B33]"
          >
            <span className="w-5 h-5 rounded-full bg-[#E6F2ED] text-[#27866F] font-bold text-[10px] font-mono flex items-center justify-center">
              {selectedPatient.avatarInitials}
            </span>
            <span className="font-medium">{selectedPatient.fullName}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-white border border-[#E8EDEB] text-[#77838D]">
              {selectedPatient.age}y
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#77838D]" />
          </button>

          {showPatientDropdown && (
            <div className="absolute right-0 top-full mt-1.5 w-60 rounded-xl shadow-card-hover border border-[#E8EDEB] bg-white p-1.5 z-50">
              <div className="px-2.5 py-1 text-[10px] uppercase font-semibold text-[#77838D] tracking-wider">
                Select Patient Profile
              </div>
              {patients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectPatient(p);
                    setShowPatientDropdown(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                    p.id === selectedPatient.id
                      ? 'bg-[#E6F2ED] text-[#27866F] font-semibold'
                      : 'text-[#202B33] hover:bg-[#F7F9F8]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#E6F2ED] text-[#27866F] font-mono font-bold text-[10px] flex items-center justify-center">
                      {p.avatarInitials}
                    </span>
                    <div>
                      <span className="block">{p.fullName}</span>
                      <span className="text-[10px] text-[#77838D] block truncate max-w-[120px]">
                        {p.primaryCondition}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      p.riskCategory === 'High'
                        ? 'bg-[#FEE2E2] text-[#DC2626]'
                        : p.riskCategory === 'Moderate'
                        ? 'bg-[#FEF3C7] text-[#D97706]'
                        : 'bg-[#E6F2ED] text-[#27866F]'
                    }`}
                  >
                    {p.riskCategory}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Stream Controller */}
        <div className="flex items-center border border-[#E8EDEB] rounded-lg bg-[#F7F9F8] p-0.5 text-xs font-mono">
          <button
            onClick={onToggleStreaming}
            className={`px-2 py-1 rounded-md flex items-center gap-1 transition-colors ${
              isStreaming
                ? 'bg-white text-[#27866F] font-semibold shadow-xs'
                : 'text-[#77838D] hover:text-[#202B33]'
            }`}
            title={isStreaming ? 'Pause streaming simulation' : 'Resume streaming'}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3 h-3 text-[#27866F]" />
                <span className="text-[11px]">Live</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span className="text-[11px]">Paused</span>
              </>
            )}
          </button>

          <button
            onClick={() => onChangeSpeed(streamingSpeed === 1 ? 2 : streamingSpeed === 2 ? 5 : 1)}
            className="px-1.5 py-1 text-[11px] text-[#77838D] hover:text-[#202B33] font-semibold"
            title="Playback Speed"
          >
            {streamingSpeed}x
          </button>
        </div>

        {/* Outlier Trigger */}
        <button
          onClick={onInjectAnomaly}
          className="px-2.5 py-1.5 rounded-lg border border-[#FDE68A] bg-[#FEF3C7] text-[#D97706] hover:bg-[#FDE68A] text-xs font-medium flex items-center gap-1.5 transition-colors"
          title="Simulate outlier telemetry event (arrhythmia/hypoxemia)"
        >
          <Zap className="w-3 h-3 text-[#D97706]" />
          <span className="hidden sm:inline">Simulate Outlier</span>
        </button>

        {/* CSV Upload */}
        <button
          onClick={onOpenCsvModal}
          className="px-2.5 py-1.5 rounded-lg border border-[#E8EDEB] bg-white text-[#202B33] hover:bg-[#F7F9F8] text-xs font-medium flex items-center gap-1.5 transition-colors"
          title="Upload Wearable CSV Telemetry"
        >
          <Upload className="w-3 h-3 text-[#77838D]" />
          <span className="hidden md:inline">Import CSV</span>
        </button>

        {/* Active Insights Notification Bell */}
        <button
          onClick={onNavigateToInsights}
          className="relative p-2 rounded-lg border border-[#E8EDEB] text-[#77838D] hover:text-[#202B33] hover:bg-[#F7F9F8] transition-colors"
          title="View active AI insights"
        >
          <Bell className="w-4 h-4" />
          {activeAlertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D97706]" />
          )}
        </button>
      </div>
    </header>
  );
};
