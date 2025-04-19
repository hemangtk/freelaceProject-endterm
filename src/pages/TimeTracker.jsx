"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "../context/AppContext"
import { format } from "date-fns"

const TimeTracker = () => {
  const { projects, activeTimer, startTimer, stopTimer, timeEntries } = useAppContext()
  const [selectedProject, setSelectedProject] = useState("")
  const [elapsedTime, setElapsedTime] = useState(0)

  // Update timer display
  useEffect(() => {
    let interval
    if (activeTimer && activeTimer.isRunning) {
      interval = setInterval(() => {
        const seconds = Math.floor((new Date() - activeTimer.startTime) / 1000)
        setElapsedTime(seconds)
      }, 1000)
    } else {
      setElapsedTime(0)
    }
    return () => clearInterval(interval)
  }, [activeTimer])

  const handleStartTimer = () => {
    if (selectedProject) {
      startTimer(selectedProject)
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="time-tracker">
      <h1>Time Tracker</h1>

      <div className="timer-container">
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
              <button onClick={handleStartTimer} disabled={!selectedProject}>
                Start Timer
              </button>
            </>
          ) : (
            <button onClick={stopTimer}>Stop Timer</button>
          )}
        </div>
      </div>

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
              </tr>
            </thead>
            <tbody>
              {[...timeEntries]
                .reverse()
                .slice(0, 10)
                .map((entry) => {
                  const project = projects.find((p) => p.id === entry.projectId)
                  return (
                    <tr key={entry.id}>
                      <td>{format(new Date(entry.startTime), "MMM dd, yyyy")}</td>
                      <td>{project ? project.name : "Unknown Project"}</td>
                      <td>{formatTime(entry.duration)}</td>
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
