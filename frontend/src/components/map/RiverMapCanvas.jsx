import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../common/Icon';
import Badge from '../common/Badge';

export const RiverMapCanvas = ({
  sites = [],
  onSelectSite,
  selectedSiteId = null,
  showMiniVerification = true,
  height = 'h-[520px]'
}) => {
  const navigate = useNavigate();

  // Map state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [spectralBand, setSpectralBand] = useState('Optical RGB'); // 'Optical RGB' | 'NDWI Water Index' | 'SAR Dredge Coherence' | 'DEM Elevation Loss'
  const [showDualTemporal, setShowDualTemporal] = useState(false);
  const [showPolygonMask, setShowPolygonMask] = useState(true);
  const [hoveredSite, setHoveredSite] = useState(null);
  const [activeSite, setActiveSite] = useState(
    sites.find(s => s.id === selectedSiteId) || sites[0] || null
  );

  // Band visual themes
  const bandThemes = {
    'Optical RGB': {
      bg: '#eaf2fd',
      riverFill: '#4a92de',
      riverStroke: '#2563eb',
      sandFill: '#d7c797',
      contourStroke: '#94a3b8',
      anomalyFill: 'rgba(220, 38, 38, 0.45)',
      anomalyStroke: '#dc2626'
    },
    'NDWI Water Index': {
      bg: '#0f172a',
      riverFill: '#06b6d4',
      riverStroke: '#0891b2',
      sandFill: '#1e293b',
      contourStroke: '#334155',
      anomalyFill: 'rgba(244, 63, 94, 0.55)',
      anomalyStroke: '#f43f5e'
    },
    'SAR Dredge Coherence': {
      bg: '#18181b',
      riverFill: '#27272a',
      riverStroke: '#3f3f46',
      sandFill: '#52525b',
      contourStroke: '#71717a',
      anomalyFill: 'rgba(234, 179, 8, 0.65)',
      anomalyStroke: '#eab308'
    },
    'DEM Elevation Loss': {
      bg: '#f1f5f9',
      riverFill: '#38bdf8',
      riverStroke: '#0284c7',
      sandFill: '#fde047',
      contourStroke: '#cbd5e1',
      anomalyFill: 'rgba(185, 28, 28, 0.6)',
      anomalyStroke: '#b91c1c'
    }
  };

  const theme = bandThemes[spectralBand] || bandThemes['Optical RGB'];

  const handleZoom = (direction) => {
    if (direction === 'in') setZoomLevel(prev => Math.min(prev + 0.25, 2.0));
    if (direction === 'out') setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
    if (direction === 'reset') setZoomLevel(1);
  };

  const handleSiteClick = (site) => {
    setActiveSite(site);
    if (onSelectSite) onSelectSite(site);
  };

  // Sites map coordinate offsets for illustrated river path
  const siteCoordinates = [
    { id: 'KV-MOH-04', x: 260, y: 190 },
    { id: 'GD-RJM-02', x: 420, y: 220 },
    { id: 'SB-GHT-01', x: 610, y: 175 },
    { id: 'KV-TRC-08', x: 180, y: 250 },
    { id: 'NM-HSH-03', x: 330, y: 310 },
    { id: 'CH-DHP-01', x: 520, y: 290 },
    { id: 'KV-SLM-02', x: 140, y: 160 },
    { id: 'GD-BHM-05', x: 480, y: 140 },
    { id: 'MH-CTK-05', x: 680, y: 260 },
    { id: 'KV-ERD-01', x: 210, y: 340 }
  ];

  const currentPopupSite = hoveredSite || activeSite;

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
      {/* Canvas Header */}
      <div className="px-5 py-3.5 border-b border-outline-variant/20 flex items-center justify-between flex-wrap gap-3 bg-surface-container-low/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Icon name="radar" size={20} className="text-secondary" />
            <h3 className="font-headline font-semibold text-headline-sm text-on-surface">
              Live Hydrological Radar Canvas
            </h3>
          </div>
          <span className="font-label-code text-label-code-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
            Scale 1:25,000
          </span>
          <span className="font-label-code text-label-code-sm text-on-surface-variant flex items-center gap-1.5">
            <Icon name="satellite_alt" size={16} className="text-secondary" />
            Sentinel-2B Pass: Today 09:42 UTC · Cloud Cover: 1.2%
          </span>
        </div>

        {/* Header Actions / Band Selector */}
        <div className="flex items-center gap-2.5">
          {/* Spectral Band Selector */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded-lg border border-outline-variant/60">
            <span className="font-label-code text-label-code-sm text-on-surface-variant">Band:</span>
            <select
              value={spectralBand}
              onChange={(e) => setSpectralBand(e.target.value)}
              className="bg-transparent font-label-code text-label-code-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="Optical RGB">Optical RGB</option>
              <option value="NDWI Water Index">NDWI Water Index</option>
              <option value="SAR Dredge Coherence">SAR Dredge Coherence</option>
              <option value="DEM Elevation Loss">DEM Elevation Loss</option>
            </select>
          </div>

          {/* Dual Temporal Toggle */}
          <button
            onClick={() => setShowDualTemporal(!showDualTemporal)}
            className={`px-3 py-1 rounded-lg font-label-code text-label-code-sm font-medium border transition-colors flex items-center gap-1.5 ${
              showDualTemporal
                ? 'bg-primary-container text-on-primary border-primary-container'
                : 'bg-surface-container-low text-on-surface border-outline-variant/60 hover:bg-surface-container'
            }`}
          >
            <Icon name="vertical_split" size={16} />
            Side-by-Side Dual Temporal View
          </button>

          {/* Polygon Mask Toggle */}
          <button
            onClick={() => setShowPolygonMask(!showPolygonMask)}
            className={`px-3 py-1 rounded-lg font-label-code text-label-code-sm font-medium border transition-colors flex items-center gap-1.5 ${
              showPolygonMask
                ? 'bg-secondary text-on-secondary border-secondary'
                : 'bg-surface-container-low text-on-surface border-outline-variant/60 hover:bg-surface-container'
            }`}
          >
            <Icon name="polyline" size={16} />
            Draw Polygon Mask
          </button>
        </div>
      </div>

      {/* Main Radar Viewport */}
      <div className={`relative ${height} w-full overflow-hidden select-none`} style={{ backgroundColor: theme.bg }}>
        {/* Zoom Controls Overlay (Top-Left) */}
        <div className="absolute top-4 left-4 z-20 flex flex-col rounded-lg bg-surface-container-lowest/90 backdrop-blur shadow-md border border-outline-variant/40 overflow-hidden">
          <button
            onClick={() => handleZoom('in')}
            className="p-2 text-on-surface hover:bg-surface-container hover:text-primary transition-colors border-b border-outline-variant/30"
            title="Zoom In"
          >
            <Icon name="add" size={18} />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-2 text-on-surface hover:bg-surface-container hover:text-primary transition-colors border-b border-outline-variant/30"
            title="Zoom Out"
          >
            <Icon name="remove" size={18} />
          </button>
          <button
            onClick={() => handleZoom('reset')}
            className="p-2 text-on-surface hover:bg-surface-container hover:text-primary transition-colors"
            title="Reset Scale"
          >
            <Icon name="crop_free" size={18} />
          </button>
        </div>

        {/* AI Confidence Top Badge */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-lowest/90 backdrop-blur shadow-md border border-outline-variant/40 font-label-code text-label-code-sm">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-on-surface font-semibold">AI Automated Confidence: 94.6%</span>
          <span className="text-on-surface-variant text-label-code-xs">· DeepHydro-SandNet v4.2</span>
        </div>

        {/* Illustrated Vector River Map Canvas */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 860 460"
            className="w-full h-full"
            style={{ minWidth: '860px', minHeight: '460px' }}
          >
            <defs>
              {/* Bathymetric depth gradient */}
              <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={theme.riverFill} stopOpacity="0.85" />
                <stop offset="50%" stopColor={theme.riverFill} stopOpacity="0.95" />
                <stop offset="100%" stopColor={theme.riverStroke} stopOpacity="0.9" />
              </linearGradient>

              {/* Sandbar texture pattern */}
              <pattern id="sandHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke={theme.contourStroke} strokeWidth="1" strokeOpacity="0.4" />
              </pattern>

              {/* Disturbed Pit Polygon Pattern */}
              <pattern id="pitHatch" width="6" height="6" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="6" stroke="#dc2626" strokeWidth="1.5" strokeOpacity="0.7" />
              </pattern>
            </defs>

            {/* Subtle GIS grid coordinates */}
            <g stroke={theme.contourStroke} strokeWidth="0.5" strokeDasharray="4,6" opacity="0.4">
              <line x1="50" y1="0" x2="50" y2="460" />
              <line x1="200" y1="0" x2="200" y2="460" />
              <line x1="350" y1="0" x2="350" y2="460" />
              <line x1="500" y1="0" x2="500" y2="460" />
              <line x1="650" y1="0" x2="650" y2="460" />
              <line x1="800" y1="0" x2="800" y2="460" />
              <line x1="0" y1="80" x2="860" y2="80" />
              <line x1="0" y1="180" x2="860" y2="180" />
              <line x1="0" y1="280" x2="860" y2="280" />
              <line x1="0" y1="380" x2="860" y2="380" />
            </g>

            {/* Geodetic Coordinate text labels */}
            <text x="60" y="24" fill={theme.contourStroke} fontSize="10" fontFamily="JetBrains Mono">11°12'N / 78°05'E</text>
            <text x="360" y="24" fill={theme.contourStroke} fontSize="10" fontFamily="JetBrains Mono">11°08'N / 78°14'E</text>
            <text x="660" y="24" fill={theme.contourStroke} fontSize="10" fontFamily="JetBrains Mono">11°02'N / 78°25'E</text>

            {/* River Floodplain / Riparian Corridor Buffer */}
            <path
              d="M 20,130 C 140,110 210,170 300,160 C 400,150 470,90 570,110 C 670,130 740,210 840,200 L 840,310 C 740,320 670,250 570,260 C 470,270 390,380 290,360 C 190,340 120,290 20,280 Z"
              fill={theme.sandFill}
              fillOpacity="0.45"
            />

            {/* Main Natural Meandering Riverbed */}
            <path
              d="M 0,160 C 120,130 190,210 280,200 C 380,190 450,120 560,140 C 670,160 720,260 860,240 L 860,290 C 720,310 650,220 550,200 C 440,180 370,260 270,250 C 170,240 110,210 0,220 Z"
              fill="url(#riverGradient)"
              stroke={theme.riverStroke}
              strokeWidth="2"
            />

            {/* Flow Streamline Vectors */}
            <path
              d="M 20,190 C 130,170 190,230 280,225 C 380,215 450,155 560,170 C 660,185 730,280 840,265"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeDasharray="8,12"
              opacity="0.6"
            />

            {/* Sandbars (sediment spits inside bends) */}
            <ellipse cx="260" cy="190" rx="36" ry="18" fill={theme.sandFill} stroke={theme.contourStroke} strokeWidth="1" />
            <ellipse cx="430" cy="225" rx="48" ry="22" fill={theme.sandFill} stroke={theme.contourStroke} strokeWidth="1" />
            <ellipse cx="610" cy="180" rx="40" ry="16" fill={theme.sandFill} stroke={theme.contourStroke} strokeWidth="1" />

            {/* Hazard Boundary Polygon Overlay (when toggled) */}
            {showPolygonMask && (
              <g>
                {/* Active extraction trench at Mohanur Sector 4 */}
                <polygon
                  points="235,180 280,172 295,198 250,208"
                  fill={theme.anomalyFill}
                  stroke={theme.anomalyStroke}
                  strokeWidth="2"
                  strokeDasharray="4,2"
                />
                <polygon
                  points="235,180 280,172 295,198 250,208"
                  fill="url(#pitHatch)"
                />
                <text x="240" y="166" fill="#dc2626" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono">
                  FLAGGED TRENCH: -3.85m
                </text>

                {/* Secondary disturbance at Rajahmundry Reach */}
                <polygon
                  points="395,210 445,205 460,235 410,242"
                  fill={theme.anomalyFill}
                  stroke={theme.anomalyStroke}
                  strokeWidth="2"
                  strokeDasharray="4,2"
                />
              </g>
            )}

            {/* Interactive Site Markers */}
            {siteCoordinates.map((coord) => {
              const site = sites.find(s => s.id === coord.id) || {
                id: coord.id,
                siteName: coord.id,
                risk: 'LOW',
                estimatedDepletionVolumeM3: 12000
              };

              const isSelected = activeSite?.id === site.id;
              const isHovered = hoveredSite?.id === site.id;
              const isHighRisk = site.risk === 'HIGH';
              const isMediumRisk = site.risk === 'MEDIUM';

              const markerColor = isHighRisk ? '#dc2626' : isMediumRisk ? '#d97706' : '#16a34a';

              return (
                <g
                  key={site.id}
                  className="cursor-pointer transition-transform duration-150"
                  onClick={() => handleSiteClick(site)}
                  onMouseEnter={() => setHoveredSite(site)}
                  onMouseLeave={() => setHoveredSite(null)}
                >
                  {/* Pulsing beacon circle for High Risk */}
                  {isHighRisk && (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={isSelected ? "22" : "16"}
                      fill={markerColor}
                      opacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer selection ring */}
                  {(isSelected || isHovered) && (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="14"
                      fill="none"
                      stroke={markerColor}
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Core marker dot */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isSelected ? "7" : "6"}
                    fill={markerColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />

                  {/* Mini ID Label */}
                  <text
                    x={coord.x}
                    y={coord.y + 18}
                    textAnchor="middle"
                    fill="#0b1c30"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="JetBrains Mono"
                    className="drop-shadow-sm select-none"
                  >
                    {site.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Floating Incident Popup Card (Hover/Select) */}
        {currentPopupSite && (
          <div className="absolute bottom-12 left-5 z-30 max-w-sm w-80 bg-surface-container-lowest/95 backdrop-blur-md rounded-xl shadow-lg border border-outline-variant/50 p-3.5 animate-in fade-in duration-150">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-label-code text-label-code-sm font-semibold text-primary">
                    {currentPopupSite.id}
                  </span>
                  <Badge kind="risk" level={currentPopupSite.risk} />
                </div>
                <h4 className="font-headline font-semibold text-body-lg text-on-surface mt-1 line-clamp-1">
                  {currentPopupSite.siteName}
                </h4>
              </div>
              <button
                onClick={() => setHoveredSite(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 text-body-sm font-label-code bg-surface-container-low p-2 rounded-lg">
              <div>
                <span className="text-on-surface-variant text-label-code-sm block">COORDINATES</span>
                <span className="text-on-surface font-medium text-label-code-sm">
                  {currentPopupSite.latitude?.toFixed(4)}°N, {currentPopupSite.longitude?.toFixed(4)}°E
                </span>
              </div>
              <div>
                <span className="text-on-surface-variant text-label-code-sm block">EST. VOLUMETRIC DEFICIT</span>
                <span className="text-risk-high font-semibold text-label-code-sm">
                  {currentPopupSite.estimatedDepletionVolumeM3?.toLocaleString()} m³
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-body-sm text-on-surface-variant">
                {currentPopupSite.detectedChangesCount} changes logged
              </span>
              <button
                onClick={() => navigate(`/detection/${currentPopupSite.id}`)}
                className="font-label-code text-label-code-sm font-medium text-secondary hover:text-primary flex items-center gap-1 hover:underline"
              >
                Inspect AI Imagery <Icon name="arrow_forward" size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Dual Temporal Split Screen Mode Overlay */}
        {showDualTemporal && (
          <div className="absolute top-14 left-1/2 bottom-12 w-0.5 bg-secondary-container z-20 flex flex-col items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center shadow-md font-label-code text-label-code-sm">
              ⇄
            </div>
            <div className="absolute top-2 -left-28 bg-surface-container-lowest/90 px-2 py-1 rounded text-label-code-sm font-label-code text-on-surface shadow-sm">
              Baseline Pass (T-33d)
            </div>
            <div className="absolute top-2 left-4 bg-surface-container-lowest/90 px-2 py-1 rounded text-label-code-sm font-label-code text-on-surface shadow-sm">
              Current Radar Pass (T0)
            </div>
          </div>
        )}
      </div>

      {/* Map Legend & Summary Bar */}
      <div className="px-5 py-2.5 bg-surface-container-low/60 border-t border-outline-variant/20 flex items-center justify-between text-body-sm flex-wrap gap-2">
        <div className="flex items-center gap-5 font-label-code text-label-code-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-risk-high" />
            <span className="text-on-surface font-medium">High Risk / Suspicious (7)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-risk-medium" />
            <span className="text-on-surface font-medium">Under Observation (18)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-risk-low" />
            <span className="text-on-surface font-medium">Safe / Permitted (117)</span>
          </div>
        </div>

        <div className="font-label-code text-label-code-sm text-on-surface-variant flex items-center gap-2">
          <span>Inference Latency: 1.4s</span>
          <span>·</span>
          <span>Coverage: 98.4% Basin Reach</span>
        </div>
      </div>

      {/* Embedded Multi-Temporal Change Detection Verification Mini-Panel (Section 7.1) */}
      {showMiniVerification && (
        <div className="p-4 bg-surface-container-low/30 border-t border-outline-variant/30 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
              <Icon name="compare" size={20} />
            </div>
            <div>
              <h4 className="font-headline font-semibold text-body-md text-on-surface">
                Multi-Temporal Change Detection Verification
              </h4>
              <p className="font-label-code text-label-code-sm text-on-surface-variant">
                Sentinel-2 MSI (18 Aug 2026) vs PlanetScope 3m Fusion (20 Sep 2026)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tone-compliant callout label per Section 1: "Delta: -14,200 m² — Change Detected" */}
            <div className="px-3 py-1 rounded-lg bg-risk-high-bg border border-risk-high/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-risk-high" />
              <span className="font-label-code text-label-code-sm font-semibold text-risk-high-text">
                Delta: -14,200 m² — Change Detected
              </span>
            </div>

            <button
              onClick={() => navigate('/detection/KV-MOH-04')}
              className="px-3 py-1 bg-primary-container hover:bg-primary text-on-primary font-label-code text-label-code-sm font-medium rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              Open Full Forensic View <Icon name="arrow_forward" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiverMapCanvas;
