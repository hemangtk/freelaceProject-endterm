"use client"

import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import ClientForm from "../components/projects/ClientForm"

const Projects = () => {
  const { projects, clients, addProject } = useAppContext()
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showClientForm, setShowClientForm] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    clientId: "",
    description: "",
    hourlyRate: "",
    status: "active",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProject({
      ...newProject,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addProject({
      ...newProject,
      hourlyRate: Number.parseFloat(newProject.hourlyRate),
    })
    setNewProject({
      name: "",
      clientId: "",
      description: "",
      hourlyRate: "",
      status: "active",
    })
    setShowProjectForm(false)
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Projects</h1>
        <div className="header-actions">
          <button onClick={() => setShowClientForm(true)} className="secondary-button">
            Add Client
          </button>
          <button onClick={() => setShowProjectForm(!showProjectForm)}>
            {showProjectForm ? "Cancel" : "Add Project"}
          </button>
        </div>
      </div>

      {showClientForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ClientForm onClose={() => setShowClientForm(false)} />
          </div>
        </div>
      )}

      {showProjectForm && (
        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label htmlFor="name">Project Name</label>
            <input type="text" id="name" name="name" value={newProject.name} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="clientId">Client</label>
            <select id="clientId" name="clientId" value={newProject.clientId} onChange={handleInputChange} required>
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={newProject.description} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <label htmlFor="hourlyRate">Hourly Rate ($)</label>
            <input
              type="number"
              id="hourlyRate"
              name="hourlyRate"
              value={newProject.hourlyRate}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={newProject.status} onChange={handleInputChange}>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          <button type="submit">Save Project</button>
        </form>
      )}

      <div className="projects-list">
        {projects.length === 0 ? (
          <p>No projects yet. Add your first project!</p>
        ) : (
          projects.map((project) => {
            const client = clients.find((c) => c.id === project.clientId)
            return (
              <div key={project.id} className="project-card">
                <h3>{project.name}</h3>
                <p className="client-name">{client ? client.name : "Unknown Client"}</p>
                <p className="project-description">{project.description}</p>
                <div className="project-details">
                  <span className={`status status-${project.status}`}>{project.status}</span>
                  <span>${project.hourlyRate}/hr</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Projects
