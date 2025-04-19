"use client"

import { useState } from "react"
import { useAppContext } from "../../context/AppContext"

const ClientForm = ({ onClose }) => {
  const { addClient } = useAppContext()
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewClient({
      ...newClient,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addClient(newClient)
    setNewClient({
      name: "",
      email: "",
      phone: "",
      address: "",
    })
    if (onClose) onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="client-form">
      <h2>Add New Client</h2>

      <div className="form-group">
        <label htmlFor="name">Client Name</label>
        <input type="text" id="name" name="name" value={newClient.name} onChange={handleInputChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={newClient.email} onChange={handleInputChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input type="tel" id="phone" name="phone" value={newClient.phone} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <textarea id="address" name="address" value={newClient.address} onChange={handleInputChange} />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit">Save Client</button>
      </div>
    </form>
  )
}

export default ClientForm
