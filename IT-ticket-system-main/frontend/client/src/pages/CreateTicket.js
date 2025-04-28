import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';
import '../assets/styles/CreateTicket.css';

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'low',
    department_id: '',
  });
  const [file, setFile] = useState(null);  // New state to track the file
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departmentLoading, setDepartmentLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('/departments', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setDepartments(res.data);
      } catch (err) {
        toast.error('Failed to load departments');
      } finally {
        setDepartmentLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'attachment') {
      setFile(e.target.files[0]);  // Handle the selected file
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();  // FormData to handle file upload

    // Append form data
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('priority', formData.priority);
    data.append('department_id', formData.department_id);

    if (file) {
      data.append('attachment', file);  // Append the file if it exists
    }

    try {
      await axios.post('/tickets/create', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data', // Important for file upload
        },
      });
      toast.success('Ticket created successfully!');

      setFormData({
        title: '',
        description: '',
        priority: 'low',
        department_id: '',
      });
      setFile(null);  // Reset the file input after submission
      navigate('/my-tickets');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-container mt-5">
      <div className="ticket-card">
        <div className="ticket-header">
          <h2>Create New Ticket</h2>
          <p>Fill out the form below to submit a new support request</p>
        </div>

        <form onSubmit={handleSubmit} className="ticket-form" encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="title">Ticket Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Briefly describe your issue"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Provide detailed information about your issue"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
            <small className="hint-text">Be as specific as possible to help us resolve your issue faster</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="priority-select"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="department_id">Department</label>
              <select
                id="department_id"
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                required
                disabled={departmentLoading}
              >
                <option value="">Select a department</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
              {departmentLoading && (
                <small className="loading-text">Loading departments...</small>
              )}
            </div>
          </div>

          {/* File input */}
          <div className="form-group">
            <label htmlFor="file">Attach a File</label>
            <input
              type="file"
              id="attachment"
              name="attachment" // ✅ match backend field name
              accept="image/*,application/*"
              onChange={handleChange}
            />

          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={loading || departmentLoading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Ticket...
              </>
            ) : (
              'Submit Ticket'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
