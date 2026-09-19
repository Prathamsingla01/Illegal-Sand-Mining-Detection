import React from 'react';
import Icon from '../common/Icon';
import Button from '../common/Button';

export const FieldActionPanel = ({ onRequestVerification }) => {
  return (
    <div className="bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl shadow-md p-5 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-secondary-container">
            <Icon name="local_police" size={20} />
          </div>
          <div>
            <h3 className="font-headline font-bold text-headline-sm text-white">
              Field Enforcement Liaison
            </h3>
            <span className="font-label-code text-label-code-sm text-secondary-container">
              Tamil Nadu & Andhra Inter-State Fluvial Wing
            </span>
          </div>
        </div>

        {/* Description paragraph */}
        <p className="text-body-sm text-white/80 leading-relaxed mt-2">
          Automated multi-spectral change triggers flag potential unauthorized riverbed alterations. Authorized personnel may dispatch rapid fluvial ground teams or queue calibrated UAV sensor sorties to perform on-site GPS ground-truthing and physical depth measurements.
        </p>

        {/* Quick status counters */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-label-code-sm font-label-code bg-white/10 p-3 rounded-lg border border-white/15">
          <div>
            <span className="text-white/70 text-label-code-xs block uppercase">Active Patrols</span>
            <span className="text-white font-bold text-headline-sm">6 Squads</span>
          </div>
          <div>
            <span className="text-white/70 text-label-code-xs block uppercase">Avg Response Time</span>
            <span className="text-secondary-container font-bold text-headline-sm">42 mins</span>
          </div>
        </div>
      </div>

      {/* Action Button: Relabeled per Section 1 to "Request Field Verification" */}
      <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-between">
        <span className="font-label-code text-label-code-xs text-white/70">
          Due process protocol v2.4
        </span>
        <Button
          variant="secondary"
          icon="send"
          onClick={onRequestVerification}
          className="bg-white text-primary hover:bg-surface-container-low font-bold shadow-md"
        >
          Request Field Verification
        </Button>
      </div>
    </div>
  );
};

export default FieldActionPanel;
