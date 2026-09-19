import React from 'react';
import Icon from '../common/Icon';
import Badge from '../common/Badge';

export const CompliancePanel = ({ detection }) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 flex flex-col justify-between">
      <div>
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container">
              <Icon name="verified_user" size={20} />
            </div>
            <div>
              {/* Relabeled per Section 1 */}
              <h3 className="font-headline font-semibold text-headline-sm text-on-surface">
                Compliance Assessment (Preliminary — Requires Verification)
              </h3>
              <p className="font-label-code text-label-code-sm text-on-surface-variant">
                Statutory regulatory checklist · State River Mining Rules, 2024
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full font-label-code text-label-code-sm font-bold bg-risk-high-bg text-risk-high-text border border-risk-high/40">
            SEV-1 ADVISORY
          </span>
        </div>

        {/* Compliance Checklist Items */}
        <div className="mt-4 space-y-3.5">
          {/* Item 1: Lease Boundary Assessment */}
          <div className="p-3.5 rounded-lg bg-surface-container-low border-l-4 border-l-risk-high">
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline font-semibold text-body-md text-on-surface">
                Lease Boundary Assessment — Flagged for Review
              </span>
              <span className="font-label-code text-label-code-xs font-semibold px-2 py-0.5 rounded bg-risk-high-bg text-risk-high-text">
                ENCROACHMENT DETECTED
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant">
              Multi-temporal edge analysis indicates excavation works extending <strong className="text-on-surface font-semibold font-label-code">185 meters</strong> past certified boundary coordinates (Khasra Parcel #49/2A).
            </p>
          </div>

          {/* Item 2: Ecological Stability Threat */}
          <div className="p-3.5 rounded-lg bg-surface-container-low border-l-4 border-l-risk-high">
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline font-semibold text-body-md text-on-surface">
                Ecological Stability Threat — Critical Warning
              </span>
              <span className="font-label-code text-label-code-xs font-semibold px-2 py-0.5 rounded bg-risk-high-bg text-risk-high-text">
                BANK FAILURE RISK
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant">
              Riverbank undercut angle of 38° exceeds geotechnical safety limits (FS &lt; 1.1). Flood protective bund destabilization risk identified for adjacent agricultural land.
            </p>
          </div>

          {/* Item 3: Heavy Machinery Presence */}
          <div className="p-3.5 rounded-lg bg-surface-container-low border-l-4 border-l-risk-medium">
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline font-semibold text-body-md text-on-surface">
                Heavy Machinery Presence — Requires Permit Verification
              </span>
              <span className="font-label-code text-label-code-xs font-semibold px-2 py-0.5 rounded bg-risk-medium-bg text-risk-medium-text">
                PERMIT CHECK NEEDED
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant">
              14 distinct heavy caterpillar track signatures and 3 pit staging areas detected inside designated 50m riparian buffer zone. Mechanized instream suction not permitted in current concession category.
            </p>
          </div>
        </div>
      </div>

      {/* Tone-Safe Cost Footer (Section 1: No computed dollar penalty!) */}
      <div className="mt-4 pt-3 border-t border-outline-variant/20 bg-surface-container/50 p-3 rounded-lg">
        <div className="flex items-start gap-2 text-on-surface-variant text-body-sm">
          <Icon name="info" size={18} className="text-secondary shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-on-surface">Reference Estimation:</span>
            <p className="font-label-code text-label-code-sm text-on-surface mt-0.5">
              Illustrative cost-of-impact range: <strong className="text-secondary">₹45–65 lakh</strong> — not a legal or financial determination.
            </p>
            <p className="text-label-code-xs text-on-surface-variant mt-1 italic">
              Decision-support notice: Statutory penalties are determined solely by competent revenue authorities following physical inspection and due process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompliancePanel;
