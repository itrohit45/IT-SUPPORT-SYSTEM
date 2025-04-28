import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';

const UpdateTicketStatus = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get('/tickets', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTickets(res.data);
      } catch (err) {
        toast.error('Error loading tickets');
      }
    };

    fetchTickets();
  }, []);

  const updateStatus = async (ticketId, status) => {
    try {
      await axios.put(`/tickets/${ticketId}/status`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <h2>Update Ticket Status</h2>
      {tickets.map(ticket => (
        <div key={ticket.id} className="ticket-card">
          <h3>{ticket.title}</h3>
          <p>Status: {ticket.status}</p>
          <select onChange={(e) => updateStatus(ticket.id, e.target.value)} defaultValue={ticket.status}>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default UpdateTicketStatus;
