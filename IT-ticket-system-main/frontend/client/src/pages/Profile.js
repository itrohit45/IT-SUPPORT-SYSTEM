import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="container mt-5">Loading profile...</div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Profile</h2>
      <div className="card shadow-sm p-4">
        <p><strong>Name:</strong> {user.name || 'Not provided'}</p>
        <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
        <p><strong>Role:</strong> {user.role || 'User'}</p>
        <p><strong>Registered On:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
      </div>
    </div>
  );
};

export default Profile;