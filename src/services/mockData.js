// Sample data to populate the app initially
export const mockClients = [
    { id: "1", name: "Acme Corp", email: "contact@acmecorp.com", phone: "123-456-7890" },
    { id: "2", name: "Globex Industries", email: "info@globex.com", phone: "987-654-3210" },
    { id: "3", name: "Wayne Enterprises", email: "bruce@wayne.com", phone: "555-123-4567" },
  ]
  
  export const mockProjects = [
    {
      id: "1",
      name: "Website Redesign",
      clientId: "1",
      description: "Complete overhaul of company website",
      hourlyRate: 75,
      status: "active",
    },
    {
      id: "2",
      name: "Mobile App Development",
      clientId: "2",
      description: "Creating a new mobile app for client",
      hourlyRate: 90,
      status: "active",
    },
    {
      id: "3",
      name: "Marketing Campaign",
      clientId: "3",
      description: "Digital marketing campaign for Q4",
      hourlyRate: 65,
      status: "on-hold",
    },
    {
      id: "4",
      name: "Logo Design",
      clientId: "1",
      description: "New logo and brand identity",
      hourlyRate: 85,
      status: "completed",
    },
  ]
  
  // Generate some mock time entries
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const twoDaysAgo = new Date(now)
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
  
  export const mockTimeEntries = [
    {
      id: "1",
      projectId: "1",
      startTime: new Date(yesterday.setHours(9, 0, 0)),
      endTime: new Date(yesterday.setHours(12, 30, 0)),
      duration: 3.5 * 3600, // 3.5 hours in seconds
    },
    {
      id: "2",
      projectId: "1",
      startTime: new Date(yesterday.setHours(13, 30, 0)),
      endTime: new Date(yesterday.setHours(17, 0, 0)),
      duration: 3.5 * 3600,
    },
    {
      id: "3",
      projectId: "2",
      startTime: new Date(twoDaysAgo.setHours(10, 0, 0)),
      endTime: new Date(twoDaysAgo.setHours(15, 45, 0)),
      duration: 5.75 * 3600,
    },
  ]
  