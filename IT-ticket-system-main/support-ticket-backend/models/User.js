const db = require("../config/db");

const createUser = (user, callback) => {
  const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  const allowedRoles = ["user", "admin", "agent"];
  if (!allowedRoles.includes(user.role)) {
    return callback(new Error("Invalid role"));
  }
  db.query(sql, [user.name, user.email, user.password, user.role || "user"], callback);
};

const getUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};

const getAllAgents = (callback) => {
  const sql = "SELECT id, name FROM users WHERE role = 'agent'";
  db.query(sql, callback);
};

const getUserById = (id, callback) => {
  const sql = "SELECT id, name, email, role, created_at FROM users WHERE id = ?";
  db.query(sql, [id], callback);
};

module.exports = {
  createUser,
  getUserByEmail,
  getAllAgents,
  getUserById
};
