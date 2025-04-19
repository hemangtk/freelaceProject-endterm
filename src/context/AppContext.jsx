"use client"

import { createContext, useContext, useState } from "react"

// Create context
const AppContext = createContext()

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext)

// Provider component
export const AppProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [timeEntries, setTimeEntries] = useState([])
  const [activeTimer, setActiveTimer] = useState(null)

  // Add a project
  const addProject = (project) => {
    setProjects([...projects, { ...project, id: Date.now().toString() }])
  }

  // Add a client
  const addClient = (client) => {
    setClients([...clients, { ...client, id: Date.now().toString() }])
  }

  // Start timer
  const startTimer = (projectId) => {
    setActiveTimer({
      projectId,
      startTime: new Date(),
      isRunning: true,
    })
  }

  // Stop timer
  const stopTimer = () => {
    if (activeTimer) {
      const newTimeEntry = {
        id: Date.now().toString(),
        projectId: activeTimer.projectId,
        startTime: activeTimer.startTime,
        endTime: new Date(),
        duration: (new Date() - activeTimer.startTime) / 1000, // in seconds
      }
      setTimeEntries([...timeEntries, newTimeEntry])
      setActiveTimer(null)
    }
  }

  const value = {
    projects,
    clients,
    timeEntries,
    activeTimer,
    addProject,
    addClient,
    startTimer,
    stopTimer,
    setProjects,
    setClients,
    setTimeEntries,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
