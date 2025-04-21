import React, { useState } from 'react';
import { useProjectContext } from '../context/ProjectContext.jsx';
import ProjectForm from '../components/ProjectForm.jsx';
import ClientForm from '../components/ClientForm.jsx';
import Card from '../components/Card.jsx';

function Projects() {
  const { projects, clients, addProject, addClient } = useProjectContext();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddProject = (projectData) => {
    addProject(projectData);
    setShowProjectForm(false);
  };

  const handleAddClient = (clientData) => {
    addClient(clientData);
    setShowClientForm(false);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'on-hold':
        return 'status-on-hold';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'on-hold':
        return 'On Hold';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <div className="projects-page">
      <h1>Projects & Clients</h1>
      
      <div className="projects-section">
        <div className="section-header">
          <h2>Projects</h2>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setSelectedProject(null);
              setShowProjectForm(!showProjectForm);
            }}
          >
            {showProjectForm ? 'Cancel' : 'Add Project'}
          </button>
        </div>
        
        {showProjectForm && (
          <Card title={selectedProject ? "Edit Project" : "Add New Project"}>
            <ProjectForm 
              onSubmit={handleAddProject} 
              initialValues={selectedProject || {}} 
              clients={clients} 
            />
          </Card>
        )}
        
        <div className="filters">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''} 
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={filter === 'active' ? 'active' : ''} 
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={filter === 'on-hold' ? 'active' : ''} 
              onClick={() => setFilter('on-hold')}
            >
              On Hold
            </button>
            <button 
              className={filter === 'completed' ? 'active' : ''} 
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>
        
        {filteredProjects.length === 0 ? (
          <p>No projects found. {projects.length === 0 ? 'Add your first project.' : ''}</p>
        ) : (
          <div className="project-list">
            {filteredProjects.map(project => {
              const client = clients.find(c => c.id === project.clientId);
              
              return (
                <div 
                  key={project.id} 
                  className="project-card"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="project-header">
                    <h3>{project.name}</h3>
                    <span className={`status ${getStatusClass(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                  
                  <div className="project-details">
                    {client && (
                      <div className="project-client">
                        <span className="label">Client:</span>
                        <span className="value">{client.name}</span>
                      </div>
                    )}
                    
                    {project.deadline && (
                      <div className="project-deadline">
                        <span className="label">Deadline:</span>
                        <span className="value">
                          {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {project.hourlyRate && (
                      <div className="project-rate">
                        <span className="label">Rate:</span>
                        <span className="value">${project.hourlyRate}/hr</span>
                      </div>
                    )}
                  </div>
                  
                  {project.description && (
                    <div className="project-description">
                      <p>{project.description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="clients-section">
        <div className="section-header">
          <h2>Clients</h2>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowClientForm(!showClientForm)}
          >
            {showClientForm ? 'Cancel' : 'Add Client'}
          </button>
        </div>
        
        {showClientForm && (
          <Card title="Add New Client">
            <ClientForm onSubmit={handleAddClient} />
          </Card>
        )}
        
        {clients.length === 0 ? (
          <p>No clients yet. Add your first client.</p>
        ) : (
          <div className="client-list">
            {clients.map(client => (
              <div key={client.id} className="client-card">
                <div className="client-header">
                  <h3>{client.name}</h3>
                  {client.company && <p className="company">{client.company}</p>}
                </div>
                
                <div className="client-details">
                  {client.email && (
                    <div className="client-email">
                      <span className="label">Email:</span>
                      <span className="value">{client.email}</span>
                    </div>
                  )}
                  
                  {client.phone && (
                    <div className="client-phone">
                      <span className="label">Phone:</span>
                      <span className="value">{client.phone}</span>
                    </div>
                  )}
                </div>
                
                {client.notes && (
                  <div className="client-notes">
                    <p>{client.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;