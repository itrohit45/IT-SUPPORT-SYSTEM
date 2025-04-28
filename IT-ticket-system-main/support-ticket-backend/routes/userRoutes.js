const express = require('express');
const router = express.Router();
const { register, login, getAgents } = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const db = require('../config/db');

router.post('/register', register);
router.post('/login', login);
router.get('/agents', authenticateToken, authorizeRoles('admin'), getAgents);
router.get('/profile', authenticateToken, (req, res) => {
  // Get user ID from the authenticated token
  const userId = req.user.id;

  User.getUserById(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user data without sensitive information
    const user = results[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    });
  });
});

module.exports = router;
