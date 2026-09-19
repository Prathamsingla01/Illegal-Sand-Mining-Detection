import React from 'react';

export const Badge = ({
  children,
  kind = 'risk', // 'risk' | 'workflow-status' | 'neutral' | 'outline'
  level = 'LOW', // 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL'
  className = '',
  showDot = true
}) => {
  const normLevel = String(level).toUpperCase();

  if (kind === 'risk') {
    if (normLevel === 'HIGH' || normLevel === 'CRITICAL') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-code text-label-code-sm font-semibold bg-risk-high-bg text-risk-high-text ${className}`}>
          {showDot && <span className="w-1.5 h-1.5 rounded-full bg-risk-high" />}
          {children || 'HIGH RISK'}
        </span>
      );
    }
    if (normLevel === 'MEDIUM') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-code text-label-code-sm font-semibold bg-risk-medium-bg text-risk-medium-text ${className}`}>
          {showDot && <span className="w-1.5 h-1.5 rounded-full bg-risk-medium" />}
          {children || 'MEDIUM RISK'}
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-code text-label-code-sm font-semibold bg-risk-low-bg text-risk-low-text ${className}`}>
        {showDot && <span className="w-1.5 h-1.5 rounded-full bg-risk-low" />}
        {children || 'LOW RISK / SAFE'}
      </span>
    );
  }

  if (kind === 'workflow-status') {
    // Neutral workflow state chip (Verification Queue, Dispatch Advisory, etc.)
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-code text-label-code-sm font-medium bg-surface-container text-on-surface-variant border border-outline-variant/60 ${className}`}>
        {showDot && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
        {children}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-code text-label-code-sm font-medium bg-surface-container text-on-surface-variant ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
