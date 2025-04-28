const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = (req, res) => {
  const { name, email, password, role, department_id } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: err });

    User.createUser({ name, email, password: hash, role }, (err, result) => {
      if (err) return res.status(500).json({ error: err });

      const userId = result.insertId;

      // If role is agent, insert into agent_department
      if (role === 'agent' && department_id) {
        const sql = 'INSERT INTO agent_department (agent_id, department_id) VALUES (?, ?)';
        db.query(sql, [userId, department_id], (err) => {
          if (err) return res.status(500).json({ error: 'Failed to assign agent to department' });

          res.status(201).json({ message: 'Agent registered and assigned to department successfully' });
        });
      } else {
        res.status(201).json({ message: 'User registered successfully' });
      }
    });
  });
};


const login = (req, res) => {
  const { email, password } = req.body;

  User.getUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, match) => {
      if (err || !match) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });

      // If user is an agent, fetch their department
      if (user.role === 'agent') {
        const sql = `
          SELECT d.id AS department_id, d.name AS department_name
          FROM agent_department ad
          JOIN departments d ON ad.department_id = d.id
          WHERE ad.agent_id = ?
        `;
        db.query(sql, [user.id], (err, deptResults) => {
          if (err) return res.status(500).json({ error: 'Failed to fetch department' });

          const department = deptResults[0] || null;
          return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
              id: user.id,
              name: user.name,
              role: user.role,
              department
            }
          });
        });
      } else {
        // For non-agent users
        res.status(200).json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            name: user.name,
            role: user.role
          }
        });
      }
    });
  });
};

const getAgents = async (req, res) => {
  try {
    const [agents] = await db.promise().query(
      `SELECT id, name, email FROM users WHERE role = 'agent'`
    );
    res.json(agents);
  } catch (err) {
    console.error('Error fetching agents:', err);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
};

module.exports = { register, login, getAgents };
