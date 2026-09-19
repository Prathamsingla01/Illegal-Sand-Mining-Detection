import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRiverGuard } from '../../context/RiverGuardContext';
import Icon from '../common/Icon';

export const Sidebar = () => {
  const { activeAlertsCount } = useRiverGuard();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: 'radar' },
    { to: '/sites', label: 'Monitoring Sites', icon: 'layers' },
    { to: '/detection', label: 'Detection Analysis', icon: 'compare' },
    { to: '/alerts', label: 'Alerts', icon: 'warning', badge: activeAlertsCount },
    { to: '/reports', label: 'Reports', icon: 'description' },
    { to: '/settings', label: 'Settings', icon: 'tune' },
  ];

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-surface-container-lowest border-r border-outline-variant/30 shadow-sm flex flex-col justify-between z-40 select-none">
      <div>
        {/* Emblem & Branding Header */}
        <div className="p-5 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            {/* RiverGuard Emblem Mark (Shield + Wave) */}
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 3L5 7.5v9.5c0 7.8 4.7 12.8 11 14 6.3-1.2 11-6.2 11-14V7.5L16 3z"
                  fill="#00288E"
                  stroke="#5BB8FE"
                  strokeWidth="1.5"
                />
                <path
                  d="M10 18c2-2 4-2 6 0s4 2 6 0"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M10 22c2-2 4-2 6 0s4 2 6 0"
                  stroke="#5BB8FE"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="font-headline font-bold text-headline-sm text-primary tracking-tight leading-tight">
                RiverGuard AI
              </h1>
              <p className="font-label-code text-label-code-sm uppercase tracking-wider text-on-surface-variant font-medium">
                GovTech Hydrology & Intel
              </p>
            </div>
          </div>

          {/* Hydrological Command Status Chip */}
          <div className="mt-3.5 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="font-label-code text-label-code-sm font-medium text-on-surface">
              Hydrological Command
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-body-md transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-medium shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-normal'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full font-label-code text-label-code-sm font-semibold bg-risk-high text-white">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Telemetry Stream Footer Card */}
      <div className="p-4 border-t border-outline-variant/20">
        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-label-code text-label-code-sm uppercase tracking-wider text-on-surface-variant font-medium">
              Telemetry Stream
            </span>
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          </div>
          <p className="font-label-code text-label-code-sm font-semibold text-on-surface">
            Sentinel-2 & PlanetScope
          </p>
          <div className="mt-1 flex items-center justify-between text-label-code-sm text-on-surface-variant">
            <span className="text-secondary font-medium">Live Synced</span>
            <span>18m ago</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
