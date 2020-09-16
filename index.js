const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const cors = require('cors');
require('dotenv').config();
const connectDB = require('./database/db');
const authRouter = require('./routes/api/auth');

app.use(express.json({ extended: false }));

app.use(cors());
app.use('/api/auth', authRouter);

// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

connectDB();

const PORT = process.env.PORT || 8000;

const allClients = [];

io.on('connection', socket => {
  socket.on('disconnect', () => {
    const i = allClients.findIndex(client => client.id === socket.id);
    if (i > -1) {
      const { room, user } = allClients[i];
      allClients.splice(i, 1);
      io.to(room).emit('chat message', {
        msg: `${user} has left`,
        sender: 'admin',
      });
    }
  });
  socket.on('join room', ({ room, user }) => {
    allClients.push({ id: socket.id, user, room });
    socket.join(room);
    socket.to(room).emit('chat message', {
      msg: `${user} has joined`,
      sender: 'admin',
    });
    io.to(socket.id).emit('chat message', {
      msg: `hello ${user}, welcome to room ${room}!`,
      sender: 'admin',
    });
  });
  socket.on('chat message', ({ room, user, message }) => {
    socket.to(room).emit('chat message', { msg: message, sender: user });
  });
});

// const PORTSOCKET = process.env.PORTSOCKET || 5000;
// http.listen(PORTSOCKET, () => {
//   console.log(`Socket IO listening on ${PORTSOCKET}`);
// });

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
