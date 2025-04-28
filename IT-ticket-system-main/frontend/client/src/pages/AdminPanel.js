import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { toast } from "react-toastify";
import { FiRefreshCw, FiSearch, FiFilter, FiUser, FiClock, FiMail, FiAlertCircle } from "react-icons/fi";
import "../assets/styles/Admin.css";
import empty from "../assets/images/out-of-stock.png";

const STATUS_OPTIONS = [
  { value: "all", label: "All Tickets" },
  { value: "unassigned", label: "Unassigned" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" }
];

const PRIORITY_OPTIONS = [
  { value: "all", label: "All Priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" }
];

const AdminPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [assignees, setAssignees] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    department: "all"
  });
  const [stats, setStats] = useState({
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
    unassigned: 0
  });

  const fetchTickets = async () => {
    try {
      const res = await axios.get("/tickets", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTickets(res.data);
      calculateStats(res.data);
    } catch (err) {
      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users/agents", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (Array.isArray(res.data)) {
        setAgents(res.data);
      } else {
        setAgents([]);
        toast.error("Unexpected response format for agents");
      }
    } catch (err) {
      toast.error("Failed to fetch agents");
    }
  };
  
  const calculateStats = (tickets) => {
    const stats = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
      unassigned: 0
    };

    tickets.forEach(ticket => {
      if (ticket.status === 'open') stats.open++;
      if (ticket.status === 'in_progress') stats.in_progress++;
      if (ticket.status === 'resolved') stats.resolved++;
      if (ticket.status === 'closed') stats.closed++;
      if (!ticket.assigned_to) stats.unassigned++;
    });

    setStats(stats);
  };

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, []);

  const assignTicket = async (ticketId) => {
    const userId = assignees[ticketId];
    if (!userId) return toast.error("Please select a user");

    try {
      await axios.put(
        `/tickets/${ticketId}/assign`,
        { userId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Ticket assigned successfully");
      fetchTickets();
    } catch (err) {
      toast.error("Failed to assign ticket");
    }
  };

  const updateTicketStatus = async (ticketId, status) => {
    try {
      await axios.put(
        `/tickets/${ticketId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Ticket status updated");
      fetchTickets();
    } catch (err) {
      toast.error("Can't change the status once assigned");
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const getAssignedUserName = (userId) => {
    const agent = agents.find((u) => u.id === userId);
    return agent ? agent.name : "Unassigned";
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filters.status === "all" || 
      (filters.status === "unassigned" ? !ticket.assigned_to : ticket.status === filters.status);
    const matchesPriority =
      filters.priority === "all" || ticket.priority === filters.priority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="admin-panel mt-5 mx-auto">
      <header className="admin-header">
        <h1>Ticket Management Dashboard</h1>
        <p className="subtitle">Monitor and resolve support requests efficiently</p>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon open">
            <FiAlertCircle size={20} />
          </div>
          <div className="stat-info">
            <h3>{stats.open}</h3>
            <p>Open Tickets</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon progress">
            <FiClock size={20} />
          </div>
          <div className="stat-info">
            <h3>{stats.in_progress}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon solved">
            <FiMail size={20} />
          </div>
          <div className="stat-info">
            <h3>{stats.resolved}</h3>
            <p>Resolved</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon closed">
            <FiAlertCircle size={20} />
          </div>
          <div className="stat-info">
            <h3>{stats.closed}</h3>
            <p>Closed Tickets</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon unassigned">
            <FiUser size={20} />
          </div>
          <div className="stat-info">
            <h3>{stats.unassigned}</h3>
            <p>Unassigned</p>
          </div>
        </div>
      </div>

      <div className="admin-controls">
        <div className="search-box">
          <FiSearch className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <FiFilter className="filter-icon" size={16} />
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="filter-select"
            >
              {STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              className="filter-select"
            >
              {PRIORITY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="refresh-btn" onClick={fetchTickets}>
          <FiRefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading ? (
  <div className="loading-state">
    <div className="spinner"></div>
    <p>Loading tickets...</p>
  </div>
) : filteredTickets.length === 0 ? (
  <div className="empty-state">
    <img src={empty} alt="No tickets found" className="empty-img" />
    <h3>No tickets match your criteria</h3>
    <p>Try adjusting your filters or search term</p>
  </div>
) : (
  <div className="tickets-container" style={{ marginBottom: '2rem' }}>
    <div className="tickets-list">
      {filteredTickets.map((ticket) => (
        <div className="ticket-item" key={ticket.id}>
          <div className="ticket-main">
            <div className="ticket-header">
              <h4 className="ticket-title">{ticket.title}</h4>
              <div className="ticket-status">
                <span className={`status-badge ${ticket.status}`}>
                  {ticket.status.replace("_", " ")}
                </span>
              </div>
            </div>
            <p className="ticket-description">{ticket.description.substring(0, 80)}...</p>
            <div className="ticket-meta">
              <span className="meta-item">
                <FiUser size={14} /> {ticket.created_by_name || "Unknown"}
              </span>
              <span className="meta-item">
                {ticket.department_name}
              </span>
              <span className="meta-item">
                <FiClock size={14} /> {new Date(ticket.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="ticket-side-info">
            <div className="ticket-priority">
              <span className={`priority-badge ${ticket.priority}`}>
                {ticket.priority}
              </span>
            </div>

            <div className="ticket-assignee">
              {ticket.assigned_to ? (
                <span className="assignee-name">
                  <FiUser size={14} /> {getAssignedUserName(ticket.assigned_to)}
                </span>
              ) : (
                <span className="unassigned">Unassigned</span>
              )}
            </div>
          </div>

          <div className="ticket-actions">
  {!ticket.assigned_to ? (
    <div className="assign-controls">
      <select
        value={assignees[ticket.id] || ""}
        onChange={(e) => setAssignees({ ...assignees, [ticket.id]: e.target.value })}
        className="assign-select"
      >
        <option value="">Select agent</option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </select>
      <button
        onClick={() => assignTicket(ticket.id)}
        disabled={!assignees[ticket.id]}
        className="assign-btn"
      >
        Assign
      </button>
    </div>
  ) : ticket.status !== "closed" ? (
    <select
      value={ticket.status}
      onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
      className="status-select"
    >
      <option value="open">Open</option>
      <option value="in_progress">In Progress</option>
      <option value="solved">Solved</option>
      <option value="closed">Closed</option>
    </select>
  ) : (
    <span className="text-gray-500">Closed</span>
  )}
</div>

        </div>
      ))}
    </div>
  </div>
)}
    </div>
  );
};

export default AdminPanel;