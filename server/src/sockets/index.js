import { Server } from 'socket.io';
import BiMap from 'bidirectional-map';

let io; // Store the Socket.IO instance
let onlineUsers // Store the online users

export function initializeSocket(server) {
    io = Server(server);
    onlineUsers = new BiMap();
    // Socket.IO event handlers and functionality
    io.on('connection', (socket) => {
    
        console.log('Socket connected: ' + socket.id);

        let sid = socket.id;
        let uid = null
    
        socket.on('set user', (id) => {
          console.log(`Client ${socket.id} set user: ${id}`);
          onlineUsers.set(uid, socket.id);
          uid = id;
        });
    
        socket.on('chat message', (msg) => {
          console.log(`User ${uid} sent message: ${msg}`);
        })
    
        socket.on('disconnect', () => {
          console.log(`User ${uid} with socketID ${sid} disconnected`)
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
