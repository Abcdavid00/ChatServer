import Room from '../models/room.js';
import Message from '../models/message.js';
import { combinedLogger } from '../utils/logger.js';
import { roomHasUser, updateLatestMessage } from './room.js';

export async function createMessage(roomId, senderId, content) {
    const timestamp = Date.now();
    const userInRoom = await roomHasUser(roomId, senderId);
    if (!userInRoom) {
        throw new Error('User is not in room');
    }
    const message = new Message({ roomId, senderId, content, timestamp });
    await message.save();
    updateLatestMessage(message);
    return message;
}


export async function getMessagesByRoom(roomId, from, count) {
    try {
        const messages = await Message.find({ roomId }).sort({ timestamp: -1 }).skip(from).limit(count).exec();
        return messages;
    } catch {
        // Handle the error appropriately
        const para = { roomId, from, count };
        combinedLogger.error('Error while getting messages by room:', error, "\nParameter(s): ", JSON.stringify(para));
        throw error;
    }
}