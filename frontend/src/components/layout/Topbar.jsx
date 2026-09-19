import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRiverGuard } from '../../context/RiverGuardContext';
import Icon from '../common/Icon';

export const Topbar = () => {
  const navigate = useNavigate();
  const {
    sites,
    alerts,
    activeAlertsCount,
    userProfile,
    setSelectedSiteId,
    setSelectedAlertId
  } = useRiverGuard();

  const [searchVal, setSearchVal] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Search filter
  const filteredSites = sites.filter(s =>
    s.siteName.toLowerCase().includes(searchVal.toLowerCase()) ||
    s.id.toLowerCase().includes(searchVal.toLowerCase()) ||
    s.river.toLowerCase().includes(searchVal.toLowerCase())
  ).slice(0, 4);

  const filteredAlerts = alerts.filter(a =>
    a.id.toLowerCase().includes(searchVal.toLowerCase()) ||
    a.siteName.toLowerCase().includes(searchVal.toLowerCase())
  ).slice(0, 3);

  const handleSelectSite = (siteId) => {
    setSelectedSiteId(siteId);
    setShowSearchResults(false);
    setSearchVal('');
    navigate(`/sites/${siteId}`);
  };

  const handleSelectAlert = (alertId) => {
    setSelectedAlertId(alertId);
    setShowSearchResults(false);
    setSearchVal('');
    navigate('/alerts');
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm z-30 px-6 flex items-center justify-between">
      {/* Search Input with dropdown jump */}
      <div className="relative w-96">
        <div className="relative flex items-center">
          <Icon name="search" size={18} className="absolute left-3 text-on-surface-variant pointer-events-none" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              setShowSearchResults(e.target.value.trim().length > 0);
            }}
            onFocus={() => {
              if (searchVal.trim().length > 0) setShowSearchResults(true);
            }}
            placeholder="Search river site, coordinates (lat/lng), or Alert ID..."
            className="w-full pl-9 pr-4 py-1.5 text-body-sm bg-surface-container-low border border-outline-variant/50 rounded-lg text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
          />
          {searchVal && (
            <button
              onClick={() => {
                setSearchVal('');
                setShowSearchResults(false);
              }}
              className="absolute right-2.5 text-on-surface-variant hover:text-on-surface"
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>

        {/* Live Search Popup */}
        {showSearchResults && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/40 overflow-hidden z-50">
            {filteredSites.length === 0 && filteredAlerts.length === 0 ? (
              <div className="p-4 text-center text-body-sm text-on-surface-variant">
                No matching river sites or alerts found.
              </div>
            ) : (
              <div className="py-2 divide-y divide-outline-variant/20 max-h-80 overflow-y-auto">
                {filteredSites.length > 0 && (
                  <div>
                    <div className="px-3 py-1 font-label-code text-label-code-sm uppercase text-on-surface-variant font-medium">
                      Monitoring Sites
                    </div>
                    {filteredSites.map(s => (
                      <button
                        key={s.id}
                        onClick={() => handleSelectSite(s.id)}
                        className="w-full text-left px-3.5 py-2 hover:bg-surface-container flex items-center justify-between text-body-sm transition-colors"
                      >
                        <div>
                          <span className="font-semibold text-on-surface">{s.siteName}</span>
                          <span className="ml-2 font-label-code text-label-code-sm text-secondary">[{s.id}]</span>
                        </div>
                        <span className="font-label-code text-label-code-sm text-on-surface-variant">{s.river}</span>
                      </button>
                    ))}
                  </div>
                )}
                {filteredAlerts.length > 0 && (
                  <div>
                    <div className="px-3 py-1 font-label-code text-label-code-sm uppercase text-on-surface-variant font-medium">
                      Alerts
                    </div>
                    {filteredAlerts.map(a => (
                      <button
                        key={a.id}
                        onClick={() => handleSelectAlert(a.id)}
                        className="w-full text-left px-3.5 py-2 hover:bg-surface-container flex items-center justify-between text-body-sm transition-colors"
                      >
                        <div>
                          <span className="font-label-code text-label-code-sm font-semibold text-risk-high">{a.id}</span>
                          <span className="ml-2 text-on-surface">{a.siteName}</span>
                        </div>
                        <span className="font-label-code text-label-code-sm text-on-surface-variant">{a.relativeTime}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Agency Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/40">
          <Icon name="shield" size={16} className="text-secondary" />
          <span className="font-label-code text-label-code-sm uppercase font-semibold text-secondary tracking-wider">
            DEFENSE / DEPT. OF WATER RESOURCES
          </span>
        </div>

        {/* Notifications Icon with popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Active Notifications"
          >
            <Icon name="notifications" size={20} />
            {activeAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-risk-high animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/40 p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline-variant/30">
                <span className="font-headline font-semibold text-body-md text-on-surface">
                  Live Notifications ({activeAlertsCount})
                </span>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/alerts');
                  }}
                  className="font-label-code text-label-code-sm text-secondary hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {alerts.slice(0, 3).map(a => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setSelectedAlertId(a.id);
                      setShowNotifications(false);
                      navigate('/alerts');
                    }}
                    className="p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-code text-label-code-sm font-semibold text-risk-high">{a.id}</span>
                      <span className="font-label-code text-label-code-sm text-on-surface-variant">{a.relativeTime}</span>
                    </div>
                    <p className="text-body-sm font-medium text-on-surface truncate">{a.siteName}</p>
                    <p className="text-body-sm text-on-surface-variant line-clamp-1">{a.detectedPattern}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile display */}
        <div className="flex items-center gap-3 pl-3 border-l border-outline-variant/30">
          <div className="text-right">
            <div className="font-headline font-semibold text-body-md text-on-surface leading-tight">
              {userProfile.name}
            </div>
            <div className="font-label-code text-label-code-sm text-on-surface-variant">
              {userProfile.role}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container border-2 border-secondary-container flex items-center justify-center text-primary font-headline font-bold text-headline-sm overflow-hidden shadow-sm">
            {/* Illustrated avatar / initial */}
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <rect width="40" height="40" fill="#eff4ff" />
              <circle cx="20" cy="15" r="7" fill="#00288E" />
              <path d="M7 36c0-6 5.8-11 13-11s13 5 13 11z" fill="#006398" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
