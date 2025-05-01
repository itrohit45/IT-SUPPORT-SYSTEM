import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../assets/styles/Agent.css';
import empty from "../assets/images/out-of-stock.png"

const STATUS_OPTIONS = [
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  
];

const STATUS_BADGE = {
  open: 'bg-red-100 text-red-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  solved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

const PRIORITY_BADGE = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
};

const AgentPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchAssignedTickets = async () => {
      try {
        const res = await axios.get('/tickets/assigned', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTickets(res.data);
      } catch (err) {
        toast.error('Failed to fetch assigned tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTickets();
  }, []);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/tickets/${ticketId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Ticket status updated successfully');
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
    } catch (err) {
      toast.error('Failed to update ticket status');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="agent-container">
      <div className="agent-header">
        <h1>My Assigned Tickets</h1>
        <p>Manage the tickets assigned to you</p>
      </div>

      <div className="agent-controls">
        <input
          type="text"
          placeholder="Search my tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your tickets...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="no-tickets">
          <img src={empty} alt='No tickets found' /> 
          <p>No tickets found matching your criteria</p>
        </div>
      ) : (
        <div className="tickets-grid">
          {filteredTickets.map((ticket) => (
            <div className="ticket-card" key={ticket.id}>
              <div className="ticket-header">
                <h3>{ticket.title}</h3>
                <div className="ticket-meta">
                  <span className={`status-badge ${STATUS_BADGE[ticket.status] || ''}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                  <span className={`priority-badge ${PRIORITY_BADGE[ticket.priority] || ''}`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>

              <div className="ticket-body">
                <p className="ticket-description">{ticket.description}</p>
                
                <div className="ticket-details">
                  <div className="detail-item">
                    <span className="detail-label">Department:</span>
                    <span>{ticket.department_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Created by:</span>
                    <span>{ticket.created_by_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Created at:</span>
                    <span>{new Date(ticket.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="ticket-footer">
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button onClick={() => navigate(`/agentticketdetails/${ticket.id}`)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentPanel;