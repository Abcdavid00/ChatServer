import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import { initializeSocket } from './src/sockets/index.js';
import router from './src/routers/index.js';
import BiMap from 'bidirectional-map';

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
  app.use('/chat', router);
  const server = app.listen(port, () => {
    console.log(`listening on *:${port}`);
  });

  initializeSocket(server);
}

StartApp();