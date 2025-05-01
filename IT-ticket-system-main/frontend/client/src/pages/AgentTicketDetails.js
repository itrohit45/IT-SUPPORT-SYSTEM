import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import '../assets/styles/AgentTicketDetails.css';

const socket = io("http://localhost:5000");

const AgentTicketDetails = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchTicket = async () => {
      try {
        const res = await axios.get(`/tickets/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTicket(res.data);
      } catch (err) {
        toast.error('Failed to load ticket');
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`/tickets/${ticketId}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(res.data);
      } catch (err) {
        toast.error('Failed to load comments');
      }
    };

    fetchTicket();
    fetchComments();

    socket.on('receiveComment', (comment) => {
      if (comment.ticketId === ticketId) {
        setComments((prev) => [...prev, comment]);
      }
    });

    return () => {
      socket.off('receiveComment');
    };
  }, [ticketId]);

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized');
      return;
    }

    const commentData = {
      message: newComment,
      role: 'admin', // or 'agent' based on your system
    };

    try {
      const res = await axios.post(
        `/tickets/${ticketId}/comments`,
        commentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      socket.emit('sendComment', { ...res.data, ticketId });
      setNewComment('');
    } catch (err) {
      console.error("Send error:", err);
      toast.error('Failed to send comment');
    }
  };

  return (
    <div className="ticket-details-container">
      <div className="ticket-details-left">
        {ticket ? (
          <>
            <div className="ticket-info">
              <h2>{ticket.title}</h2>
              <p>{ticket.description}</p>
            </div>

            <div className="chat-box">
              <h3>Conversation</h3>
              <div className="messages-list">
                {comments.map((msg, index) => (
                  <div
                    key={index}
                    className={`message-bubble ${msg.role === 'admin' ? 'agent' : 'user'}`}
                  >
                    <span className="author">{msg.author}</span>
                    <p className="text">{msg.message}</p>
                    <span className="timestamp">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="reply-box">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Type your message here..."
                />
                <button onClick={handleSendComment}>Send</button>
              </div>
            </div>
          </>
        ) : (
          <p>Loading ticket...</p>
        )}
      </div>

      <div className="ticket-details-right">
        {ticket && (
          <>
            <h4>Ticket Info</h4>
            <div className="info-box">
              <p>
                <strong>Status:</strong>
                <span className={`status-tag ${ticket.status}`}> {ticket.status}</span>
              </p>
              <p><strong>Priority:</strong> {ticket.priority}</p>
              <p><strong>Created By:</strong> {ticket.created_by_name}</p>
              <p><strong>Created At:</strong> {new Date(ticket.created_at).toLocaleString()}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AgentTicketDetails;
