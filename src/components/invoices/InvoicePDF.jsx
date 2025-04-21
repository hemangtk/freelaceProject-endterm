// components/invoices/InvoicePDF.jsx
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Define styles for PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1pt solid #eee',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomStyle: 'solid',
    paddingBottom: 5,
    paddingTop: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  label: {
    width: '30%',
  },
  value: {
    width: '70%',
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    paddingBottom: 5,
    paddingTop: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingBottom: 5,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomStyle: 'solid',
  },
  col20: {
    width: '20%',
  },
  col30: {
    width: '30%',
  },
  col50: {
    width: '50%',
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderTopStyle: 'solid',
  },
  notes: {
    marginTop: 20,
    paddingTop: 10,
    fontSize: 10,
  },
});

// Create PDF Document component
const InvoiceDocument = ({ invoice, client, project, timeEntries }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>INVOICE</Text>
        <Text>Invoice #: INV-{invoice.id.substring(0, 6)}</Text>
        <Text>Date: {format(new Date(invoice.createdAt), 'MMMM dd, yyyy')}</Text>
        <Text>Status: {invoice.status}</Text>
      </View>
      
      {/* Client Information */}
      <View style={styles.section}>
        <Text style={styles.bold}>Client Details:</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Client:</Text>
          <Text style={styles.value}>{client?.name || 'Unknown Client'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{client?.email || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{client?.phone || 'N/A'}</Text>
        </View>
      </View>
      
      {/* Project Information */}
      <View style={styles.section}>
        <Text style={styles.bold}>Project Information:</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Project:</Text>
          <Text style={styles.value}>{project?.name || 'Unknown Project'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{project?.description || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Billing Period:</Text>
          <Text style={styles.value}>
            {format(new Date(invoice.startDate), 'MMM dd, yyyy')} to {format(new Date(invoice.endDate), 'MMM dd, yyyy')}
          </Text>
        </View>
      </View>
      
      {/* Time Entries */}
      <View style={styles.section}>
        <Text style={styles.bold}>Time Entries:</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col30}>Date</Text>
            <Text style={styles.col50}>Description</Text>
            <Text style={styles.col20}>Hours</Text>
          </View>
          {invoice.entries.map((entry, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col30}>{format(new Date(entry.startTime), 'MMM dd, yyyy')}</Text>
              <Text style={styles.col50}>Work on {project?.name || 'project'}</Text>
              <Text style={styles.col20}>{(entry.duration / 3600).toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.bold}>Summary:</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total Hours:</Text>
          <Text style={styles.value}>{invoice.totalHours.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Hourly Rate:</Text>
          <Text style={styles.value}>${invoice.hourlyRate.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Amount:</Text>
          <Text style={styles.value}>${invoice.totalAmount.toFixed(2)}</Text>
        </View>
      </View>
      
      {/* Notes */}
      {invoice.notes && (
        <View style={styles.notes}>
          <Text style={styles.bold}>Notes:</Text>
          <Text>{invoice.notes}</Text>
        </View>
      )}
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
      </View>
    </Page>
  </Document>
);

// PDF Download Link Component
const InvoicePDF = ({ invoice, client, project }) => (
  <PDFDownloadLink
    document={<InvoiceDocument invoice={invoice} client={client} project={project} />}
    fileName={`invoice-${invoice.id.substring(0, 6)}.pdf`}
    style={{
      textDecoration: 'none',
      padding: '10px 15px',
      color: '#ffffff',
      backgroundColor: '#4CAF50',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'inline-block',
      marginLeft: '10px',
    }}
  >
    {({ blob, url, loading, error }) =>
      loading ? 'Generating PDF...' : 'Download PDF'
    }
  </PDFDownloadLink>
);

export default InvoicePDF;