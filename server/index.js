import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import { initializeSocket } from './src/sockets/index.js';
import router from './src/routers/index.js';
import { restLogger, combinedLogger } from './src/utils/logger.js';
import helmet from 'helmet';

const port = process.env.PORT || 3000;
const mongo_root_username = process.env.MONGO_ROOT_USERNAME;
const mongo_root_password = process.env.MONGO_ROOT_PASSWORD;

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
  const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/chat';
  combinedLogger.info(`Connecting to MongoDB at ${mongoURI}`);
  await mongoose.connect(mongoURI, {
    user: mongo_root_username,
    pass: mongo_root_password,
    authSource: 'admin',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    combinedLogger.info(`Connected to MongoDB at ${mongoURI}`);
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

// if (module.hot) {
//   module.hot.accept();
//   module.hot.dispose(() => server.close());
// }

StartApp();
