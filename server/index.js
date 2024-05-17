import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import { initializeSocket } from './src/sockets/index.js';
import router from './src/routers/index.js';
import { restLogger, combinedLogger } from './src/utils/logger.js';
import helmet from 'helmet';

const port = process.env.PORT || 3000;
const MONGO_ROOT_USERNAME = process.env.MONGO_ROOT_USERNAME;
const MONGO_ROOT_PASSWORD = process.env.MONGO_ROOT_PASSWORD;
const MONGO_DATABASE = process.env.MONGO_DATABASE;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(helmet());
app.use(express.json());
app.use((req, res, next) => {
  restLogger.info(`${req.method} ${req.url}`);
  next();
})

async function StartApp() {

  //Connect to MongoDB
  const mongoURI = process.env.MONGO_URI || `mongodb://mongo:27017/${MONGO_DATABASE}` ;
  combinedLogger.info(`Connecting to MongoDB using ${mongoURI}`);
  await mongoose.connect(mongoURI, {
    user: MONGO_ROOT_USERNAME,
    pass: MONGO_ROOT_PASSWORD,
    authSource: 'admin',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    combinedLogger.info(`Connected to MongoDB using ${mongoURI}`);
  }).catch((error) => {
    combinedLogger.error(`Error connecting to MongoDB: ${error}`);
    return;
  });

  app.use('/chat', router);

  const server = app.listen(port, () => {
    combinedLogger.info(`Server listening on port ${port}`);
  });

  initializeSocket(server);
}

StartApp();
