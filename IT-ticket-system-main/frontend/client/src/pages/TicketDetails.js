import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import "../assets/styles/TicketDetails.css";

const socket = io("http://localhost:5000");

const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTicketData = async () => {
      setIsLoading(true);
      setTicket(null);
      setComments([]);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token not found");
          return;
        }

        const ticketResponse = await axios.get(`/tickets/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTicket(ticketResponse.data);

        const commentsResponse = await axios.get(`/tickets/${ticketId}/comments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching ticket data:', error);
      }

      setIsLoading(false);
    };

    fetchTicketData();

    socket.emit("joinTicketRoom", ticketId);

    socket.on("receiveMessage", (data) => {
      setComments(prev => [...prev, data]);
    });

    return () => {
      socket.emit("leaveTicketRoom", ticketId);
      socket.off("receiveMessage");
    };
  }, [ticketId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      console.log("Decoded token:", decodedToken);

      if (!userId) {
        console.error("User ID not found in token");
        return;
      }

      const commentData = {
        message: newComment,
        role: "user"
      };

      // ✅ Send the comment to the backend to store in DB
      const res = await axios.post(
        `/tickets/${ticketId}/comments`,
        commentData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // ✅ Emit after successful save
      socket.emit("sendMessage", { ...res.data, ticketId });

      setNewComment('');
    } catch (error) {
      console.error("Failed to add comment:", error.response?.data || error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!ticket) return <div>Ticket not found.</div>;

  return (
    <div className="ticket-details-container">
      <div className="ticket-details-left">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

        <h3>Conversation</h3>
        <div className="comments">
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((c, index) => (
              <div key={c.id || index} className={`comment-bubble ${c.role}`}>
                <p><strong>{c.author}:</strong> {c.message}</p>
                <small>{new Date(c.timestamp || c.created_at).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>

        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleAddComment}>Send</button>
        </div>
      </div>

      <div className="ticket-details-right">
        <h4>Ticket Info</h4>
        <div className="info-box">
          <p>Ticket {ticket.id} – {ticket.title}</p>
          <p><strong>Raised:</strong> {new Date(ticket.created_at).toLocaleDateString()}</p>
          <p><strong>Closed:</strong> {ticket.closed_at ? new Date(ticket.closed_at).toLocaleDateString() : "N/A"}</p>
          <p><strong>Status:</strong>
            <span className={`status-tag ${ticket.status.toLowerCase()}`}>
              {ticket.status}
            </span>
          </p>
        </div>

        <div className="info-box">
          <p><strong>Assigned To:</strong><br />{ticket.assigned_to_name || "Unassigned"}</p>
        </div>

        <div className="info-box">
          <p><strong>Raised By:</strong><br />{ticket.created_by_name}</p>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
