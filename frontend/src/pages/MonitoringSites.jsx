import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRiverGuard } from '../context/RiverGuardContext';
import { DISTRICT_OPTIONS, LEASE_STATUS_OPTIONS, SORT_OPTIONS } from '../data/mockData';
import StatCard from '../components/common/StatCard';
import Icon from '../components/common/Icon';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

export const MonitoringSites = () => {
  const navigate = useNavigate();
  const { sites, addGeofence, addToast } = useRiverGuard();

  // State
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [filterRiver, setFilterRiver] = useState('');
  const [filterRisk, setFilterRisk] = useState('All Levels');
  const [filterDistrict, setFilterDistrict] = useState('All Jurisdictions');
  const [filterLeaseStatus, setFilterLeaseStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Highest Risk First');

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [newRiver, setNewRiver] = useState('Kaveri River');
  const [newDistrict, setNewDistrict] = useState('Namakkal');
  const [newLeaseStatus, setNewLeaseStatus] = useState('Permitted / Compliant');

  // Filter logic
  let filtered = sites.filter(s => {
    if (filterRiver && !s.siteName.toLowerCase().includes(filterRiver.toLowerCase()) && !s.river.toLowerCase().includes(filterRiver.toLowerCase())) {
      return false;
    }
    if (filterRisk === 'High Risk Only (Red)' && s.risk !== 'HIGH') return false;
    if (filterRisk === 'Medium Risk' && s.risk !== 'MEDIUM') return false;
    if (filterRisk === 'Low-Safe' && s.risk !== 'LOW') return false;

    if (filterDistrict !== 'All Jurisdictions' && s.district !== filterDistrict) return false;

    if (filterLeaseStatus === 'Unpermitted-Unauthorized (Under Review)' && !s.leaseStatus.includes('Unauthorized')) return false;
    if (filterLeaseStatus === 'Permitted-Compliant' && !s.leaseStatus.includes('Permitted')) return false;
    if (filterLeaseStatus === 'Expired-Suspended' && !s.leaseStatus.includes('Expired')) return false;

    return true;
  });

  // Sort logic
  filtered.sort((a, b) => {
    if (sortBy === 'Highest Risk First') {
      const weight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return (weight[b.risk] || 0) - (weight[a.risk] || 0);
    }
    if (sortBy === 'Extraction Volume Desc') {
      return (b.estimatedDepletionVolumeM3 || 0) - (a.estimatedDepletionVolumeM3 || 0);
    }
    if (sortBy === 'Latest Satellite Pass') {
      return new Date(b.lastObservation) - new Date(a.lastObservation);
    }
    return a.siteName.localeCompare(b.siteName);
  });

  const handleCreateSite = () => {
    if (!newSiteName.trim()) {
      addToast('Validation Error', 'Please enter a site or reach name.', 'error');
      return;
    }
    addGeofence({
      siteName: newSiteName,
      river: newRiver,
      district: newDistrict,
      leaseStatus: newLeaseStatus,
      areaSqM: 32000
    });
    setShowAddModal(false);
    setNewSiteName('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header (Section 7.2) */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-headline font-bold text-headline-md text-on-surface">
              Riverbed Monitoring Sites
            </h2>
            <span className="font-label-code text-label-code-sm px-2.5 py-0.5 rounded-full bg-surface-container text-secondary font-semibold border border-outline-variant/40">
              142 Active Geofences
            </span>
            <span className="font-label-code text-label-code-sm px-2.5 py-0.5 rounded-full bg-risk-low-bg text-risk-low-text font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-risk-low" />
              Telemetry Polling: Active
            </span>
          </div>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Automated multi-spectral temporal geofences monitoring sand accretion, extraction morphology, and statutory boundary limits.
          </p>
        </div>

        {/* View Toggle & Add CTA */}
        <div className="flex items-center gap-3">
          {/* Segmented View Toggle */}
          <div className="flex items-center bg-surface-container-low p-1 rounded-lg border border-outline-variant/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Grid View"
            >
              <Icon name="grid_view" size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${
                viewMode === 'table'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Table View"
            >
              <Icon name="table_rows" size={18} />
            </button>
          </div>

          <Button
            variant="primary"
            icon="add"
            onClick={() => setShowAddModal(true)}
          >
            Add Monitored Site / Draw Geofence
          </Button>
        </div>
      </div>

      {/* 2. Four Stat Cards (Section 7.2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Breach Detections"
          value="19 Sites"
          icon="warning"
          trend={{ text: '+4 today', positive: false }}
          footerRight="Priority Investigation Required"
        />

        <StatCard
          label="Total Sand Extraction Est."
          value="84,600 m³"
          icon="layers"
          subtext="Last 48h observation window"
          footerRight="Across all monitored basins"
        />

        <StatCard
          label="Valid Permitted Operations"
          value="88 Leases"
          icon="verified_user"
          trend={{ text: '94.1% compliance', positive: true }}
          footerRight="Certified environmental clearances"
        />

        <StatCard
          label="Active UAV Sorties"
          value="6 Patrols"
          icon="flight_takeoff"
          subtext="Mohanur & Chambal Units"
          footerRight="Real-time live flight telemetry"
        />
      </div>

      {/* 3. Filter Row (Section 7.2) */}
      <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/30 flex items-center justify-between flex-wrap gap-3">
        {/* River text search */}
        <div className="relative w-64">
          <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={filterRiver}
            onChange={(e) => setFilterRiver(e.target.value)}
            placeholder="Filter by river name..."
            className="w-full pl-9 pr-3 py-1.5 text-body-sm bg-surface-container-low border border-outline-variant/50 rounded-lg text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-secondary"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Risk Level Dropdown */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/50">
            <span className="font-label-code text-label-code-xs text-on-surface-variant">Risk:</span>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-transparent font-label-code text-label-code-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="All Levels">All Levels</option>
              <option value="High Risk Only (Red)">High Risk Only (Red)</option>
              <option value="Medium Risk">Medium Risk</option>
              <option value="Low-Safe">Low-Safe</option>
            </select>
          </div>

          {/* District Dropdown */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/50">
            <span className="font-label-code text-label-code-xs text-on-surface-variant">District:</span>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="bg-transparent font-label-code text-label-code-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
            >
              {DISTRICT_OPTIONS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Lease Status Dropdown (relabeled per Section 1) */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/50">
            <span className="font-label-code text-label-code-xs text-on-surface-variant">Lease:</span>
            <select
              value={filterLeaseStatus}
              onChange={(e) => setFilterLeaseStatus(e.target.value)}
              className="bg-transparent font-label-code text-label-code-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Unpermitted-Unauthorized (Under Review)">Unpermitted / Unauthorized (Under Review)</option>
              <option value="Permitted-Compliant">Permitted / Compliant</option>
              <option value="Expired-Suspended">Expired / Suspended</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/50">
            <Icon name="sort" size={16} className="text-on-surface-variant" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-label-code text-label-code-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Site Cards Grid (3 Columns on Desktop) or Table View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((site) => (
            <div
              key={site.id}
              className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 hover:border-secondary transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Site ID (mono) + District Chip + Risk Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-label-code text-label-code-sm font-bold text-primary">
                      {site.id}
                    </span>
                    <span className="font-label-code text-label-code-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                      {site.district}
                    </span>
                  </div>
                  <Badge kind="risk" level={site.risk} />
                </div>

                {/* Site/River Name & Coordinates */}
                <h3 className="font-headline font-bold text-body-lg text-on-surface line-clamp-1">
                  {site.siteName}
                </h3>
                <div className="font-label-code text-label-code-sm text-on-surface-variant flex items-center justify-between mt-0.5">
                  <span>{site.river}</span>
                  <span className="text-secondary">{site.latitude?.toFixed(4)}°N, {site.longitude?.toFixed(4)}°E</span>
                </div>

                {/* Thumbnail Map Graphic with 2 overlay chips */}
                <div className="mt-3.5 h-36 w-full rounded-lg bg-[#eaf2fd] border border-outline-variant/40 relative overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 280 140" className="w-full h-full">
                    {/* Illustrated river curve */}
                    <path
                      d="M 0,40 C 70,20 120,90 180,80 C 220,70 250,30 280,40 L 280,110 C 230,120 180,90 120,110 C 70,125 30,80 0,90 Z"
                      fill="#4a92de"
                    />
                    {site.risk === 'HIGH' && (
                      <ellipse cx="140" cy="75" rx="30" ry="18" fill="rgba(220, 38, 38, 0.4)" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,2" />
                    )}
                  </svg>

                  {/* Top-Left Mode Chip */}
                  <div className="absolute top-2 left-2 bg-surface-container-lowest/90 backdrop-blur px-2 py-0.5 rounded font-label-code text-label-code-xs text-on-surface font-medium border border-outline-variant/30">
                    SAR C-Band Interferometry
                  </div>

                  {/* Top-Right Finding Chip (Neutral finding label per Section 1) */}
                  <div className="absolute top-2 right-2 bg-surface-container-lowest/90 backdrop-blur px-2 py-0.5 rounded font-label-code text-label-code-xs font-semibold text-on-surface border border-outline-variant/30">
                    {site.risk === 'HIGH' ? '+240m Boundary Change' : 'Concession Stable'}
                  </div>
                </div>

                {/* Two Data Columns (Section 7.2) */}
                <div className="mt-4 grid grid-cols-2 gap-3 font-label-code text-label-code-sm bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
                  <div>
                    <span className="text-on-surface-variant text-label-code-xs uppercase block">
                      Last Satellite Pass
                    </span>
                    <span className="text-on-surface font-semibold block mt-0.5">
                      {site.lastObservation}
                    </span>
                    <span className="text-secondary text-label-code-xs">
                      Orbit {site.lastPassOrbit}
                    </span>
                  </div>

                  <div>
                    <span className="text-on-surface-variant text-label-code-xs uppercase block">
                      Detected Changes
                    </span>
                    <span className="text-on-surface font-semibold block mt-0.5">
                      {site.detectedChangesCount} events
                    </span>
                    <span className="text-on-surface-variant text-label-code-xs truncate block" title={site.detectedChangeReason}>
                      {site.detectedChangeReason}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/20">
                    <span className="text-on-surface-variant text-label-code-xs uppercase block">
                      Est. Depletion Vol.
                    </span>
                    <span className="text-risk-high font-bold block mt-0.5">
                      {site.estimatedDepletionVolumeM3?.toLocaleString()} m³
                    </span>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/20">
                    <span className="text-on-surface-variant text-label-code-xs uppercase block">
                      Lease Status
                    </span>
                    <span className="text-on-surface font-medium text-label-code-xs block mt-0.5 truncate" title={site.leaseStatus}>
                      {site.leaseStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Action Buttons (Section 7.2) */}
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                <Button
                  variant="primary"
                  icon="troubleshoot"
                  onClick={() => navigate(`/detection/${site.id}`)}
                  className="flex-1 justify-center"
                >
                  Inspect Detection Analysis
                </Button>

                <button
                  onClick={() => navigate(`/sites/${site.id}`)}
                  className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-outline-variant/50"
                  title="Historical Site Timeline"
                >
                  <Icon name="history" size={18} />
                </button>

                <button
                  onClick={() => addToast('GIS Layer Export', `Shapefile & GeoTIFF vector bundle downloaded for ${site.id}`, 'info')}
                  className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-outline-variant/50"
                  title="Export GeoTIFF Polygon"
                >
                  <Icon name="download" size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30 font-label-code text-label-code-sm uppercase text-on-surface-variant">
                <th className="p-3.5">Site ID</th>
                <th className="p-3.5">River & Sector</th>
                <th className="p-3.5">District</th>
                <th className="p-3.5">Coordinates</th>
                <th className="p-3.5">Risk Level</th>
                <th className="p-3.5">Lease Status</th>
                <th className="p-3.5 text-right">Est. Volume (m³)</th>
                <th className="p-3.5">Last Pass</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-label-code text-label-code-sm">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="p-3.5 font-bold text-primary">{s.id}</td>
                  <td className="p-3.5 font-sans font-semibold text-on-surface">{s.siteName}</td>
                  <td className="p-3.5 text-on-surface-variant">{s.district}</td>
                  <td className="p-3.5 text-secondary">{s.latitude?.toFixed(4)}°N, {s.longitude?.toFixed(4)}°E</td>
                  <td className="p-3.5"><Badge kind="risk" level={s.risk} /></td>
                  <td className="p-3.5 text-on-surface-variant">{s.leaseStatus}</td>
                  <td className="p-3.5 text-right font-bold text-risk-high">{s.estimatedDepletionVolumeM3?.toLocaleString()}</td>
                  <td className="p-3.5 text-on-surface-variant">{s.lastObservation}</td>
                  <td className="p-3.5 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/detection/${s.id}`)}
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Footer (Section 7.2) */}
      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex items-center justify-between flex-wrap gap-4 font-label-code text-label-code-sm">
        <div className="flex items-center gap-4 text-on-surface-variant">
          <span>Showing 1–{filtered.length} of 142 Active Monitoring Sites</span>
          <span>·</span>
          <span>Geodetic Datum: WGS 84 / UTM Zone 44N</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary font-medium">
          <Icon name="flight_takeoff" size={16} />
          <span>Auto-Dispatch Drone Verification Sortie (2 Queued)</span>
        </div>
      </div>

      {/* Add Geofence Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Monitored River Site / Draw Geofence"
        subtitle="Register new multi-spectral satellite surveillance perimeter"
        primaryAction={{
          label: 'Register Geofence Polygon',
          icon: 'polyline',
          variant: 'primary',
          onClick: handleCreateSite
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setShowAddModal(false)
        }}
      >
        <div className="space-y-3.5 text-body-md text-on-surface">
          <div>
            <label className="font-label-code text-label-code-sm text-on-surface-variant block mb-1">
              Site / Sandbar Reach Name
            </label>
            <input
              type="text"
              value={newSiteName}
              onChange={(e) => setNewSiteName(e.target.value)}
              placeholder="e.g. Bhavani Downstream Sand Spit Reach"
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-label-code text-label-code-sm text-on-surface-variant block mb-1">
                River Basin
              </label>
              <input
                type="text"
                value={newRiver}
                onChange={(e) => setNewRiver(e.target.value)}
                className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-low text-body-sm font-label-code"
              />
            </div>
            <div>
              <label className="font-label-code text-label-code-sm text-on-surface-variant block mb-1">
                Administrative District
              </label>
              <input
                type="text"
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
                className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-low text-body-sm font-label-code"
              />
            </div>
          </div>

          <div>
            <label className="font-label-code text-label-code-sm text-on-surface-variant block mb-1">
              Statutory Concession / Lease Status
            </label>
            <select
              value={newLeaseStatus}
              onChange={(e) => setNewLeaseStatus(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-body-sm font-label-code"
            >
              <option value="Permitted / Compliant">Permitted / Compliant</option>
              <option value="Unauthorized (Under Review)">Unauthorized (Under Review)</option>
              <option value="Expired / Suspended">Expired / Suspended</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MonitoringSites;
