const Ticket = require('../models/Ticket');
const path = require('path'); // For handling file extensions
const fs = require('fs'); // To handle file deletion in case of error
const db = require('../config/db'); // Assuming db is set up here

// Create a ticket
const createTicket = (req, res) => {
  console.log("🔐 User from token:", req.user);
  console.log("📁 Uploaded file:", req.file); // Helpful for debugging

  const { title, description, priority, department_id } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ message: 'User not authenticated' });
  }

  const newTicket = {
    title,
    description,
    priority,
    status: 'open',
    department_id,
    assigned_to: null,
    user_id: userId,
  };

  // ✅ Pass the uploaded file to the model
  Ticket.createTicket(newTicket, req.file, (err, result) => {
    if (err) {
      console.error('Error creating ticket:', err);
      return res.status(500).json({ message: 'Failed to create ticket', error: err });
    }

    res.status(201).json({ message: 'Ticket created successfully', ticketId: result.insertId });
  });
};

// Assign a ticket
const assignTicket = (req, res) => {
  const ticketId = req.params.id;
  const { userId } = req.body;

  console.log('Assigning ticket:', ticketId, 'to user:', userId);  

  Ticket.assignTicket(ticketId, userId, (err, result) => {
    if (err) {
      console.error("Error while assigning ticket:", err); 
      return res.status(500).json({ message: 'Failed to assign ticket', error: err });
    }

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Ticket not found' });

    res.status(200).json({ message: 'Ticket assigned successfully' });
  });
};

// Update ticket status
const updateTicketStatus = (req, res) => {
  const ticketId = req.params.id;
  const { status } = req.body;

  const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  Ticket.updateTicketStatus(ticketId, status, (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to update status', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Ticket not found' });

    res.status(200).json({ message: 'Ticket status updated successfully' });
  });
};

// Get all tickets (admin-only)
const getTickets = (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  if (userRole === 'admin') {
    Ticket.getAllTickets((err, tickets) => {
      if (err) return res.status(500).json({ message: 'Error fetching tickets' });
      res.status(200).json(tickets);
    });
  } else {
    Ticket.getTicketsByUser(userId, (err, tickets) => {
      if (err) return res.status(500).json({ message: 'Error fetching user tickets' });
      res.status(200).json(tickets);
    });
  }
};

// Get ticket by ID
const getTicketById = (req, res) => {
  const ticketId = req.params.id;
  const query = `
    SELECT 
      t.*,
      u_creator.name   AS created_by_name,
      u_assignee.name  AS assigned_to_name,
      d.name           AS department_name
    FROM tickets t
    LEFT JOIN users u_creator   ON t.user_id      = u_creator.id
    LEFT JOIN users u_assignee  ON t.assigned_to  = u_assignee.id
    LEFT JOIN departments d     ON t.department_id = d.id
    WHERE t.id = ?
  `;

  db.query(query, [ticketId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching ticket', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Ticket not found' });

    console.log(results[0]); // Log the result to check the data returned
    res.json(results[0]);
  });
};

// Update ticket with file
const updateTicketWithFile = (req, res) => {
  const ticketId = req.params.id;
  const { title, description, priority, department_id } = req.body;
  const file = req.file;

  const updatedFields = {
    title,
    description,
    priority,
    department_id,
    attachment: req.body.existingAttachment || null // fallback if no new file
  };

  Ticket.updateTicketWithFile(ticketId, updatedFields, file, (err, result) => {
    if (err) {
      console.error('Error updating ticket:', err);
      return res.status(500).json({ message: 'Failed to update ticket' });
    }
    res.status(200).json({ message: 'Ticket updated successfully' });
  });
};

module.exports = {
  createTicket,
  assignTicket,
  updateTicketStatus,
  getTickets,
  getTicketById,
  updateTicketWithFile
};
