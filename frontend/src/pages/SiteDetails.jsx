import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRiverGuard } from '../context/RiverGuardContext';
import Icon from '../components/common/Icon';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const SiteDetails = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const { sites, alerts } = useRiverGuard();

  const site = sites.find(s => s.id === siteId) || sites[0];
  const siteAlerts = alerts.filter(a => a.siteId === site.id);

  // Volume history data
  const volumeHistory = [
    { month: 'Apr', volume: 1800 },
    { month: 'May', volume: 2400 },
    { month: 'Jun', volume: 3200 },
    { month: 'Jul', volume: 6800 },
    { month: 'Aug', volume: 14200 },
    { month: 'Sep', volume: 38400 }
  ];

  // Timeline nodes (Section 7.5: Normal -> Minor Change -> Suspicious Change -> High-Risk Alert)
  const timelineNodes = [
    {
      date: '12 May 2026',
      status: 'Normal Baseline Observation',
      badgeLevel: 'LOW',
      sensor: 'Sentinel-2A MSI',
      detail: 'Riverbed morphology stable. Concession boundaries demarcated in green.',
      icon: 'check_circle',
      color: '#16a34a'
    },
    {
      date: '28 Jun 2026',
      status: 'Minor Seasonal Shift Detected',
      badgeLevel: 'LOW',
      sensor: 'PlanetScope 3m',
      detail: 'Minor sediment accumulation on southern sandbar spit. Flow within historical velocity.',
      icon: 'info',
      color: '#006398'
    },
    {
      date: '14 Aug 2026',
      status: 'Suspicious Change Flagged — Pending Review',
      badgeLevel: 'MEDIUM',
      sensor: 'Sentinel-2B MSI',
      detail: 'Localized surface reflectance change. Mechanical crawler tracks identified near buffer.',
      icon: 'warning',
      color: '#d97706'
    },
    {
      date: '20 Sep 2026',
      status: 'High-Confidence Anomaly Detected',
      badgeLevel: 'HIGH',
      sensor: 'PlanetScope + Sentinel-1 SAR',
      detail: 'Deep pit bathymetric deficit of -38,400 m³ detected. Encroachment beyond authorized lease limits.',
      icon: 'priority_high',
      color: '#dc2626'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header & Navigation Breadcrumb */}
      <div className="pb-3 border-b border-outline-variant/20 flex items-start justify-between flex-wrap gap-4">
        <div>
          <nav className="flex items-center gap-2 font-label-code text-label-code-sm text-on-surface-variant mb-2">
            <Link to="/sites" className="hover:text-primary hover:underline">
              Monitoring Sites
            </Link>
            <span>/</span>
            <span className="font-bold text-secondary">{site.id}</span>
          </nav>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-headline font-bold text-headline-md text-on-surface">
              {site.siteName}
            </h1>
            <Badge kind="risk" level={site.risk} />
            <Badge kind="workflow-status">{site.leaseStatus}</Badge>
          </div>

          <div className="font-label-code text-label-code-sm text-on-surface-variant flex items-center gap-3 mt-1.5 flex-wrap">
            <span>River Basin: <strong className="text-on-surface font-semibold">{site.river}</strong></span>
            <span>·</span>
            <span>District: <strong className="text-on-surface font-semibold">{site.district}</strong></span>
            <span>·</span>
            <span className="text-secondary font-medium">{site.latitude?.toFixed(4)}°N, {site.longitude?.toFixed(4)}°E</span>
            <span>·</span>
            <span>Last Pass: {site.lastObservation} ({site.lastPassOrbit})</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon="compare"
            onClick={() => navigate(`/detection/${site.id}`)}
          >
            Open Detection Analysis
          </Button>
        </div>
      </div>

      {/* 2. Two-Column Block: Pinned Illustrated River-Map & Latest Satellite Pass */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Pinned Mini-Map Vector Graphic (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icon name="pin_drop" size={20} className="text-secondary" />
              <h3 className="font-headline font-semibold text-headline-sm text-on-surface">
                Geofence Perimeter & Hydrological Reach
              </h3>
            </div>
            <span className="font-label-code text-label-code-sm px-2.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
              Zone UTM 44N
            </span>
          </div>

          <div className="h-56 w-full rounded-lg bg-[#eaf2fd] border border-outline-variant/40 relative overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 400 180" className="w-full h-full">
              <path
                d="M 0,50 C 90,30 160,110 240,90 C 300,75 350,35 400,50 L 400,140 C 340,150 280,120 220,135 C 150,150 70,110 0,120 Z"
                fill="#4a92de"
              />
              <ellipse cx="210" cy="110" rx="45" ry="25" fill="#d7c797" />
              {site.risk === 'HIGH' && (
                <g>
                  <circle cx="210" cy="110" r="14" fill="#dc2626" opacity="0.25" className="animate-ping" />
                  <circle cx="210" cy="110" r="6" fill="#dc2626" stroke="#fff" strokeWidth="2" />
                  <rect x="165" y="85" width="90" height="50" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,2" />
                </g>
              )}
            </svg>
            <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur px-2.5 py-1 rounded font-label-code text-label-code-xs text-on-surface font-semibold shadow-sm">
              Monitored Reach: {site.siteName}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-outline-variant/20 grid grid-cols-3 gap-2 font-label-code text-label-code-sm">
            <div>
              <span className="text-on-surface-variant text-label-code-xs block">SURVEILLANCE GEOFENCE</span>
              <span className="text-on-surface font-semibold">{site.areaSqM?.toLocaleString()} m²</span>
            </div>
            <div>
              <span className="text-on-surface-variant text-label-code-xs block">SENSOR STREAM</span>
              <span className="text-secondary font-semibold">{site.sensor}</span>
            </div>
            <div>
              <span className="text-on-surface-variant text-label-code-xs block">EST. VOLUMETRIC LOSS</span>
              <span className="text-risk-high font-bold">{site.estimatedDepletionVolumeM3?.toLocaleString()} m³</span>
            </div>
          </div>
        </div>

        {/* Latest Satellite Pass Thumbnail & Quick Action (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon name="satellite_alt" size={20} className="text-secondary" />
                <h3 className="font-headline font-semibold text-headline-sm text-on-surface">
                  Latest Multi-Spectral Pass
                </h3>
              </div>
              <span className="font-label-code text-label-code-sm text-on-surface-variant">
                {site.lastObservation}
              </span>
            </div>

            <div className="h-44 w-full rounded-lg bg-[#1e293b] border border-outline-variant/40 relative overflow-hidden flex items-center justify-center p-4 text-center">
              <div className="space-y-1 font-label-code text-white">
                <span className="text-secondary-container font-semibold text-label-code-sm block">
                  PlanetScope 3m Orthoimagery + SAR InSAR
                </span>
                <p className="text-headline-sm font-bold text-white">
                  Orbit {site.lastPassOrbit}
                </p>
                <p className="text-label-code-xs text-white/70">
                  Cloud Cover: {(site.cloudCover * 100).toFixed(1)}% · Incident Anomaly Detected
                </p>
              </div>
            </div>

            <p className="text-body-sm text-on-surface-variant mt-3 leading-relaxed">
              {site.summary}
            </p>
          </div>

          <div className="pt-3 border-t border-outline-variant/20">
            <Button
              variant="primary"
              icon="compare"
              onClick={() => navigate(`/detection/${site.id}`)}
              className="w-full justify-center"
            >
              Open Detection Analysis →
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Historical Detection Timeline (Connected vertical nodes per Section 7.5) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="history" size={20} className="text-secondary" />
          <h3 className="font-headline font-bold text-headline-sm text-on-surface">
            Historical Detection Timeline
          </h3>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/40">
          {timelineNodes.map((node, i) => (
            <div key={i} className="relative flex items-start gap-4">
              {/* Timeline Node Dot */}
              <div
                className="absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-surface-container-lowest flex items-center justify-center shadow-sm"
                style={{ backgroundColor: node.color }}
              >
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              {/* Node Card */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-headline font-bold text-body-md text-on-surface">
                      {node.status}
                    </span>
                    <Badge kind="risk" level={node.badgeLevel} />
                  </div>
                  <span className="font-label-code text-label-code-sm text-on-surface-variant">
                    {node.date} · {node.sensor}
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {node.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Estimated Extraction Volume History Chart */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon name="bar_chart" size={20} className="text-secondary" />
            <h3 className="font-headline font-bold text-headline-sm text-on-surface">
              Estimated Extraction Volume History (Monthly Aggregation)
            </h3>
          </div>
          <span className="font-label-code text-label-code-sm text-on-surface-variant">
            Unit: Cubic Meters (m³)
          </span>
        </div>

        <div className="h-52 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eff4ff" vertical={false} />
              <XAxis dataKey="month" stroke="#757684" fontSize={11} fontFamily="JetBrains Mono" />
              <YAxis stroke="#757684" fontSize={11} fontFamily="JetBrains Mono" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip />
              <Bar dataKey="volume" fill="#00288e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SiteDetails;
