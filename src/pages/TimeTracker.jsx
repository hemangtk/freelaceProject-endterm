"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "../context/AppContext"
import { format } from "date-fns"

const TimeTracker = () => {
  const { projects, activeTimer, startTimer, pauseTimer, resumeTimer, stopTimer, timeEntries, addTimeEntry } =
    useAppContext()
  const [selectedProject, setSelectedProject] = useState("")
  const [elapsedTime, setElapsedTime] = useState(0)
  const [notes, setNotes] = useState("")
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [manualEntry, setManualEntry] = useState({
    projectId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "17:00",
    notes: "",
  })

  // Update timer display
  useEffect(() => {
    let interval
    if (activeTimer && activeTimer.isRunning) {
      interval = setInterval(() => {
        let totalSeconds = 0

        // Calculate time from current session
        const currentSessionSeconds = Math.floor((new Date() - new Date(activeTimer.startTime)) / 1000)

        // Add previously elapsed time (from pauses)
        if (activeTimer.elapsedTime) {
          totalSeconds = currentSessionSeconds + Math.floor(activeTimer.elapsedTime / 1000)
        } else {
          totalSeconds = currentSessionSeconds
        }

        setElapsedTime(totalSeconds)
      }, 1000)
    } else if (activeTimer && !activeTimer.isRunning && activeTimer.elapsedTime) {
      // If paused, show the elapsed time
      setElapsedTime(Math.floor(activeTimer.elapsedTime / 1000))
    }

    return () => clearInterval(interval)
  }, [activeTimer])

  const handleStartTimer = () => {
    if (selectedProject) {
      startTimer(selectedProject)
      setNotes("")
    }
  }

  const handlePauseTimer = () => {
    pauseTimer()
  }

  const handleResumeTimer = () => {
    resumeTimer()
  }

  const handleStopTimer = () => {
    // Update the notes in the active timer before stopping
    if (activeTimer) {
      activeTimer.notes = notes
    }
    stopTimer()
    setNotes("")
  }

  const handleManualEntryChange = (e) => {
    const { name, value } = e.target
    setManualEntry({
      ...manualEntry,
      [name]: value,
    })
  }

  const handleManualEntrySubmit = (e) => {
    e.preventDefault()

    const { projectId, date, startTime, endTime, notes } = manualEntry

    // Create Date objects from the form inputs
    const startDateTime = new Date(`${date}T${startTime}`)
    const endDateTime = new Date(`${date}T${endTime}`)

    // Validate end time is after start time
    if (endDateTime <= startDateTime) {
      alert("End time must be after start time")
      return
    }

    addTimeEntry({
      projectId,
      startTime: startDateTime,
      endTime: endDateTime,
      notes,
    })

    // Reset form
    setManualEntry({
      projectId: "",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "17:00",
      notes: "",
    })

    setShowManualEntry(false)
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getActiveProject = () => {
    if (!activeTimer) return null
    return projects.find((p) => p.id === activeTimer.projectId)
  }

  const activeProject = getActiveProject()

  return (
    <div className="time-tracker">
      <h1>Time Tracker</h1>

      <div className="timer-container">
        {activeTimer && (
          <div className="active-project">
            <h3>Currently tracking: {activeProject ? activeProject.name : "Unknown Project"}</h3>
          </div>
        )}

        <div className="timer-display">
          <h2>{formatTime(elapsedTime)}</h2>
        </div>

        <div className="timer-controls">
          {!activeTimer ? (
            <>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                disabled={activeTimer !== null}
              >
                <option value="">Select a project</option>
                {projects
                  .filter((p) => p.status === "active")
                  .map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
              </select>
              <button onClick={handleStartTimer} disabled={!selectedProject} className="btn-primary">
                Start Timer
              </button>
              <button onClick={() => setShowManualEntry(!showManualEntry)} className="btn-secondary">
                {showManualEntry ? "Cancel Manual Entry" : "Add Time Manually"}
              </button>
            </>
          ) : (
            <>
              <div className="timer-notes">
                <label htmlFor="notes">Notes:</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What are you working on?"
                />
              </div>
              <div className="timer-buttons">
                {activeTimer.isRunning ? (
                  <button onClick={handlePauseTimer} className="btn-secondary">
                    Pause
                  </button>
                ) : (
                  <button onClick={handleResumeTimer} className="btn-secondary">
                    Resume
                  </button>
                )}
                <button onClick={handleStopTimer} className="btn-primary">
                  Stop Timer
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showManualEntry && (
        <div className="manual-entry-form">
          <h3>Add Time Manually</h3>
          <form onSubmit={handleManualEntrySubmit}>
            <div className="form-group">
              <label htmlFor="projectId">Project</label>
              <select
                id="projectId"
                name="projectId"
                value={manualEntry.projectId}
                onChange={handleManualEntryChange}
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={manualEntry.date}
                onChange={handleManualEntryChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={manualEntry.startTime}
                  onChange={handleManualEntryChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={manualEntry.endTime}
                  onChange={handleManualEntryChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="manualNotes">Notes</label>
              <textarea
                id="manualNotes"
                name="notes"
                value={manualEntry.notes}
                onChange={handleManualEntryChange}
                placeholder="What did you work on?"
              />
            </div>

            <button type="submit" className="btn-primary">
              Add Time Entry
            </button>
          </form>
        </div>
      )}

      <div className="time-entries">
        <h2>Recent Time Entries</h2>
        {timeEntries.length === 0 ? (
          <p>No time entries yet.</p>
        ) : (
          <table className="time-entries-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Duration</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {[...timeEntries]
                .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
                .slice(0, 10)
                .map((entry) => {
                  const project = projects.find((p) => p.id === entry.projectId)
                  return (
                    <tr key={entry.id}>
                      <td>{format(new Date(entry.startTime), "MMM dd, yyyy")}</td>
                      <td>{project ? project.name : "Unknown Project"}</td>
                      <td>{(entry.duration / 3600).toFixed(2)} hrs</td>
                      <td>{entry.notes || "-"}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default TimeTracker
