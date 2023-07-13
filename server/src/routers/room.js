import express from 'express';
import { createRoom, findRoom, getRoom, getLatestRoomByUser, roomHasUser } from '../controllers/room.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from Mobike Chat Server (Room)!');
});

router.get('/:roomID', async (req, res) => {
    const room = await getRoom(req.params.roomID);
    if (room) {
        res.send(room);
    }else {
        res.status(404).send('Room not found');
    }
});

router.post('/create', async (req, res) => {
    const { postId, users } = req.body;
    if (!postId || !users) {
        res.status(400).send('Missing parameters');
        return;
    }
    const [room, created] = await createRoom(postId, users);
    res.status(200).send({
        room: room,
        created: created,
    });
})

router.post('/find', async (req, res) => {
    const { postId, users } = req.body;
    if (!postId || !users) {
        res.status(400).send('Missing parameters');
        return;
    }
    const room = await findRoom(postId, users);
    if (room) {
        res.status(200).send(room);
    }else {
        res.status(404).send('Room not found');
    }
})

router.get('/latest/:userId', async (req, res) => {
    const userId = req.params.userId;
    let { from, count } = req.body;
    if (!userId) {
        res.status(400).send('Missing User ID');
        return;
    }
    if (!from) from = 0;
    if (!count) count = 30;
    try {
        const rooms = await getLatestRoomByUser(userId, from, count);
        if (rooms) {
            res.status(200).send(rooms);
            return;
        }
        res.status(404).send('Rooms not found');
    } catch (error) {
        res.status(500).send('Server error');
    }
})

router.get('/hasuser/:roomId/:userId', async (req, res) => {
    const roomId = req.params.roomId;
    const userId = req.params.userId;
    if (!roomId || !userId) {
        res.status(400).send('Missing parameters');
        return;
    }
    const room = await getRoom(roomId);
    if (room) {
        // const hasUser = room.users.includes(userId);
        const hasUser = await roomHasUser(roomId, userId);
        res.status(200).send(hasUser);
    }else {
        res.status(404).send('Room not found');
    }
})

export default router;
