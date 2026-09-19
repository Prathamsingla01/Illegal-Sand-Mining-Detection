import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RiverGuardProvider } from './context/RiverGuardContext';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import MonitoringSites from './pages/MonitoringSites';
import SiteDetails from './pages/SiteDetails';
import DetectionAnalysis from './pages/DetectionAnalysis';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import ReportPreview from './pages/ReportPreview';
import Settings from './pages/Settings';

function App() {
  return (
    <RiverGuardProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="sites" element={<MonitoringSites />} />
            <Route path="sites/:siteId" element={<SiteDetails />} />
            <Route path="detection" element={<DetectionAnalysis />} />
            <Route path="detection/:siteId" element={<DetectionAnalysis />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="alerts/:alertId" element={<Alerts />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reports/:reportId" element={<ReportPreview />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RiverGuardProvider>
  );
}

export default App;
