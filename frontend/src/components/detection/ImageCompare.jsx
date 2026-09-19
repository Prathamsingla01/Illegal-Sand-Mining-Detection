import React, { useState, useRef, useEffect } from 'react';
import Icon from '../common/Icon';

export const ImageCompare = ({ detection }) => {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState('Split Comparison'); // 'Split Comparison' | 'AI Difference Heatmap' | 'DEM Depth Relief (3D)'
  const [showHazardBoundary, setShowHazardBoundary] = useState(true);
  const [showEquipmentMarkers, setShowEquipmentMarkers] = useState(true);
  const [showLeaseBorder, setShowLeaseBorder] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const containerRef = useRef(null);

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  useEffect(() => {
    const handleMove = (clientX) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const percentage = Math.max(5, Math.min(95, (offsetX / rect.width) * 100));
      setSliderPos(percentage);
    };

    const handleMouseMove = (e) => handleMove(e.clientX);
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX);
    };

    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
      {/* Top Controls Bar */}
      <div className="px-5 py-3 border-b border-outline-variant/20 flex items-center justify-between flex-wrap gap-3 bg-surface-container-low/30">
        {/* View Mode Tabs */}
        <div className="flex items-center p-1 bg-surface-container-low rounded-lg border border-outline-variant/50">
          {['Split Comparison', 'AI Difference Heatmap', 'DEM Depth Relief (3D)'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded-md font-label-code text-label-code-sm transition-all ${
                viewMode === mode
                  ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Layer Checkboxes */}
        <div className="flex items-center gap-4 font-label-code text-label-code-sm text-on-surface-variant flex-wrap">
          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showHazardBoundary}
              onChange={(e) => setShowHazardBoundary(e.target.checked)}
              className="rounded text-risk-high focus:ring-risk-high"
            />
            <span className="text-on-surface">Hazard Boundary Polygon</span>
          </label>
          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showEquipmentMarkers}
              onChange={(e) => setShowEquipmentMarkers(e.target.checked)}
              className="rounded text-secondary focus:ring-secondary"
            />
            <span className="text-on-surface">Equipment Markers</span>
          </label>
          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showLeaseBorder}
              onChange={(e) => setShowLeaseBorder(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span className="text-on-surface">Permitted Lease Border</span>
          </label>
        </div>

        {/* Zoom & Scale Readout */}
        <div className="flex items-center gap-2">
          <span className="font-label-code text-label-code-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
            Scale: 1:2,500
          </span>
          <div className="flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40 overflow-hidden">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
              className="p-1.5 hover:bg-surface-container text-on-surface"
              title="Zoom In"
            >
              <Icon name="add" size={16} />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
              className="p-1.5 hover:bg-surface-container text-on-surface border-l border-outline-variant/30"
              title="Zoom Out"
            >
              <Icon name="remove" size={16} />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 hover:bg-surface-container text-on-surface border-l border-outline-variant/30"
              title="Reset"
            >
              <Icon name="crop_free" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Draggable Comparison Viewport */}
      <div
        ref={containerRef}
        className="relative h-[480px] w-full overflow-hidden select-none bg-[#111827] cursor-ew-resize"
      >
        {/* Inner scaling container */}
        <div
          className="relative w-full h-full transition-transform duration-100"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* AFTER LAYER (Current pass with disturbance) */}
          <div className="absolute inset-0 overflow-hidden">
            <svg viewBox="0 0 900 480" className="w-full h-full object-cover">
              <defs>
                <linearGradient id="afterWaterGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <pattern id="afterExcavationHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#dc2626" strokeWidth="1.5" strokeOpacity="0.8" />
                </pattern>
                {/* Heatmap gradient */}
                <radialGradient id="heatGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                </radialGradient>
              </defs>

              {/* Background riverbank terrain */}
              <rect width="900" height="480" fill={viewMode === 'DEM Depth Relief (3D)' ? '#1e293b' : '#334155'} />

              {/* Riverbed channel */}
              <path
                d="M 0,100 C 180,80 320,180 500,160 C 680,140 760,60 900,100 L 900,380 C 750,420 620,310 460,330 C 300,350 180,410 0,370 Z"
                fill="url(#afterWaterGrad)"
              />

              {/* Disturbed sandbar (heavily dredged) */}
              <path
                d="M 280,170 C 370,160 480,180 540,240 C 580,280 520,320 420,320 C 320,320 250,260 280,170 Z"
                fill="#b45309"
                opacity="0.8"
              />

              {/* Deep Excavation Pit with red hazard fill */}
              {viewMode !== 'AI Difference Heatmap' ? (
                <g>
                  <ellipse cx="400" cy="245" rx="95" ry="55" fill="rgba(220, 38, 38, 0.45)" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,3" />
                  <ellipse cx="400" cy="245" rx="95" ry="55" fill="url(#afterExcavationHatch)" />
                </g>
              ) : (
                /* Heatmap Overlay View */
                <ellipse cx="400" cy="245" rx="120" ry="70" fill="url(#heatGradient)" />
              )}

              {/* Permitted Lease Border (Green polygon) */}
              {showLeaseBorder && (
                <g>
                  <rect
                    x="240"
                    y="150"
                    width="180"
                    height="130"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeDasharray="6,4"
                  />
                  <text x="245" y="166" fill="#22c55e" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">
                    PERMITTED LEASE BOUNDARY
                  </text>
                </g>
              )}

              {/* Hazard Boundary Polygon (Red encroachment line) */}
              {showHazardBoundary && (
                <g>
                  <polygon
                    points="300,190 495,190 520,300 320,305"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2.5"
                  />
                  <text x="330" y="322" fill="#ef4444" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">
                    DETECTED DISTURBANCE: 42,850 m²
                  </text>
                </g>
              )}

              {/* Equipment Markers (Excavators & Dump Trucks) */}
              {showEquipmentMarkers && (
                <g>
                  {/* Excavator 1 */}
                  <circle cx="370" cy="225" r="9" fill="#eab308" stroke="#000" strokeWidth="1.5" />
                  <text x="370" y="228" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">🚜</text>
                  <text x="370" y="244" textAnchor="middle" fill="#fde047" fontSize="9" fontFamily="JetBrains Mono">EXC-01</text>

                  {/* Excavator 2 */}
                  <circle cx="430" cy="250" r="9" fill="#eab308" stroke="#000" strokeWidth="1.5" />
                  <text x="430" y="253" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">🚜</text>
                  <text x="430" y="269" textAnchor="middle" fill="#fde047" fontSize="9" fontFamily="JetBrains Mono">EXC-02</text>

                  {/* Tipper Truck 1 */}
                  <circle cx="475" cy="280" r="9" fill="#38bdf8" stroke="#000" strokeWidth="1.5" />
                  <text x="475" y="283" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">🚚</text>
                  <text x="475" y="299" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="JetBrains Mono">TRK-08</text>
                </g>
              )}
            </svg>
          </div>

          {/* BEFORE LAYER (Clipped by draggable slider) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <svg viewBox="0 0 900 480" className="w-full h-full object-cover">
              <defs>
                <linearGradient id="beforeWaterGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>

              {/* Natural pristine riverbank terrain */}
              <rect width="900" height="480" fill="#334155" />

              {/* Riverbed channel */}
              <path
                d="M 0,100 C 180,80 320,180 500,160 C 680,140 760,60 900,100 L 900,380 C 750,420 620,310 460,330 C 300,350 180,410 0,370 Z"
                fill="url(#beforeWaterGrad)"
              />

              {/* Natural undisturbed sandbar spit */}
              <path
                d="M 280,170 C 370,160 480,180 540,240 C 580,280 520,320 420,320 C 320,320 250,260 280,170 Z"
                fill="#d97706"
                opacity="0.9"
              />

              {/* Natural braided ripples */}
              <ellipse cx="380" cy="235" rx="75" ry="35" fill="#f59e0b" opacity="0.6" />

              {/* Baseline Lease Border */}
              {showLeaseBorder && (
                <g>
                  <rect
                    x="240"
                    y="150"
                    width="180"
                    height="130"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeDasharray="6,4"
                  />
                  <text x="245" y="166" fill="#22c55e" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">
                    PERMITTED LEASE BOUNDARY
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Floating Info Card: BEFORE (Left Side) */}
        <div className="absolute top-5 left-5 z-20 max-w-xs bg-surface-container-lowest/90 backdrop-blur-md rounded-lg shadow-md border border-outline-variant/50 p-3 pointer-events-none">
          <div className="flex items-center justify-between font-label-code text-label-code-sm mb-1">
            <span className="font-semibold text-secondary">T1: BASELINE OPTICAL PASS</span>
            <span className="text-on-surface-variant">Cloud: 0.8%</span>
          </div>
          <p className="font-headline font-semibold text-body-md text-on-surface">
            {detection.beforeObservation?.date || '18 Aug 2026'}
          </p>
          <p className="font-label-code text-label-code-sm text-on-surface-variant">
            {detection.beforeObservation?.sensor || 'Sentinel-2 MSI (10m)'}
          </p>
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-risk-low-bg text-risk-low-text font-label-code text-label-code-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-risk-low" />
            Pristine Riverbed · No Active Pits
          </div>
        </div>

        {/* Floating Info Card: AFTER (Right Side) */}
        <div className="absolute top-5 right-5 z-20 max-w-xs bg-surface-container-lowest/90 backdrop-blur-md rounded-lg shadow-md border border-outline-variant/50 p-3 pointer-events-none text-right">
          <div className="flex items-center justify-between font-label-code text-label-code-sm mb-1">
            <span className="text-on-surface-variant">Cloud: 1.2%</span>
            <span className="font-semibold text-risk-high">T0: CURRENT RADAR FUSION</span>
          </div>
          <p className="font-headline font-semibold text-body-md text-on-surface">
            {detection.afterObservation?.date || '20 Sep 2026'}
          </p>
          <p className="font-label-code text-label-code-sm text-on-surface-variant">
            {detection.afterObservation?.sensor || 'PlanetScope 3m + Sentinel-1 SAR'}
          </p>
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-risk-high-bg text-risk-high-text font-label-code text-label-code-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-risk-high" />
            Volumetric Deficit: -38,400 m³ (est.)
          </div>
        </div>

        {/* Draggable Vertical Divider & 28px Circular Handle (Section 3 & 7.3) */}
        <div
          className="absolute top-0 bottom-0 z-30 pointer-events-none flex flex-col items-center"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Vertical 2px Divider Line (Secondary color #006398) */}
          <div className="w-0.5 h-full bg-secondary shadow-lg" />

          {/* 28px Circular Handle with Drag Arrows */}
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-secondary border-2 border-white shadow-xl flex items-center justify-center text-white cursor-ew-resize pointer-events-auto hover:scale-110 active:scale-95 transition-transform"
            title="Drag left/right to compare temporal passes"
          >
            <Icon name="compare_arrows" size={18} />
          </div>
        </div>
      </div>

      {/* Bathymetric Elevation Shift Color Legend Strip */}
      <div className="px-5 py-2.5 bg-surface-container-low/80 border-t border-outline-variant/30 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="font-label-code text-label-code-sm text-on-surface font-medium">
            Bathymetric Elevation Shift (Δz):
          </span>
          <div className="flex items-center gap-2">
            <span className="font-label-code text-label-code-sm text-risk-low">0.0m (Stable)</span>
            <div className="w-44 h-3 rounded-full bg-gradient-to-r from-[#16a34a] via-[#eab308] via-[#f97316] to-[#dc2626] border border-outline-variant/40" />
            <span className="font-label-code text-label-code-sm text-risk-high font-bold">-4.1m (Pit Max)</span>
          </div>
        </div>

        <div className="font-label-code text-label-code-sm text-on-surface-variant flex items-center gap-2">
          <span>Sensors: Sentinel-2 MSI + PlanetScope SuperDove</span>
          <span>·</span>
          <span className="text-secondary font-medium">Temporal Shift Interval: 33 Calendar Days</span>
        </div>
      </div>
    </div>
  );
};

export default ImageCompare;
