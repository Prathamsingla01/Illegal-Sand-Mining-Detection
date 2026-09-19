import React from 'react';
import Icon from './Icon';

export const StatCard = ({
  label,
  value,
  subtext,
  icon,
  badge = null,
  trend = null, // { text: '+12 added', positive: true/false }
  footerRight = null,
  accentColor = null,
  className = ''
}) => {
  return (
    <div className={`bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between ${className}`}>
      {/* Top row: Label & Icon */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-col">
          <span className="font-label-code text-label-code-sm uppercase tracking-wider text-on-surface-variant font-medium">
            {label}
          </span>
        </div>
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container shrink-0">
            <Icon name={icon} size={20} />
          </div>
        )}
      </div>

      {/* Middle row: Big Value + optional badge */}
      <div className="flex items-baseline gap-2.5 my-1">
        <span className="font-headline font-bold text-headline-md text-on-surface tracking-tight">
          {value}
        </span>
        {badge && <div>{badge}</div>}
      </div>

      {/* Footer row: Trend and context info */}
      <div className="mt-2 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-body-sm text-on-surface-variant">
        <div className="flex items-center gap-1.5 font-label-code text-label-code-sm">
          {trend && (
            <span className={`inline-flex items-center font-medium ${trend.positive ? 'text-secondary' : 'text-risk-high'}`}>
              <Icon name={trend.positive ? 'trending_up' : 'trending_down'} size={14} className="mr-0.5" />
              {trend.text}
            </span>
          )}
          {subtext && !trend && <span>{subtext}</span>}
        </div>
        {footerRight && (
          <span className="font-label-code text-label-code-sm text-on-surface-variant/80">
            {footerRight}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
