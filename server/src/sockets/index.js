import { Server } from 'socket.io';
import BiMap from 'bidirectional-map';
import { socketLogger, combinedLogger } from '../utils/logger.js';
import { getUsers } from '../utils/roomCache.js';
import { createMessage } from '../controllers/message.js';

let io; // Store the Socket.IO instance
let onlineUsers // Store the online users

function getUserId(socketId) {
    return onlineUsers.getKey(socketId);
}

function getSocketId(userId) {
    return onlineUsers.get(userId);
}

export function initializeSocket(server) {
    io = new Server(server);
    onlineUsers = new BiMap();
    // Socket.IO event handlers and functionality
    io.on('connection', (socket) => {

        socketLogger.info(`Socket connected: ${socket.id}`);

        let sid = socket.id;
        let uid = null

        const requestPing = setInterval(() => {
            socket.emit('request user');
        }, 1000);

        socket.on('set user', (id) => {
            socketLogger.info(`Client ${socket.id} set user: ${id}`);
            onlineUsers.set(uid, socket.id);
            uid = id;
            clearInterval(requestPing);
        });

        socket.on('chat message', (msg) => {
            socketLogger.info(`Client ${socket.id} sent message: ${msg}`);
            OnClientSendMessage(socket, msg);
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

async function OnClientSendMessage(socket, data) {
    const { roomId, content } = data;
    if (!roomId || !content) {
        socketLogger.error(`Invalid message from client ${socket.id}: ${JSON.stringify(data)}`);
        return;
    }
    const senderId = getUserId(socket.id);
    console.log(`User ${senderId} with socket ${socket.id} sent message to room ${roomId}: ${content}`)
    console.log(`Current online users: ${JSON.stringify(onlineUsers)}`)
    try {
        const message = await createMessage(roomId, senderId, content);
        const users = await getUsers(roomId);
        users.forEach((user) => {
            const socketId = getSocketId(user._id);
            if (socketId) {
                io.to(socketId).emit('chat message', message);
            }
        })
        socketLogger.info(`User ${senderId} sent message to room ${roomId}: ${content}`);
    } catch (error) {
        socketLogger.error(`Error while sending message to room ${roomId}: ${error}`);
    }
}