import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { EXTRACTION_TREND_DATA } from '../../data/mockData';
import Icon from '../common/Icon';

export const ExtractionTrendChart = () => {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon name="trending_up" size={20} className="text-secondary" />
          <h3 className="font-headline font-semibold text-headline-sm text-on-surface">
            Extraction Trend & Volumetric Fluctuations (14 Days)
          </h3>
        </div>
        <div className="flex items-center gap-4 font-label-code text-label-code-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-primary-container" />
            <span className="text-on-surface-variant">Daily Volume (m³)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-risk-high" />
            <span className="text-on-surface-variant">Surge Anomaly</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-56 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={EXTRACTION_TREND_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eff4ff" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#757684"
              fontSize={11}
              fontFamily="JetBrains Mono"
            />
            <YAxis
              stroke="#757684"
              fontSize={11}
              fontFamily="JetBrains Mono"
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k m³`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-surface-container-lowest p-3 rounded-lg shadow-md border border-outline-variant/50 font-label-code text-label-code-sm">
                      <p className="font-bold text-on-surface mb-1">{label} 2026</p>
                      <p className={data.isPeak ? 'text-risk-high font-bold' : 'text-primary'}>
                        Estimated Volume: {data.volume.toLocaleString()} m³
                      </p>
                      {data.isPeak && (
                        <p className="text-risk-high text-label-code-xs font-semibold mt-0.5">
                          ⚠ Peak Anomaly Surge (+144%)
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Bar with dynamic colors: alert red on peak day, primary blue on others */}
            <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
              {EXTRACTION_TREND_DATA.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isPeak ? '#dc2626' : '#1e40af'}
                />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#5bb8fe"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Stats (from Section 7.1) */}
      <div className="mt-2 pt-3 border-t border-outline-variant/20 flex items-center justify-between flex-wrap gap-3">
        <div className="font-label-code text-label-code-sm text-on-surface">
          <span className="text-on-surface-variant">Daily Mean Extraction: </span>
          <strong className="text-primary font-semibold">11,600 m³/day</strong>
        </div>
        <div className="font-label-code text-label-code-sm text-risk-high">
          <span className="text-on-surface-variant">Peak Incident Surge: </span>
          <strong className="font-semibold">+144% above threshold (18 Sep)</strong>
        </div>
      </div>
    </div>
  );
};

export default ExtractionTrendChart;
