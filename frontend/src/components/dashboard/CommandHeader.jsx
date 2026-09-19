import React from 'react';
import { useRiverGuard } from '../../context/RiverGuardContext';
import { BASIN_OPTIONS, DATE_RANGE_OPTIONS, SEVERITY_OPTIONS } from '../../data/mockData';
import Icon from '../common/Icon';
import Button from '../common/Button';

export const CommandHeader = ({ onExportDossier }) => {
  const {
    selectedBasin,
    setSelectedBasin,
    selectedDateRange,
    setSelectedDateRange,
    selectedSeverity,
    setSelectedSeverity
  } = useRiverGuard();

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
      {/* Left Title & Telemetry Metadata */}
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
          </span>
          <h2 className="font-headline font-bold text-headline-sm text-on-surface">
            {selectedBasin}
          </h2>
          <span className="font-label-code text-label-code-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium border border-outline-variant/40">
            EPSG:4326
          </span>
        </div>
        <div className="flex items-center gap-2 font-label-code text-label-code-sm text-on-surface-variant mt-1">
          <Icon name="satellite_alt" size={16} className="text-secondary" />
          <span>3 Satellite Constellations Active: Sentinel-2 MSI, Landsat 9 OLI-2, PlanetScope 3m Constellation</span>
        </div>
      </div>

      {/* Right Filters & Primary CTA */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Basin Dropdown */}
        <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/60">
          <Icon name="public" size={16} className="text-on-surface-variant" />
          <select
            value={selectedBasin}
            onChange={(e) => setSelectedBasin(e.target.value)}
            className="bg-transparent font-label-code text-label-code-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
          >
            {BASIN_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Date Range Dropdown */}
        <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/60">
          <Icon name="calendar_today" size={16} className="text-on-surface-variant" />
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="bg-transparent font-label-code text-label-code-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
          >
            {DATE_RANGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Severity Dropdown */}
        <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/60">
          <Icon name="filter_list" size={16} className="text-on-surface-variant" />
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-transparent font-label-code text-label-code-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
          >
            {SEVERITY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Primary Export CTA */}
        <Button
          variant="primary"
          icon="file_download"
          onClick={onExportDossier}
        >
          Export Forensics Dossier
        </Button>
      </div>
    </div>
  );
};

export default CommandHeader;
