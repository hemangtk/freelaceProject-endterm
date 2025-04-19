import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { mockClients, mockProjects, mockTimeEntries } from "./services/mockData.js"

// Initialize app with mock data
const initializeApp = () => {
  // Store mock data in localStorage for persistence
  if (!localStorage.getItem("clients")) {
    localStorage.setItem("clients", JSON.stringify(mockClients))
  }

  if (!localStorage.getItem("projects")) {
    localStorage.setItem("projects", JSON.stringify(mockProjects))
  }

  if (!localStorage.getItem("timeEntries")) {
    localStorage.setItem("timeEntries", JSON.stringify(mockTimeEntries))
  }
}

// Call initialization function
initializeApp()

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
