"use client"

import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import { format } from "date-fns"
import InvoiceView from "../components/invoices/InvoiceView"

const Invoices = () => {
  const { projects, clients, timeEntries, addInvoice, invoices, updateInvoiceStatus } = useAppContext()
  const [showForm, setShowForm] = useState(false)
  const [viewInvoice, setViewInvoice] = useState(null)
  const [newInvoice, setNewInvoice] = useState({
    clientId: "",
    projectId: "",
    startDate: "",
    endDate: "",
    notes: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewInvoice({
      ...newInvoice,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Filter time entries for the selected project and date range
    const relevantEntries = timeEntries.filter((entry) => {
      const entryDate = new Date(entry.startTime)
      const startDate = new Date(newInvoice.startDate)
      const endDate = new Date(newInvoice.endDate)
      endDate.setHours(23, 59, 59) // Set to end of day

      return entry.projectId === newInvoice.projectId && entryDate >= startDate && entryDate <= endDate
    })

    // Calculate total hours and amount
    const totalHours = relevantEntries.reduce((sum, entry) => sum + entry.duration / 3600, 0)
    const project = projects.find((p) => p.id === newInvoice.projectId)
    const hourlyRate = project ? project.hourlyRate : 0
    const totalAmount = totalHours * hourlyRate

    const invoice = {
      id: Date.now().toString(),
      ...newInvoice,
      totalHours,
      hourlyRate,
      totalAmount,
      status: "draft",
      createdAt: new Date(),
      entries: relevantEntries,
    }

    addInvoice(invoice)
    setNewInvoice({
      clientId: "",
      projectId: "",
      startDate: "",
      endDate: "",
      notes: "",
    })
    setShowForm(false)
  }

  const handleStatusChange = (id, status) => {
    updateInvoiceStatus(id, status)
  }

  const handleViewInvoice = (invoice) => {
    setViewInvoice(invoice)
  }

  const handleCloseInvoice = () => {
    setViewInvoice(null)
  }

  return (
    <div className="invoices-page">
      <div className="invoices-header">
        <h1>Invoices</h1>
        <button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Create Invoice"}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="invoice-form">
          <div className="form-group">
            <label htmlFor="clientId">Client</label>
            <select id="clientId" name="clientId" value={newInvoice.clientId} onChange={handleInputChange} required>
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="projectId">Project</label>
            <select id="projectId" name="projectId" value={newInvoice.projectId} onChange={handleInputChange} required>
              <option value="">Select a project</option>
              {projects
                .filter((project) => !newInvoice.clientId || project.clientId === newInvoice.clientId)
                .map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={newInvoice.startDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={newInvoice.endDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" value={newInvoice.notes} onChange={handleInputChange} />
          </div>

          <button type="submit">Generate Invoice</button>
        </form>
      )}

      {viewInvoice ? (
        <InvoiceView invoice={viewInvoice} onClose={handleCloseInvoice} />
      ) : (
        <div className="invoices-list">
          {invoices.length === 0 ? (
            <p>No invoices yet. Create your first invoice!</p>
          ) : (
            <table className="invoices-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => {
                  const client = clients.find((c) => c.id === invoice.clientId)
                  return (
                    <tr key={invoice.id}>
                      <td>INV-{invoice.id.substring(0, 6)}</td>
                      <td>{client ? client.name : "Unknown Client"}</td>
                      <td>{format(new Date(invoice.createdAt), "MMM dd, yyyy")}</td>
                      <td>${invoice.totalAmount.toFixed(2)}</td>
                      <td>
                        <select
                          value={invoice.status}
                          onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                          className={`status-${invoice.status.toLowerCase()}`}
                        >
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="paid">Paid</option>
                          <option value="overdue">Overdue</option>
                        </select>
                      </td>
                      <td>
                        <button onClick={() => handleViewInvoice(invoice)}>View</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default Invoices