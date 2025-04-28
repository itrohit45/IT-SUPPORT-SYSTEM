const db = require('../config/db');

const createTicket = (ticket, file, callback) => {
  // If there's a file, save its path; otherwise, set it to null
  const filePath = file ? `/uploads/${file.filename}` : null;

  const sql = `
    INSERT INTO tickets (title, description, priority, status, department_id, assigned_to, user_id, attachment)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    ticket.title,
    ticket.description,
    ticket.priority || 'low',
    ticket.status || 'open',
    ticket.department_id,
    ticket.assigned_to || null,
    ticket.user_id, // ✅ Make sure this is added!
    filePath // Save the file path (or null if no file)
  ];

  db.query(sql, values, callback);
};

const assignTicket = (ticketId, userId, callback) => {
  const sql = `
    UPDATE tickets
    SET assigned_to = ?, status = 'in_progress', updated_at = NOW()
    WHERE id = ?
  `;
  db.query(sql, [userId, ticketId], callback);
};

const updateTicketStatus = (ticketId, status, callback) => {
  const sql = `
    UPDATE tickets
    SET status = ?, updated_at = NOW()
    WHERE id = ?
  `;
  db.query(sql, [status, ticketId], callback);
};

const getAllTickets = (callback) => {
  const sql = `
    SELECT t.*, u.name AS created_by_name, d.name AS department_name
    FROM tickets t
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN departments d ON t.department_id = d.id
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching tickets:", err);
      return callback(err, null);
    }
    
    console.log("Tickets with user name:", results); // Log the results here
    
    callback(null, results);
  });
};

const getTicketsByUser = (userId, callback) => {
  const sql = 'SELECT * FROM tickets WHERE assigned_to = ?';
  db.query(sql, [userId], callback);
};

const getTicketById = (ticketId, callback) => {
  const sql = 'SELECT * FROM tickets WHERE id = ?';
  db.query(sql, [ticketId], (err, results) => {
    if (err) return callback(err, null);
    if (results.length === 0) return callback(null, null);
    callback(null, results[0]);
  });
};

const updateTicketWithFile = (ticketId, updatedFields, file, callback) => {
  const filePath = file ? `/uploads/${file.filename}` : updatedFields.attachment || null;

  const sql = `
    UPDATE tickets 
    SET title = ?, description = ?, priority = ?, department_id = ?, attachment = ?, updated_at = NOW()
    WHERE id = ?
  `;

  const values = [
    updatedFields.title,
    updatedFields.description,
    updatedFields.priority,
    updatedFields.department_id,
    filePath,
    ticketId
  ];

  db.query(sql, values, callback);
};

module.exports = {
  createTicket,
  assignTicket,
  updateTicketStatus,
  getAllTickets,
  getTicketsByUser,
  getTicketById,
  updateTicketWithFile
};
