import {
  MONITORING_SITES,
  DETECTIONS,
  ALERTS,
  REPORTS
} from '../data/mockData';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Frontend API Service Layer
 * 
 * Note: Backend integration will be connected after the FastAPI + PostgreSQL
 * backend is completed. For now, this service layer defines the future API interface
 * while utilizing mock data to ensure full frontend functionality.
 */
export const api = {
  getHealth: async () => {
    // Future: GET /api/health
    return { status: 'ok', apiBaseUrl: API_BASE_URL };
  },

  getSites: async () => {
    // Future: GET /api/sites
    return MONITORING_SITES;
  },

  getSite: async (siteId) => {
    // Future: GET /api/sites/{siteId}
    return MONITORING_SITES.find(s => s.id === siteId) || null;
  },

  getDetections: async () => {
    // Future: GET /api/detections
    return DETECTIONS;
  },

  getDetection: async (detectionId) => {
    // Future: GET /api/detections/{detectionId}
    return DETECTIONS.find(d => d.id === detectionId) || null;
  },

  getAlerts: async () => {
    // Future: GET /api/alerts
    return ALERTS;
  },

  getAlert: async (alertId) => {
    // Future: GET /api/alerts/{alertId}
    return ALERTS.find(a => a.id === alertId) || null;
  },

  getReports: async () => {
    // Future: GET /api/reports
    return REPORTS;
  },

  getReport: async (reportId) => {
    // Future: GET /api/reports/{reportId}
    return REPORTS.find(r => r.id === reportId) || null;
  },

  createGeofence: async (data) => {
    // Future: POST /api/sites
    return { success: true, data };
  },

  uploadAnalysisImage: async (file, siteId) => {
    // Future: POST /api/analyze
    return { success: true, siteId, fileName: file?.name };
  }
};

export default api;
