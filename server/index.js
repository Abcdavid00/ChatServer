import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import router from './src/routers/index.js';


//Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/chat';
console.log('mongoURI: ', mongoURI);
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('MongoDB connected');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const port = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${Date.now()} ${req.method} ${req.url}`);
  next();
})

async function StartApp() {
  router(app);
  const server = app.listen(port, () => {
    console.log(`listening on *:${port}`);
  });

  const io = new Server(server);
  // global.onlineUsers = new Map();
  io.on('connection', (socket) => {
    console.log('Socket connected: ' + socket.id);
  });

}

StartApp();

// const server = http.createServer(app);
// const io = new Server(server)

// mongoose.connect(mongoURI, {
//   user: 'root',
//   pass: 'example',
//   autoCreate: true,
// }).then(() => {
//   console.log('MongoDB connected');
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