import { Schema, model } from "mongoose";

const AttachmentSchema = new Schema({
    filename: String,
    contentType: String,
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
})

const Attachment = model('Attachment', AttachmentSchema);
export default Attachment;