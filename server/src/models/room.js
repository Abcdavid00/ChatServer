import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    postId: String,
    users: [{ type: String, ref: 'User' }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId,ref: 'Message' },
    latestMessageTimestamp: Date,
})

export const Room = mongoose.model('Room', RoomSchema);