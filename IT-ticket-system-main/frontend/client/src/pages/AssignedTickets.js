import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';



const AssignedTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchAssignedTickets();
  }, []);

  const fetchAssignedTickets = async () => {
    try {
      const res = await axios.get('/tickets/assigned', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTickets(res.data);
    } catch (err) {
      toast.error('Failed to fetch assigned tickets');
    }
  };

  const handleMarkAsSolved = async (ticketId) => {
    try {
      await axios.put(
        `/tickets/update-status/${ticketId}`,
        { status: 'solved' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );      
      toast.success('Ticket marked as solved!');
      fetchAssignedTickets(); // Refresh list after update
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update ticket status.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>My Assigned Tickets</h2>
      <div className="row">
        {tickets.map((t, i) => (
          <div className="col-md-6 mb-4" key={t.id}>
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">#{i + 1} - {t.title}</h5>
                <span className={`badge bg-${t.status === 'solved' ? 'success' : t.status === 'in_progress' ? 'warning' : 'secondary'}`}>
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

                {/* Show button only if status is in_progress */}
                {t.status === 'in_progress' && (
                  <button
                    className="btn btn-success mt-3"
                    onClick={() => handleMarkAsSolved(t.id)}
                  >
                    Mark as Solved
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {tickets.length === 0 && (
          <p className="text-center">No tickets assigned to you.</p>
        )}
      </div>
    </div>
  );
};

export default AssignedTickets;
