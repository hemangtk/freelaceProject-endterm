"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import { format } from "date-fns"

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects, clients, timeEntries, updateProject, deleteProject, startTimer } = useAppContext()

  const [project, setProject] = useState(null)
  const [client, setClient] = useState(null)
  const [projectTimeEntries, setProjectTimeEntries] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hourlyRate: "",
    status: "active",
  })

  // Load project data
  useEffect(() => {
    const foundProject = projects.find((p) => p.id === id)
    if (foundProject) {
      setProject(foundProject)
      setFormData({
        name: foundProject.name,
        description: foundProject.description || "",
        hourlyRate: foundProject.hourlyRate,
        status: foundProject.status,
      })

      // Find client
      const foundClient = clients.find((c) => c.id === foundProject.clientId)
      setClient(foundClient)

      // Find time entries for this project
      const filteredEntries = timeEntries.filter((entry) => entry.projectId === id)
      setProjectTimeEntries(filteredEntries)
    } else {
      // Project not found, redirect to projects page
      navigate("/projects")
    }
  }, [id, projects, clients, timeEntries, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProject(id, {
      ...formData,
      hourlyRate: Number.parseFloat(formData.hourlyRate),
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    const success = deleteProject(id)
    if (success) {
      navigate("/projects")
    } else {
      alert("Cannot delete project with time entries. Delete the time entries first.")
    }
  }

  const handleStartTimer = () => {
    startTimer(id)
    navigate("/time-tracker")
  }

  // Calculate total hours and earnings
  const totalHours = projectTimeEntries.reduce((total, entry) => total + entry.duration / 3600, 0)
  const totalEarnings = totalHours * (project?.hourlyRate || 0)

  if (!project) return <div>Loading...</div>

  return (
    <div className="project-details-page">
      <div className="project-details-header">
        <h1>{project.name}</h1>
        <div className="project-actions">
          <button onClick={handleStartTimer} className="btn-primary">
            Start Timer
          </button>
          {isEditing ? (
            <button onClick={() => setIsEditing(false)} className="btn-secondary">
              Cancel
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn-secondary">
              Edit Project
            </button>
          )}
          <button onClick={handleDelete} className="btn-danger">
            Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="project-edit-form">
          <div className="form-group">
            <label htmlFor="name">Project Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <label htmlFor="hourlyRate">Hourly Rate ($)</label>
            <input
              type="number"
              id="hourlyRate"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleInputChange}>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </form>
      ) : (
        <div className="project-info">
          <div className="project-summary">
            <div className="info-card">
              <h3>Client</h3>
              <p>{client ? client.name : "Unknown Client"}</p>
            </div>
            <div className="info-card">
              <h3>Status</h3>
              <p className={`status status-${project.status}`}>{project.status}</p>
            </div>
            <div className="info-card">
              <h3>Hourly Rate</h3>
              <p>${project.hourlyRate}/hr</p>
            </div>
            <div className="info-card">
              <h3>Total Hours</h3>
              <p>{totalHours.toFixed(2)} hrs</p>
            </div>
            <div className="info-card">
              <h3>Total Earnings</h3>
              <p>${totalEarnings.toFixed(2)}</p>
            </div>
          </div>

          {project.description && (
            <div className="project-description">
              <h3>Description</h3>
              <p>{project.description}</p>
            </div>
          )}
        </div>
      )}

      <div className="project-time-entries">
        <h2>Time Entries</h2>
        {projectTimeEntries.length === 0 ? (
          <p>No time entries for this project yet.</p>
        ) : (
          <table className="time-entries-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {[...projectTimeEntries]
                .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
                .map((entry) => (
                  <tr key={entry.id}>
                    <td>{format(new Date(entry.startTime), "MMM dd, yyyy")}</td>
                    <td>{format(new Date(entry.startTime), "h:mm a")}</td>
                    <td>{format(new Date(entry.endTime), "h:mm a")}</td>
                    <td>{(entry.duration / 3600).toFixed(2)} hrs</td>
                    <td>{entry.notes || "-"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ProjectDetails
