import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' },
    senderId: { type: String, ref: 'User' },
    timestamp: Date,
    content: String,
    attachment: { type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }
})

export const Message = mongoose.model('Message', MessageSchema);