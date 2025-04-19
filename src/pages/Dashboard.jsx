import { useAppContext } from "../context/AppContext"

const Dashboard = () => {
  const { projects, timeEntries } = useAppContext()

  // Calculate total hours worked
  const totalHours = timeEntries.reduce((total, entry) => {
    return total + entry.duration / 3600 // Convert seconds to hours
  }, 0)

  // Get active projects count
  const activeProjectsCount = projects.filter((project) => project.status === "active").length

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Active Projects</h3>
          <p>{activeProjectsCount}</p>
        </div>

        <div className="summary-card">
          <h3>Total Hours</h3>
          <p>{totalHours.toFixed(2)}</p>
        </div>

        <div className="summary-card">
          <h3>Total Earnings</h3>
          <p>${calculateEarnings(projects, timeEntries).toFixed(2)}</p>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        {/* We'll implement this later */}
        <p>No recent activity</p>
      </div>
    </div>
  )
}

// Helper function to calculate earnings
const calculateEarnings = (projects, timeEntries) => {
  return timeEntries.reduce((total, entry) => {
    const project = projects.find((p) => p.id === entry.projectId)
    if (project && project.hourlyRate) {
      return total + (entry.duration / 3600) * project.hourlyRate
    }
    return total
  }, 0)
}

export default Dashboard
