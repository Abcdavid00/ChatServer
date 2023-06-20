import Cache from "./timeCacheClass.js";
import { getRoomUsers } from "../controllers/room.js";

const roomCache = new Cache(1000 * 60 * 60, 1000);

export async function getUsers(roomId) {
    let users = roomCache.get(roomId);
    if (!users) {
        users = await getRoomUsers(roomId);
        if (!users) return null;
        roomCache.set(roomId, users);
        return users;
    }
}