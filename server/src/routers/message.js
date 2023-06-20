import express from 'express';
import { createMessage, getMessagesByRoom } from '../controllers/message.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from Mobike Chat Server (Message)!');
});

router.post('/create', async (req, res) => {
    const { roomId, userId, content } = req.body;
    if (!roomId || !userId || !content) {
        res.status(400).send('Missing parameters');
        return;
    }
    try {
        const message = await createMessage(roomId, userId, content);
        res.status(200).send(message);
    } catch (error) {
        if (error.message === 'User is not in room') {
            res.status(400).send('User is not in room');
            return;
        }
    }
});

router.get('/latest/:roomId', async (req, res) => {
    const roomId = req.params.roomId;
    let { from, count } = req.body;
    if (!roomId) {
        res.status(400).send('Missing Room ID');
        return;
    }
    if (!from) from = 0;
    if (!count) count = 30;
    try {
        const messages = await getMessagesByRoom(roomId, from, count);
        if (messages) {
            res.status(200).send(messages);
            return;
        }
        res.status(404).send('Messages not found');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

export default router;