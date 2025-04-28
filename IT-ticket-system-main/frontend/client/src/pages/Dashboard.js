import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';
import '../assets/styles/Dashboard.css';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 6;

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
        toast.error('Failed to fetch tickets');
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    let data = [...tickets];
    if (statusFilter !== 'All') {
      data = data.filter(t => t.status === statusFilter);
    }
    data.sort((a, b) =>
      sortOrder === 'asc'
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at)
    );
    setFiltered(data);
    setCurrentPage(1);
  }, [statusFilter, sortOrder, tickets]);

  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;
  const currentTickets = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / ticketsPerPage);

  return (
    <div className="dashboard-page container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>All Tickets</h2>
        <div className="d-flex gap-2">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-select">
            <option>All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Solved</option>
            <option>Closed</option>
          </select>
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="form-select">
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>
      </div>

      {currentTickets.length === 0 ? (
        <div className="empty-state text-center py-5 text-muted">No tickets found.</div>
      ) : (
        <div className="ticket-grid">
          {currentTickets.map(ticket => (
            <div key={ticket.id} className="ticket-card p-4 rounded shadow-sm">
              <h5>{ticket.title}</h5>
              <p className="text-muted mb-1">{ticket.description}</p>
              <div className="small mt-2">
                <span className="badge bg-primary me-2">Priority: {ticket.priority}</span>
                <span className="badge bg-info me-2">Status: {ticket.status}</span>
                <span className="badge bg-secondary">Dept ID: {ticket.department_id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination d-flex justify-content-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`btn btn-sm mx-1 ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
