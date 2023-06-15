import mongoose from "mongoose";

const mongoUsername = process.env.MONGO_USERNAME || "root";
const mongoPassword = process.env.MONGO_PASSWORD || "example";
const mongoDatabase = process.env.MONGO_DATABASE || "chat";

const checkIfDatabaseExists = async () => {
    mongoose.connect(`mongodb://${mongoUsername}:${mongoPassword}@mongo:27017/admin`, {
}

const createDatabase = async () => {}