import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../common/Icon';
import Badge from '../common/Badge';

export const RecentAlertsFeed = ({ alerts = [] }) => {
  const navigate = useNavigate();

  // Pick first 4 alerts, including 1 resolved
  const feedAlerts = alerts.slice(0, 4);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 flex flex-col justify-between h-full">
      {/* Feed Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <Icon name="warning" size={20} className="text-secondary" />
          <h3 className="font-headline font-semibold text-headline-sm text-on-surface">
            Recent Alerts Feed
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full font-label-code text-label-code-sm font-semibold bg-risk-high-bg text-risk-high-text">
          3 Unresolved
        </span>
      </div>

      {/* Incident List */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {feedAlerts.map((alert, idx) => {
          const isResolved = alert.workflowStatus?.includes('Resolved') || idx === 3;
          const isHigh = alert.riskLevel === 'HIGH' && !isResolved;
          const dotColor = isResolved ? '#16a34a' : isHigh ? '#dc2626' : '#d97706';

          return (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isResolved
                  ? 'bg-surface-container-low/40 border-outline-variant/30 opacity-80'
                  : 'bg-surface-container-low border-outline-variant/50 hover:border-secondary shadow-sm'
              }`}
            >
              {/* Card Meta Row */}
              <div className="flex items-center justify-between font-label-code text-label-code-sm mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
                  <span className={`font-semibold ${isResolved ? 'text-on-surface-variant' : 'text-risk-high'}`}>
                    {alert.id}
                  </span>
                </div>
                <span className="text-on-surface-variant">{alert.relativeTime}</span>
              </div>

              {/* Site Name */}
              <h4 className="font-headline font-bold text-body-md text-on-surface">
                {alert.siteName}
              </h4>

              {/* One line description */}
              <p className="text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                {alert.detectedPattern}
              </p>

              {/* Footer row: Workflow chip + links */}
              <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between flex-wrap gap-2">
                <Badge
                  kind="workflow-status"
                  className={isResolved ? 'bg-risk-low-bg text-risk-low-text border-risk-low/30' : ''}
                >
                  {isResolved ? 'Resolved (Permit WRD-041)' : alert.workflowStatus}
                </Badge>

                <div className="flex items-center gap-3">
                  {!isResolved ? (
                    <button
                      onClick={() => navigate(`/detection/${alert.siteId || 'KV-MOH-04'}`)}
                      className="font-label-code text-label-code-sm text-secondary hover:text-primary font-medium flex items-center gap-1 hover:underline"
                    >
                      Inspect AI Imagery <Icon name="arrow_forward" size={14} />
                    </button>
                  ) : (
                    <span className="font-label-code text-label-code-sm text-risk-low flex items-center gap-1">
                      <Icon name="check_circle" size={16} /> Verified Compliant
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Link */}
      <div className="mt-3 pt-3 border-t border-outline-variant/20 text-center">
        <button
          onClick={() => navigate('/alerts')}
          className="font-label-code text-label-code-sm text-secondary hover:text-primary font-semibold hover:underline"
        >
          View All Incident Queues ({alerts.length}) →
        </button>
      </div>
    </div>
  );
};

export default RecentAlertsFeed;
