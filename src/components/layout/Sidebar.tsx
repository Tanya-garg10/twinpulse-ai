import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  TrendingUp,
  Sparkles,
  FlaskConical,
  FileText,
  Activity,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export type NavRoute = 'overview' | 'digital_twin' | 'timeline' | 'insights' | 'whatif' | 'reports';

interface SidebarProps {
  currentRoute: NavRoute;
  onRouteChange: (route: NavRoute) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeAlertCount: number;
  onOpenArchitecture: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onRouteChange,
  isCollapsed,
  onToggleCollapse,
  activeAlertCount,
  onOpenArchitecture,
}) => {
  const navItems = [
    { id: 'overview' as NavRoute, label: 'Overview', icon: LayoutDashboard },
    { id: 'digital_twin' as NavRoute, label: 'My Digital Twin', icon: UserCheck },
    { id: 'timeline' as NavRoute, label: 'Health Trends', icon: TrendingUp },
    {
      id: 'insights' as NavRoute,
      label: 'AI Insights',
      icon: Sparkles,
      badge: activeAlertCount > 0 ? activeAlertCount : undefined,
    },
    { id: 'whatif' as NavRoute, label: 'Scenario Lab', icon: FlaskConical },
    { id: 'reports' as NavRoute, label: 'Reports', icon: FileText },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen transition-all duration-200 flex flex-col justify-between bg-white border-r border-[#E8EDEB] text-[#202B33] ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-[#E8EDEB]">
          <button
            onClick={() => onRouteChange('overview')}
            className="flex items-center gap-2.5 text-left focus:outline-none overflow-hidden group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#27866F] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Activity className="w-4 h-4 stroke-[2.2]" />
            </div>
            {!isCollapsed && (
              <div className="leading-tight">
                <span className="font-semibold text-sm tracking-tight text-[#202B33] block">
                  TwinPulse AI
                </span>
                <span className="text-[11px] text-[#77838D]">
                  Digital Health Twin
                </span>
              </div>
            )}
          </button>

          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            className="p-1 rounded-md text-[#77838D] hover:text-[#202B33] hover:bg-[#F7F9F8] transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onRouteChange(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#E6F2ED] text-[#27866F] font-semibold'
                    : 'text-[#77838D] hover:text-[#202B33] hover:bg-[#F7F9F8]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#27866F]' : 'text-[#77838D]'}`} />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {!isCollapsed && item.badge !== undefined && (
                  <span className="ml-auto px-1.5 py-0.2 text-[10px] font-mono font-semibold rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Meta Zone */}
      <div className="p-2.5 border-t border-[#E8EDEB] space-y-2">
        {!isCollapsed && (
          <button
            onClick={onOpenArchitecture}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] text-[#77838D] hover:text-[#202B33] hover:bg-[#F7F9F8] transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#27866F]" />
              <span>Model Specs</span>
            </span>
            <span className="font-mono text-[10px] text-[#77838D]">Isolation Forest</span>
          </button>
        )}

        {/* Clinician Account Capsule */}
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#F7F9F8] border border-[#E8EDEB]">
          <div className="w-6 h-6 rounded-full bg-[#E6F2ED] text-[#27866F] text-[10px] font-bold font-mono flex items-center justify-center shrink-0">
            TV
          </div>
          {!isCollapsed && (
            <div className="leading-none overflow-hidden">
              <span className="text-xs font-semibold text-[#202B33] block truncate">
                Dr. Taylor Vance
              </span>
              <span className="text-[10px] text-[#77838D] block mt-0.5">
                Clinical Lead
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
