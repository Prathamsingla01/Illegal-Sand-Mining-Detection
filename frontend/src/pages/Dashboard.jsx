import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRiverGuard } from '../context/RiverGuardContext';
import CommandHeader from '../components/dashboard/CommandHeader';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import RiverMapCanvas from '../components/map/RiverMapCanvas';
import RecentAlertsFeed from '../components/dashboard/RecentAlertsFeed';
import ExtractionTrendChart from '../components/dashboard/ExtractionTrendChart';
import FieldActionPanel from '../components/dashboard/FieldActionPanel';
import Modal from '../components/common/Modal';

export const Dashboard = () => {
  const navigate = useNavigate();
  const {
    sites,
    alerts,
    dispatchTaskforce,
    addToast,
    selectedBasin,
    selectedSiteId,
    setSelectedSiteId
  } = useRiverGuard();

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');

  const handleConfirmVerification = () => {
    dispatchTaskforce(selectedSiteId || 'KV-MOH-04', verificationNotes);
    setShowVerificationModal(false);
  };

  const handleExportDossier = () => {
    addToast(
      'Forensics Dossier Generated',
      `Comprehensive basin telemetry dossier exported for ${selectedBasin}. PDF report ready for download.`,
      'success'
    );
    setShowExportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Command Header Row */}
      <CommandHeader onExportDossier={() => setShowExportModal(true)} />

      {/* 2. Four Stat Cards (Section 7.1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Monitoring Sites */}
        <StatCard
          label="Active Monitoring Sites"
          value="142"
          icon="explore"
          trend={{ text: '+12 added this cycle', positive: true }}
          footerRight="98.4% basin radar coverage"
        />

        {/* Card 2: Flagged / Unverified (Workflow chip: Verification Queue) */}
        <StatCard
          label="Flagged / Unverified"
          value="18"
          icon="troubleshoot"
          badge={
            <Badge kind="workflow-status" showDot={true}>
              Verification Queue
            </Badge>
          }
          trend={{ text: '+4 since last SAR pass', positive: false }}
          footerRight="Spectral Shift > 14%"
        />

        {/* Card 3: High Risk Alerts (Workflow chip: Dispatch Advisory) */}
        <StatCard
          label="High Risk Alerts"
          value="7"
          icon="priority_high"
          badge={
            <Badge kind="workflow-status" className="bg-risk-high-bg text-risk-high-text border-risk-high/30" showDot={true}>
              Dispatch Advisory
            </Badge>
          }
          subtext="Active night dredging detected"
          footerRight="2 squads on patrol"
        />

        {/* Card 4: Extracted Sand Volume (Section 1: small estimated caption) */}
        <StatCard
          label="Extracted Sand Volume"
          value={
            <span className="flex items-baseline gap-1">
              <span>348,200 m³</span>
              <span className="font-label-code text-label-code-xs text-on-surface-variant font-normal">
                (estimated)
              </span>
            </span>
          }
          icon="layers"
          trend={{ text: '+18.4% MoM spike', positive: false }}
          footerRight="~24,800 tipper truckloads"
        />
      </div>

      {/* 3. Main Split: Live Hydrological Radar Canvas (~65%) + Recent Alerts Feed (~35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <RiverMapCanvas
            sites={sites}
            selectedSiteId={selectedSiteId}
            onSelectSite={(s) => setSelectedSiteId(s.id)}
            showMiniVerification={true}
          />
        </div>
        <div className="lg:col-span-4">
          <RecentAlertsFeed alerts={alerts} />
        </div>
      </div>

      {/* 4. Bottom Row: Extraction Trend Chart (2/3) + Field Enforcement Liaison (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <ExtractionTrendChart />
        </div>
        <div className="lg:col-span-4">
          <FieldActionPanel
            onRequestVerification={() => setShowVerificationModal(true)}
          />
        </div>
      </div>

      {/* Modal: Request Field Verification */}
      <Modal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        title="Request Field Ground Verification"
        subtitle="Tamil Nadu & Andhra Fluvial Taskforce Interception"
        primaryAction={{
          label: 'Submit Verification Order',
          icon: 'send',
          variant: 'primary',
          onClick: handleConfirmVerification
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setShowVerificationModal(false)
        }}
      >
        <div className="space-y-4 text-body-md text-on-surface">
          <p className="text-body-sm text-on-surface-variant">
            Initiate a field ground inspection request for flagged coordinate points. Inspection teams will verify bathymetric pit depths with handheld RTK-GPS receivers and document equipment presence.
          </p>

          <div>
            <label className="font-label-code text-label-code-sm text-on-surface-variant block mb-1">
              Select River Reach / Monitored Site
            </label>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low font-label-code text-label-code-sm"
            >
              {sites.map(s => (
                <option key={s.id} value={s.id}>
                  {s.siteName} [{s.id}] — {s.river} ({s.risk} Risk)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-label-code text-label-code-sm text-on-surface-variant block mb-1">
              Special Inspection Directives
            </label>
            <textarea
              rows={3}
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              placeholder="e.g. Inspect riverbank stability at northern boundary; cross-check lease concession marker pillars..."
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>
        </div>
      </Modal>

      {/* Modal: Export Forensics Dossier */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Forensics Intelligence Dossier"
        subtitle={`Scope: ${selectedBasin} · Temporal Window: Last 14 Days`}
        primaryAction={{
          label: 'Generate & Download PDF',
          icon: 'download',
          variant: 'primary',
          onClick: handleExportDossier
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setShowExportModal(false)
        }}
      >
        <div className="space-y-3 text-body-md text-on-surface">
          <p className="text-body-sm text-on-surface-variant">
            Export a certified multi-spectral intelligence dossier containing all detected boundary anomalies, volumetric depletion trajectories, and satellite observation metadata.
          </p>
          <div className="p-3 bg-surface-container-low rounded-lg font-label-code text-label-code-sm space-y-1.5">
            <p className="font-semibold text-on-surface">Included Artifacts:</p>
            <p>✓ Orthorectified Sentinel-2 & PlanetScope GeoTIFF Composites</p>
            <p>✓ Bathymetric Elevation Profile Contours (DEM LiDAR Inversion)</p>
            <p>✓ Preliminary Compliance Audit & Encroachment Polygon Vectors</p>
            <p>✓ State River Mining Authority Standardized Evidence Manifest</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
