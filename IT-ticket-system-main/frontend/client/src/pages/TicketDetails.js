import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import "../assets/styles/TicketDetails.css";

const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch ticket details and comments when ticketId changes
  useEffect(() => {
    const fetchTicketData = async () => {
      setIsLoading(true);  // Start loading state

      try {
        // Fetch ticket details
        const ticketResponse = await axios.get(`/tickets/${ticketId}`);
        setTicket(ticketResponse.data);  // Set ticket data

        // Fetch comments for the specific ticket
        const commentsResponse = await axios.get(`/tickets/${ticketId}/comments`);
        setComments(commentsResponse.data);  // Set comments data

      } catch (error) {
        console.error('Error fetching ticket data:', error);
        setIsLoading(false);
      }
      
      setIsLoading(false);  // Stop loading state after data is fetched
    };

    fetchTicketData();
  }, [ticketId]);  // The hook runs every time ticketId changes

  // Handle adding new comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;  // Avoid submitting empty comments

    axios.post(`/tickets/${ticketId}/comments`, { message: newComment })
      .then(response => {
        setComments(prev => [...prev, response.data]);  // Add the new comment to state
        setNewComment('');  // Reset input field
      })
      .catch(error => console.error('Error adding comment:', error));
  };

  // Loading state or ticket not found
  if (isLoading) return <div>Loading...</div>;
  if (!ticket) return <div>Ticket not found.</div>;

  return (
    <div key={ticketId} className="ticket-details">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <h2>Ticket #{ticket.id} – {ticket.title}</h2>
      <p><strong>Department:</strong> {ticket.department_name}</p>
      <p><strong>Status:</strong> {ticket.status}</p>
      <p><strong>Created by:</strong> {ticket.created_by_name}</p>
      <p><strong>Assigned to:</strong> {ticket.assigned_to_name || "Unassigned"}</p>
      <p><strong>Created on:</strong> {new Date(ticket.created_at).toLocaleString()}</p>

      <h3>Conversation</h3>
      <div className="comments">
        {comments.length === 0 
          ? <p>No comments yet.</p>
          : comments.map(c => (
              <div key={c.id} className={`comment ${c.role}`}>
                <p>
                  <strong>{c.role === 'admin' ? 'Admin' : 'User'}:</strong> {c.message}
                </p>
                <small>{new Date(c.timestamp || c.created_at).toLocaleString()}</small>
              </div>
            ))
        }
      </div>

      <div className="add-comment">
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleAddComment}>Submit</button>
      </div>
    </div>
  );
};

export default TicketDetails;
