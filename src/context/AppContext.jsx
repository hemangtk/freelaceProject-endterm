"use client"

import { createContext, useContext, useState, useEffect } from "react"

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
  const [invoices, setInvoices] = useState([])

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedClients = localStorage.getItem("clients")
    const storedProjects = localStorage.getItem("projects")
    const storedTimeEntries = localStorage.getItem("timeEntries")
    const storedInvoices = localStorage.getItem("invoices")

    if (storedClients) {
      setClients(JSON.parse(storedClients))
    }

    if (storedProjects) {
      setProjects(JSON.parse(storedProjects))
    }

    if (storedTimeEntries) {
      // Convert string dates back to Date objects
      const parsedEntries = JSON.parse(storedTimeEntries)
      const formattedEntries = parsedEntries.map((entry) => ({
        ...entry,
        startTime: new Date(entry.startTime),
        endTime: new Date(entry.endTime),
      }))
      setTimeEntries(formattedEntries)
    }

    if (storedInvoices) {
      setInvoices(JSON.parse(storedInvoices))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem("timeEntries", JSON.stringify(timeEntries))
  }, [timeEntries])

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices))
  }, [invoices])

  // Client functions
  const addClient = (client) => {
    setClients([...clients, { ...client, id: Date.now().toString() }])
  }

  const updateClient = (id, updatedClient) => {
    setClients(clients.map((client) => (client.id === id ? { ...client, ...updatedClient } : client)))
  }

  const deleteClient = (id) => {
    // Check if client has projects
    const hasProjects = projects.some((project) => project.clientId === id)
    if (hasProjects) {
      return false // Can't delete client with projects
    }
    setClients(clients.filter((client) => client.id !== id))
    return true
  }

  // Project functions
  const addProject = (project) => {
    setProjects([...projects, { ...project, id: Date.now().toString() }])
  }

  const updateProject = (id, updatedProject) => {
    setProjects(projects.map((project) => (project.id === id ? { ...project, ...updatedProject } : project)))
  }

  const deleteProject = (id) => {
    // Check if project has time entries
    const hasTimeEntries = timeEntries.some((entry) => entry.projectId === id)
    if (hasTimeEntries) {
      return false // Can't delete project with time entries
    }
    setProjects(projects.filter((project) => project.id !== id))
    return true
  }

  // Time tracking functions
  const startTimer = (projectId) => {
    setActiveTimer({
      projectId,
      startTime: new Date(),
      isRunning: true,
    })
  }

  const pauseTimer = () => {
    if (activeTimer && activeTimer.isRunning) {
      // Calculate duration so far
      const elapsedTime = new Date() - activeTimer.startTime
      setActiveTimer({
        ...activeTimer,
        isRunning: false,
        pausedAt: new Date(),
        elapsedTime: activeTimer.elapsedTime ? activeTimer.elapsedTime + elapsedTime : elapsedTime,
      })
    }
  }

  const resumeTimer = () => {
    if (activeTimer && !activeTimer.isRunning) {
      setActiveTimer({
        ...activeTimer,
        startTime: new Date(),
        isRunning: true,
        pausedAt: null,
      })
    }
  }

  const stopTimer = () => {
    if (activeTimer) {
      const endTime = new Date()
      let duration = 0

      if (activeTimer.isRunning) {
        // If timer is running, calculate duration from start time to now
        duration = (endTime - activeTimer.startTime) / 1000 // in seconds

        // Add any previously elapsed time (from pauses)
        if (activeTimer.elapsedTime) {
          duration += activeTimer.elapsedTime / 1000
        }
      } else {
        // If timer is paused, use the elapsed time
        duration = activeTimer.elapsedTime / 1000
      }

      const newTimeEntry = {
        id: Date.now().toString(),
        projectId: activeTimer.projectId,
        startTime: new Date(endTime - duration * 1000), // Approximate start time
        endTime: endTime,
        duration: duration, // in seconds
        notes: activeTimer.notes || "",
      }

      setTimeEntries([...timeEntries, newTimeEntry])
      setActiveTimer(null)
    }
  }

  const addTimeEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      duration: (new Date(entry.endTime) - new Date(entry.startTime)) / 1000,
    }
    setTimeEntries([...timeEntries, newEntry])
  }

  const updateTimeEntry = (id, updatedEntry) => {
    setTimeEntries(
      timeEntries.map((entry) => {
        if (entry.id === id) {
          const duration = (new Date(updatedEntry.endTime) - new Date(updatedEntry.startTime)) / 1000
          return { ...entry, ...updatedEntry, duration }
        }
        return entry
      }),
    )
  }

  const deleteTimeEntry = (id) => {
    setTimeEntries(timeEntries.filter((entry) => entry.id !== id))
  }

  // Invoice functions
  const addInvoice = (invoice) => {
    setInvoices([...invoices, { ...invoice, id: Date.now().toString(), createdAt: new Date() }])
  }

  const updateInvoiceStatus = (id, status) => {
    setInvoices(invoices.map((invoice) => (invoice.id === id ? { ...invoice, status } : invoice)))
  }

  const value = {
    projects,
    clients,
    timeEntries,
    activeTimer,
    invoices,
    addClient,
    updateClient,
    deleteClient,
    addProject,
    updateProject,
    deleteProject,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    addTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    addInvoice,
    updateInvoiceStatus,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
