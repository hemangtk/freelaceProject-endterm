// services/exportService.js

// Helper function to convert array to CSV
export const arrayToCSV = (data) => {
    if (!data || !data.length) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(value => {
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        // Format date objects
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      }).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };
  
  // Helper function to convert array to JSON
  export const arrayToJSON = (data) => {
    return JSON.stringify(data, (key, value) => {
      // Convert Date objects to ISO strings
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }, 2);
  };
  
  // Format time entries for export
  export const formatTimeEntriesForExport = (timeEntries, projects, clients) => {
    return timeEntries.map(entry => {
      const project = projects.find(p => p.id === entry.projectId) || {};
      const client = clients.find(c => c.id === project.clientId) || {};
      
      return {
        timeEntryId: entry.id,
        projectName: project.name || 'Unknown Project',
        clientName: client.name || 'Unknown Client',
        startTime: new Date(entry.startTime).toISOString(),
        endTime: entry.endTime ? new Date(entry.endTime).toISOString() : '',
        durationHours: (entry.duration / 3600).toFixed(2),
        notes: entry.notes || ''
      };
    });
  };
  
  // Format projects for export
  export const formatProjectsForExport = (projects, clients) => {
    return projects.map(project => {
      const client = clients.find(c => c.id === project.clientId) || {};
      
      return {
        projectId: project.id,
        projectName: project.name,
        clientName: client.name || 'Unknown Client',
        description: project.description || '',
        hourlyRate: project.hourlyRate,
        status: project.status
      };
    });
  };
  
  // Format clients for export
  export const formatClientsForExport = (clients) => {
    return clients.map(client => ({
      clientId: client.id,
      clientName: client.name,
      email: client.email || '',
      phone: client.phone || ''
    }));
  };
  
  // Format invoices for export
  export const formatInvoicesForExport = (invoices, clients, projects) => {
    return invoices.map(invoice => {
      const client = clients.find(c => c.id === invoice.clientId) || {};
      const project = projects.find(p => p.id === invoice.projectId) || {};
      
      return {
        invoiceId: invoice.id,
        invoiceNumber: `INV-${invoice.id.substring(0, 6)}`,
        clientName: client.name || 'Unknown Client',
        projectName: project.name || 'Unknown Project',
        createdAt: new Date(invoice.createdAt).toISOString(),
        startDate: new Date(invoice.startDate).toISOString(),
        endDate: new Date(invoice.endDate).toISOString(),
        totalHours: invoice.totalHours,
        hourlyRate: invoice.hourlyRate,
        totalAmount: invoice.totalAmount,
        status: invoice.status,
        notes: invoice.notes || ''
      };
    });
  };
  
  // Main export function
  export const exportData = (type, data, format = 'csv') => {
    let formattedData;
    let fileName;
    
    switch (type) {
      case 'clients':
        formattedData = formatClientsForExport(data.clients);
        fileName = `clients_export_${new Date().toISOString().slice(0, 10)}`;
        break;
      case 'projects':
        formattedData = formatProjectsForExport(data.projects, data.clients);
        fileName = `projects_export_${new Date().toISOString().slice(0, 10)}`;
        break;
      case 'timeEntries':
        formattedData = formatTimeEntriesForExport(data.timeEntries, data.projects, data.clients);
        fileName = `time_entries_export_${new Date().toISOString().slice(0, 10)}`;
        break;
      case 'invoices':
        formattedData = formatInvoicesForExport(data.invoices, data.clients, data.projects);
        fileName = `invoices_export_${new Date().toISOString().slice(0, 10)}`;
        break;
      default:
        throw new Error(`Unsupported export type: ${type}`);
    }
    
    let content;
    let mimeType;
    
    if (format === 'csv') {
      content = arrayToCSV(formattedData);
      mimeType = 'text/csv';
      fileName += '.csv';
    } else if (format === 'json') {
      content = arrayToJSON(formattedData);
      mimeType = 'application/json';
      fileName += '.json';
    } else {
      throw new Error(`Unsupported export format: ${format}`);
    }
    
    // Create download link
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return fileName;
  };