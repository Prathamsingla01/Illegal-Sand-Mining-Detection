import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MONITORING_SITES,
  DETECTIONS,
  ALERTS,
  REPORTS,
  BASIN_OPTIONS,
  DATE_RANGE_OPTIONS,
  SEVERITY_OPTIONS
} from '../data/mockData';

const RiverGuardContext = createContext(null);

export const RiverGuardProvider = ({ children }) => {
  const [sites, setSites] = useState(MONITORING_SITES);
  const [detections, setDetections] = useState(DETECTIONS);
  const [alerts, setAlerts] = useState(ALERTS);
  const [reports, setReports] = useState(REPORTS);

  // Global filters
  const [selectedBasin, setSelectedBasin] = useState(BASIN_OPTIONS[1]); // Kaveri & Godavari 4B
  const [selectedDateRange, setSelectedDateRange] = useState(DATE_RANGE_OPTIONS[0]); // Last 7 Days
  const [selectedSeverity, setSelectedSeverity] = useState(SEVERITY_OPTIONS[0]); // All Incidents
  const [globalSearch, setGlobalSearch] = useState('');

  // Selected item references for deep inspection
  const [selectedAlertId, setSelectedAlertId] = useState('ALT-2025-0982');
  const [selectedSiteId, setSelectedSiteId] = useState('KV-MOH-04');

  // Toasts / notifications
  const [toasts, setToasts] = useState([]);

  // User Profile (Settings)
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('riverguard_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      name: 'Insp. Sarah Jensen',
      role: 'GIS Enforcement Lead',
      agency: 'Dept. of Water Resources / River Protection Wing',
      badgeId: 'TN-WRD-9402',
      email: 's.jensen@water-enforcement.gov.in',
      phone: '+91 94432 88190',
      highRiskAlerts: true,
      mediumRiskAlerts: true,
      lowRiskAlerts: false,
      soundAlerts: true,
      confidenceThreshold: 85,
      autoSyncHours: 6
    };
  });

  useEffect(() => {
    localStorage.setItem('riverguard_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Workflow actions
  const dispatchTaskforce = (siteId, notes = '') => {
    const site = sites.find(s => s.id === siteId);
    const siteName = site ? site.siteName : siteId;
    
    // Update alert status if exists
    setAlerts(prev => prev.map(a => {
      if (a.siteId === siteId) {
        return { ...a, workflowStatus: 'Patrol Dispatched (Unit 4 On-Site)' };
      }
      return a;
    }));

    addToast(
      'River Taskforce Dispatched',
      `Interdiction patrol deployed to ${siteName}. Estimated ground arrival: 45 minutes.`,
      'success'
    );
  };

  const notifyMagistrate = (siteId) => {
    const site = sites.find(s => s.id === siteId);
    const siteName = site ? site.siteName : siteId;
    
    setAlerts(prev => prev.map(a => {
      if (a.siteId === siteId) {
        return { ...a, workflowStatus: 'Under Legal Review' };
      }
      return a;
    }));

    addToast(
      'Statutory Notice Transmitted',
      `Preliminary evidentiary dossier forwarded to District Magistrate collectorate for ${siteName}.`,
      'info'
    );
  };

  const scheduleUav = (siteId) => {
    const site = sites.find(s => s.id === siteId);
    const siteName = site ? site.siteName : siteId;
    
    setAlerts(prev => prev.map(a => {
      if (a.siteId === siteId) {
        return { ...a, workflowStatus: 'Drone Verification Scheduled' };
      }
      return a;
    }));

    addToast(
      'UAV Sortie Scheduled',
      `Autonomous drone mission queued for ${siteName}. Target window: next daylight optical pass.`,
      'info'
    );
  };

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return { ...a, workflowStatus: 'Under Officer Review' };
      }
      return a;
    }));
    addToast('Alert Acknowledged', `Alert ${alertId} logged into officer review workflow.`, 'info');
  };

  const addGeofence = (newSiteData) => {
    const newSite = {
      id: `KV-NEW-${String(sites.length + 1).padStart(2, '0')}`,
      river: newSiteData.river || 'Kaveri River',
      siteName: newSiteData.siteName || 'New Riverbed Geofence',
      district: newSiteData.district || 'Namakkal',
      latitude: newSiteData.latitude || 11.12,
      longitude: newSiteData.longitude || 78.20,
      risk: 'LOW',
      leaseStatus: newSiteData.leaseStatus || 'Permitted / Compliant',
      lastObservation: '2026-09-20',
      lastPassOrbit: '#49135',
      sensor: 'Sentinel-2A MSI',
      cloudCover: 0.01,
      detectedChangesCount: 0,
      detectedChangeReason: 'Baseline geofence registered',
      estimatedDepletionVolumeM3: 0,
      areaSqM: newSiteData.areaSqM || 25000,
      activeSorties: 'Assigned Surveillance Unit',
      hasActiveDetection: false,
      summary: 'New monitored polygon perimeter registered into automated hydrological inference pipeline.'
    };
    setSites(prev => [newSite, ...prev]);
    addToast('Geofence Created', `Site ${newSite.id} (${newSite.siteName}) successfully added to surveillance radar.`, 'success');
  };

  const activeAlertsCount = alerts.filter(a => a.workflowStatus !== 'Resolved · Permit Verified').length;

  return (
    <RiverGuardContext.Provider value={{
      sites,
      detections,
      alerts,
      reports,
      selectedBasin,
      setSelectedBasin,
      selectedDateRange,
      setSelectedDateRange,
      selectedSeverity,
      setSelectedSeverity,
      globalSearch,
      setGlobalSearch,
      selectedAlertId,
      setSelectedAlertId,
      selectedSiteId,
      setSelectedSiteId,
      userProfile,
      setUserProfile,
      toasts,
      addToast,
      removeToast,
      activeAlertsCount,
      dispatchTaskforce,
      notifyMagistrate,
      scheduleUav,
      acknowledgeAlert,
      addGeofence
    }}>
      {children}
    </RiverGuardContext.Provider>
  );
};

export const useRiverGuard = () => {
  const context = useContext(RiverGuardContext);
  if (!context) {
    throw new Error('useRiverGuard must be used within a RiverGuardProvider');
  }
  return context;
};
