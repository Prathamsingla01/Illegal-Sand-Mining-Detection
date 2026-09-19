import React, { useState } from 'react';
import { useRiverGuard } from '../context/RiverGuardContext';
import Icon from '../components/common/Icon';
import Button from '../components/common/Button';

export const Settings = () => {
  const { userProfile, setUserProfile, addToast } = useRiverGuard();
  const [formData, setFormData] = useState({ ...userProfile });

  const handleSave = (e) => {
    e.preventDefault();
    setUserProfile(formData);
    addToast('Settings Saved', 'User preferences and threshold parameters successfully updated.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-3 border-b border-outline-variant/20">
        <h2 className="font-headline font-bold text-headline-md text-on-surface">
          System Settings & Operational Preferences
        </h2>
        <p className="text-body-sm text-on-surface-variant mt-0.5">
          Configure jurisdictional profile, alert telemetry thresholds, and satellite pipeline parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Officer Profile Settings */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/20">
            <Icon name="person" size={20} className="text-secondary" />
            <h3 className="font-headline font-bold text-headline-sm text-on-surface">
              Enforcement Officer Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-label-code text-label-code-sm text-on-surface-variant block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="font-label-code text-label-code-sm text-on-surface-variant block mb-1">
                Designated Operational Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="font-label-code text-label-code-sm text-on-surface-variant block mb-1">
                Department / Authority
              </label>
              <input
                type="text"
                value={formData.agency}
                onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="font-label-code text-label-code-sm text-on-surface-variant block mb-1">
                Officer Badge / Credential ID
              </label>
              <input
                type="text"
                value={formData.badgeId}
                onChange={(e) => setFormData({ ...formData, badgeId: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-body-sm font-label-code focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>
          </div>
        </div>

        {/* 2. Notification Preferences */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/20">
            <Icon name="notifications" size={20} className="text-secondary" />
            <h3 className="font-headline font-bold text-headline-sm text-on-surface">
              Telemetry Alert Notifications
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low cursor-pointer">
              <div>
                <span className="text-body-sm font-semibold text-on-surface block">
                  High Risk / Critical Anomaly Alerts
                </span>
                <span className="text-body-xs text-on-surface-variant">
                  Immediate pop-up and dispatch advisory notifications when volumetric extraction spike exceeds +100%
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.highRiskAlerts}
                onChange={(e) => setFormData({ ...formData, highRiskAlerts: e.target.checked })}
                className="h-5 w-5 rounded text-risk-high focus:ring-risk-high"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low cursor-pointer">
              <div>
                <span className="text-body-sm font-semibold text-on-surface block">
                  Medium Risk Boundary Drift Alerts
                </span>
                <span className="text-body-xs text-on-surface-variant">
                  Notify when lease encroachment or machinery buffer violations are flagged by satellite inference
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.mediumRiskAlerts}
                onChange={(e) => setFormData({ ...formData, mediumRiskAlerts: e.target.checked })}
                className="h-5 w-5 rounded text-secondary focus:ring-secondary"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low cursor-pointer">
              <div>
                <span className="text-body-sm font-semibold text-on-surface block">
                  Audible Telemetry Dispatch Chime
                </span>
                <span className="text-body-xs text-on-surface-variant">
                  Sound chime when new satellite pass ingestion completes
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.soundAlerts}
                onChange={(e) => setFormData({ ...formData, soundAlerts: e.target.checked })}
                className="h-5 w-5 rounded text-primary focus:ring-primary"
              />
            </label>
          </div>
        </div>

        {/* 3. Monitoring Preferences */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/20">
            <Icon name="tune" size={20} className="text-secondary" />
            <h3 className="font-headline font-bold text-headline-sm text-on-surface">
              Inference & Sensitivity Thresholds
            </h3>
          </div>

          <div>
            <div className="flex items-center justify-between font-label-code text-label-code-sm mb-2">
              <span className="text-on-surface font-semibold">
                AI Model Confidence Threshold: {formData.confidenceThreshold}%
              </span>
              <span className="text-secondary">
                DeepHydro-SandNet v4.2
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="98"
              step="1"
              value={formData.confidenceThreshold}
              onChange={(e) => setFormData({ ...formData, confidenceThreshold: Number(e.target.value) })}
              className="w-full accent-secondary cursor-pointer"
            />
            <p className="text-body-xs text-on-surface-variant mt-1.5">
              Lowering threshold increases sensitivity for early change detection; higher threshold restricts alerts to confirmed volumetric pits.
            </p>
          </div>
        </div>

        {/* 4. Data Sources & Transparency Notice (Section 7.7) */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-outline-variant/20">
            <Icon name="satellite_alt" size={20} className="text-secondary" />
            <h3 className="font-headline font-bold text-headline-sm text-on-surface">
              Constellation Feeds & Data Transparency
            </h3>
          </div>

          <div className="p-3.5 bg-surface-container-low rounded-lg text-body-sm text-on-surface-variant leading-relaxed space-y-2">
            <p>
              <strong className="text-on-surface">Data Stream Footnote:</strong> Imagery references to Sentinel-2 MSI (ESA Copernicus), PlanetScope (Planet Labs 3m), and Sentinel-1 C-SAR are configured as simulated demonstration telemetry feeds for the RiverGuard AI intelligence prototype.
            </p>
            <p>
              All bathymetric cross-sections, coordinates, and change polygons simulate authentic Indian river basin dynamics (Kaveri, Godavari, Subarnarekha, Narmada, Mahanadi, Chambal) under decision-support guidelines.
            </p>
          </div>
        </div>

        {/* 5. About & Statutory Mandate (Section 1 & 7.7) */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-outline-variant/20">
            <Icon name="shield" size={20} className="text-primary" />
            <h3 className="font-headline font-bold text-headline-sm text-on-surface">
              About RiverGuard AI & Decision-Support Mandate
            </h3>
          </div>

          <div className="space-y-2 text-body-sm text-on-surface-variant leading-relaxed">
            <p>
              <strong>RiverGuard AI Platform Version 2.4-gov (Stitch Spec v2 Edition)</strong>
            </p>
            <p>
              <strong>Core Statutory Notice (Section 1):</strong> RiverGuard AI is architected as an administrative decision-support system. All telemetry outputs indicate <em>"suspicious extraction detected, requires investigation"</em> and never assert guilt, legal non-compliance, or financial liability prior to physical on-site ground-truthing and procedural due process.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            icon="save"
            className="px-6 py-2.5 text-label-code-md"
          >
            Save Configuration Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
