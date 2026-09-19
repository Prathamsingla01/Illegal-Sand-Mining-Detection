import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRiverGuard } from '../context/RiverGuardContext';
import { DEPLETION_TRAJECTORY_24H, DETECTED_PATTERN_BREAKDOWN } from '../data/mockData';
import TriageDossier from '../components/alerts/TriageDossier';
import Icon from '../components/common/Icon';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const Alerts = () => {
  const navigate = useNavigate();
  const {
    alerts,
    selectedAlertId,
    setSelectedAlertId,
    dispatchTaskforce,
    acknowledgeAlert,
    addToast
  } = useRiverGuard();

  // Filter tab state
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'High Risk' | 'Medium Risk' | 'Low Risk' | 'Active' | 'Resolved'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Severity — Highest First');
  const [selectedIds, setSelectedIds] = useState(['ALT-2025-0982']);

  const selectedAlert = alerts.find(a => a.id === selectedAlertId) || alerts[0];

  // Filtering
  let filteredAlerts = alerts.filter(a => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!a.id.toLowerCase().includes(q) &&
          !a.siteName.toLowerCase().includes(q) &&
          !a.coords.toLowerCase().includes(q)) {
        return false;
      }
    }

    if (activeTab === 'High Risk') return a.riskLevel === 'HIGH';
    if (activeTab === 'Medium Risk') return a.riskLevel === 'MEDIUM';
    if (activeTab === 'Low Risk') return a.riskLevel === 'LOW';
    if (activeTab === 'Active') return !a.workflowStatus.includes('Resolved');
    if (activeTab === 'Resolved') return a.workflowStatus.includes('Resolved');

    return true;
  });

  // Sorting
  filteredAlerts.sort((a, b) => {
    if (sortBy === 'Severity — Highest First') {
      const weight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return (weight[b.riskLevel] || 0) - (weight[a.riskLevel] || 0);
    }
    if (sortBy === 'Volume Extraction (m³)') {
      return (b.estimatedVolumeM3 || 0) - (a.estimatedVolumeM3 || 0);
    }
    return 0; // Most Recent preserves order
  });

  const handleSelectCard = (alertId) => {
    setSelectedAlertId(alertId);
    if (!selectedIds.includes(alertId)) {
      setSelectedIds([alertId]);
    }
  };

  const handleToggleCheckbox = (e, alertId) => {
    e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(alertId) ? prev.filter(id => id !== alertId) : [...prev, alertId]
    );
  };

  const handleBatchAcknowledge = () => {
    selectedIds.forEach(id => acknowledgeAlert(id));
    addToast('Batch Update', `${selectedIds.length} incidents marked as acknowledged by officer.`, 'success');
  };

  const handleExportCsv = () => {
    addToast('Export Generated', 'Incident log exported as CSV: RiverGuard_Incident_Log_2026.csv', 'info');
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Status Strip & Header (Section 7.4) */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/30 mb-2 font-label-code text-label-code-sm">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-secondary font-medium">Live Geofence Radar Active</span>
          <span className="text-on-surface-variant">· Sentinel-2 / PlanetScope Automated Inference</span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-outline-variant/20">
          <div>
            <h2 className="font-headline font-bold text-headline-md text-on-surface">
              Enforcement Alerts & Incident Queue
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-0.5">
              Prioritized multi-sensor anomaly triggers requiring field reconnaissance, formal show-cause notices, or drone tasking.
            </p>
          </div>

          {/* 5 Summary Counts (Section 7.4) */}
          <div className="flex items-center gap-2 font-label-code text-label-code-sm flex-wrap">
            <span className="px-3 py-1 rounded-lg bg-surface-container font-semibold text-on-surface">
              Total Active: 24
            </span>
            <span className="px-3 py-1 rounded-lg bg-risk-high-bg text-risk-high-text font-bold">
              Critical/High: 7
            </span>
            <span className="px-3 py-1 rounded-lg bg-risk-medium-bg text-risk-medium-text font-medium">
              Medium: 11
            </span>
            <span className="px-3 py-1 rounded-lg bg-risk-low-bg text-risk-low-text font-medium">
              Low: 6
            </span>
            <span className="px-3 py-1 rounded-lg bg-surface-container-low text-secondary font-medium border border-secondary/30">
              Resolved Today: 9
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filter & Toolbar Row (Section 7.4) */}
      <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/30 flex items-center justify-between flex-wrap gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center p-1 bg-surface-container-low rounded-lg border border-outline-variant/40 font-label-code text-label-code-sm flex-wrap">
          {['All (24)', 'High Risk (7)', 'Medium Risk (11)', 'Low Risk (6)', 'Active (18)', 'Resolved (6)'].map((tab) => {
            const rawKey = tab.split(' ')[0];
            const isActive = activeTab === rawKey || (activeTab === 'All' && rawKey === 'All');
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(rawKey)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search, Sort, and Batch Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Input */}
          <div className="relative w-64">
            <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Alert ID, River Site..."
              className="w-full pl-9 pr-3 py-1.5 text-body-sm bg-surface-container-low border border-outline-variant/50 rounded-lg text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/50">
            <Icon name="sort" size={16} className="text-on-surface-variant" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-label-code text-label-code-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="Severity — Highest First">Sort by Severity — Highest First</option>
              <option value="Most Recent">Sort by Most Recent</option>
              <option value="Volume Extraction (m³)">Sort by Volume Extraction (m³)</option>
            </select>
          </div>

          {/* Batch Acknowledge */}
          <Button
            variant="secondary"
            icon="task_alt"
            onClick={handleBatchAcknowledge}
            disabled={selectedIds.length === 0}
          >
            Batch Acknowledge
          </Button>

          {/* Export CSV */}
          <Button
            variant="secondary"
            icon="download"
            onClick={handleExportCsv}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* 3. Main Split: Live Incident Priority Queue (~65%) & Forensic Triage Dossier (~35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Incident Priority Queue */}
        <div className="lg:col-span-8 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-8 text-center text-on-surface-variant border border-outline-variant/30">
              No incidents match the selected filter criteria.
            </div>
          ) : (
            filteredAlerts.map((item) => {
              const isSelected = selectedAlertId === item.id;
              const isChecked = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectCard(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-surface-container-lowest ${
                    isSelected
                      ? 'border-secondary shadow-md border-l-[5px] border-l-risk-high' // Static red left-border accent per Section 7.4 (NO blinking/pulsing!)
                      : 'border-outline-variant/30 hover:border-outline-variant shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleToggleCheckbox(e, item.id)}
                        className="mt-1 rounded text-primary focus:ring-primary"
                      />

                      <div>
                        {/* Meta row: Alert ID + Severity + Workflow status + Time */}
                        <div className="flex items-center gap-2 flex-wrap font-label-code text-label-code-sm mb-1">
                          <span className="font-bold text-primary">{item.id}</span>
                          <Badge kind="risk" level={item.riskLevel} />
                          <Badge kind="workflow-status">{item.workflowStatus}</Badge>
                          <span className="text-on-surface-variant ml-1">{item.relativeTime}</span>
                        </div>

                        {/* Site Name and District */}
                        <h4 className="font-headline font-bold text-body-lg text-on-surface">
                          {item.siteName}
                        </h4>
                        <div className="font-label-code text-label-code-sm text-on-surface-variant flex items-center gap-2 mt-0.5">
                          <span>{item.district}</span>
                          <span>·</span>
                          <span className="text-secondary">{item.coords}</span>
                        </div>

                        {/* Pattern Description */}
                        <p className="text-body-sm text-on-surface mt-1.5 leading-relaxed">
                          {item.detectedPattern}
                        </p>

                        {/* Telemetry Tags */}
                        <div className="mt-3 flex items-center gap-3 font-label-code text-label-code-sm flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-surface-container font-semibold text-risk-high">
                            Est. Volume: {item.estimatedVolumeM3?.toLocaleString()} m³
                          </span>
                          <span className="text-on-surface-variant flex items-center gap-1">
                            <Icon name="satellite_alt" size={15} className="text-secondary" />
                            {item.sensor}
                          </span>
                          <span className="text-secondary font-medium">
                            Confidence: {item.confidence}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action Buttons per card */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="primary"
                        icon="compare"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/detection/${item.siteId || 'KV-MOH-04'}`);
                        }}
                      >
                        Inspect AI Imagery
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        icon="send"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatchTaskforce(item.siteId);
                        }}
                      >
                        Dispatch Patrol
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Forensic Triage Dossier */}
        <div className="lg:col-span-4">
          <TriageDossier alert={selectedAlert} />
        </div>
      </div>

      {/* 4. Bottom Row (Section 7.4): 24h Depletion Trajectory & Detected Pattern Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 24h Depletion Trajectory Chart (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon name="speed" size={20} className="text-secondary" />
              <h3 className="font-headline font-semibold text-headline-sm text-on-surface">
                24h Depletion Trajectory
              </h3>
            </div>
            <div className="flex items-center gap-1.5 font-label-code text-label-code-sm text-risk-high font-bold bg-risk-high-bg px-2.5 py-0.5 rounded-full">
              <Icon name="trending_up" size={16} />
              <span>+18.4% vs prev day</span>
            </div>
          </div>

          <div className="h-44 w-full my-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEPLETION_TRAJECTORY_24H} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="depletionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006398" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#006398" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eff4ff" vertical={false} />
                <XAxis dataKey="time" stroke="#757684" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#757684" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip />
                <Area type="monotone" dataKey="extractionM3" stroke="#006398" strokeWidth={2} fillOpacity={1} fill="url(#depletionGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between font-label-code text-label-code-sm text-on-surface-variant">
            <span>Peak extraction rate: 1,980 m³/hr at 15:00 UTC</span>
            <span className="text-secondary font-medium">Night extraction monitoring active</span>
          </div>
        </div>

        {/* Detected Pattern Breakdown Bars (5 cols, relabeled per Section 1) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon name="pie_chart" size={20} className="text-secondary" />
              <h3 className="font-headline font-semibold text-headline-sm text-on-surface">
                Detected Pattern Breakdown
              </h3>
            </div>
            <span className="font-label-code text-label-code-sm text-on-surface-variant">
              Active Incidents
            </span>
          </div>

          <div className="space-y-3.5 my-2">
            {DETECTED_PATTERN_BREAKDOWN.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-body-sm font-medium text-on-surface mb-1">
                  <span>{item.label}</span>
                  <span className="font-label-code text-label-code-sm text-secondary font-bold">
                    {item.percentage}% ({item.count})
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-surface-container-low overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-outline-variant/20 text-body-sm text-on-surface-variant flex items-center justify-between">
            <span>AI Automated Typology Classification</span>
            <span className="font-label-code text-label-code-sm text-secondary font-semibold">
              DeepHydro-SandNet
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
