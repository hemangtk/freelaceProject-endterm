import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Freelancer Manager</h1>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/projects" className="nav-link">
            Projects
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/time-tracker" className="nav-link">
            Time Tracker
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/invoices" className="nav-link">
            Invoices
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
