import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Clients from "./pages/Clients"
import TimeTracker from "./pages/TimeTracker"
import Invoices from "./pages/Invoices"
import Reports from "./pages/Reports"
import ProjectDetails from "./pages/ProjectDetails"
import Navbar from "./components/common/Navbar"
import { AppProvider } from "./context/AppContext"
import NotFound from "./pages/NotFound"
import ErrorBoundary from "./components/common/ErrorBoundary"

function App() {
  return (
    <AppProvider>
      <Router>
        <ErrorBoundary>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/time-tracker" element={<TimeTracker />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </ErrorBoundary>
      </Router>
    </AppProvider>
  )
}

export default App
