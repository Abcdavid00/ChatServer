import mongoose from 'mongoose';

// ChatRoom Schema
const ChatRoomSchema = new mongoose.Schema({
    postId: String,
    users: [{ type: String, ref: 'User' }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' }
});

// ChatMessage Schema
const ChatMessageSchema = new mongoose.Schema({
    chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' },
    senderId: { type: String, ref: 'User' },
    timestamp: Date,
    content: String,
    attachment: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatAttachment' }
});

// ChatAttachment Schema
const ChatAttachmentSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' },
});

// Define the models
export const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
export const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
export const ChatAttachment = mongoose.model('ChatAttachment', ChatAttachmentSchema);