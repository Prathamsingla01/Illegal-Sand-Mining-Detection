import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRiverGuard } from '../context/RiverGuardContext';
import Icon from '../components/common/Icon';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

export const Reports = () => {
  const navigate = useNavigate();
  const { reports, addToast } = useRiverGuard();
  const [filterQuery, setFilterQuery] = useState('');

  const filteredReports = reports.filter(r =>
    r.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
    r.siteName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    r.river.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleDownloadPdf = (reportId) => {
    navigate(`/reports/${reportId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-outline-variant/20">
        <div>
          <h2 className="font-headline font-bold text-headline-md text-on-surface">
            Forensic & Compliance Dossier Archive
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Certified multi-temporal satellite investigation reports formatted for statutory administrative inquiries.
          </p>
        </div>

        <div className="relative w-72">
          <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search dossier reports..."
            className="w-full pl-9 pr-3 py-1.5 text-body-sm bg-surface-container-low border border-outline-variant/50 rounded-lg text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-secondary"
          />
        </div>
      </div>

      {/* Reports Table (Section 7.6) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30 font-label-code text-label-code-sm uppercase text-on-surface-variant">
              <th className="p-4">Report ID</th>
              <th className="p-4">River Site Reach</th>
              <th className="p-4">Date</th>
              <th className="p-4">Detection Type</th>
              <th className="p-4 text-right">Affected Area (m²)</th>
              <th className="p-4 text-right">Est. Volume (m³)</th>
              <th className="p-4">Risk Severity</th>
              <th className="p-4">Review Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 font-label-code text-label-code-sm">
            {filteredReports.map((report) => (
              <tr key={report.id} className="hover:bg-surface-container-low/60 transition-colors">
                <td className="p-4 font-bold text-primary">{report.id}</td>
                <td className="p-4 font-sans font-semibold text-on-surface">
                  {report.siteName}
                  <span className="block text-body-xs font-label-code text-on-surface-variant font-normal">
                    {report.river} · {report.district}
                  </span>
                </td>
                <td className="p-4 text-on-surface-variant">{report.date}</td>
                <td className="p-4 text-secondary">{report.detectionType}</td>
                <td className="p-4 text-right font-medium text-on-surface">
                  {report.affectedAreaM2?.toLocaleString()}
                </td>
                <td className="p-4 text-right font-bold text-risk-high">
                  {report.estimatedVolumeM3?.toLocaleString()}
                </td>
                <td className="p-4">
                  <Badge kind="risk" level={report.risk} />
                </td>
                <td className="p-4">
                  <Badge kind="workflow-status">{report.status}</Badge>
                </td>
                <td className="p-4 text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon="visibility"
                    onClick={() => navigate(`/reports/${report.id}`)}
                  >
                    View Report
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    icon="download"
                    onClick={() => handleDownloadPdf(report.id)}
                  >
                    PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
