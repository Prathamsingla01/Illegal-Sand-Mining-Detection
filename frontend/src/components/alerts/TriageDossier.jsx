import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRiverGuard } from '../../context/RiverGuardContext';
import Icon from '../common/Icon';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Modal from '../common/Modal';

export const TriageDossier = ({ alert }) => {
  const navigate = useNavigate();
  const { dispatchTaskforce, scheduleUav, addToast } = useRiverGuard();

  const [showMobilizeModal, setShowMobilizeModal] = useState(false);
  const [showFirModal, setShowFirModal] = useState(false);
  const [firDraftNotes, setFirDraftNotes] = useState('');

  if (!alert) {
    return (
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-8 text-center text-on-surface-variant">
        Select an alert from the queue to view its forensic triage dossier.
      </div>
    );
  }

  const handleMobilize = () => {
    dispatchTaskforce(alert.siteId, 'Urgent field interception mobilized from forensic dossier.');
    setShowMobilizeModal(false);
  };

  const handleTaskDrone = () => {
    scheduleUav(alert.siteId);
  };

  const handleDraftFir = () => {
    addToast(
      'FIR Notice Draft Created',
      `Draft First Information Report logged for ${alert.siteName} (${alert.id}). Ready for magistrate endorsement.`,
      'info'
    );
    setShowFirModal(false);
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 flex flex-col justify-between h-full">
      <div>
        {/* Dossier Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-headline font-bold text-headline-sm text-on-surface">
                Forensic Triage Dossier
              </h3>
              <Badge kind="risk" level={alert.riskLevel} />
            </div>
            <p className="font-label-code text-label-code-sm text-on-surface-variant mt-0.5">
              Case File: <strong className="text-secondary">{alert.id}</strong>
            </p>
          </div>
          <span className="font-label-code text-label-code-sm text-on-surface-variant">
            {alert.createdAt}
          </span>
        </div>

        {/* Site Location & Coords Banner */}
        <div className="bg-surface-container-low p-3 rounded-lg mb-3.5">
          <div className="flex items-center justify-between font-label-code text-label-code-sm">
            <span className="font-bold text-on-surface">{alert.siteName}</span>
            <span className="text-secondary font-medium">[{alert.siteId}]</span>
          </div>
          <div className="text-body-sm text-on-surface-variant mt-1 flex items-center justify-between">
            <span>{alert.district} District · {alert.river}</span>
            <span className="font-label-code text-label-code-xs text-on-surface-variant/90">{alert.coords}</span>
          </div>
        </div>

        {/* Pinned Mini-Map Vector Graphic */}
        <div className="h-32 w-full rounded-lg bg-[#eaf2fd] border border-outline-variant/30 relative overflow-hidden mb-3.5 flex items-center justify-center">
          <svg viewBox="0 0 300 120" className="w-full h-full">
            <path
              d="M 0,30 C 80,10 140,80 200,60 C 250,45 280,20 300,30 L 300,90 C 250,110 200,80 140,100 C 80,120 40,70 0,80 Z"
              fill="#4a92de"
            />
            {/* Red disturbance marker */}
            <circle cx="150" cy="65" r="10" fill="#dc2626" opacity="0.3" className="animate-ping" />
            <circle cx="150" cy="65" r="5" fill="#dc2626" />
            <rect x="110" y="45" width="80" height="40" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,2" />
          </svg>
          <div className="absolute top-2 left-2 bg-surface-container-lowest/80 px-2 py-0.5 rounded font-label-code text-label-code-xs text-on-surface">
            Pinned Radar Anchor
          </div>
        </div>

        {/* Mini Multi-Temporal Before/After Pair */}
        <div className="p-3 bg-surface-container-low rounded-lg mb-3.5">
          <div className="flex items-center justify-between font-label-code text-label-code-sm mb-2">
            <span className="font-semibold text-on-surface">AI Multi-Temporal Analysis</span>
            <span className="text-secondary font-medium">Confidence: {alert.confidence}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#1e293b] rounded p-2 text-center text-white">
              <span className="font-label-code text-label-code-xs text-secondary-container block">T1 Baseline</span>
              <div className="h-14 flex items-center justify-center text-body-sm font-label-code text-white/70">
                Pristine Sandbar
              </div>
            </div>
            <div className="bg-[#3b0764] rounded p-2 text-center text-white border border-risk-high">
              <span className="font-label-code text-label-code-xs text-pink-300 block">T0 Anomaly</span>
              <div className="h-14 flex items-center justify-center text-body-sm font-label-code text-pink-100 font-bold">
                -38,400 m³ Pit
              </div>
            </div>
          </div>
        </div>

        {/* Two Stat Tiles */}
        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          <div className="bg-surface-container-low p-2.5 rounded-lg">
            <span className="font-label-code text-label-code-xs text-on-surface-variant uppercase block">
              Extraction Vol. (est.)
            </span>
            <span className="font-headline font-bold text-headline-sm text-risk-high">
              {alert.estimatedVolumeM3?.toLocaleString()} m³
            </span>
          </div>
          <div className="bg-surface-container-low p-2.5 rounded-lg">
            <span className="font-label-code text-label-code-xs text-on-surface-variant uppercase block">
              Footprint Area
            </span>
            <span className="font-headline font-bold text-headline-sm text-on-surface">
              {alert.disturbedAreaM2?.toLocaleString()} m²
            </span>
          </div>
        </div>

        {/* Relabeled per Section 1: Detected Pattern (was "Violation Classification") */}
        <div className="p-3 bg-surface-container-low rounded-lg mb-3.5 border-l-4 border-l-secondary">
          <span className="font-label-code text-label-code-xs uppercase text-on-surface-variant font-bold block mb-1">
            Detected Pattern
          </span>
          <p className="text-body-sm text-on-surface font-medium leading-relaxed">
            {alert.detectedPattern}
          </p>
        </div>

        {/* Assigned Officer Row */}
        <div className="flex items-center justify-between p-2.5 bg-surface-container-low/50 rounded-lg border border-outline-variant/30 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-headline font-bold text-body-sm">
              SJ
            </div>
            <div>
              <span className="text-body-sm font-semibold text-on-surface block">
                {alert.assignedOfficer}
              </span>
              <span className="font-label-code text-label-code-xs text-on-surface-variant">
                {alert.assignedRole || 'GIS Enforcement Lead'}
              </span>
            </div>
          </div>
          <button
            onClick={() => addToast('Officer Reassignment', 'Officer reassignment modal dispatched.', 'info')}
            className="font-label-code text-label-code-sm text-secondary hover:underline"
          >
            Reassign
          </button>
        </div>
      </div>

      {/* Triage Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-outline-variant/20">
        <Button
          variant="primary"
          icon="local_police"
          className="w-full justify-center bg-primary hover:bg-primary-container"
          onClick={() => setShowMobilizeModal(true)}
        >
          Mobilize Field Interception
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            icon="flight_takeoff"
            onClick={handleTaskDrone}
            className="w-full justify-center"
          >
            Task Drone
          </Button>
          <Button
            variant="secondary"
            icon="gavel"
            onClick={() => setShowFirModal(true)}
            className="w-full justify-center"
          >
            Draft FIR Notice
          </Button>
        </div>
      </div>

      {/* Mobilize Field Interception Modal */}
      <Modal
        isOpen={showMobilizeModal}
        onClose={() => setShowMobilizeModal(false)}
        title="Mobilize Field Interception Squad"
        subtitle={`Target Location: ${alert.siteName} (${alert.coords})`}
        primaryAction={{
          label: 'Confirm Patrol Dispatch',
          icon: 'send',
          variant: 'primary',
          onClick: handleMobilize
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setShowMobilizeModal(false)
        }}
      >
        <div className="space-y-3 text-body-md text-on-surface">
          <p>
            You are about to issue a formal field dispatch order to <strong>Unit 4 (Tamil Nadu Water Resources Police)</strong>.
          </p>
          <div className="p-3 bg-surface-container-low rounded-lg font-label-code text-label-code-sm space-y-1">
            <p>• Ground Unit: Tamil Nadu Fluvial Patrol Squad #4</p>
            <p>• Estimated Arrival: 45 minutes</p>
            <p>• Primary Task: On-site geodetic perimeter verification & physical equipment audit</p>
          </div>
        </div>
      </Modal>

      {/* Draft FIR Notice Modal */}
      <Modal
        isOpen={showFirModal}
        onClose={() => setShowFirModal(false)}
        title="Draft Preliminary FIR Evidentiary Dossier"
        subtitle={`Case ID: ${alert.id} · Site: ${alert.siteName}`}
        primaryAction={{
          label: 'Generate & Save Draft',
          icon: 'description',
          variant: 'primary',
          onClick: handleDraftFir
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setShowFirModal(false)
        }}
      >
        <div className="space-y-3 text-body-md text-on-surface">
          <p className="text-body-sm text-on-surface-variant">
            Prepare a preliminary evidentiary dossier under Section 21 of the Mines and Minerals (Development and Regulation) Act. Note: This creates an internal administrative draft for human executive review.
          </p>
          <div>
            <label className="font-label-code text-label-code-sm text-on-surface-variant block mb-1">
              Field Officer Notes & Observations
            </label>
            <textarea
              rows={4}
              value={firDraftNotes}
              onChange={(e) => setFirDraftNotes(e.target.value)}
              placeholder="Record ground coordinates, observed vehicle registration numbers, or witness testimonies..."
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TriageDossier;
