import React, { useState } from 'react';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import '../assets/styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/auth/forgot-password', { email });
      toast.success('Password reset link sent to your email');
      setEmailSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Forgot Password</h2>
          <p>
            {emailSent
              ? 'Check your email for the reset link'
              : "Enter your email and we'll send you a link to reset your password"}
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#48bb78"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p>We've sent a password reset link to your email address.</p>
            <p className="check-spam">
              Didn't receive it? Check your spam folder or{' '}
              <button
                onClick={() => setEmailSent(false)}
                className="text-link"
              >
                try again
              </button>
            </p>
          </div>
        )}

        <div className="auth-footer">
          <p>
            Remember your password? <Link to="/login" className="auth-link">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;