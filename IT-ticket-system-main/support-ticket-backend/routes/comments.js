const express = require('express');
const router = express.Router();
const db = require('../db');

// Get comments for a ticket
router.get('/:ticketId', (req, res) => {
  const { ticketId } = req.params;
  db.query('SELECT * FROM comments WHERE ticket_id = ?', [ticketId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Post a new comment
router.post('/', (req, res) => {
  const { ticket_id, user_id, message, role } = req.body;
  db.query(
    'INSERT INTO comments (ticket_id, user_id, message, role) VALUES (?, ?, ?, ?)',
    [ticket_id, user_id, message, role],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      // Fetch the newly inserted comment
      db.query('SELECT * FROM comments WHERE id = ?', [result.insertId], (err2, rows) => {
        if (err2) return res.status(500).json({ error: err2 });
        res.json(rows[0]); // send full comment object back
      });
    }
  );
});

module.exports = router;
