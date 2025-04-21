"use client"

import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import ClientForm from "../components/projects/ClientForm"

const Clients = () => {
  const { clients, projects } = useAppContext()
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState(null)

  const handleAddClient = () => {
    setEditingClient(null)
    setShowForm(true)
  }

  const handleEditClient = (client) => {
    setEditingClient(client)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingClient(null)
  }

  // Count projects per client
  const getProjectCount = (clientId) => {
    return projects.filter((project) => project.clientId === clientId).length
  }

  return (
    <div className="clients-page">
      <div className="clients-header">
        <h1>Clients</h1>
        <button onClick={handleAddClient}>Add Client</button>
      </div>

      {showForm && (
        <div className="form-container">
          <ClientForm client={editingClient} onClose={handleCloseForm} />
        </div>
      )}

      <div className="clients-list">
        {clients.length === 0 ? (
          <p>No clients yet. Add your first client!</p>
        ) : (
          <table className="clients-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Projects</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td>{getProjectCount(client.id)}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEditClient(client)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Clients
