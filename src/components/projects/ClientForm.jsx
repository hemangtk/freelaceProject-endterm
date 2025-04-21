"use client"

import { useState } from "react"
import { useAppContext } from "../../context/AppContext"

const ClientForm = ({ onClose }) => {
  const { addClient, updateClient } = useAppContext()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        address: client.address || "",
      })
    }
  }, [client])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (client) {
      // Update existing client
      updateClient(client.id, formData)
    } else {
      // Add new client
      addClient(formData)
    }
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    })

    if (onClose) onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="client-form">
      <h2>{client ? "Edit Client" : "Add New Client"}</h2>

      <div className="form-group">
        <label htmlFor="name">Client Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <textarea id="address" name="address" value={formData.address} onChange={handleInputChange} />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {client ? "Update Client" : "Save Client"}
        </button>
      </div>
    </form>
  )
}

export default ClientForm

