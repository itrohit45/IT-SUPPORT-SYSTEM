const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { ticket_id, user_id, is_satisfied } = req.body;
  db.query('INSERT INTO feedback (ticket_id, user_id, is_satisfied) VALUES (?, ?, ?)',
    [ticket_id, user_id, is_satisfied],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true });
  });
});

module.exports = router;
