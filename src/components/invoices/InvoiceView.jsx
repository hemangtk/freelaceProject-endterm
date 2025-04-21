// components/invoices/InvoiceView.jsx
import { useAppContext } from '../../context/AppContext';
import { format } from 'date-fns';
import InvoicePDF from './InvoicePDF';

const InvoiceView = ({ invoice, onClose }) => {
  const { clients, projects } = useAppContext();
  
  const client = clients.find(c => c.id === invoice.clientId);
  const project = projects.find(p => p.id === invoice.projectId);
  
  return (
    <div className="invoice-view">
      <div className="invoice-view-header">
        <h2>Invoice: INV-{invoice.id.substring(0, 6)}</h2>
        <div className="invoice-actions">
          <InvoicePDF invoice={invoice} client={client} project={project} />
          <button onClick={onClose}>Close</button>
        </div>
      </div>
      
      <div className="invoice-view-content">
        <div className="invoice-section">
          <h3>Invoice Details</h3>
          <div className="invoice-info">
            <div className="info-row">
              <span className="info-label">Date:</span>
              <span className="info-value">{format(new Date(invoice.createdAt), 'MMMM dd, yyyy')}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Status:</span>
              <span className="info-value">{invoice.status}</span>
            </div>
          </div>
        </div>
        
        <div className="invoice-section">
          <h3>Client Information</h3>
          <div className="invoice-info">
            <div className="info-row">
              <span className="info-label">Client:</span>
              <span className="info-value">{client?.name || 'Unknown Client'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{client?.email || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone:</span>
              <span className="info-value">{client?.phone || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div className="invoice-section">
          <h3>Project Information</h3>
          <div className="invoice-info">
            <div className="info-row">
              <span className="info-label">Project:</span>
              <span className="info-value">{project?.name || 'Unknown Project'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Description:</span>
              <span className="info-value">{project?.description || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Billing Period:</span>
              <span className="info-value">
                {format(new Date(invoice.startDate), 'MMM dd, yyyy')} to {format(new Date(invoice.endDate), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="invoice-section">
          <h3>Time Entries</h3>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Hours</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.entries.map((entry, index) => (
                <tr key={index}>
                  <td>{format(new Date(entry.startTime), 'MMM dd, yyyy')}</td>
                  <td>{(entry.duration / 3600).toFixed(2)}</td>
                  <td>${invoice.hourlyRate.toFixed(2)}</td>
                  <td>${((entry.duration / 3600) * invoice.hourlyRate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2">Total Hours: {invoice.totalHours.toFixed(2)}</td>
                <td>Rate: ${invoice.hourlyRate.toFixed(2)}</td>
                <td>Total: ${invoice.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {invoice.notes && (
          <div className="invoice-section">
            <h3>Notes</h3>
            <p>{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceView;