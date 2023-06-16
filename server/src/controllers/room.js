import Room from '../models/room';

export const createRoom = async (req, res) => {
    const { postId, users} = req.body;
    const latestMessageTimestamp = Date.now();
    const latestMessage = null;
    const room = new Room({ postId, users, latestMessage, latestMessageTimestamp });
    
}

