import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRiverGuard } from '../context/RiverGuardContext';
import ImageCompare from '../components/detection/ImageCompare';
import BathymetricChart from '../components/detection/BathymetricChart';
import CompliancePanel from '../components/detection/CompliancePanel';
import Icon from '../components/common/Icon';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

export const DetectionAnalysis = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const {
    detections,
    sites,
    dispatchTaskforce,
    notifyMagistrate,
    scheduleUav,
    addToast
  } = useRiverGuard();

  // Find detection for siteId, or default to Mohanur Sector 4
  const currentSite = sites.find(s => s.id === siteId) || sites[0];
  const detection = detections.find(d => d.siteId === currentSite.id) || detections[0];

  // Action modals
  const [showTaskforceModal, setShowTaskforceModal] = useState(false);
  const [showMagistrateModal, setShowMagistrateModal] = useState(false);
  const [showUavModal, setShowUavModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleTaskforceDispatch = () => {
    dispatchTaskforce(detection.siteId, 'Rapid interdiction order authorized via Detection Analysis console.');
    setShowTaskforceModal(false);
  };

  const handleNotifyMagistrate = () => {
    notifyMagistrate(detection.siteId);
    setShowMagistrateModal(false);
  };

  const handleQueueUav = () => {
    scheduleUav(detection.siteId);
    setShowUavModal(false);
  };

  const handleExportDossier = () => {
    addToast(
      'Enforcement Dossier Ready',
      `Complete GeoTIFF rasters and signed evidentiary PDF created for ${detection.id}.`,
      'success'
    );
    setShowExportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumb + Header (Section 7.3) */}
      <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-outline-variant/20">
        <div>
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 font-label-code text-label-code-sm text-on-surface-variant mb-2">
            <Link to="/sites" className="hover:text-primary hover:underline">
              Monitoring Sites
            </Link>
            <span>/</span>
            <Link to={`/sites/${currentSite.id}`} className="hover:text-primary hover:underline">
              {currentSite.siteName}
            </Link>
            <span>/</span>
            <span className="font-bold text-secondary">{detection.id}</span>
          </nav>

          {/* Title and Status Chip */}
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-headline font-bold text-headline-md text-on-surface">
              AI Satellite Detection & Volumetric Analysis
            </h1>

            {/* Relabeled per Section 1: "High-Confidence Change Detected — Pending Verification" */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-code text-label-code-sm font-bold bg-risk-high-bg text-risk-high-text border border-risk-high/40">
              <span className="w-2 h-2 rounded-full bg-risk-high animate-pulse" />
              High-Confidence Change Detected — Pending Verification
            </span>
          </div>

          {/* Model caption line */}
          <p className="font-label-code text-label-code-sm text-on-surface-variant mt-1">
            Model: <strong className="text-on-surface font-semibold">{detection.modelName}</strong> · Multi-spectral SAR/Optical Fusion · Verification Confidence: <strong className="text-secondary font-semibold">{(detection.confidence * 100).toFixed(1)}%</strong>
          </p>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            icon="file_download"
            onClick={() => setShowExportModal(true)}
          >
            Export GeoTIFF & Dossier PDF
          </Button>

          <Button
            variant="primary"
            icon="crisis_alert"
            onClick={() => setShowTaskforceModal(true)}
          >
            Generate Enforcement Alert & Action Dossier
          </Button>
        </div>
      </div>

      {/* 2. Six-Stat Strip (Section 7.3) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Stat 1: Disturbed Area */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/30">
          <span className="font-label-code text-label-code-xs uppercase tracking-wider text-on-surface-variant font-medium block">
            Disturbed Area
          </span>
          <span className="font-headline font-bold text-headline-sm text-on-surface block mt-0.5">
            {detection.disturbedAreaM2?.toLocaleString()} m²
          </span>
          <span className="font-label-code text-label-code-xs text-risk-high font-medium block mt-1">
            {detection.disturbedAcres}
          </span>
        </div>

        {/* Stat 2: Est. Extracted Volume (captioned as estimate per Section 1) */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/30">
          <span className="font-label-code text-label-code-xs uppercase tracking-wider text-on-surface-variant font-medium block">
            Est. Extracted Volume
          </span>
          <span className="font-headline font-bold text-headline-sm text-risk-high block mt-0.5">
            {detection.estimatedVolumeM3?.toLocaleString()} m³
          </span>
          <span className="font-label-code text-label-code-xs text-on-surface-variant block mt-1">
            LiDAR/DEM Inversion (est.)
          </span>
        </div>

        {/* Stat 3: Machinery Footprint */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/30">
          <span className="font-label-code text-label-code-xs uppercase tracking-wider text-on-surface-variant font-medium block">
            Machinery Footprint
          </span>
          <span className="font-headline font-bold text-headline-sm text-on-surface block mt-0.5">
            {detection.machinerySummary}
          </span>
          <span className="font-label-code text-label-code-xs text-risk-medium font-medium block mt-1">
            {detection.machineryFootprintNote}
          </span>
        </div>

        {/* Stat 4: Extraction Velocity */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/30">
          <span className="font-label-code text-label-code-xs uppercase tracking-wider text-on-surface-variant font-medium block">
            Extraction Velocity
          </span>
          <span className="font-headline font-bold text-headline-sm text-on-surface block mt-0.5">
            {detection.extractionVelocityM3PerDay?.toLocaleString()} m³/day
          </span>
          <span className="font-label-code text-label-code-xs text-risk-high font-medium block mt-1">
            {detection.velocitySpikePercent}
          </span>
        </div>

        {/* Stat 5: Centroid Coordinates */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/30">
          <span className="font-label-code text-label-code-xs uppercase tracking-wider text-on-surface-variant font-medium block">
            Centroid Coordinates
          </span>
          <span className="font-label-code font-bold text-body-md text-secondary block mt-0.5">
            {detection.centroid.label}
          </span>
          <span className="font-label-code text-label-code-xs text-on-surface-variant block mt-1 truncate">
            {detection.district}
          </span>
        </div>

        {/* Stat 6: Temporal Shift Interval */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/30">
          <span className="font-label-code text-label-code-xs uppercase tracking-wider text-on-surface-variant font-medium block">
            Temporal Interval
          </span>
          <span className="font-headline font-bold text-headline-sm text-on-surface block mt-0.5">
            {detection.temporalDays} Days
          </span>
          <span className="font-label-code text-label-code-xs text-secondary font-medium block mt-1">
            {detection.previousObservationDate} → {detection.currentObservationDate}
          </span>
        </div>
      </div>

      {/* 3. Comparison Viewport (ImageCompare component with draggable slider) */}
      <ImageCompare detection={detection} />

      {/* 4. Two Columns Below Viewport: Bathymetric Depth Profile & Preliminary Compliance Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <BathymetricChart />
        </div>
        <div className="lg:col-span-5">
          <CompliancePanel detection={detection} />
        </div>
      </div>

      {/* 5. Bottom Action Section: Automated Escalation & Interdiction Dispatch (Section 7.3) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6">
        <div className="mb-4">
          <h3 className="font-headline font-bold text-headline-sm text-on-surface">
            Automated Escalation & Interdiction Dispatch
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Execute statutory enforcement dispatches, notify district revenue authorities, and schedule autonomous aerial validation sorties.
          </p>
        </div>

        {/* Three Escalation Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Dispatch River Taskforce */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-code text-label-code-xs px-2 py-0.5 rounded bg-risk-high-bg text-risk-high-text font-bold">
                  ETA: 45 MINS
                </span>
                <Icon name="local_police" size={22} className="text-primary" />
              </div>
              <h4 className="font-headline font-bold text-body-lg text-on-surface">
                Dispatch River Taskforce
              </h4>
              <p className="text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                Deploy Tamil Nadu Fluvial Patrol Squad #4 for rapid ground coordinates verification and heavy machinery containment.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/20">
              <Button
                variant="primary"
                icon="send"
                onClick={() => setShowTaskforceModal(true)}
                className="w-full justify-center bg-primary hover:bg-primary-container"
              >
                Issue Rapid Interdiction Order
              </Button>
            </div>
          </div>

          {/* Card 2: Notify District Magistrate */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-code text-label-code-xs px-2 py-0.5 rounded bg-surface-container text-secondary font-semibold">
                  STATUTORY NOTICE
                </span>
                <Icon name="gavel" size={22} className="text-secondary" />
              </div>
              <h4 className="font-headline font-bold text-body-lg text-on-surface">
                Notify District Magistrate
              </h4>
              <p className="text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                Transmit multi-temporal satellite evidence dossier to Namakkal Collectorate for initiation of administrative review under Section 21.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/20">
              <Button
                variant="secondary"
                icon="receipt_long"
                onClick={() => setShowMagistrateModal(true)}
                className="w-full justify-center"
              >
                Transmit Legal Evidentiary Dossier
              </Button>
            </div>
          </div>

          {/* Card 3: Schedule UAV / Drone Flyover */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-code text-label-code-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-semibold">
                  WITHIN 24 HOURS
                </span>
                <Icon name="flight" size={22} className="text-primary-container" />
              </div>
              <h4 className="font-headline font-bold text-body-lg text-on-surface">
                Schedule UAV / Drone Flyover
              </h4>
              <p className="text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                Queue autonomous UAV Sortie 3 (thermal & optical LiDAR payload) to acquire millimeter-grade topographic elevation profiles.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/20">
              <Button
                variant="secondary"
                icon="flight_takeoff"
                onClick={() => setShowUavModal(true)}
                className="w-full justify-center"
              >
                Queue Flight Mission
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Interdiction Order */}
      <Modal
        isOpen={showTaskforceModal}
        onClose={() => setShowTaskforceModal(false)}
        title="Authorize Rapid Interdiction Order"
        subtitle={`Target Reach: ${detection.siteName} (${detection.centroid.label})`}
        primaryAction={{
          label: 'Transmit Interdiction Directive',
          icon: 'send',
          variant: 'primary',
          onClick: handleTaskforceDispatch
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setShowTaskforceModal(false)
        }}
      >
        <div className="space-y-3 text-body-md text-on-surface">
          <p>
            You are deploying an inter-agency river taskforce. This dispatches an encrypted ground mission docket to the on-duty field patrol squad.
          </p>
          <div className="p-3 bg-surface-container-low rounded-lg font-label-code text-label-code-sm space-y-1">
            <p>• Estimated Ground Arrival: 45 minutes</p>
            <p>• Tactical Unit: Unit 4 / Fluvial Interdiction Squad</p>
            <p>• Mandate: Conduct RTK-GPS survey, verify excavator registry, ensure bank safety</p>
          </div>
        </div>
      </Modal>

      {/* Modal 2: Magistrate Notification */}
      <Modal
        isOpen={showMagistrateModal}
        onClose={() => setShowMagistrateModal(false)}
        title="Transmit Statutory Notice to District Collectorate"
        subtitle={`District: ${detection.district} · Reference: ${detection.id}`}
        primaryAction={{
          label: 'Transmit Certified Dossier',
          icon: 'gavel',
          variant: 'primary',
          onClick: handleNotifyMagistrate
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setShowMagistrateModal(false)
        }}
      >
        <div className="space-y-3 text-body-md text-on-surface">
          <p className="text-body-sm text-on-surface-variant">
            Forward automated satellite anomaly telemetry to the designated District Magistrate & Mines Officer for preliminary administrative inquiry.
          </p>
          <div className="p-3 bg-surface-container-low rounded-lg font-label-code text-label-code-sm space-y-1">
            <p>✓ Multi-temporal change polygon attached</p>
            <p>✓ Bathymetric pit transect profiles included</p>
            <p>✓ Timestamped sensor orbit telemetry certified</p>
          </div>
        </div>
      </Modal>

      {/* Modal 3: Drone Mission */}
      <Modal
        isOpen={showUavModal}
        onClose={() => setShowUavModal(false)}
        title="Queue Autonomous UAV Sortie"
        subtitle={`Flight Corridor: Mohanur Reach Sector 4 (Waypoint WP-01 to WP-08)`}
        primaryAction={{
          label: 'Confirm Flight Plan',
          icon: 'flight_takeoff',
          variant: 'primary',
          onClick: handleQueueUav
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setShowUavModal(false)
        }}
      >
        <div className="space-y-3 text-body-md text-on-surface">
          <p className="text-body-sm text-on-surface-variant">
            An autonomous waypoint flight plan will be queued for the nearest surveillance UAV base station. Flight will initiate during optimal daylight sun angle.
          </p>
          <div className="p-3 bg-surface-container-low rounded-lg font-label-code text-label-code-sm space-y-1">
            <p>• Flight Altitude: 120m AGL</p>
            <p>• Sensor: 4K RGB Camera + High-Resolution LiDAR Inversion Pod</p>
            <p>• GSD Resolution: 1.8 cm/pixel</p>
          </div>
        </div>
      </Modal>

      {/* Modal 4: Export Dossier */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export GeoTIFF & Forensics Dossier PDF"
        subtitle={`Detection ID: ${detection.id}`}
        primaryAction={{
          label: 'Export Package',
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
            Exporting a comprehensive archive containing full-resolution multi-spectral layers and standardized forensic documentation.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default DetectionAnalysis;
