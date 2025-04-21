// components/common/Export.jsx
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const Export = () => {
  const { projects, timeEntries, clients, invoices } = useAppContext();
  const [exportFormat, setExportFormat] = useState('json');
  const [exportType, setExportType] = useState('all');
  const [message, setMessage] = useState('');

  const handleExport = () => {
    let dataToExport = {};

    switch (exportType) {
      case 'all':
        dataToExport = {
          projects,
          timeEntries,
          clients,
          invoices
        };
        break;
      case 'projects':
        dataToExport = projects;
        break;
      case 'timeEntries':
        dataToExport = timeEntries;
        break;
      case 'clients':
        dataToExport = clients;
        break;
      case 'invoices':
        dataToExport = invoices;
        break;
      default:
        dataToExport = {};
    }

    if (exportFormat === 'json') {
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `${exportType}-data.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else if (exportFormat === 'csv') {
      // Convert to CSV format
      let csvContent = '';
      
      if (Array.isArray(dataToExport)) {
        if (dataToExport.length > 0) {
          // Get headers
          const headers = Object.keys(dataToExport[0]);
          csvContent += headers.join(',') + '\n';
          
          // Add data rows
          dataToExport.forEach(item => {
            const row = headers.map(header => {
              const value = item[header];
              return typeof value === 'string' ? `"${value}"` : value;
            });
            csvContent += row.join(',') + '\n';
          });
        }
      }

      const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      const exportFileDefaultName = `${exportType}-data.csv`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }

    setMessage('Data exported successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="export-container">
      {message && (
        <div className="success-message">
          {message}
        </div>
      )}
      
      <div className="export-form">
        <div className="form-group">
          <label htmlFor="exportType">Export Type</label>
          <select
            id="exportType"
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
          >
            <option value="all">All Data</option>
            <option value="projects">Projects</option>
            <option value="timeEntries">Time Entries</option>
            <option value="clients">Clients</option>
            <option value="invoices">Invoices</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="exportFormat">Format</label>
          <select
            id="exportFormat"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
        </div>

        <button className="export-button" onClick={handleExport}>
          Export Data
        </button>
      </div>

      <div className="export-info">
        <h3>Export Information</h3>
        <ul>
          <li>JSON format is recommended for full data export</li>
          <li>CSV format is better for spreadsheet applications</li>
          <li>All dates are exported in ISO format</li>
          <li>Exported data can be imported back into the application</li>
        </ul>
      </div>
    </div>
  );
};

export default Export;