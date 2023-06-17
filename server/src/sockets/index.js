import { Server } from 'socket.io';
import BiMap from 'bidirectional-map';
import { socketLogger, combinedLogger } from '../utils/logger.js';

let io; // Store the Socket.IO instance
let onlineUsers // Store the online users

export function initializeSocket(server) {
    io = new Server(server);
    onlineUsers = new BiMap();
    // Socket.IO event handlers and functionality
    io.on('connection', (socket) => {

        socketLogger.info(`Socket connected: ${socket.id}`);


        let sid = socket.id;
        let uid = null

        socket.on('set user', (id) => {
            socketLogger.info(`Client ${socket.id} set user: ${id}`);
            onlineUsers.set(uid, socket.id);
            uid = id;
        });

        socket.on('chat message', (msg) => {
            socketLogger.info(`User ${uid} sent message: ${msg}`);
        })

        socket.on('disconnect', () => {
            socketLogger.info(`Socket disconnected: ${socket.id}`);
            onlineUsers.delete(uid);
        });
    });
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.IO has not been initialized');
    }
    return io;
}
