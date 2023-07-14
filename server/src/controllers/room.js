import Room from '../models/room.js';
import { OnRoomCreated, OnRoomUpdated } from '../sockets/index.js';
import { combinedLogger } from '../utils/logger.js';

export async function createRoom(postId, users) {
    try{
        let room = await findRoom(postId, users);
        if (room) {
            return [room, false]
        }
        const latestTimestamp = Date.now();
        const latestMessage = null;
        room = new Room({ postId, users, latestMessage, latestTimestamp });
        await room.save();
        OnRoomCreated(room);
        return [room, true];
    } catch (error) {
        // Handle the error appropriately
        const para = { postId, users };
        combinedLogger.error('Error while creating room:', error, "\nParameter(s): ", JSON.stringify(para));
        console.error('Error while creating room:', error);
        throw error;
    }
}

export async function getRoom(roomId) {
    const room = await Room.findById(roomId).populate('latestMessage').exec();
    return room;
}

export async function findRoom(postId, users) {
    try {
        const room = await Room.findOne({ postId, users: { $all: users, $size: users.length } }).exec();
        return room;
    } catch (error) {
        // Handle the error appropriately
        const para = { postId, users };
        combinedLogger.error('Error while finding room:', error, "\nParameter(s): ", JSON.stringify(para));
        console.error('Error while checking room existence:', error);
        throw error;
    }
}

export async function getRoomsByUser(userId) {
    try {
        const rooms = await Room.find({ users: { $in: [userId] }  }).exec();
        return rooms;
    } catch (error) {
        // Handle the error appropriately
        const para = { userId };
        combinedLogger.error('Error while getting rooms by user:', error, "\nParameter(s): ", JSON.stringify(para));
        console.error('Error while getting rooms by user:', error);
        throw error;
    }
}

export async function getLatestRoomByUser(userId, from, count) {
    try {
        const rooms = await Room.find({ users: { $in: [userId] } }).sort({ latestTimestamp: -1 }).skip(from).limit(count).populate('latestMessage').exec();
        return rooms;
    } catch (error) {
        // Handle the error appropriately
        const para = { userId, from, count };
        combinedLogger.error('Error while getting latest rooms by user:', error, "\nParameter(s): ", JSON.stringify(para));
        console.error('Error while getting latest rooms by user:', error);
        throw error;
    }
}

export async function roomHasUser(roomId, userId) {
    const room = await Room.findById(roomId).exec();
    if (!room) {
        return false;
    }
    return room.users.includes(userId);
}


export async function getRoomUsers(roomId) {
    const room = await Room.findById(roomId).select('users').exec();
    if (!room) {
        return null;
    }
    return room.users;
}


export async function updateLatestMessage(message) {
    const room = await Room.findById(message.roomId).exec();
    if (!room) {
        return;
    }
    room.latestMessage = message;
    room.latestTimestamp = message.timestamp;
    await room.save();
    OnRoomUpdated(room);
    console.log(`Updated latest message of room ${room._id} to ${message._id} at ${message.timestamp}`)
}