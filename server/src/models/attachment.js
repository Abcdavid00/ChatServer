import mongoose from "mongoose";

const AttachmentSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' },
})

export default Attachment = mongoose.model('Attachment', AttachmentSchema);ws