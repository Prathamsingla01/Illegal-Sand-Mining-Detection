import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import { BATHYMETRIC_CROSS_SECTION } from '../../data/mockData';
import Icon from '../common/Icon';

export const BathymetricChart = () => {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="waves" size={20} className="text-secondary" />
            <h3 className="font-headline font-semibold text-headline-sm text-on-surface">
              Bathymetric Depth Profile & Sub-Surface Relief
            </h3>
          </div>
          <p className="font-label-code text-label-code-sm text-on-surface-variant mt-0.5">
            Cross-sectional transect (Transect X-4B) · Sensor: InSAR & Dual-Frequency LiDAR Inversion
          </p>
        </div>

        {/* Tone-Safe Callout Box per Section 1: "2.85m Over Permitted Depth Limit" */}
        <div className="px-3 py-1.5 rounded-lg bg-risk-high-bg border border-risk-high/30 text-right">
          <span className="font-label-code text-label-code-xs uppercase tracking-wider text-risk-high-text block">
            CRITICAL DEPTH BREACH
          </span>
          <span className="font-label-code text-label-code-sm font-bold text-risk-high-text">
            Maximum Pit Depth: -3.85m (2.85m Over Permitted Depth Limit)
          </span>
        </div>
      </div>

      {/* Recharts Bathymetric Cross-Section */}
      <div className="h-64 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={BATHYMETRIC_CROSS_SECTION} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dce9ff" vertical={false} />
            <XAxis
              dataKey="distanceM"
              stroke="#757684"
              fontSize={11}
              fontFamily="JetBrains Mono"
              tickFormatter={(v) => `${v}m`}
            />
            <YAxis
              domain={[-4.5, 1.0]}
              stroke="#757684"
              fontSize={11}
              fontFamily="JetBrains Mono"
              tickFormatter={(v) => `${v}m`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-surface-container-lowest p-3 rounded-lg shadow-md border border-outline-variant/50 font-label-code text-label-code-sm">
                      <p className="font-bold text-on-surface mb-1">Transect Distance: {label}m</p>
                      <p className="text-secondary">Baseline Bed: {payload[0]?.value}m</p>
                      <p className="text-risk-high font-semibold">Current Excavated Bed: {payload[1]?.value}m</p>
                      <p className="text-[#16a34a]">Permitted Limit: -1.0m</p>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Annotated Reference Lines */}
            <ReferenceLine y={0.5} stroke="#006398" strokeDasharray="4 4" label={{ value: 'High-Water Mark (+0.5m)', position: 'right', fill: '#006398', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            <ReferenceLine y={-1.0} stroke="#16a34a" strokeWidth={2} strokeDasharray="6 4" label={{ value: 'Permitted Dredge Limit (-1.0m)', position: 'right', fill: '#16a34a', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            <ReferenceLine y={-3.85} stroke="#dc2626" strokeWidth={1.5} strokeDasharray="2 2" label={{ value: 'Pit Floor (-3.85m)', position: 'left', fill: '#dc2626', fontSize: 10, fontFamily: 'JetBrains Mono' }} />

            {/* Baseline bed line */}
            <Line
              type="monotone"
              dataKey="baselineBed"
              stroke="#006398"
              strokeWidth={2}
              dot={{ r: 3, fill: '#006398' }}
              name="Baseline Bed (Aug 2026)"
            />

            {/* Current excavated pit line */}
            <Line
              type="monotone"
              dataKey="currentBed"
              stroke="#dc2626"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#dc2626' }}
              name="Current Excavated Bed (Sep 2026)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Three Sub-Surface Readout Stats Below Chart (Section 7.3) */}
      <div className="mt-3 pt-3 border-t border-outline-variant/20 grid grid-cols-3 gap-3">
        <div className="bg-surface-container-low p-3 rounded-lg">
          <span className="font-label-code text-label-code-xs uppercase text-on-surface-variant block font-medium">
            Mean Sand Thickness
          </span>
          <span className="font-headline font-bold text-headline-sm text-on-surface">
            1.4m
          </span>
          <span className="text-body-sm text-on-surface-variant block mt-0.5">
            Depleted from 3.6m baseline
          </span>
        </div>

        <div className="bg-surface-container-low p-3 rounded-lg">
          <span className="font-label-code text-label-code-xs uppercase text-on-surface-variant block font-medium">
            Embankment Shear Angle
          </span>
          <span className="font-headline font-bold text-headline-sm text-risk-high">
            38°
          </span>
          <span className="text-body-sm text-risk-high font-medium block mt-0.5">
            Collapse Risk (Safety factor &lt; 1.1)
          </span>
        </div>

        <div className="bg-surface-container-low p-3 rounded-lg">
          <span className="font-label-code text-label-code-xs uppercase text-on-surface-variant block font-medium">
            Aquifer Exposure Status
          </span>
          <span className="font-headline font-semibold text-body-lg text-risk-high block mt-0.5">
            Breached
          </span>
          <span className="text-body-sm text-on-surface-variant block">
            Shallow perched water table exposed
          </span>
        </div>
      </div>
    </div>
  );
};

export default BathymetricChart;
