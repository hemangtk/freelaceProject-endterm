"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "../context/AppContext"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, subMonths } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const Reports = () => {
  const { projects, timeEntries, clients } = useAppContext()
  const [reportType, setReportType] = useState("monthly")
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"))
  const [selectedProject, setSelectedProject] = useState("all")
  const [selectedClient, setSelectedClient] = useState("all")
  const [reportData, setReportData] = useState([])
  const [summaryData, setSummaryData] = useState({
    totalHours: 0,
    totalEarnings: 0,
    avgHoursPerDay: 0,
    projectBreakdown: [],
  })

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B", "#6B66FF"]

  useEffect(() => {
    generateReport()
  }, [reportType, selectedMonth, selectedProject, selectedClient, projects, timeEntries])

  const generateReport = () => {
    // Filter entries based on selected criteria
    let filteredEntries = [...timeEntries]

    // Filter by project
    if (selectedProject !== "all") {
      filteredEntries = filteredEntries.filter((entry) => entry.projectId === selectedProject)
    }

    // Filter by client
    if (selectedClient !== "all") {
      const projectIds = projects.filter((project) => project.clientId === selectedClient).map((project) => project.id)

      filteredEntries = filteredEntries.filter((entry) => projectIds.includes(entry.projectId))
    }

    // Filter by date range
    if (reportType === "monthly") {
      const [year, month] = selectedMonth.split("-")
      const startDate = startOfMonth(new Date(Number.parseInt(year), Number.parseInt(month) - 1))
      const endDate = endOfMonth(startDate)

      filteredEntries = filteredEntries.filter((entry) => {
        const entryDate = new Date(entry.startTime)
        return isWithinInterval(entryDate, { start: startDate, end: endDate })
      })

      // Generate daily data for the month
      const days = eachDayOfInterval({ start: startDate, end: endDate })

      const dailyData = days.map((day) => {
        const dayEntries = filteredEntries.filter((entry) => {
          const entryDate = new Date(entry.startTime)
          return format(entryDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
        })

        const hoursWorked = dayEntries.reduce((total, entry) => total + entry.duration / 3600, 0)

        const earnings = dayEntries.reduce((total, entry) => {
          const project = projects.find((p) => p.id === entry.projectId)
          if (project) {
            return total + (entry.duration / 3600) * project.hourlyRate
          }
          return total
        }, 0)

        return {
          date: format(day, "MMM dd"),
          hours: hoursWorked,
          earnings: earnings,
        }
      })

      setReportData(dailyData)
    } else if (reportType === "yearly") {
      // Generate monthly data for the past 12 months
      const monthlyData = []
      const today = new Date()

      for (let i = 0; i < 12; i++) {
        const monthDate = subMonths(today, i)
        const startDate = startOfMonth(monthDate)
        const endDate = endOfMonth(monthDate)

        const monthEntries = filteredEntries.filter((entry) => {
          const entryDate = new Date(entry.startTime)
          return isWithinInterval(entryDate, { start: startDate, end: endDate })
        })

        const hoursWorked = monthEntries.reduce((total, entry) => total + entry.duration / 3600, 0)

        const earnings = monthEntries.reduce((total, entry) => {
          const project = projects.find((p) => p.id === entry.projectId)
          if (project) {
            return total + (entry.duration / 3600) * project.hourlyRate
          }
          return total
        }, 0)

        monthlyData.unshift({
          date: format(monthDate, "MMM yyyy"),
          hours: hoursWorked,
          earnings: earnings,
        })
      }

      setReportData(monthlyData)
    }

    // Calculate summary data
    const totalHours = filteredEntries.reduce((total, entry) => total + entry.duration / 3600, 0)

    const totalEarnings = filteredEntries.reduce((total, entry) => {
      const project = projects.find((p) => p.id === entry.projectId)
      if (project) {
        return total + (entry.duration / 3600) * project.hourlyRate
      }
      return total
    }, 0)

    // Calculate average hours per day
    let avgHoursPerDay = 0
    if (reportType === "monthly") {
      const [year, month] = selectedMonth.split("-")
      const startDate = startOfMonth(new Date(Number.parseInt(year), Number.parseInt(month) - 1))
      const endDate = endOfMonth(startDate)
      const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate }).length
      avgHoursPerDay = totalHours / daysInMonth
    }

    // Calculate project breakdown
    const projectHours = {}
    filteredEntries.forEach((entry) => {
      if (!projectHours[entry.projectId]) {
        projectHours[entry.projectId] = 0
      }
      projectHours[entry.projectId] += entry.duration / 3600
    })

    const projectBreakdown = Object.keys(projectHours)
      .map((projectId) => {
        const project = projects.find((p) => p.id === projectId)
        return {
          name: project ? project.name : "Unknown Project",
          value: projectHours[projectId],
        }
      })
      .sort((a, b) => b.value - a.value)

    setSummaryData({
      totalHours,
      totalEarnings,
      avgHoursPerDay,
      projectBreakdown,
    })
  }

  return (
    <div className="reports-page">
      <h1>Reports</h1>

      <div className="report-filters">
        <div className="form-group">
          <label htmlFor="reportType">Report Type</label>
          <select id="reportType" value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {reportType === "monthly" && (
          <div className="form-group">
            <label htmlFor="selectedMonth">Month</label>
            <input
              type="month"
              id="selectedMonth"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="selectedClient">Client</label>
          <select id="selectedClient" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
            <option value="all">All Clients</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="selectedProject">Project</label>
          <select id="selectedProject" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
            <option value="all">All Projects</option>
            {projects
              .filter((project) => selectedClient === "all" || project.clientId === selectedClient)
              .map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="report-summary">
        <div className="summary-card">
          <h3>Total Hours</h3>
          <p>{summaryData.totalHours.toFixed(2)}</p>
        </div>

        <div className="summary-card">
          <h3>Total Earnings</h3>
          <p>${summaryData.totalEarnings.toFixed(2)}</p>
        </div>

        {reportType === "monthly" && (
          <div className="summary-card">
            <h3>Avg Hours/Day</h3>
            <p>{summaryData.avgHoursPerDay.toFixed(2)}</p>
          </div>
        )}
      </div>

      <div className="report-charts">
        <div className="chart-container">
          <h2>{reportType === "monthly" ? "Daily Hours" : "Monthly Hours"}</h2>
          <div className="chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toFixed(2)} hrs`, "Hours"]} />
                <Legend />
                <Bar dataKey="hours" fill="#3b82f6" name="Hours Worked" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h2>{reportType === "monthly" ? "Daily Earnings" : "Monthly Earnings"}</h2>
          <div className="chart">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, "Earnings"]} />
                <Legend />
                <Line type="monotone" dataKey="earnings" stroke="#10b981" name="Earnings" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h2>Project Distribution</h2>
          <div className="chart">
            {summaryData.projectBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={summaryData.projectBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {summaryData.projectBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value.toFixed(2)} hrs`, "Hours"]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
