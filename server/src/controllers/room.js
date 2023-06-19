import Room from '../models/room.js';

export async function createRoom(postId, users) {
    let room = await findRoom(postId, users);
    if (room) {
        return [room, false]
    }
    const latestTimestamp = Date.now();
    const latestMessage = null;
    room = new Room({ postId, users, latestMessage, latestTimestamp });
    await room.save();
    return [room, true];
}

export async function getRoom(roomId) {
    return await Room.findById(roomId).exec();
}

export async function findRoom(postId, users) {
    try {
        const room = await Room.findOne({ postId, users: { $all: users } }).exec();
        return room;
    } catch (error) {
        // Handle the error appropriately
        console.error('Error while checking room existence:', error);
        throw error;
    }
}