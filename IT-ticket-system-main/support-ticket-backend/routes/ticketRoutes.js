const express = require('express');
const router = express.Router();
const path = require('path');
const upload = require('../middleware/upload');

const {
  createTicket,
  assignTicket,
  updateTicketStatus,
  getTickets,
  getTicketById,
  updateTicketWithFile
} = require('../controllers/ticketController');

// Comment controller
const { getComments, addComment } = require('../controllers/commentController');

const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const db = require('../config/db');

// Route to create a ticket (with file upload)
router.post(
  '/create',
  authenticateToken,
  upload.single('attachment'),
  createTicket
);

// Route to assign a ticket (only accessible by admin)
router.put(
  '/:id/assign',
  authenticateToken,
  authorizeRoles('admin'),
  assignTicket
);

// Route to update ticket status (general status update)
router.put('/:id/status', authenticateToken, updateTicketStatus);

// Route to update ticket with file (edit with optional file)
router.put(
  '/update/:id',
  authenticateToken,
  upload.single('attachment'),
  updateTicketWithFile
);

// Route to get all tickets (admin-only)
router.get('/', authenticateToken, getTickets);

// Route to get tickets by user
router.get('/user/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const query = `
    SELECT t.*, d.name AS department_name
    FROM tickets t
    LEFT JOIN departments d ON t.department_id = d.id
    WHERE t.user_id = ?
    ORDER BY t.created_at DESC
  `;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', err });
    res.json(results);
  });
});

// Route to get assigned tickets for the logged-in user
router.get('/assigned', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const [tickets] = await db.promise().query(
      `SELECT tickets.*, 
              departments.name AS department_name, 
              u.name AS created_by_name
       FROM tickets 
       JOIN departments ON tickets.department_id = departments.id
       JOIN users u ON tickets.user_id = u.id
       WHERE tickets.assigned_to = ?`,
      [userId]
    );
    res.json(tickets);
  } catch (err) {
    console.error('Error fetching assigned tickets:', err);
    res.status(500).json({ error: 'Failed to fetch assigned tickets' });
  }
});

// Route to get solved tickets (admin-only)
router.get(
  '/solved-tickets',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const [tickets] = await db.promise().query(
        `SELECT tickets.*, 
                departments.name AS department_name, 
                u.name AS created_by_name
         FROM tickets 
         JOIN departments ON tickets.department_id = departments.id
         JOIN users u ON tickets.user_id = u.id
         WHERE tickets.status = 'resolved'`
      );
      res.json(tickets);
    } catch (err) {
      console.error('Error fetching solved tickets:', err);
      res.status(500).json({ error: 'Failed to fetch solved tickets' });
    }
  }
);

// Comment routes (conversation history)
router.get('/:id/comments', authenticateToken, getComments);
router.post('/:id/comments', authenticateToken, addComment);

// Route to get ticket by ID
router.get('/:id', authenticateToken, getTicketById);

module.exports = router;
