// controllers/commentController.js
const db = require("../config/db");

// Fetch all comments for a given ticket
exports.getComments = (req, res) => {
  const ticketId = req.params.id;
  const sql = `
    SELECT 
      c.id,
      c.message,
      c.role,
      c.created_at AS timestamp,
      u.name AS author
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.ticket_id = ?
    ORDER BY c.created_at ASC
  `;
  db.query(sql, [ticketId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Add a new comment to a ticket
exports.addComment = (req, res) => {
  const ticketId = req.params.id;
  const userId   = req.user.id;            // from authenticateToken middleware
  const { message, role } = req.body;      // role optional, defaults to 'user'

  const sql = `
    INSERT INTO comments (ticket_id, user_id, message, role)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [ticketId, userId, message, role || "user"], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    // Build the newly created comment object to return
    const newComment = {
      id: result.insertId,
      message,
      role: role || "user",
      timestamp: new Date(),
      author: req.user.name  // assuming your auth middleware adds user.name
    };
    res.status(201).json(newComment);
  });
};
