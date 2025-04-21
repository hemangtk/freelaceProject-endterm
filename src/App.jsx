import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Clients from "./pages/Clients"
import TimeTracker from "./pages/TimeTracker"
import Invoices from "./pages/Invoices"
import ProjectDetails from "./pages/ProjectDetails"
import Navbar from "./components/common/Navbar"
import { AppProvider } from "./context/AppContext"

function App() {
  return (
    <AppProvider>
      <Router>
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
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App
