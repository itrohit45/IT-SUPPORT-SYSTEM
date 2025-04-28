import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';

const SolvedTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchSolvedTickets();
  }, []);

  const fetchSolvedTickets = async () => {
    try {
      const res = await axios.get('/tickets/solved-tickets', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTickets(res.data);
    } catch (err) {
      toast.error('Failed to fetch solved tickets');
    }
  };

  return (
    <div className="container mt-4">
      <h2>All Solved Tickets</h2>
      <div className="row">
        {tickets.map((t, i) => (
          <div className="col-md-6 mb-4" key={t.id}>
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">#{i + 1} - {t.title}</h5>
                <span className="badge bg-success">
                  {t.status}
                </span>
              </div>
              <div className="card-body">
                <p>{t.description}</p>
                <ul className="list-unstyled">
                  <li><strong>Priority:</strong> {t.priority}</li>
                  <li><strong>Raised By:</strong> {t.created_by_name}</li>
                  <li><strong>Department:</strong> {t.department_name}</li>
                  <li><strong>Updated At:</strong> {new Date(t.updated_at).toLocaleString()}</li>
                </ul>
              </div>
            </div>
          </div>
        ))}

        {tickets.length === 0 && (
          <p className="text-center">No solved tickets available.</p>
        )}
      </div>
    </div>
  );
};

export default SolvedTickets;
