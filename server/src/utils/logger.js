import winston from 'winston';
const { combine, timestamp, printf } = winston.format;

// Define the log formats
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
});

// Create separate transports for REST requests, Socket.IO, and combined logs
const restTransport = new winston.transports.File({ filename: 'rest.log', dirname: 'logs'});
const socketTransport = new winston.transports.File({ filename: 'socket.log', dirname: 'logs' });
const combinedTransport = new winston.transports.File({ filename: 'combined.log', dirname: 'logs' });
const consoleTransport = new winston.transports.Console();

// Create separate loggers for REST requests, Socket.IO, and combined logs
export const restLogger = winston.createLogger({
  format: combine(timestamp(), logFormat),
  transports: [restTransport, combinedTransport, consoleTransport],
});

export const socketLogger = winston.createLogger({
  format: combine(timestamp(), logFormat),
  transports: [socketTransport, combinedTransport, consoleTransport],
});


export const combinedLogger = winston.createLogger({
  format: combine(timestamp(), logFormat),
  transports: [combinedTransport, consoleTransport],
});
