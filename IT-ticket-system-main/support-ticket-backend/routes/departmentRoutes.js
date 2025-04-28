// backend/routes/departmentRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// GET all departments
router.get('/', authenticateToken, (req, res) => {
  db.query('SELECT * FROM departments', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching departments' });
    res.json(results);
  });
});

module.exports = router;
