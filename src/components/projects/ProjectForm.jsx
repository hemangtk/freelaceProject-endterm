import React, { useState } from 'react';
import { useProjectContext } from '../context/ProjectContext.jsx';

function ProjectForm({ onSubmit, initialValues = {}, clients = [] }) {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    description: initialValues.description || '',
    clientId: initialValues.clientId || '',
    status: initialValues.status || 'active',
    deadline: initialValues.deadline || '',
    hourlyRate: initialValues.hourlyRate || '',
    budget: initialValues.budget || '',
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.clientId) {
      newErrors.clientId = 'Client is required';
    }
    
    if (formData.hourlyRate && isNaN(parseFloat(formData.hourlyRate))) {
      newErrors.hourlyRate = 'Hourly rate must be a number';
    }
    
    if (formData.budget && isNaN(parseFloat(formData.budget))) {
      newErrors.budget = 'Budget must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert numeric strings to numbers
      const processedData = {
        ...formData,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
      };
      
      onSubmit(processedData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="project-form">
      <div className="form-group">
        <label htmlFor="name">Project Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="clientId">Client *</label>
        <select
          id="clientId"
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          className={errors.clientId ? 'error' : ''}
        >
          <option value="">Select a client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
        {errors.clientId && <span className="error-message">{errors.clientId}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="on-hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="deadline">Deadline</label>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="hourlyRate">Hourly Rate ($)</label>
        <input
          type="text"
          id="hourlyRate"
          name="hourlyRate"
          value={formData.hourlyRate}
          onChange={handleChange}
          className={errors.hourlyRate ? 'error' : ''}
        />
        {errors.hourlyRate && <span className="error-message">{errors.hourlyRate}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="budget">Budget ($)</label>
        <input
          type="text"
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className={errors.budget ? 'error' : ''}
        />
        {errors.budget && <span className="error-message">{errors.budget}</span>}
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialValues.id ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;