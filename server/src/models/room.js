import { Schema, model } from "mongoose";

const RoomSchema = new Schema({
    postId: String,
    users: [{ type: String }],
    latestMessage: { type: Schema.Types.ObjectId,ref: 'Message' },
    latestTimestamp: Date,
})

const Room = model('Room', RoomSchema);
export default Room;