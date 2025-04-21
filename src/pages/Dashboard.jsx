"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "../context/AppContext"
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"
import { Link } from "react-router-dom"
import Export from "../components/common/Export"
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
} from "recharts"

const Dashboard = () => {
  const { projects, timeEntries, clients } = useAppContext()
  const [weeklyData, setWeeklyData] = useState([])
  const [projectDistribution, setProjectDistribution] = useState([])
  const [totalHours, setTotalHours] = useState(0)
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [activeProjects, setActiveProjects] = useState([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([])

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B", "#6B66FF"]

  useEffect(() => {
    // Calculate total hours and earnings
    const hours = timeEntries.reduce((total, entry) => total + entry.duration / 3600, 0)
    setTotalHours(hours)

    const earnings = timeEntries.reduce((total, entry) => {
      const project = projects.find((p) => p.id === entry.projectId)
      if (project) {
        return total + (entry.duration / 3600) * project.hourlyRate
      }
      return total
    }, 0)
    setTotalEarnings(earnings)

    // Get active projects
    const active = projects.filter((project) => project.status === "active")
    setActiveProjects(active)

    // Calculate weekly data
    const today = new Date()
    const start = startOfWeek(today)
    const end = endOfWeek(today)
    const days = eachDayOfInterval({ start, end })

    const weekData = days.map((day) => {
      const dayEntries = timeEntries.filter((entry) => {
        const entryDate = new Date(entry.startTime)
        return format(entryDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
      })

      const hoursWorked = dayEntries.reduce((total, entry) => total + entry.duration / 3600, 0)

      return {
        day: format(day, "EEE"),
        hours: hoursWorked,
      }
    })

    setWeeklyData(weekData)

    // Calculate project distribution
    const projectHours = {}
    timeEntries.forEach((entry) => {
      if (!projectHours[entry.projectId]) {
        projectHours[entry.projectId] = 0
      }
      projectHours[entry.projectId] += entry.duration / 3600
    })

    const distribution = Object.keys(projectHours)
      .map((projectId) => {
        const project = projects.find((p) => p.id === projectId)
        return {
          name: project ? project.name : "Unknown Project",
          value: projectHours[projectId],
        }
      })
      .sort((a, b) => b.value - a.value)

    setProjectDistribution(distribution)

    // TODO: Add logic for upcoming deadlines when we implement them
    setUpcomingDeadlines([])
  }, [projects, timeEntries])

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Active Projects</h3>
          <p>{activeProjects.length}</p>
        </div>

        <div className="summary-card">
          <h3>Total Hours</h3>
          <p>{totalHours.toFixed(2)}</p>
        </div>

        <div className="summary-card">
          <h3>Total Earnings</h3>
          <p>${totalEarnings.toFixed(2)}</p>
        </div>

        <div className="summary-card">
          <h3>Clients</h3>
          <p>{clients.length}</p>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-container">
          <h2>Weekly Hours</h2>
          <div className="chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toFixed(2)} hrs`, "Hours"]} />
                <Legend />
                <Bar dataKey="hours" fill="#8884d8" name="Hours Worked" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h2>Project Distribution</h2>
          <div className="chart">
            {projectDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {projectDistribution.map((entry, index) => (
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

      <div className="dashboard-lists">
        <div className="active-projects-list">
          <div className="list-header">
            <h2>Active Projects</h2>
            <Link to="/projects" className="view-all">
              View All
            </Link>
          </div>
          {activeProjects.length === 0 ? (
            <p>No active projects.</p>
          ) : (
            <div className="project-cards">
              {activeProjects.slice(0, 3).map((project) => {
                const client = clients.find((c) => c.id === project.clientId)
                const projectHours = timeEntries
                  .filter((entry) => entry.projectId === project.id)
                  .reduce((total, entry) => total + entry.duration / 3600, 0)

                return (
                  <div key={project.id} className="project-card">
                    <Link to={`/projects/${project.id}`}>
                      <h3>{project.name}</h3>
                      <p className="client-name">{client ? client.name : "Unknown Client"}</p>
                      <div className="project-stats">
                        <div className="stat">
                          <span className="label">Hours:</span>
                          <span className="value">{projectHours.toFixed(2)}</span>
                        </div>
                        <div className="stat">
                          <span className="label">Rate:</span>
                          <span className="value">${project.hourlyRate}/hr</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="export-section">
          <div className="list-header">
            <h2>Export Data</h2>
          </div>
          <Export />
        </div>

        <div className="recent-activity">
          <div className="list-header">
            <h2>Recent Activity</h2>
            <Link to="/time-tracker" className="view-all">
              View All
            </Link>
          </div>
          {timeEntries.length === 0 ? (
            <p>No recent activity.</p>
          ) : (
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Project</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {[...timeEntries]
                  .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
                  .slice(0, 5)
                  .map((entry) => {
                    const project = projects.find((p) => p.id === entry.projectId)
                    return (
                      <tr key={entry.id}>
                        <td>{format(new Date(entry.startTime), "MMM dd")}</td>
                        <td>{project ? project.name : "Unknown Project"}</td>
                        <td>{(entry.duration / 3600).toFixed(2)} hrs</td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
