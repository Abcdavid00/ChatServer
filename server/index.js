import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { Server } from "socket.io";
import { ChatRoom } from './src/database/schema.js';

const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/chat-app';

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server)
// 
console.log('mongoURI: ', mongoURI);
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
//   console.log('MongoDB connected');
// }).catch((error) => {
//   console.error('Error connecting to MongoDB:', error);
// });

mongoose.connect(mongoURI, {
  user: 'root',
  pass: 'example',
  autoCreate: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// mongoose.connect(connectionString, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('Connected to MongoDB');
// }).catch((error) => {
//   console.error('Error connecting to MongoDB:', error);
// });

// io.on('connection', (socket) => {
//   console.log('user connected');
//   socket.broadcast.emit('New user joined');

//   socket.on('disconnect', () => {
//       console.log('user disconnected');
//   })

//   socket.on('chat message', (msg) => {
//     console.log('message: ' + msg);
//     io.emit('chat message', msg)
//   })

// })

ChatRoom.create({ postId: '123', users: ['user1', 'user2'] }).then((chatRoom) => {
  console.log("ChatRoom created: ", chatRoom)
})

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});