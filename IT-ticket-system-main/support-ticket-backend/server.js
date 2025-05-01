const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const db = require('./config/db'); // MySQL connection

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const departmentRoutes = require('./routes/departmentRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/departments', departmentRoutes);

// Socket.io Setup
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join ticket room
  socket.on('joinTicketRoom', (ticketId) => {
    socket.join(ticketId);
    console.log(`User joined room for ticket: ${ticketId}`);
  });

  // Handle sending a message (comment)
  socket.on('sendMessage', async (data) => {
    try {
      const { ticketId, message, userId, role } = data;

      // Insert comment into the database
      const [result] = await db.execute(
        "INSERT INTO comments (ticket_id, user_id, message, role) VALUES (?, ?, ?, ?)",
        [ticketId, userId, message, role]
      );

      // Get user's name from DB
      const [userResult] = await db.execute(
        "SELECT name FROM users WHERE id = ?",
        [userId]
      );

      const author = userResult.length > 0 ? userResult[0].name : 'Unknown';

      const savedComment = {
        id: result.insertId,
        ticketId,
        message,
        userId,
        role,
        author,
        timestamp: new Date()
      };

      // Emit to all in the ticket room
      io.to(ticketId).emit('receiveMessage', savedComment);
    } catch (err) {
      console.error('Error saving comment:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
