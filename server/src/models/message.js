import { Schema, model } from 'mongoose';

const MessageSchema = new Schema({
    roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
    senderId: { type: String},
    timestamp: Date,
    content: String,
    attachment: { type: Schema.Types.ObjectId, ref: 'Attachment' }
})

const Message = model('Message', MessageSchema);
export default Message
 