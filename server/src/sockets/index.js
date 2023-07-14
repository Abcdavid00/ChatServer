import { Server } from 'socket.io';
import { socketLogger, combinedLogger } from '../utils/logger.js';
import { getRoom, getRoomUsers } from '../controllers/room.js';
import { createMessage } from '../controllers/message.js';

let io; // Store the Socket.IO instance
let onlineUsers = {} // Store the online users

function getUserId(socketId) {
    for (let key of Object.keys(onlineUsers)) {
        if (onlineUsers[key] === socketId) return key;
    }
    return null; // return null if socketId is not found
}

function getSocketId(userId) {
    return onlineUsers[userId]; // return the socketId associated with the userId
}

export function initializeSocket(server) {
    io = new Server(server);
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
            uid = id;
            onlineUsers = { ...onlineUsers, [id]: socket.id}
            clearInterval(requestPing);
        });

        socket.on('chat message', (msg) => {
            socketLogger.info(`Client ${socket.id} sent message: ${msg}`);
            OnClientSendMessage(socket, msg);
        })

        socket.on('disconnect', () => {
            socketLogger.info(`Socket disconnected: ${socket.id}`);
            try {
                onlineUsers = { ...onlineUsers, [uid]: undefined}
            } catch (error) {
                socketLogger.error(`Error while disconnecting socket ${socket.id}: ${error}`);
            }
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
    console.log(`Online users: ${JSON.stringify(onlineUsers)}`)
    try {
        const message = await createMessage(roomId, senderId, content);
        const users = await getRoomUsers(roomId);
        console.log("Users in room: ", users)
        for (const user of users) {
            const socketId = getSocketId(user);
            console.log(`Getting socket id for user ${user}: ${socketId}`)
            if (socketId) {
                console.log(`Sending message to user ${user} with socket ${socketId}: ${JSON.stringify(message)}`)
                io.to(socketId).emit('chat message', message);
            }
        }
        // socketLogger.info(`User ${senderId} sent message to room ${roomId}: ${content}`);
        // const room = await getRoom(roomId);
        // OnRoomCreated(room);
    } catch (error) {
        socketLogger.error(`Error while sending message to room ${roomId}: ${error}`);
    }
}

export async function OnRoomCreated(room) {
    const users = await getRoomUsers(room._id);
    console.log("Room created: ", JSON.stringify(room))
    console.log(`Users in room ${room._id}: `, users)
    for (const user of users) {
        const socketId = getSocketId(user);
        if (socketId) {
            io.to(socketId).emit('room created', room);
        }
    }
}

export async function OnRoomUpdated(room) {
    const users = await getRoomUsers(room._id);
    console.log("Room updated: ", JSON.stringify(room))
    console.log(`Users in room ${room._id}: `, users)
    for (const user of users) {
        const socketId = getSocketId(user);
        if (socketId) {
            io.to(socketId).emit('room updated', room);
        }
    }
}